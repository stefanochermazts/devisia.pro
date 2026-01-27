import type { Handler } from '@netlify/functions';
import { detectSensitiveInput } from './lib/secrets';
import { rateLimit } from './lib/rateLimit';
import { generateStructureArtifact } from './lib/aiProvider';
import { validateArtifactV1 } from './lib/schema';

const json = (statusCode: number, body: unknown, extraHeaders?: Record<string, string>) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8', ...(extraHeaders || {}) },
  body: JSON.stringify(body),
});

function getClientIp(event: Parameters<Handler>[0]) {
  const h = event.headers || {};
  const direct = h['x-nf-client-connection-ip'] || h['client-ip'];
  if (direct) return String(direct);
  const xff = h['x-forwarded-for'];
  if (!xff) return 'unknown';
  return String(xff).split(',')[0]?.trim() || 'unknown';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let payload: unknown;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { code: 'BAD_REQUEST', message: 'Invalid JSON body.' });
  }

  const p = isPlainObject(payload) ? payload : {};
  const input_text = typeof p.input_text === 'string' ? p.input_text : '';
  const locale = typeof p.locale === 'string' ? p.locale : undefined;

  const trimmed = input_text.trim();
  if (trimmed.length < 80 || trimmed.length > 1500) {
    return json(400, {
      code: 'INVALID_INPUT_LENGTH',
      message: 'Input length must be between 80 and 1500 characters.',
    });
  }

  const sensitive = detectSensitiveInput(trimmed);
  if (sensitive.isSensitive) {
    return json(400, {
      code: 'SENSITIVE_INPUT',
      message: 'Sensitive-looking data detected. Remove secrets and retry.',
    });
  }

  const ip = getClientIp(event);
  const rl = rateLimit({ key: `generate:${ip}`, limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return json(
      429,
      { code: 'RATE_LIMITED', message: 'Too many requests. Retry later.' },
      { 'retry-after': String(Math.ceil(rl.retryAfterMs / 1000)) }
    );
  }

  // Call AI provider and enforce strict schema.
  // The AI provider already retries per-section in "sectioned" mode, so avoid a global retry here
  // (it would multiply calls and increase timeout risk).
  let out: unknown;
  try {
    out = await generateStructureArtifact({ input_text: trimmed, locale });
  } catch (err: unknown) {
    console.error('AI provider error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    // Return a safe, non-sensitive hint for debugging (no secrets, no raw input).
    return json(502, {
      code: 'AI_PROVIDER_FAILED',
      message: 'AI provider failed.',
      detail: msg.slice(0, 160),
    });
  }

  const validated = validateArtifactV1(out);
  if (validated.ok) return json(200, { artifact: validated.value });

  return json(502, { code: 'INVALID_AI_OUTPUT', message: 'AI output failed validation.' });
};

