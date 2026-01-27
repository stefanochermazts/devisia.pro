# Plan — AI “System Structuring” demo (/ai-structure)

## Goal
Implement a minimal public, controlled demo that:
- Takes a non-sensitive problem description (80–1500 chars)
- Returns a structured architectural artifact in a strict JSON schema (ArtifactV1)
- Allows the user to “send it to Devisia” via email (Mailtrap Sending API) with 30-day retention notice

## Non-goals
- Chatbot, SaaS, playground, copy generator
- Any client-side secrets
- Persisting anything on generation

## Stack constraints
- Frontend: Astro page `/ai-structure` + minimal components
- Backend: Netlify Functions (Node runtime)
- Email: Mailtrap Sending API via the existing production sender (`sendViaMailtrapApi`)
- AI prompt: embedded verbatim as a constant in `netlify/functions/lib/aiProvider.ts`

## API endpoints
1) `POST /.netlify/functions/generate-structure`
- Validates input length
- Rejects sensitive-looking data (400, `SENSITIVE_INPUT`)
- Applies in-memory per-IP rate limiting
- Calls AI provider (server-side)
- Validates strict ArtifactV1 schema and constraints
- Retries once on invalid JSON/schema

2) `POST /.netlify/functions/submit-artifact`
- Validates email + consent + note length
- Generates reference ID `DV-XXXXXX`
- Computes `content_hash = sha256(input_raw + canonical_json(artifact))`
- Builds record payload (ArtifactRecordV1)
- Sends email to `DEVISIA_INBOX` including: contact info, retention, raw input, HTML render, and full JSON
- Returns 502 `DELIVERY_FAILED` on Mailtrap errors

## Implementation steps
1. Reuse Mailtrap sender by extracting the existing logic to `netlify/functions/lib/mailtrap.ts`
2. Add backend libs:
   - `schema.ts` (ArtifactV1 strict validation + constraints + “no extra keys”)
   - `secrets.ts` (sensitive pattern detection)
   - `rateLimit.ts` (in-memory per-IP limiter)
   - `hash.ts` (sha256 + canonical JSON)
   - `aiProvider.ts` (OpenAI Chat Completions call + embedded prompt constant)
   - `renderEmail.ts` (HTML rendering + plain text fallback)
3. Implement the two functions with clear error codes and JSON responses
4. Implement the Astro page + components with a single linear flow:
   - input → generate → output → “vediamolo insieme” modal → submit
5. Run lint/build and do a quick local smoke test (valid/invalid input, sensitive rejection, schema enforcement)

## Env vars
- `OPENAI_API_KEY` (AI call)
- `OPENAI_MODEL` (optional; default `gpt-5-mini`)
- `SMTP_PASS` (Mailtrap API Bearer token — existing convention)
- `FROM_EMAIL`
- `DEVISIA_INBOX` (destination inbox for artifacts)

## Test plan (MVP)
- Generate:
  - <80 chars → 400
  - >1500 chars → 400
  - sensitive pattern → 400 `SENSITIVE_INPUT`
  - valid input → 200 with ArtifactV1
- Submit:
  - invalid email → 400
  - consent=false → 400
  - note > 500 → 400
  - Mailtrap failure → 502 `DELIVERY_FAILED`
  - success → 200 `{ ref_id }`

