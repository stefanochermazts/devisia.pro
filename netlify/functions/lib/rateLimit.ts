type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(params.key);

  if (!b || now >= b.resetAt) {
    buckets.set(params.key, { count: 1, resetAt: now + params.windowMs });
    return { ok: true };
  }

  if (b.count >= params.limit) {
    return { ok: false, retryAfterMs: Math.max(0, b.resetAt - now) };
  }

  b.count += 1;
  buckets.set(params.key, b);
  return { ok: true };
}

