import type { Handler } from '@netlify/functions';
import crypto from 'node:crypto';
import { getEnv, sendViaMailtrapApi } from './lib/mailtrap';
import { canonicalJson, sha256Hex } from './lib/hash';
import { renderArtifactEmail } from './lib/renderEmail';
import { validateArtifactV1, type ArtifactRecordV1 } from './lib/schema';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function randomRefId() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(12);
  let out = 'DV-';
  for (let i = 0; i < 6; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
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
  const email = typeof p.email === 'string' ? p.email.trim() : '';
  const name = typeof p.name === 'string' ? p.name.trim() : '';
  const note = typeof p.note === 'string' ? p.note.trim() : '';
  const consent = Boolean(p.consent);
  const input_raw = typeof p.input_raw === 'string' ? p.input_raw.trim() : '';
  const artifactInput = p.artifact;

  if (!email || !isEmail(email)) return json(400, { code: 'INVALID_EMAIL', message: 'Invalid email.' });
  if (!consent) return json(400, { code: 'CONSENT_REQUIRED', message: 'Consent is required.' });
  if (note && note.length > 500) return json(400, { code: 'NOTE_TOO_LONG', message: 'Note exceeds 500 characters.' });
  if (input_raw.length < 80 || input_raw.length > 1500) {
    return json(400, { code: 'INVALID_INPUT_LENGTH', message: 'Input length must be between 80 and 1500 characters.' });
  }

  const validated = validateArtifactV1(artifactInput);
  if (!validated.ok) return json(400, { code: 'INVALID_ARTIFACT', message: 'Artifact payload is invalid.' });

  const ref_id = randomRefId();
  const nowIso = new Date().toISOString();
  const artifact = validated.value;

  const content_hash = sha256Hex(input_raw + canonicalJson(artifact));

  const record: ArtifactRecordV1 = {
    ref_id,
    created_at: nowIso,
    schema_version: 'v1',
    input_raw,
    output_json: artifact,
    content_hash,
    email,
    ...(name ? { name } : {}),
    ...(note ? { note } : {}),
    consent_timestamp: nowIso,
    retention_days: 30,
    retention_policy_version: 'v1',
  };

  try {
    let inbox: string;
    try {
      inbox = getEnv('DEVISIA_INBOX');
    } catch (err) {
      console.error('Missing env var:', err);
      return json(500, { code: 'MISSING_ENV', message: 'Missing required environment variable: DEVISIA_INBOX' });
    }

    const rendered = renderArtifactEmail(record);

    await sendViaMailtrapApi({
      to: inbox,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      timeoutMs: 10_000,
    });
  } catch (err: unknown) {
    console.error('Mailtrap sending failed:', err);
    return json(502, { code: 'DELIVERY_FAILED' });
  }

  return json(200, { ref_id });
};

