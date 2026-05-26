import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const EN_DIR = path.join(process.cwd(), 'src/content/blog/en');
const IT_DIR = path.join(process.cwd(), 'src/content/blog/it');

const EN_PHRASES = [
  ' in the ',
  ' of the ',
  ' and the ',
  ' with the ',
  ' for the ',
  ' you can ',
  ' you should ',
  ' this is ',
  ' that is ',
  ' however ',
  ' therefore ',
  ' moreover ',
  ' in order to ',
  ' as well as ',
  ' such as ',
  ' according to ',
  ' data protection ',
  ' software development ',
  ' cloud computing ',
];

function stripMarkdown(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countPhrases(text) {
  const lower = stripMarkdown(text).toLowerCase();
  let count = 0;
  for (const phrase of EN_PHRASES) {
    let idx = 0;
    while ((idx = lower.indexOf(phrase, idx)) !== -1) {
      count++;
      idx += phrase.length;
    }
  }
  return count;
}

function sameTitle(a, b) {
  return String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
}

async function listMarkdown(dir) {
  const files = await fs.readdir(dir);
  return files.filter((f) => /\.mdx?$/i.test(f)).sort();
}

async function main() {
  const enFiles = await listMarkdown(EN_DIR);
  const itFiles = new Set(await listMarkdown(IT_DIR));

  const issues = [];

  for (const file of enFiles) {
    const enSlug = file.replace(/\.mdx?$/i, '');
    const enParsed = matter(await fs.readFile(path.join(EN_DIR, file), 'utf8'));
    if (!enParsed.data.autoTranslateToIt) continue;

    const itSlug = String(enParsed.data.translationSlug ?? '').trim();
    if (!itSlug) {
      issues.push({ enSlug, itSlug, kind: 'missing-slug' });
      continue;
    }

    const itPath = path.join(IT_DIR, `${itSlug}.md`);
    if (!itFiles.has(`${itSlug}.md`)) {
      issues.push({ enSlug, itSlug, kind: 'missing-it' });
      continue;
    }

    const itParsed = matter(await fs.readFile(itPath, 'utf8'));
    const enBody = stripMarkdown(enParsed.content);
    const itBody = stripMarkdown(itParsed.content);
    const enPhrases = countPhrases(enParsed.content);
    const itPhrases = countPhrases(itParsed.content);
    const lenRatio = itBody.length / Math.max(enBody.length, 1);
    const titleMatch = sameTitle(enParsed.data.title, itParsed.data.title);

    const flags = [];
    if (titleMatch) flags.push('same-title');
    if (itPhrases >= 5) flags.push(`english-phrases:${itPhrases}`);
    if (lenRatio < 0.55) flags.push(`short-body:${Math.round(lenRatio * 100)}%`);
    if (lenRatio > 1.45) flags.push(`long-body:${Math.round(lenRatio * 100)}%`);
    if (enSlug === itSlug && itPhrases >= 3) flags.push('same-slug-english');

    if (flags.length) {
      issues.push({
        enSlug,
        itSlug,
        kind: 'suspect',
        flags,
        enTitle: enParsed.data.title,
        itTitle: itParsed.data.title,
        hasHash: Boolean(itParsed.data.translationSourceHash),
      });
    }
  }

  const missingIt = issues.filter((i) => i.kind === 'missing-it');
  const missingSlug = issues.filter((i) => i.kind === 'missing-slug');
  const suspect = issues.filter((i) => i.kind === 'suspect');

  console.log(`Total issues: ${issues.length}`);
  console.log(`Missing IT: ${missingIt.length}`);
  console.log(`Missing slug: ${missingSlug.length}`);
  console.log(`Suspect translations: ${suspect.length}`);
  console.log('');

  for (const row of issues) {
    if (row.kind === 'missing-it') {
      console.log(`MISSING  ${row.enSlug} -> ${row.itSlug}`);
      continue;
    }
    if (row.kind === 'missing-slug') {
      console.log(`NO SLUG ${row.enSlug}`);
      continue;
    }
    console.log(`SUSPECT  ${row.enSlug} -> ${row.itSlug} [${row.flags.join(', ')}] hash=${row.hasHash}`);
    console.log(`         EN: ${row.enTitle}`);
    console.log(`         IT: ${row.itTitle}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
