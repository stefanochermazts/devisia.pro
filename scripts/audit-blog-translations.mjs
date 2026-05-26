import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { needsItalianTranslation, findEnglishResidue } from './lib/blog-translation-audit.mjs';

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
  const ok = [];
  const configIssues = [];

  for (const file of enFiles) {
    const enSlug = file.replace(/\.mdx?$/i, '');
    const enRaw = await fs.readFile(path.join(EN_DIR, file), 'utf8');
    const enParsed = matter(enRaw);
    if (!enParsed.data.autoTranslateToIt) continue;

    const itSlug = String(enParsed.data.translationSlug ?? '').trim();
    if (!itSlug) {
      configIssues.push({ enSlug, reasons: ['missing-translationSlug'] });
      continue;
    }

    const itPath = path.join(IT_DIR, `${itSlug}.md`);
    const itExists = itFiles.has(`${itSlug}.md`);
    let itParsed = { data: {}, content: '' };
    if (itExists) {
      itParsed = matter(await fs.readFile(itPath, 'utf8'));
    }

    const verdict = needsItalianTranslation({
      enTitle: enParsed.data.title,
      enDescription: enParsed.data.description,
      enBody: enParsed.content,
      itExists,
      itTitle: itParsed.data.title,
      itDescription: itParsed.data.description,
      itBody: itParsed.content,
    });

    const residue = itExists ? findEnglishResidue(itParsed.content) : { prose: [], tables: [], alts: [] };

    const row = {
      enSlug,
      itSlug,
      reasons: verdict.reasons,
      prose: residue.prose.length,
      tables: residue.tables.length,
      alts: residue.alts.length,
      hasHash: Boolean(itParsed.data?.translationSourceHash),
      enTitle: enParsed.data.title,
      itTitle: itParsed.data?.title,
    };

    if (verdict.needed) needsTranslation.push(row);
    else ok.push(row);
  }

  log(`Auto-translate EN posts: ${needsTranslation.length + ok.length + configIssues.length}`);
  log(`Needs Italian translation: ${needsTranslation.length}`);
  log(`Looks translated OK: ${ok.length}`);
  log(`Config issues: ${configIssues.length}`);
  log('');

  if (configIssues.length) {
    log('=== CONFIG ISSUES ===');
    for (const row of configIssues) {
      log(`- ${row.enSlug}: ${row.reasons.join(', ')}`);
    }
    log('');
  }

  if (needsTranslation.length) {
    log('=== NEEDS TRANSLATION ===');
    for (const row of needsTranslation) {
      log(`- ${row.enSlug} -> ${row.itSlug} [${row.reasons.join(', ')}] hash=${row.hasHash}`);
      if (row.prose || row.tables || row.alts) {
        log(`  residue: prose=${row.prose}, tables=${row.tables}, alts=${row.alts}`);
      }
      log(`  EN: ${row.enTitle}`);
      log(`  IT: ${row.itTitle ?? '(missing)'}`);
    }
    log('');
    const only = needsTranslation.map((r) => r.enSlug).join(',');
    log('ONLY_TRANSLATE=' + only);
    if (printOnlyTranslate) {
      process.stdout.write(only);
    }
  }
}

main({ printOnlyTranslate: process.argv.includes('--print-only-translate') }).catch((err) => {
  console.error(err);
  process.exit(1);
});
