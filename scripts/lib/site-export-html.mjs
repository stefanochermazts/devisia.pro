import { JSDOM } from 'jsdom';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEMPLATE']);

export function normalizePath(fullUrlString) {
  try {
    const u = new URL(fullUrlString);
    let p = u.pathname || '/';
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p === '' ? '/' : p;
  } catch {
    return '/';
  }
}

export async function fetchSitemapLocs(siteBase) {
  const smUrl = `${siteBase}/sitemap.xml`;
  const res = await fetch(smUrl);
  if (!res.ok) throw new Error(`sitemap fetch failed ${res.status}: ${smUrl}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
  return [...new Set(locs)];
}

export function filterItalianNonBlog(siteBase, locs) {
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

export function stripSiteTitle(title) {
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

export function scrubSubtree(rootEl) {
  rootEl.querySelectorAll('script, style, noscript, iframe').forEach((el) => el.remove());
  rootEl.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  rootEl.querySelectorAll('[data-mobile-sticky-cta]').forEach((el) => el.remove());
}

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

function isSkippable(el) {
  if (SKIP_TAGS.has(el.tagName.toUpperCase())) return true;
  if (el.getAttribute('aria-hidden') === 'true') return true;
  return Boolean(el.closest?.('[data-mobile-sticky-cta]'));
}

export function mainToMarkdown(root) {
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

export function chunkMarkdown(md, maxChars) {
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

/**
 * @param {string} siteBase
 * @param {string} pagePath e.g. `/contatti`
 */
export async function fetchPageMarkdown(siteBase, pagePath) {
  const requestUrl = `${siteBase}${pagePath === '/' ? '' : pagePath}`;
  const res = await fetch(requestUrl, {
    redirect: 'follow',
    headers: {
      Accept: 'text/html',
      'User-Agent': 'devisia-export-corpus/1.0 (+https://devisia.pro)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const finalUrl = res.url.split('#')[0];
  const finalPath = normalizePath(finalUrl);
  const html = await res.text();
  const dom = new JSDOM(html, { url: finalUrl });
  const { document } = dom.window;

  const main = document.querySelector('main#main') || document.querySelector('main');
  if (!main) {
    dom.window.close();
    throw new Error('missing <main>');
  }

  const titleRaw = stripSiteTitle(document.querySelector('title')?.textContent || '');
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

  const innerDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const cloned = /** @type {import('jsdom').Element} */ (innerDom.window.document.importNode(main, true));
  innerDom.window.document.body.appendChild(cloned);
  scrubSubtree(cloned);
  const mdBody = mainToMarkdown(cloned);

  dom.window.close();
  innerDom.window.close();

  const canonUrl = `${new URL(siteBase).origin}${finalPath === '/' ? '/' : finalPath}`;

  return {
    path: finalPath,
    url: canonUrl,
    title: titleRaw,
    description: metaDesc,
    body: mdBody,
    exportedFrom: requestUrl,
  };
}
