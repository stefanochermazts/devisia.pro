import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { needsItalianTranslation, findEnglishResidue, stripMarkdown } from './lib/blog-translation-audit.mjs';

try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch {
  // dotenv is optional outside local dev
}

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
  parsed.content = normalizeMarkdownBody(parsed.content);
  return { raw, parsed };
}

function normalizeMarkdownBody(content) {
  return String(content ?? '').replace(/^\s*---\s*(?:\r?\n|$)/, '').trimStart();
}

function sanitizeFrontmatterString(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .trim();
}

function buildItalianMarkdown({ frontmatter, body }) {
  const safeFrontmatter = {
    ...frontmatter,
    title: sanitizeFrontmatterString(frontmatter.title),
    description: sanitizeFrontmatterString(frontmatter.description),
  };
  const safeBody = normalizeMarkdownBody(body);
  const raw = matter.stringify(safeBody, safeFrontmatter);

  try {
    matter(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Generated invalid markdown frontmatter: ${message}`);
  }

  return raw;
}

function isCommitEachEnabled() {
  return process.env.COMMIT_EACH === '1' || process.env.COMMIT_EACH === 'true';
}

function runGit(args) {
  execFileSync('git', args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
}

function gitCommitEach({ enSlug, itSlug, itPath }) {
  if (!isCommitEachEnabled()) return;

  const relPath = path.relative(REPO_ROOT, itPath).replace(/\\/g, '/');
  runGit(['add', '--', relPath]);

  try {
    execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: REPO_ROOT, stdio: 'ignore' });
    console.log(`No git changes to commit for ${relPath}.`);
    return;
  } catch {
    // staged changes exist
  }

  runGit(['commit', '-m', `auto: translate blog ${enSlug} -> ${itSlug}`]);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      runGit(['push', 'origin', 'HEAD:main']);
      console.log(`Committed and pushed: ${relPath}`);
      return;
    } catch {
      console.warn(`Push rejected. Rebasing onto origin/main (attempt ${attempt}/3)…`);
      runGit(['fetch', 'origin', 'main']);
      runGit(['rebase', 'origin/main']);
    }
  }

  throw new Error(`Failed to push ${relPath} after 3 attempts.`);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function computeTranslationSourceHash({ title, description, content_markdown }) {
  // Only include what materially affects the translation output.
  // (pubDate/author/tags are not translated; keep them out to avoid unnecessary churn.)
  const payload = {
    title: String(title ?? ''),
    description: String(description ?? ''),
    content_markdown: String(content_markdown ?? ''),
  };
  return crypto.createHash('sha256').update(JSON.stringify(payload), 'utf8').digest('hex');
}

function buildChatCompletionBody({ model, messages }) {
  return JSON.stringify({
    model,
    messages,
    response_format: { type: 'json_object' },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableOpenAIStatus(status) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || (status >= 520 && status <= 524);
}

function summarizeOpenAIErrorBody(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    const titleMatch = trimmed.match(/<title>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'HTML error page';
  }
  return trimmed.length > 500 ? `${trimmed.slice(0, 500)}…` : trimmed;
}

function parseOnlyTranslateFilter() {
  const raw = String(process.env.ONLY_TRANSLATE ?? '').trim();
  if (!raw) return null;
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function normalizeComparableText(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function looksUntranslated({ source, translated }) {
  const src = normalizeComparableText(source);
  const out = normalizeComparableText(translated);
  if (!src || !out) return true;
  if (src === out) return true;

  const srcWords = src.split(' ').filter(Boolean);
  const outWords = new Set(out.split(' ').filter(Boolean));
  if (srcWords.length < 40) return false;

  let overlap = 0;
  for (const word of srcWords) {
    if (outWords.has(word)) overlap++;
  }
  return overlap / srcWords.length > 0.82;
}

async function callOpenAIChatCompletions({ model, messages }) {
  const apiKey = requireEnv('OPENAI_API_KEY');
  const maxAttempts = Number.parseInt(process.env.OPENAI_MAX_RETRIES ?? '5', 10);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
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
        const summary = summarizeOpenAIErrorBody(text) || res.statusText;

        if (isRetryableOpenAIStatus(res.status) && attempt < maxAttempts) {
          const delayMs = Math.min(60_000, 2_000 * 2 ** (attempt - 1));
          console.warn(
            `OpenAI API ${res.status} (${summary}). Retry ${attempt}/${maxAttempts - 1} in ${Math.round(delayMs / 1000)}s…`
          );
          await sleep(delayMs);
          continue;
        }

        throw new Error(`OpenAI API error (${res.status}): ${summary}`);
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
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      if (isNetworkError && attempt < maxAttempts) {
        const delayMs = Math.min(60_000, 2_000 * 2 ** (attempt - 1));
        console.warn(
          `OpenAI request failed (${err.message}). Retry ${attempt}/${maxAttempts - 1} in ${Math.round(delayMs / 1000)}s…`
        );
        await sleep(delayMs);
        continue;
      }
      throw err;
    }
  }

  throw new Error('OpenAI API failed after retries.');
}

async function translateMetaWithOpenAI({ title, meta_description }) {
  const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

  const systemPrompt = `You are a professional translator and SEO copywriter for a software company called Devisia.
Translate the following fields from English to Italian.
Rules:
1. Keep meaning accurate and natural Italian.
2. Avoid overly literal translations of role titles and industry terms; prefer common Italian usage in tech.
3. Keep established English role labels when they are clearer for the target audience.
4. Use this glossary consistently:
- engineering leader -> engineering leader
- tech lead -> tech lead
- product manager -> product manager
- growth -> growth
- go-to-market -> go-to-market
- scale/scale up -> scalare/scalabilità (when it reads naturally)
5. Return the result as a JSON object with these keys: "title", "meta_description".`;

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
2. Do NOT translate image URLs or link URLs. Do NOT change any URLs.
3. DO translate image alt text inside markdown images: ![alt text here](url)
4. DO translate markdown table headers and cell text. Keep table layout, pipes, and alignment rows unchanged.
5. Preserve code blocks, inline code, iframe embeds, and HTML tags exactly (do not translate code or URLs inside them).
6. Do NOT output the original English text. Output must be Italian.
7. Return the result as a JSON object with this key: "content_markdown".`;

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
  const markdownFiles = files.filter(isMarkdownFile).sort((a, b) => a.localeCompare(b));
  const onlyFilter = parseOnlyTranslateFilter();

  if (markdownFiles.length === 0) {
    console.log('No EN blog posts found.');
    return;
  }

  await ensureDir(IT_DIR);

  const problems = [];
  const failures = [];
  const updated = [];
  const force = process.env.FORCE_TRANSLATE === '1' || process.env.FORCE_TRANSLATE === 'true';

  for (const filename of markdownFiles) {
    const enSlug = stripExt(filename);
    if (onlyFilter && !onlyFilter.has(enSlug)) continue;

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

    const sourceHash = computeTranslationSourceHash({
      title,
      description,
      content_markdown: parsed.content,
    });

    const itPath = path.join(IT_DIR, `${itSlug}.md`);

    if (!force) {
      try {
        const { parsed: itParsed } = await readMarkdownFile(itPath);
        const itData = itParsed.data || {};
        const hashMatches =
          typeof itData.translationSourceHash === 'string' && itData.translationSourceHash === sourceHash;
        const verdict = needsItalianTranslation({
          enTitle: title,
          enDescription: description,
          enBody: parsed.content,
          itExists: true,
          itTitle: itData.title,
          itDescription: itData.description,
          itBody: itParsed.content,
        });

        if (hashMatches && !verdict.needed) {
          console.log(`Skipping (Italian OK): ${enSlug} -> ${itSlug}`);
          continue;
        }

        if (verdict.needed) {
          console.log(
            `Translating EN -> IT: ${enSlug} -> ${itSlug} (${verdict.reasons.join(', ')})`
          );
        } else {
          console.log(`Translating EN -> IT: ${enSlug} -> ${itSlug} (source changed)`);
        }
      } catch {
        console.log(`Translating EN -> IT: ${enSlug} -> ${itSlug} (missing IT file)`);
      }
    } else {
      console.log(`Translating EN -> IT: ${enSlug} -> ${itSlug} (force)`);
    }

    try {
      const translatedMeta = await translateMetaWithOpenAI({
        title,
        meta_description: description,
      });
      const translatedBody = await translateMarkdownInChunks(parsed.content);

      if (looksUntranslated({ source: parsed.content, translated: translatedBody })) {
        throw new Error('Translated body still looks like English source text.');
      }

      const residue = findEnglishResidue(translatedBody);
      if (residue.prose.length > 0) {
        throw new Error(
          `Translated body still contains ${residue.prose.length} English prose block(s). Sample: ${stripMarkdown(residue.prose[0]).slice(0, 120)}…`
        );
      }

      const itFrontmatter = {
        title: translatedMeta.title,
        description: translatedMeta.meta_description,
        pubDate,
        heroImage,
        author,
        tags,
        translationSlug: enSlug,
        translationSourceHash: sourceHash,
      };

      const itRaw = buildItalianMarkdown({
        frontmatter: itFrontmatter,
        body: translatedBody,
      });
      await fs.writeFile(itPath, itRaw, 'utf8');
      updated.push(itPath);
      gitCommitEach({ enSlug, itSlug, itPath });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`EN post "${enSlug}" -> "${itSlug}": ${message}`);
      console.error(`Failed: ${enSlug} -> ${itSlug}: ${message}`);
    }
  }

  if (problems.length) {
    console.warn('Some posts were skipped:\n' + problems.map((p) => `- ${p}`).join('\n'));
  }

  console.log(`Done. Updated/created ${updated.length} IT post(s).`);

  if (failures.length) {
    console.error('Translation failures:\n' + failures.map((f) => `- ${f}`).join('\n'));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

