import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const EN_DIR = path.join(process.cwd(), 'src/content/blog/en');
const IT_DIR = path.join(process.cwd(), 'src/content/blog/it');

async function main() {
  const enFiles = (await fs.readdir(EN_DIR)).filter((f) => f.endsWith('.md'));
  const enSlugs = new Set(enFiles.map((f) => f.replace(/\.md$/, '')));

  const enByItSlug = new Map();
  for (const file of enFiles) {
    const parsed = matter(await fs.readFile(path.join(EN_DIR, file), 'utf8'));
    const itSlug = String(parsed.data.translationSlug ?? '').trim();
    if (itSlug) enByItSlug.set(itSlug, file.replace(/\.md$/, ''));
  }

  const itFiles = (await fs.readdir(IT_DIR)).filter((f) => f.endsWith('.md'));
  const wrongSlug = [];
  const okSlug = [];

  for (const file of itFiles) {
    const itSlug = file.replace(/\.md$/, '');
    const parsed = matter(await fs.readFile(path.join(IT_DIR, file), 'utf8'));
    const ts = String(parsed.data.translationSlug ?? '').trim();
    if (!ts) {
      wrongSlug.push({ itSlug, ts, reason: 'empty' });
      continue;
    }
    if (enSlugs.has(ts)) {
      okSlug.push({ itSlug, enSlug: ts });
      continue;
    }
    const expectedEn = enByItSlug.get(itSlug);
    wrongSlug.push({
      itSlug,
      ts,
      expectedEn: expectedEn ?? 'unknown',
      reason: expectedEn ? 'points-to-it-slug' : 'en-not-found',
    });
  }

  console.log(`IT files with correct translationSlug (EN slug): ${okSlug.length}`);
  console.log(`IT files with wrong/missing translationSlug: ${wrongSlug.length}`);
  console.log('');
  for (const row of wrongSlug) {
    console.log(`${row.itSlug}: translationSlug="${row.ts}" expected="${row.expectedEn}" (${row.reason})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
