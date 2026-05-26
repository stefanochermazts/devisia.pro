import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const EN_DIR = path.join(process.cwd(), 'src/content/blog/en');
const IT_DIR = path.join(process.cwd(), 'src/content/blog/it');

async function main() {
  const enFiles = (await fs.readdir(EN_DIR)).filter((f) => f.endsWith('.md'));
  const enSlugs = new Set(enFiles.map((f) => f.replace(/\.md$/, '')));
  let fixed = 0;

  for (const file of enFiles) {
    const enSlug = file.replace(/\.md$/, '');
    const enPath = path.join(EN_DIR, file);
    const enParsed = matter(await fs.readFile(enPath, 'utf8'));
    if (!enParsed.data.autoTranslateToIt) continue;

    const itSlug = String(enParsed.data.translationSlug ?? '').trim();
    if (!itSlug) {
      console.warn(`Skip ${enSlug}: EN missing translationSlug`);
      continue;
    }

    const itPath = path.join(IT_DIR, `${itSlug}.md`);
    try {
      const itRaw = await fs.readFile(itPath, 'utf8');
      const itParsed = matter(itRaw);
      const current = String(itParsed.data.translationSlug ?? '').trim();

      if (current === enSlug && enSlugs.has(current)) continue;

      const nextFrontmatter = { ...itParsed.data, translationSlug: enSlug };
      const nextRaw = matter.stringify(itParsed.content, nextFrontmatter);
      await fs.writeFile(itPath, nextRaw, 'utf8');
      fixed++;
      console.log(`Fixed ${itSlug}: translationSlug "${current || '(empty)'}" -> "${enSlug}"`);
    } catch {
      console.warn(`Skip ${enSlug}: IT file ${itSlug}.md not found`);
    }
  }

  console.log(`Done. Fixed ${fixed} IT file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
