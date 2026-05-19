import { getDatabase } from '@netlify/database';
import type { APIRoute } from 'astro';
import { isLocalChatDevRequest } from '../../lib/chatLocalDev';

export const prerender = false;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Netlify (and other hosts) inject secrets at **runtime** via `process.env`.
 * Vite may inline `import.meta.env` at **build** time, so keys set only in the
 * Netlify UI can be missing there — prefer `process.env` on the server.
 */
function serverEnv(name: string): string {
  const fromProcess = typeof process !== 'undefined' ? process.env[name] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.trim()) return fromProcess.trim();
  const fromMeta = (import.meta.env as Record<string, string | boolean | undefined>)[name];
  return typeof fromMeta === 'string' && fromMeta.trim() ? fromMeta.trim() : '';
}

function clientKey(request: Request): string {
  const directIp = request.headers.get('x-nf-client-connection-ip') || request.headers.get('cf-connecting-ip');
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return directIp || forwardedIp || 'unknown';
}

function rateLimit(request: Request): boolean {
  const now = Date.now();
  const key = clientKey(request);
  const current = rateBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  current.count += 1;
  return current.count <= RATE_LIMIT_MAX;
}

async function hasActiveConsent(consentId: string): Promise<boolean> {
  const db = getDatabase();
  const rows = await db.sql<{ has_active_consent: boolean }>`
    SELECT EXISTS (
      SELECT 1
      FROM chat_consent_events accepted
      WHERE accepted.consent_id = ${consentId}
        AND accepted.event_type = 'accepted'
        AND NOT EXISTS (
          SELECT 1
          FROM chat_consent_events withdrawn
          WHERE withdrawn.consent_id = accepted.consent_id
            AND withdrawn.event_type = 'withdrawn'
            AND withdrawn.created_at >= accepted.created_at
        )
    ) AS has_active_consent
  `;

  return rows[0]?.has_active_consent === true;
}

/** Proxy Toolhouse Agents API — keeps Bearer token server-side only. */
export const POST: APIRoute = async ({ request }) => {
  if (!rateLimit(request)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const apiKey = serverEnv('TOOLHOUSE_API_KEY');
  const baseRaw = serverEnv('TOOLHOUSE_AGENT_BASE');
  const base = baseRaw.replace(/\/+$/, '');

  if (!apiKey || !base) {
    console.error('Missing Toolhouse server configuration');
    return Response.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const consentId = request.headers.get('x-devisia-chat-consent-id')?.trim() || '';
  if (!UUID_RE.test(consentId)) {
    return Response.json({ error: 'Chat consent is required' }, { status: 403 });
  }

  if (!isLocalChatDevRequest(request)) {
    try {
      if (!(await hasActiveConsent(consentId))) {
        return Response.json({ error: 'Chat consent is not active' }, { status: 403 });
      }
    } catch (error) {
      console.error('Failed to verify chat consent', error);
      return Response.json({ error: 'Unable to verify chat consent' }, { status: 503 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const o = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const message = typeof o.message === 'string' ? o.message : '';
  if (!message.trim()) {
    return Response.json({ error: 'Field "message" is required' }, { status: 400 });
  }

  const runIdRaw = typeof o.runId === 'string' ? o.runId.trim() : '';
  const url = runIdRaw ? `${base}/${encodeURIComponent(runIdRaw)}` : base;
  const method = runIdRaw ? 'PUT' : 'POST';

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream, application/json, text/plain;q=0.9, */*;q=0.8',
      },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error('Failed to reach Toolhouse agent', error);
    return Response.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const runIdHeader =
    upstream.headers.get('x-toolhouse-run-id') ?? upstream.headers.get('X-Toolhouse-Run-ID');

  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  if (runIdHeader) headers.set('x-toolhouse-run-id', runIdHeader);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
};
