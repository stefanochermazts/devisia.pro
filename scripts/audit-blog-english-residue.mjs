import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { findEnglishResidue, needsItalianTranslation } from './lib/blog-translation-audit.mjs';

const EN_DIR = path.join(process.cwd(), 'src/content/blog/en');
const IT_DIR = path.join(process.cwd(), 'src/content/blog/it');

async function listMarkdown(dir) {
  const files = await fs.readdir(dir);
  return files.filter((f) => /\.mdx?$/i.test(f)).sort();
}

async function main({ printOnlyTranslate = false } = {}) {
  const log = printOnlyTranslate ? (...args) => console.error(...args) : console.log.bind(console);
  const enFiles = await listMarkdown(EN_DIR);
  const itFiles = new Set(await listMarkdown(IT_DIR));

  const needsTranslation = [];
  let ok = 0;

  for (const file of enFiles) {
    const enSlug = file.replace(/\.mdx?$/i, '');
    const enParsed = matter(await fs.readFile(path.join(EN_DIR, file), 'utf8'));
    if (!enParsed.data.autoTranslateToIt) continue;

    const itSlug = String(enParsed.data.translationSlug ?? '').trim();
    if (!itSlug) continue;

    const itExists = itFiles.has(`${itSlug}.md`);
    const itParsed = itExists
      ? matter(await fs.readFile(path.join(IT_DIR, `${itSlug}.md`), 'utf8'))
      : { data: {}, content: '' };

    const verdict = needsItalianTranslation({
      enTitle: enParsed.data.title,
      enDescription: enParsed.data.description,
      enBody: enParsed.content,
      itExists,
      itTitle: itParsed.data.title,
      itDescription: itParsed.data.description,
      itBody: itParsed.content,
    });

    if (!verdict.needed) {
      ok++;
      continue;
    }

    const residue = itExists ? findEnglishResidue(itParsed.content) : { prose: [], tables: [], alts: [] };
    needsTranslation.push({
      enSlug,
      itSlug,
      reasons: verdict.reasons,
      prose: residue.prose.length,
      tables: residue.tables.length,
      alts: residue.alts.length,
      enTitle: enParsed.data.title,
      itTitle: itParsed.data?.title,
    });
  }

  log(`Needs Italian translation: ${needsTranslation.length}`);
  log(`Looks translated OK: ${ok}`);
  log('');

  for (const row of needsTranslation) {
    log(`- ${row.enSlug} -> ${row.itSlug}`);
    log(`  reasons: ${row.reasons.join(', ')}`);
    if (row.prose || row.tables || row.alts) {
      log(`  residue: prose=${row.prose}, tables=${row.tables}, alts=${row.alts}`);
    }
    log(`  EN: ${row.enTitle}`);
    log(`  IT: ${row.itTitle ?? '(missing)'}`);
  }

  const only = needsTranslation.map((r) => r.enSlug).join(',');
  if (only) {
    log('');
    log('ONLY_TRANSLATE=' + only);
    if (printOnlyTranslate) process.stdout.write(only);
  }
}

main({ printOnlyTranslate: process.argv.includes('--print-only-translate') }).catch((err) => {
  console.error(err);
  process.exit(1);
});
