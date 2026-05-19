import type { APIRoute } from 'astro';

export const prerender = false;

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

/** Proxy Toolhouse Agents API — keeps Bearer token server-side only. */
export const POST: APIRoute = async ({ request }) => {
  const apiKey = serverEnv('TOOLHOUSE_API_KEY');
  const baseRaw = serverEnv('TOOLHOUSE_AGENT_BASE');
  const base = baseRaw.replace(/\/+$/, '');

  if (!apiKey || !base) {
    return Response.json({ error: 'Missing TOOLHOUSE_API_KEY or TOOLHOUSE_AGENT_BASE' }, { status: 500 });
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

  const upstream = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/json, text/plain;q=0.9, */*;q=0.8',
    },
    body: JSON.stringify({ message }),
  });

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
