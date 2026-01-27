import crypto from 'node:crypto';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isPlainObject(value)) return value;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(value).sort()) {
    out[k] = canonicalize(value[k]);
  }
  return out;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

export function sha256Hex(input: string): string {
  return crypto.createHash('sha256').update(String(input), 'utf8').digest('hex');
}

