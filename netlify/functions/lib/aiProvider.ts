import { getEnv } from './mailtrap';

// IMPORTANT:
// The following prompt must be embedded verbatim and used for every generation request.
export const SYSTEM_PROMPT_V1 = `-------------------- AI SYSTEM PROMPT --------------------

You are performing a constrained system-structuring task for a technology consultancy.

Your role is to transform an unstructured problem or product description into an initial system structure.

This task is NOT:
- business strategy
- marketing or copywriting
- technical implementation
- code generation

Your output is an architectural thinking artifact.

You must reason in terms of:
- systems and boundaries
- domain concepts and responsibilities
- cause-effect flows
- risks and design constraints

Tone must be technical, neutral, and precise.

-------------------- AI TASK INSTRUCTIONS --------------------

Given the user input, generate an output that strictly follows the provided JSON schema.

The output must contain exactly four sections:
1. System Overview
2. Core Domain Model
3. Key Flows
4. Critical Considerations

Do not add any other sections.
Do not include explanations or commentary.
Do not reference the prompt or the task.

-------------------- SECTION RULES --------------------

System Overview:
- 4 to 6 sentences
- Describe what the system is and what problem it addresses
- Define scope and boundaries
- No benefits, no value claims, no marketing language

Core Domain Model:
- 6 to 8 domain entities
- Each entity represents a real domain concept
- Each entity has a short, concrete description
- No UI elements
- No technical classes or database tables

Key Flows:
- 2 to 4 flows
- Each flow has a short title
- Each flow contains 2 to 3 logical steps
- Describe cause → effect, not user interface interactions

Critical Considerations:
- Three subsections: Technical, Privacy & Data, Architectural
- Each subsection contains 1 to 3 concrete points
- Focus on risks, trade-offs, and attention areas
- Do not propose solutions

-------------------- OUTPUT CONSTRAINT --------------------

Return ONLY valid JSON matching the provided schema.
Do not use markdown.
Do not include additional text.
If information is missing, make conservative assumptions.`;

// NOTE: To reduce function timeouts, we can generate the artifact in 4 smaller calls (one per section)
// and then merge + validate the final ArtifactV1.
const SYSTEM_PROMPT_V1_SECTIONED = `You are performing a constrained system-structuring task for a technology consultancy.
Your role is to transform an unstructured problem or product description into an initial system structure.
This task is NOT: business strategy, marketing/copywriting, technical implementation, or code generation.
Tone must be technical, neutral, and precise.
Return ONLY valid JSON. Do not use markdown. Do not include any additional text.`;

type ChatMessage = { role: 'system' | 'user'; content: string };

function buildChatCompletionBody(params: { model: string; messages: ChatMessage[] }) {
  return JSON.stringify({
    model: params.model,
    messages: params.messages,
    response_format: { type: 'json_object' },
  });
}

async function callOpenAIChatCompletions(params: { model: string; messages: ChatMessage[]; timeoutMs?: number }) {
  const apiKey = getEnv('OPENAI_API_KEY');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs ?? 24_000);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: buildChatCompletionBody(params),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`OpenAI API error (${res.status}): ${text || res.statusText}`);
    }

    const data = await res.json();
    const content =
      data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('OpenAI API returned an unexpected payload (missing message content).');

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error(`OpenAI did not return valid JSON. Raw: ${String(content).slice(0, 500)}`);
    }

    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

const ARTIFACT_SCHEMA_HINT = `ArtifactV1 MUST be valid JSON with EXACTLY this structure:

{
  "schema_version": "v1",
  "system_overview": string,
  "core_domain_model": [
    { "name": string, "description": string }
  ],
  "key_flows": [
    { "title": string, "steps": string[] }
  ],
  "critical_considerations": {
    "technical": string[],
    "privacy_data": string[],
    "architectural": string[]
  }
}

Constraints:
- system_overview: 4–6 sentences
- core_domain_model: 6–8 entities max
- key_flows: 2–4 flows, each with 2–3 steps
- critical_considerations:
  - technical: 1–3 bullets
  - privacy_data: 1–3 bullets
  - architectural: 1–3 bullets`;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function hasExactKeys(obj: Record<string, unknown>, keys: string[]) {
  const actual = Object.keys(obj).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (actual[i] !== expected[i]) return false;
  }
  return true;
}

function sentenceCount(text: string) {
  const parts = text
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
  return parts.length;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStringArray(v: unknown) {
  return Array.isArray(v) && v.every((x) => isNonEmptyString(x));
}

type PartialArtifact = {
  system_overview?: string;
  core_domain_model?: Array<{ name: string; description: string }>;
  key_flows?: Array<{ title: string; steps: string[] }>;
  critical_considerations?: {
    technical: string[];
    privacy_data: string[];
    architectural: string[];
  };
};

function validateSystemOverviewSection(input: unknown): { ok: true; value: Pick<PartialArtifact, 'system_overview'> } | { ok: false } {
  if (!isPlainObject(input)) return { ok: false };
  if (!hasExactKeys(input, ['system_overview'])) return { ok: false };
  if (!isNonEmptyString(input.system_overview)) return { ok: false };
  const sc = sentenceCount(input.system_overview);
  if (sc < 4 || sc > 6) return { ok: false };
  return { ok: true, value: { system_overview: input.system_overview } };
}

function validateCoreDomainModelSection(
  input: unknown
): { ok: true; value: Pick<PartialArtifact, 'core_domain_model'> } | { ok: false } {
  if (!isPlainObject(input)) return { ok: false };
  if (!hasExactKeys(input, ['core_domain_model'])) return { ok: false };
  const dm = input.core_domain_model;
  if (!Array.isArray(dm)) return { ok: false };
  if (dm.length < 6 || dm.length > 8) return { ok: false };
  for (const e of dm) {
    if (!isPlainObject(e)) return { ok: false };
    if (!hasExactKeys(e, ['name', 'description'])) return { ok: false };
    if (!isNonEmptyString(e.name) || !isNonEmptyString(e.description)) return { ok: false };
  }
  return { ok: true, value: { core_domain_model: dm as Array<{ name: string; description: string }> } };
}

function validateKeyFlowsSection(input: unknown): { ok: true; value: Pick<PartialArtifact, 'key_flows'> } | { ok: false } {
  if (!isPlainObject(input)) return { ok: false };
  if (!hasExactKeys(input, ['key_flows'])) return { ok: false };
  const flows = input.key_flows;
  if (!Array.isArray(flows)) return { ok: false };
  if (flows.length < 2 || flows.length > 4) return { ok: false };
  for (const f of flows) {
    if (!isPlainObject(f)) return { ok: false };
    if (!hasExactKeys(f, ['title', 'steps'])) return { ok: false };
    if (!isNonEmptyString(f.title)) return { ok: false };
    if (!Array.isArray(f.steps)) return { ok: false };
    if (f.steps.length < 2 || f.steps.length > 3) return { ok: false };
    for (const s of f.steps) {
      if (!isNonEmptyString(s)) return { ok: false };
    }
  }
  return { ok: true, value: { key_flows: flows as Array<{ title: string; steps: string[] }> } };
}

function validateCriticalConsiderationsSection(
  input: unknown
): { ok: true; value: Pick<PartialArtifact, 'critical_considerations'> } | { ok: false } {
  if (!isPlainObject(input)) return { ok: false };
  if (!hasExactKeys(input, ['critical_considerations'])) return { ok: false };
  const cc = input.critical_considerations;
  if (!isPlainObject(cc)) return { ok: false };
  if (!hasExactKeys(cc, ['technical', 'privacy_data', 'architectural'])) return { ok: false };
  const { technical, privacy_data, architectural } = cc;
  if (!isStringArray(technical) || technical.length < 1 || technical.length > 3) return { ok: false };
  if (!isStringArray(privacy_data) || privacy_data.length < 1 || privacy_data.length > 3) return { ok: false };
  if (!isStringArray(architectural) || architectural.length < 1 || architectural.length > 3) return { ok: false };
  return {
    ok: true,
    value: {
      critical_considerations: {
        technical: technical as string[],
        privacy_data: privacy_data as string[],
        architectural: architectural as string[],
      },
    },
  };
}

async function callSectionWithRetry(params: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  validate: (v: unknown) => { ok: true; value: PartialArtifact } | { ok: false };
  timeoutMs: number;
}) {
  // Attempt 1
  const out1 = await callOpenAIChatCompletions({
    model: params.model,
    messages: [
      { role: 'system', content: params.systemPrompt },
      { role: 'user', content: params.userPrompt },
    ],
    timeoutMs: params.timeoutMs,
  });
  const v1 = params.validate(out1);
  if (v1.ok) return v1.value;

  // Attempt 2 (retry hint)
  const retryUserPrompt = [
    'Your previous response was invalid. Return ONLY valid JSON matching the requested schema. Do not add extra keys.',
    '',
    params.userPrompt,
  ].join('\n');

  const out2 = await callOpenAIChatCompletions({
    model: params.model,
    messages: [
      { role: 'system', content: params.systemPrompt },
      { role: 'user', content: retryUserPrompt },
    ],
    timeoutMs: Math.max(6_000, Math.floor(params.timeoutMs * 0.8)),
  });
  const v2 = params.validate(out2);
  if (v2.ok) return v2.value;

  throw new Error('Invalid AI output for section.');
}

export async function generateStructureArtifact(params: {
  input_text: string;
  locale?: string;
  retryHint?: string;
}) {
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  const locale = (params.locale || 'it').trim();
  const baseContext = [`Locale: ${locale}`, '', 'USER_INPUT:', params.input_text].join('\n');

  const mode = (process.env.AI_STRUCTURE_MODE || 'sectioned').trim().toLowerCase();
  if (mode === 'single') {
    const userPrompt = [
      params.retryHint ? params.retryHint : null,
      `Locale: ${locale}`,
      '',
      ARTIFACT_SCHEMA_HINT,
      '',
      'USER_INPUT:',
      params.input_text,
    ]
      .filter(Boolean)
      .join('\n');

    return await callOpenAIChatCompletions({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_V1 },
        { role: 'user', content: userPrompt },
      ],
      // Keep under Netlify 26s max.
      timeoutMs: 24_000,
    });
  }

  // SECTIONED mode: 4 smaller prompts, then merge into ArtifactV1 shape.
  // Keep per-call timeout lower to leave room for merge/validation and potential one-section retry.
  const perCallTimeoutMs = 14_000;

  const sectionPrompts = {
    system_overview: [
      params.retryHint ? params.retryHint : null,
      'Return ONLY JSON with EXACTLY this structure: {"system_overview": string}',
      'Constraints: system_overview MUST be 4–6 sentences. No extra keys.',
      '',
      baseContext,
    ]
      .filter(Boolean)
      .join('\n'),
    core_domain_model: [
      params.retryHint ? params.retryHint : null,
      'Return ONLY JSON with EXACTLY this structure: {"core_domain_model": [{"name": string, "description": string}] }',
      'Constraints: 6–8 entities. Each entity must have exactly name and description. No extra keys.',
      '',
      baseContext,
    ]
      .filter(Boolean)
      .join('\n'),
    key_flows: [
      params.retryHint ? params.retryHint : null,
      'Return ONLY JSON with EXACTLY this structure: {"key_flows": [{"title": string, "steps": string[]}] }',
      'Constraints: 2–4 flows. Each flow has 2–3 steps. No extra keys.',
      '',
      baseContext,
    ]
      .filter(Boolean)
      .join('\n'),
    critical_considerations: [
      params.retryHint ? params.retryHint : null,
      'Return ONLY JSON with EXACTLY this structure: {"critical_considerations": {"technical": string[], "privacy_data": string[], "architectural": string[]} }',
      'Constraints: each list has 1–3 items. No extra keys.',
      '',
      baseContext,
    ]
      .filter(Boolean)
      .join('\n'),
  } as const;

  const [systemOverview, domainModel, flows, considerations] = await Promise.all([
    callSectionWithRetry({
      model,
      systemPrompt: SYSTEM_PROMPT_V1_SECTIONED,
      userPrompt: sectionPrompts.system_overview,
      validate: validateSystemOverviewSection,
      timeoutMs: perCallTimeoutMs,
    }),
    callSectionWithRetry({
      model,
      systemPrompt: SYSTEM_PROMPT_V1_SECTIONED,
      userPrompt: sectionPrompts.core_domain_model,
      validate: validateCoreDomainModelSection,
      timeoutMs: perCallTimeoutMs,
    }),
    callSectionWithRetry({
      model,
      systemPrompt: SYSTEM_PROMPT_V1_SECTIONED,
      userPrompt: sectionPrompts.key_flows,
      validate: validateKeyFlowsSection,
      timeoutMs: perCallTimeoutMs,
    }),
    callSectionWithRetry({
      model,
      systemPrompt: SYSTEM_PROMPT_V1_SECTIONED,
      userPrompt: sectionPrompts.critical_considerations,
      validate: validateCriticalConsiderationsSection,
      timeoutMs: perCallTimeoutMs,
    }),
  ]);

  // Merge into full ArtifactV1 structure. Final strict validation happens in generate-structure.ts.
  return {
    schema_version: 'v1',
    ...systemOverview,
    ...domainModel,
    ...flows,
    ...considerations,
  };
}

