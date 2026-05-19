#!/usr/bin/env node
/**
 * Export Italian (non-blog) site pages from rendered HTML → Markdown + JSONL for RAG.
 * Usage:
 *   node scripts/export-rag-content.mjs --base https://devisia.pro --out rag-export/it
 *   node scripts/export-rag-content.mjs --base http://127.0.0.1:4321 --out rag-export/it
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEMPLATE']);

function parseArgs(argv) {
  let base = 'https://devisia.pro';
  let outDir = path.join(process.cwd(), 'rag-export', 'it');
  let chunkSize = 4000;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' && argv[i + 1]) base = argv[++i];
    else if (a === '--out' && argv[i + 1]) outDir = path.resolve(process.cwd(), argv[++i]);
    else if (a === '--chunk-size' && argv[i + 1]) chunkSize = Math.max(500, Number(argv[++i]) || 4000);
  }
  return { base: base.replace(/\/+$/, ''), outDir, chunkSize };
}

function pathnameToSlug(pn) {
  const p = pn === '/' || !pn ? '' : pn.replace(/\/+$/, '');
  if (!p || p === '/') return 'index';
  return p
    .replace(/^\//, '')
    .replace(/\//g, '-')
    .replace(/[^a-zA-Z0-9\-._]/g, '_');
}

function normalizePath(fullUrlString) {
  try {
    const u = new URL(fullUrlString);
    let p = u.pathname || '/';
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p === '' ? '/' : p;
  } catch {
    return '/';
  }
}

async function fetchSitemapLocs(siteBase) {
  const smUrl = `${siteBase}/sitemap.xml`;
  const res = await fetch(smUrl);
  if (!res.ok) throw new Error(`sitemap fetch failed ${res.status}: ${smUrl}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
  return [...new Set(locs)];
}

function filterItalianNonBlog(siteBase, locs) {
  const origin = new URL(siteBase).origin;
  /** @type Set<string> */
  const paths = new Set();

  const extra = ['/projects'];
  for (const raw of [...locs].concat(extra.map((p) => `${origin}${p}`))) {
    let url;
    try {
      url = new URL(raw, siteBase);
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;
    const p = url.pathname.replace(/\/+$/, '') || '/';

    if (p === '/blog' || p.startsWith('/blog/')) continue;
    if (p === '/en' || p.startsWith('/en')) continue;
    if (p.startsWith('/api')) continue;

    paths.add(p);
  }

  return [...paths].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

function stripSiteTitle(title) {
  if (!title) return '';
  return title.replace(/\s*\|\s*Devisia\s*/i, '').trim();
}

function normalizeWhitespace(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeMdInline(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`');
}

/**
 * Remove boilerplate/decorative nodes inside an element subtree before extract.
 * @param {import('jsdom').Element} rootEl
 */
function scrubSubtree(rootEl) {
  rootEl.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());
  rootEl.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  rootEl.querySelectorAll('[data-mobile-sticky-cta]').forEach((el) => el.remove());
}

/**
 * @param {import('jsdom').Element} root
 */
function serializeInline(root) {
  /** @type {string[]} */
  const parts = [];
  for (const node of root.childNodes) {
    if (node.nodeType === node.TEXT_NODE) {
      parts.push(node.textContent ?? '');
      continue;
    }
    if (node.nodeType !== node.ELEMENT_NODE) continue;
    const el = /** @type {import('jsdom').Element} */ (node);
    const t = el.tagName.toUpperCase();
    if (SKIP_TAGS.has(t) || el.getAttribute('aria-hidden') === 'true') continue;

    if (['STRONG', 'B'].includes(t)) parts.push(`**${serializeInline(el)}**`);
    else if (['EM', 'I'].includes(t)) parts.push(`_${serializeInline(el)}_`);
    else if (t === 'CODE') parts.push('`' + escapeMdInline(el.textContent) + '`');
    else if (t === 'BR') parts.push('\n');
    else if (t === 'A') {
      const hrefRaw = el.getAttribute('href') || '';
      const href =
        /^https?:/i.test(hrefRaw) || hrefRaw.startsWith('/') || hrefRaw.startsWith('./') || hrefRaw.startsWith('../')
          ? hrefRaw
          : hrefRaw.startsWith('#')
            ? hrefRaw
            : hrefRaw || '#';
      const label = normalizeWhitespace(el.textContent || '');
      parts.push(`[${escapeMdInline(label)}](${href})`);
    } else parts.push(serializeInline(el));
  }
  return parts.join('').replace(/\s+/g, ' ').trim();
}

/**
 * @param {import('jsdom').Element} el
 * @returns {boolean}
 */
function isSkippable(el) {
  if (SKIP_TAGS.has(el.tagName.toUpperCase())) return true;
  if (el.getAttribute('aria-hidden') === 'true') return true;
  return Boolean(el.closest?.('[data-mobile-sticky-cta]'));
}

/**
 * Walk block-level content → Markdown string.
 * @param {import('jsdom').Element} root
 */
function mainToMarkdown(root) {
  /** @type {string[]} */
  const lines = [];

  function walk(el) {
    if (el.nodeType !== 1) return;
    const tag = el.tagName.toUpperCase();

    if (isSkippable(el)) return;

    const hm = /^H([1-6])$/.exec(tag);
    if (hm) {
      const level = Number(hm[1]);
      const hashes = '#'.repeat(level);
      const text = escapeMdInline(normalizeWhitespace(serializeInline(el) || el.textContent || ''));
      if (text) {
        lines.push(`${hashes} ${text}\n`);
      }
      return;
    }

    if (tag === 'P') {
      const txt = serializeInline(el);
      if (txt) lines.push(`${txt}\n`);
      return;
    }

    if (tag === 'UL') {
      for (const li of el.querySelectorAll(':scope > li')) {
        if (isSkippable(li)) continue;
        const bullet = `- ${serializeInline(li)}`;
        lines.push(`${bullet}\n`);
      }
      lines.push('');
      return;
    }

    if (tag === 'OL') {
      let i = 1;
      for (const li of el.querySelectorAll(':scope > li')) {
        if (isSkippable(li)) continue;
        lines.push(`${i}. ${serializeInline(li)}\n`);
        i++;
      }
      lines.push('');
      return;
    }

    if (['SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN', 'NAV', 'ASIDE', 'DIV', 'DETAILS'].includes(tag)) {
      for (const child of [...el.childNodes])
        if (child.nodeType === child.ELEMENT_NODE) walk(/** @type {import('jsdom').Element} */ (child));
      return;
    }

    if (['BUTTON', 'FORM', 'INPUT', 'FIELDSET'].includes(tag)) {
      lines.push(`${escapeMdInline(normalizeWhitespace(el.textContent || ''))}\n`);
      return;
    }
  }

  for (const child of [...root.childNodes])
    if (child.nodeType === child.ELEMENT_NODE) walk(/** @type {import('jsdom').Element} */ (child));

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Chunk markdown by approximate size; keep headings with following text when possible.
 * @param {string} md
 * @param {number} maxChars
 */
function chunkMarkdown(md, maxChars) {
  if (!md) return [{ content: '', index: 0 }];
  if (md.length <= maxChars) return [{ content: md, index: 0 }];
  /** @type {string[]} */
  const paras = md.split(/\n\n+/).map((x) => x.trim()).filter(Boolean);
  /** @type {string[]} */
  const chunks = [];
  let cur = '';

  function flush() {
    if (cur.trim()) chunks.push(cur.trim());
    cur = '';
  }

  for (const p of paras) {
    if ((cur + '\n\n' + p).length > maxChars && cur.trim()) flush();
    if (p.length > maxChars) {
      for (let i = 0; i < p.length; i += maxChars) chunks.push(p.slice(i, i + maxChars));
      continue;
    }
    cur = cur ? `${cur}\n\n${p}` : p;
  }
  flush();
  return chunks.map((content, index) => ({ content, index }));
}

async function main() {
  const { base: siteBase, outDir, chunkSize } = parseArgs(process.argv);

  /** @type {string[]} */
  const errors = [];
  const urls = [];

  console.log(`Base: ${siteBase}`);
  console.log(`Output: ${outDir}`);

  let locPaths;
  try {
    locPaths = filterItalianNonBlog(siteBase, await fetchSitemapLocs(siteBase));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  console.log(`Paths (${locPaths.length}):`);

  /** @type {Map<string,{path:string,url:string}>} */
  const byFinal = new Map();

  await fs.mkdir(path.join(outDir, 'pages'), { recursive: true });

  /** @type {object[]} */
  const jsonlRows = [];

  for (const p of locPaths) {
    const requestUrl = `${siteBase}${p === '/' ? '' : p}`;
    try {
      const res = await fetch(requestUrl, {
        redirect: 'follow',
        headers: {
          Accept: 'text/html',
          'User-Agent':
            'devisia-export-rag/1.0 (+https://devisia.pro)',
        },
      });
      if (!res.ok) {
        errors.push({ path: p, url: requestUrl, error: `HTTP ${res.status}` });
        continue;
      }

      const finalUrl = res.url.split('#')[0];
      const finalPath = normalizePath(finalUrl);

      const html = await res.text();

      if (finalPath === '/blog' || finalPath.startsWith('/blog/')) continue;
      if (finalPath === '/en' || finalPath.startsWith('/en')) continue;
      if (finalPath.startsWith('/api')) continue;

      const dom = new JSDOM(html, { url: finalUrl });
      const { document } = dom.window;

      const main = document.querySelector('main#main') || document.querySelector('main');
      if (!main) {
        errors.push({ path: p, url: requestUrl, error: 'missing <main>' });
        dom.window.close();
        continue;
      }

      if (byFinal.has(finalPath)) {
        console.log(`  dedupe skipped (same destination): ${p} → ${finalPath}`);
        dom.window.close();
        continue;
      }
      byFinal.set(finalPath, { path: finalPath, url: finalUrl });

      const titleRaw = stripSiteTitle(document.querySelector('title')?.textContent || '');
      const metaDesc =
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

      const innerDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      const cloned = /** @type {import('jsdom').Element} */ (
        innerDom.window.document.importNode(main, true)
      );
      innerDom.window.document.body.appendChild(cloned);
      scrubSubtree(cloned);
      const mdBody = cloned ? mainToMarkdown(cloned) : '';

      const slugFile = pathnameToSlug(finalPath);
      const canonUrl =
        `${new URL(siteBase).origin}${finalPath === '/' ? '/' : finalPath}`;

      const frontmatterLines = [
        '---',
        `title: ${JSON.stringify(titleRaw || slugFile)}`,
        `description: ${JSON.stringify(metaDesc || '')}`,
        `url: ${JSON.stringify(canonUrl)}`,
        `path: ${JSON.stringify(finalPath)}`,
        'lang: "it"',
        'type: "page"',
        'source: "rendered-html"',
        `exportedFrom: ${JSON.stringify(requestUrl)}`,
        `generatedAt: ${JSON.stringify(new Date().toISOString())}`,
        '---',
      ];

      const markdown = [...frontmatterLines, '', mdBody].join('\n');

      const outMd = path.join(outDir, 'pages', `${slugFile}.md`);
      await fs.writeFile(outMd, markdown, 'utf8');

      const chunks = chunkMarkdown(mdBody, chunkSize);
      for (const { content, index } of chunks)
        jsonlRows.push({
          id: `it:${slugFile}:${index}`,
          path: finalPath,
          url: canonUrl,
          title: titleRaw,
          lang: 'it',
          chunkIndex: index,
          chunkCount: chunks.length,
          description: metaDesc,
          source: 'rendered-html',
          content,
        });

      urls.push({ path: finalPath, url: canonUrl });
      console.log(`  ok ${finalPath}`);
      dom.window.close();
      innerDom.window.close();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ path: p, url: requestUrl, error: msg });
      console.warn(`  fail ${p}: ${msg}`);
    }
  }

  const jsonlPath = path.join(outDir, 'index.jsonl');
  await fs.writeFile(
    jsonlPath,
    jsonlRows.map((r) => JSON.stringify(r)).join('\n') + '\n',
    'utf8'
  );

  const manifestPath = path.join(outDir, 'manifest.json');
  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        base: siteBase,
        exportedCount: urls.length,
        urls,
        chunkSize,
        jsonlRecords: jsonlRows.length,
        errors,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`\nExported ${urls.length} pages`);
  console.log(`${jsonlRows.length} JSONL records`);
  if (errors.length) console.warn(`Errors: ${errors.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
