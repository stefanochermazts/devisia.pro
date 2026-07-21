#!/usr/bin/env node
/**
 * Export all Italian site copy into a single Markdown file for chatbot / RAG prep.
 *
 * Includes:
 * - Rendered Italian pages (from sitemap, excluding /blog and /en)
 * - Blog articles from src/content/blog/it (source Markdown)
 * - Project pages from src/content/projects/it
 * - CMS page metadata from src/content/pages/it
 *
 * Usage:
 *   node scripts/export-chatbot-corpus-it.mjs
 *   node scripts/export-chatbot-corpus-it.mjs --base http://127.0.0.1:4321
 *   node scripts/export-chatbot-corpus-it.mjs --out rag-export/it/devisia-corpus-it.md
 *   node scripts/export-chatbot-corpus-it.mjs --offline
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  fetchPageMarkdown,
  fetchSitemapLocs,
  filterItalianNonBlog,
} from './lib/site-export-html.mjs';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src', 'content');

function parseArgs(argv) {
  let base = 'https://devisia.pro';
  let outFile = path.join(ROOT, 'rag-export', 'it', 'devisia-corpus-it.md');
  let offline = false;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' && argv[i + 1]) base = argv[++i];
    else if (a === '--out' && argv[i + 1]) outFile = path.resolve(ROOT, argv[++i]);
    else if (a === '--offline') offline = true;
  }

  return { base: base.replace(/\/+$/, ''), outFile, offline };
}

async function* walkMarkdownFiles(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkMarkdownFiles(full);
    else if (/\.mdx?$/i.test(entry.name)) yield full;
  }
}

function formatMetaBlock(fields) {
  return Object.entries(fields)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `- **${k}:** ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n');
}

function flattenFrontmatter(data, prefix = '') {
  /** @type {Record<string, string>} */
  const flat = {};

  for (const [key, value] of Object.entries(data ?? {})) {
    const label = prefix ? `${prefix}.${key}` : key;
    if (value == null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (typeof value[0] === 'object') {
        value.forEach((item, i) => {
          Object.assign(flat, flattenFrontmatter(item, `${label}[${i}]`));
        });
      } else {
        flat[label] = value.join(', ');
      }
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      Object.assign(flat, flattenFrontmatter(value, label));
    } else if (value instanceof Date) {
      flat[label] = value.toISOString().slice(0, 10);
    } else {
      flat[label] = String(value);
    }
  }

  return flat;
}

async function loadMarkdownSections(contentDir, type, urlBuilder) {
  /** @type {{ title: string, url: string, body: string, sortKey: string }[]} */
  const sections = [];

  for await (const filePath of walkMarkdownFiles(contentDir)) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    const slug = path.basename(filePath).replace(/\.mdx?$/i, '');
    const title = data.title || slug;
    const url = urlBuilder(slug, data);
    const meta = flattenFrontmatter(data);
    const metaBlock = Object.keys(meta).length ? `\n\n${formatMetaBlock(meta)}` : '';
    const body = `${content.trim()}${metaBlock}`.trim();

    sections.push({
      title,
      url,
      body,
      sortKey: slug,
    });
  }

  sections.sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'it'));
  return sections;
}

function sectionDivider(title) {
  return `\n\n---\n\n`;
}

async function main() {
  const { base, outFile, offline } = parseArgs(process.argv);
  const generatedAt = new Date().toISOString();

  /** @type {string[]} */
  const parts = [
    '# Corpus contenuti italiani — Devisia',
    '',
    `Generato: ${generatedAt}`,
    offline ? 'Modalità: solo file Markdown locali (nessun fetch HTML).' : `Sorgente pagine renderizzate: ${base}`,
    '',
    'Questo file riunisce testi pubblici in italiano per addestramento o indicizzazione di un chatbot.',
    'Le sezioni sono separate da `---`.',
  ];

  /** @type {{ type: string, title: string, url?: string, error?: string }[]} */
  const manifest = [];
  /** @type {{ type: string, path: string, error: string }[]} */
  const errors = [];

  if (!offline) {
    parts.push(sectionDivider('Pagine sito (HTML renderizzato)'));

    let paths;
    try {
      paths = filterItalianNonBlog(base, await fetchSitemapLocs(base));
    } catch (e) {
      console.error('Impossibile leggere la sitemap:', e);
      process.exit(1);
    }

    console.log(`Pagine da ${base}: ${paths.length}`);

    for (const pagePath of paths) {
      try {
        const page = await fetchPageMarkdown(base, pagePath);
        parts.push(`## ${page.title || page.path}`);
        parts.push('');
        parts.push(`- **URL:** ${page.url}`);
        if (page.description) parts.push(`- **Descrizione:** ${page.description}`);
        parts.push(`- **Tipo:** pagina`);
        parts.push('');
        parts.push(page.body || '_Nessun contenuto estratto dal main._');
        manifest.push({ type: 'page', title: page.title || page.path, url: page.url });
        console.log(`  ok ${page.path}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push({ type: 'page', path: pagePath, error: msg });
        console.warn(`  fail ${pagePath}: ${msg}`);
      }
    }
  }

  console.log('Articoli blog (sorgente locale)...');
  const blogSections = await loadMarkdownSections(
    path.join(CONTENT, 'blog', 'it'),
    'blog',
    (slug) => `https://devisia.pro/blog/${slug}`
  );

  parts.push(sectionDivider('Articoli blog'));
  for (const article of blogSections) {
    parts.push(`## ${article.title}`);
    parts.push('');
    parts.push(`- **URL:** ${article.url}`);
    parts.push(`- **Tipo:** articolo blog`);
    parts.push('');
    parts.push(article.body || '_Vuoto_');
    manifest.push({ type: 'blog', title: article.title, url: article.url });
  }
  console.log(`  ${blogSections.length} articoli`);

  console.log('Progetti (sorgente locale)...');
  const projectSections = await loadMarkdownSections(
    path.join(CONTENT, 'projects', 'it'),
    'project',
    (slug, data) => {
      if (slug === 'auditready') return 'https://audit-ready.eu/';
      return `https://devisia.pro/projects/${data.slug || slug}`;
    }
  );

  parts.push(sectionDivider('Progetti'));
  for (const project of projectSections) {
    parts.push(`## ${project.title}`);
    parts.push('');
    parts.push(`- **URL:** ${project.url}`);
    parts.push(`- **Tipo:** progetto`);
    parts.push('');
    parts.push(project.body || '_Vuoto_');
    manifest.push({ type: 'project', title: project.title, url: project.url });
  }
  console.log(`  ${projectSections.length} progetti`);

  console.log('Metadati pagine CMS...');
  const cmsSections = await loadMarkdownSections(
    path.join(CONTENT, 'pages', 'it'),
    'cms',
    (slug) => {
      const map = {
        home: 'https://devisia.pro/',
        about: 'https://devisia.pro/chi-siamo',
        contact: 'https://devisia.pro/contatti',
        privacy: 'https://devisia.pro/privacy',
        services: 'https://devisia.pro/cosa-facciamo',
      };
      return map[slug] || `https://devisia.pro/${slug}`;
    }
  );

  parts.push(sectionDivider('Metadati CMS (pagine statiche)'));
  parts.push(
    '_Campi strutturati da Decap/CMS. Il testo visibile sul sito per queste route è già nelle sezioni HTML sopra._',
    ''
  );
  for (const cms of cmsSections) {
    parts.push(`## ${cms.title}`);
    parts.push('');
    parts.push(`- **URL:** ${cms.url}`);
    parts.push(`- **Tipo:** metadati CMS`);
    parts.push('');
    parts.push(cms.body || '_Vuoto_');
    manifest.push({ type: 'cms', title: cms.title, url: cms.url });
  }
  console.log(`  ${cmsSections.length} voci CMS`);

  const corpus = parts.join('\n');
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, corpus, 'utf8');

  const manifestPath = outFile.replace(/\.md$/i, '.manifest.json');
  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt,
        base,
        offline,
        outputFile: outFile,
        characterCount: corpus.length,
        sectionCount: manifest.length,
        sections: manifest,
        errors,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`\nScritto: ${outFile}`);
  console.log(`Caratteri: ${corpus.length.toLocaleString('it-IT')}`);
  console.log(`Sezioni: ${manifest.length}`);
  if (errors.length) console.warn(`Errori: ${errors.length} (vedi manifest)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
