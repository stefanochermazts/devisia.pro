import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const REPO_ROOT = process.cwd();
const EN_DIR = path.join(REPO_ROOT, 'src', 'content', 'blog', 'en');
const IT_DIR = path.join(REPO_ROOT, 'src', 'content', 'blog', 'it');

function requireEnv(key) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

function stripExt(filename) {
  return filename.replace(/\.(md|mdx)$/i, '');
}

function isMarkdownFile(filename) {
  return /\.mdx?$/i.test(filename);
}

async function readMarkdownFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw);
  return { raw, parsed };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function buildChatCompletionBody({ model, messages }) {
  return JSON.stringify({
    model,
    messages,
    response_format: { type: 'json_object' },
  });
}

async function callOpenAIChatCompletions({ model, messages }) {
  const apiKey = requireEnv('OPENAI_API_KEY');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: buildChatCompletionBody({ model, messages }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI API error (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error('OpenAI API returned an unexpected payload (missing message content).');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`OpenAI did not return valid JSON. Raw: ${String(content).slice(0, 500)}`);
  }

  return parsed;
}

async function translateMetaWithOpenAI({ title, meta_description }) {
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  const systemPrompt = `You are a professional translator and SEO copywriter for a software company called Devisia.
Translate the following fields from English to Italian.
Rules:
1. Keep meaning accurate and natural Italian.
2. Return the result as a JSON object with these keys: "title", "meta_description".`;

  const userPrompt = [
    'Translate these fields from English to Italian.',
    '',
    'TITLE:',
    title,
    '',
    'META_DESCRIPTION:',
    meta_description,
  ].join('\n');

  const parsed = await callOpenAIChatCompletions({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  if (!parsed.title || !parsed.meta_description) {
    throw new Error('OpenAI JSON is missing one of: title, meta_description.');
  }

  return parsed;
}

async function translateMarkdownChunkWithOpenAI({ content_markdown, attempt }) {
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  const systemPrompt = `You are a professional translator for a software company called Devisia.
Translate the following Markdown content from English to Italian.
Rules:
1. Maintain the exact same Markdown structure, headings, bolding, lists, and links.
2. Do NOT translate image URLs. Do NOT change any URLs.
3. Preserve code blocks exactly (do not translate code).
4. Do NOT output the original English text. Output must be Italian.
5. Return the result as a JSON object with this key: "content_markdown".`;

  // NOTE: Do not JSON.stringify the markdown input: the escaping (\n, \") makes long posts
  // much harder to translate and may cause the model to "echo" the input content_markdown.
  const userPrompt = [
    `Translate this markdown chunk from English to Italian. Attempt ${attempt}.`,
    '',
    'CONTENT_MARKDOWN:',
    '<<<MARKDOWN',
    content_markdown,
    'MARKDOWN',
  ].join('\n');

  const parsed = await callOpenAIChatCompletions({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  if (!parsed.content_markdown) {
    throw new Error('OpenAI JSON is missing: content_markdown.');
  }

  return parsed.content_markdown;
}

function splitMarkdownIntoChunks(markdown, { maxChars = 12000 } = {}) {
  const lines = String(markdown).split('\n');
  const chunks = [];
  let cur = [];
  let curLen = 0;

  function pushCur() {
    if (!cur.length) return;
    chunks.push(cur.join('\n'));
    cur = [];
    curLen = 0;
  }

  for (const line of lines) {
    const lineLen = line.length + 1; // + newline

    // Prefer splitting at section boundaries when we are already "big enough".
    const isHeading = /^#{2,3}\s/.test(line);
    if (curLen >= maxChars && isHeading) {
      pushCur();
    } else if (curLen + lineLen > maxChars && cur.length > 0) {
      // Hard split if we exceed maxChars.
      pushCur();
    }

    cur.push(line);
    curLen += lineLen;
  }

  pushCur();
  return chunks;
}

async function translateMarkdownInChunks(content_markdown) {
  const chunks = splitMarkdownIntoChunks(content_markdown, { maxChars: 12000 });
  const translatedChunks = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const original = String(chunk).trim();
    let last = null;

    // Retry once if the model echoes the chunk unchanged.
    for (let attempt = 1; attempt <= 2; attempt++) {
      const out = await translateMarkdownChunkWithOpenAI({ content_markdown: chunk, attempt });
      last = out;
      if (String(out).trim() !== original) break;
    }

    if (!last || String(last).trim() === original) {
      throw new Error(`OpenAI returned a non-translated markdown chunk (echo) at chunk ${i + 1}/${chunks.length}.`);
    }

    translatedChunks.push(last);
  }

  return translatedChunks.join('\n');
}

async function main() {
  const files = await fs.readdir(EN_DIR);
  const markdownFiles = files.filter(isMarkdownFile);

  if (markdownFiles.length === 0) {
    console.log('No EN blog posts found.');
    return;
  }

  await ensureDir(IT_DIR);

  const problems = [];
  const updated = [];

  for (const filename of markdownFiles) {
    const enSlug = stripExt(filename);
    const enPath = path.join(EN_DIR, filename);

    const { parsed } = await readMarkdownFile(enPath);
    const data = parsed.data || {};

    const autoTranslateToIt = Boolean(data.autoTranslateToIt);
    if (!autoTranslateToIt) continue;

    const itSlug = (typeof data.translationSlug === 'string' && data.translationSlug.trim()) ? data.translationSlug.trim() : '';
    if (!itSlug) {
      problems.push(
        `EN post "${enSlug}" has autoTranslateToIt=true but missing translationSlug (IT). Set it in CMS before pushing.`
      );
      continue;
    }

    const title = typeof data.title === 'string' ? data.title : '';
    const description = typeof data.description === 'string' ? data.description : '';
    const pubDate = data.pubDate;
    const heroImage = data.heroImage ?? null;
    const author = typeof data.author === 'string' ? data.author : '';
    const tags = Array.isArray(data.tags) ? data.tags : [];

    if (!title || !description || !author || !parsed.content) {
      problems.push(`EN post "${enSlug}" is missing required fields (title/description/author/body).`);
      continue;
    }

    console.log(`Translating EN -> IT: ${enSlug} -> ${itSlug}`);

    const translatedMeta = await translateMetaWithOpenAI({
      title,
      meta_description: description,
    });
    const translatedBody = await translateMarkdownInChunks(parsed.content);

    const itFrontmatter = {
      title: translatedMeta.title,
      description: translatedMeta.meta_description,
      pubDate,
      heroImage,
      author,
      tags,
      translationSlug: enSlug,
    };

    // IMPORTANT: Do not carry autoTranslateToIt into IT files.
    const itBody = translatedBody;

    const itPath = path.join(IT_DIR, `${itSlug}.md`);
    const itRaw = matter.stringify(itBody, itFrontmatter);

    await fs.writeFile(itPath, itRaw, 'utf8');
    updated.push(itPath);
  }

  if (problems.length) {
    console.warn('Some posts were skipped:\n' + problems.map((p) => `- ${p}`).join('\n'));
  }

  console.log(`Done. Updated/created ${updated.length} IT post(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

