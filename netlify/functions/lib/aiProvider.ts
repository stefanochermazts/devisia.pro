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

type ChatMessage = { role: 'system' | 'user'; content: string };

function buildChatCompletionBody(params: { model: string; messages: ChatMessage[] }) {
  return JSON.stringify({
    model: params.model,
    messages: params.messages,
    response_format: { type: 'json_object' },
  });
}

async function callOpenAIChatCompletions(params: { model: string; messages: ChatMessage[] }) {
  const apiKey = getEnv('OPENAI_API_KEY');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: buildChatCompletionBody(params),
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

export async function generateStructureArtifact(params: {
  input_text: string;
  locale?: string;
  retryHint?: string;
}) {
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  const locale = (params.locale || 'it').trim();
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
  });
}

