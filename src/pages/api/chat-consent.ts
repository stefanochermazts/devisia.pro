import { getDatabase } from '@netlify/database';
import type { APIRoute } from 'astro';

export const prerender = false;

type ConsentEventType = 'accepted' | 'withdrawn';
type ConsentLocale = 'it' | 'en';
type ConsentSurface = 'widget' | 'standalone';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONSENT_TEXT_VERSION = 'chat-consent-v1';
const AI_DISCLOSURE_VERSION = 'ai-disclosure-v1';
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function isConsentEventType(value: unknown): value is ConsentEventType {
  return value === 'accepted' || value === 'withdrawn';
}

function isLocale(value: unknown): value is ConsentLocale {
  return value === 'it' || value === 'en';
}

function isSurface(value: unknown): value is ConsentSurface {
  return value === 'widget' || value === 'standalone';
}

function isPrivacyPath(value: unknown): value is '/privacy' | '/en/privacy' {
  return value === '/privacy' || value === '/en/privacy';
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

export const POST: APIRoute = async ({ request }) => {
  if (!rateLimit(request)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const payload = asRecord(body);
  const eventType = payload.eventType;
  const consentId = typeof payload.consentId === 'string' ? payload.consentId.trim() : '';
  const locale = payload.locale;
  const surface = payload.surface;
  const privacyPath = payload.privacyPath;
  const consentTextVersion = payload.consentTextVersion;
  const aiDisclosureVersion = payload.aiDisclosureVersion;

  if (!isConsentEventType(eventType)) {
    return Response.json({ error: 'Invalid eventType' }, { status: 400 });
  }

  if (!UUID_RE.test(consentId)) {
    return Response.json({ error: 'Invalid consentId' }, { status: 400 });
  }

  if (!isLocale(locale) || !isSurface(surface) || !isPrivacyPath(privacyPath)) {
    return Response.json({ error: 'Invalid consent metadata' }, { status: 400 });
  }

  if (consentTextVersion !== CONSENT_TEXT_VERSION || aiDisclosureVersion !== AI_DISCLOSURE_VERSION) {
    return Response.json({ error: 'Invalid consent version' }, { status: 400 });
  }

  try {
    const db = getDatabase();
    await db.sql`
      INSERT INTO chat_consent_events (
        consent_id,
        event_type,
        locale,
        surface,
        privacy_path,
        consent_text_version,
        ai_disclosure_version
      )
      VALUES (
        ${consentId},
        ${eventType},
        ${locale},
        ${surface},
        ${privacyPath},
        ${consentTextVersion},
        ${aiDisclosureVersion}
      )
      ON CONFLICT (consent_id, event_type) DO NOTHING
    `;
  } catch (error) {
    console.error('Failed to persist chat consent event', error);
    return Response.json({ error: 'Unable to register consent event' }, { status: 503 });
  }

  return Response.json({ ok: true });
};
