import type { Handler } from '@netlify/functions';
import { rateLimit } from './lib/rateLimit';
import { callOpenAIChatCompletions } from './lib/aiProvider';

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

// ────────────────────────────────────────────────────
// PROMPTS
// ────────────────────────────────────────────────────

const HOOK_SYSTEM_PROMPT = `You analyze the opening of a LinkedIn post.
Given the first 2-3 non-empty lines of the post, return a JSON object with EXACTLY this structure:
{"verdict":"good"|"generic"|"weak","reason":"one sentence explaining why","suggestion":"one concrete, specific rewrite hint"}

Rules:
- "good": the opening creates curiosity, contains a concrete claim, number, or specific context.
- "generic": the opening uses filler phrases like "Today I want to share", "In this post", "Lately" etc.
- "weak": the opening lacks any concrete noun, number, or context — it could apply to any topic.
- Be specific in your reason and suggestion. Do not be vague.
- Respond in the SAME language as the input text.
- Return ONLY valid JSON. No markdown, no extra text.`;

const TONE_SYSTEM_PROMPT = `You analyze the tone and language quality of a LinkedIn post.
Return a JSON object with EXACTLY this structure:
{"score":number,"issues":[{"phrase":"exact phrase from text","reason":"why it is problematic"}],"summary":"one sentence overall tone assessment"}

Rules:
- score: integer 1-10. 10 = clean, precise, technical tone. 1 = pure marketing fluff / buzzword soup.
- issues: list every vague buzzword, marketingese phrase, empty claim, or filler expression you find.
  Examples: "innovative solution", "game changer", "revolutionary", "best in class", "leverage", "synergy", "disruptive", "thought leader".
- If there are no issues, return an empty array.
- summary: one sentence describing the overall tone (e.g. "Clean and specific" or "Heavy on buzzwords, light on substance").
- Respond in the SAME language as the input text.
- Return ONLY valid JSON. No markdown, no extra text.`;

// ────────────────────────────────────────────────────
// HANDLER
// ────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  let payload: unknown;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { code: 'BAD_REQUEST', message: 'Invalid JSON body.' });
  }

  const p = isPlainObject(payload) ? payload : {};
  const text = typeof p.text === 'string' ? p.text.trim() : '';
  const locale = typeof p.locale === 'string' ? p.locale : 'it';

  if (!text || text.length > 3000) {
    return json(400, {
      code: 'INVALID_INPUT',
      message: 'Text must be non-empty and at most 3000 characters.',
    });
  }

  // Rate limit
  const ip = getClientIp(event);
  const rl = rateLimit({ key: `linkedin:${ip}`, limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return json(
      429,
      { code: 'RATE_LIMITED', message: 'Too many requests. Retry later.' },
      { 'retry-after': String(Math.ceil(rl.retryAfterMs / 1000)) }
    );
  }

  // Extract first 2-3 lines for hook analysis
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const hookInput = lines.slice(0, 3).join('\n');

  const languageHint = locale.startsWith('en')
    ? 'Respond in English.'
    : locale.startsWith('it')
      ? 'Rispondi in italiano.'
      : `Respond in ${locale}.`;

  // Run both analyses in parallel with allSettled so we can return partial results
  // instead of a gateway 504 if one call is slow.
  const perCallTimeout = 25_000; // keep well under 60s gateway limit

  const [hookResult, toneResult] = await Promise.allSettled([
    callOpenAIChatCompletions({
      model,
      messages: [
        { role: 'system', content: HOOK_SYSTEM_PROMPT },
        { role: 'user', content: `${languageHint}\n\nPost opening:\n${hookInput}` },
      ],
      timeoutMs: perCallTimeout,
    }),
    callOpenAIChatCompletions({
      model,
      messages: [
        { role: 'system', content: TONE_SYSTEM_PROMPT },
        { role: 'user', content: `${languageHint}\n\nFull post:\n${text}` },
      ],
      timeoutMs: perCallTimeout,
    }),
  ]);

  const hookRaw = hookResult.status === 'fulfilled' && isPlainObject(hookResult.value) ? hookResult.value : null;
  const toneRaw = toneResult.status === 'fulfilled' && isPlainObject(toneResult.value) ? toneResult.value : null;

  // If both failed, return 502
  if (!hookRaw && !toneRaw) {
    const hookErr = hookResult.status === 'rejected' ? String(hookResult.reason) : '';
    const toneErr = toneResult.status === 'rejected' ? String(toneResult.reason) : '';
    console.error('LinkedIn analyze: both calls failed.', { hookErr, toneErr });
    return json(502, {
      code: 'AI_PROVIDER_FAILED',
      message: 'AI analysis failed.',
      detail: (hookErr || toneErr).slice(0, 160),
      model,
    });
  }

  // Return whatever succeeded (partial results are fine)
  return json(200, {
    hook: hookRaw
      ? {
          verdict: typeof hookRaw.verdict === 'string' ? hookRaw.verdict : 'unknown',
          reason: typeof hookRaw.reason === 'string' ? hookRaw.reason : '',
          suggestion: typeof hookRaw.suggestion === 'string' ? hookRaw.suggestion : '',
        }
      : { verdict: 'error', reason: 'Hook analysis timed out.', suggestion: '' },
    tone: toneRaw
      ? {
          score: typeof toneRaw.score === 'number' ? toneRaw.score : 0,
          issues: Array.isArray(toneRaw.issues) ? toneRaw.issues.slice(0, 20) : [],
          summary: typeof toneRaw.summary === 'string' ? toneRaw.summary : '',
        }
      : { score: 0, issues: [], summary: 'Tone analysis timed out.' },
    model,
  });
};
