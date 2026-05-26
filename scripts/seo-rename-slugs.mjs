import fs from 'fs/promises';
import path from 'path';

/** IT blog slug renames: old filename (no .md) -> new slug */
export const IT_BLOG_RENAMES = {
  'advanced-driver-assistance-system': 'sistema-assistenza-guida-resiliente',
  'confidentiality-agreement-template': 'modello-accordo-riservatezza-nda',
  'consent-management-platform': 'piattaforma-gestione-consenso',
  'cyber-security-consultancies': 'consulenza-cybersecurity-pragmatica',
  'data-processing-agreement': 'contratto-trattamento-dati',
  'data-processing-agreements': 'accordi-trattamento-dati',
  'data-retention-policies': 'policy-conservazione-dati',
  'disaster-recovery-and-cloud-computing': 'disaster-recovery-nel-cloud',
  'document-management-system': 'software-gestione-documenti',
  'first-party-data': 'strategia-dati-first-party',
  'internet-of-things-automotive': 'iot-settore-automotive',
  'means-of-compliance': 'mezzi-di-conformita',
  'personal-identifiable-information': 'informazioni-personali-identificabili',
  'program-management-officer': 'responsabile-gestione-programmi',
  'solutions-for-iot': 'soluzioni-iot-scalabili',
  'travel-artificial-intelligence': 'intelligenza-artificiale-travel',
  'progetti-kaizen-cosa-sono-e-perché-funzionano-nel-mantenimento-dei-sistemi-esistenti':
    'progetti-kaizen-cosa-sono-e-perche-funzionano-nel-mantenimento-dei-sistemi-esistenti',
};

/** EN blog slug renames */
export const EN_BLOG_RENAMES = {
  'costruire-software-su-misura-senza-creare-problemi-futuri':
    'building-custom-software-without-building-future-problems',
};

async function renameBlogFiles(dir, renames) {
  for (const [oldSlug, newSlug] of Object.entries(renames)) {
    const oldPath = path.join(dir, `${oldSlug}.md`);
    const newPath = path.join(dir, `${newSlug}.md`);
    try {
      await fs.access(oldPath);
      await fs.rename(oldPath, newPath);
      console.log(`Renamed ${path.relative(process.cwd(), oldPath)} -> ${newSlug}.md`);
    } catch {
      console.warn(`Skip rename (missing): ${oldPath}`);
    }
  }
}

async function replaceInTree(rootDir, replacements) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(rootDir, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    if (entry.isDirectory()) {
      await replaceInTree(full, replacements);
      continue;
    }
    if (!/\.(md|astro|ts|tsx|js|mjs|json|yaml|yml|toml)$/.test(entry.name)) continue;
    let content = await fs.readFile(full, 'utf-8');
    let changed = false;
    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(full, content, 'utf-8');
      console.log(`Updated references in ${path.relative(process.cwd(), full)}`);
    }
  }
}

function buildReplacements() {
  const pairs = [];
  for (const [oldSlug, newSlug] of Object.entries(IT_BLOG_RENAMES)) {
    pairs.push([`/blog/${oldSlug}`, `/blog/${newSlug}`]);
    pairs.push([`translationSlug: ${oldSlug}`, `translationSlug: ${newSlug}`]);
    pairs.push([`translationSlug: "${oldSlug}"`, `translationSlug: "${newSlug}"`]);
    pairs.push([`translationSlug: '${oldSlug}'`, `translationSlug: '${newSlug}'`]);
  }
  for (const [oldSlug, newSlug] of Object.entries(EN_BLOG_RENAMES)) {
    pairs.push([`/en/blog/${oldSlug}`, `/en/blog/${newSlug}`]);
    pairs.push([`translationSlug: ${oldSlug}`, `translationSlug: ${newSlug}`]);
    pairs.push([`translationSlug: "${oldSlug}"`, `translationSlug: "${newSlug}"`]);
  }
  return pairs;
}

function buildRedirectToml() {
  const lines = ['\n# SEO audit slug redirects (301)\n'];
  for (const [oldSlug, newSlug] of Object.entries(IT_BLOG_RENAMES)) {
    lines.push('[[redirects]]');
    lines.push(`  from = "/blog/${oldSlug}"`);
    lines.push(`  to = "/blog/${newSlug}/"`);
    lines.push('  status = 301');
    lines.push('');
    if (oldSlug.includes('é')) {
      const encoded = oldSlug.replace('é', '%C3%A9');
      lines.push('[[redirects]]');
      lines.push(`  from = "/blog/${encoded}"`);
      lines.push(`  to = "/blog/${newSlug}/"`);
      lines.push('  status = 301');
      lines.push('');
    }
  }
  for (const [oldSlug, newSlug] of Object.entries(EN_BLOG_RENAMES)) {
    lines.push('[[redirects]]');
    lines.push(`  from = "/en/blog/${oldSlug}"`);
    lines.push(`  to = "/en/blog/${newSlug}/"`);
    lines.push('  status = 301');
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const root = process.cwd();
  await renameBlogFiles(path.join(root, 'src/content/blog/it'), IT_BLOG_RENAMES);
  await renameBlogFiles(path.join(root, 'src/content/blog/en'), EN_BLOG_RENAMES);

  await replaceInTree(path.join(root, 'src'), buildReplacements());
  await replaceInTree(path.join(root, 'rag-export'), buildReplacements()).catch(() => {});

  // Fix bidirectional translation for renamed EN post
  const itCustom = path.join(
    root,
    'src/content/blog/it/costruire-software-su-misura-senza-creare-problemi-futuri.md',
  );
  try {
    let content = await fs.readFile(itCustom, 'utf-8');
    content = content.replace(
      /translationSlug:\s*costruire-software-su-misura-senza-creare-problemi-futuri/,
      'translationSlug: building-custom-software-without-building-future-problems',
    );
    await fs.writeFile(itCustom, content, 'utf-8');
    console.log('Fixed IT costruire-software translationSlug');
  } catch {
    console.warn('IT costruire-software file not found for translationSlug fix');
  }

  const enBuilding = path.join(
    root,
    'src/content/blog/en/building-custom-software-without-building-future-problems.md',
  );
  try {
    let content = await fs.readFile(enBuilding, 'utf-8');
    content = content.replace(
      /translationSlug:\s*building-custom-software-without-building-future-problems/,
      'translationSlug: costruire-software-su-misura-senza-creare-problemi-futuri',
    );
    if (!content.includes('translationSlug: costruire-software')) {
      content = content.replace(
        /translationSlug:\s*.+/,
        'translationSlug: costruire-software-su-misura-senza-creare-problemi-futuri',
      );
    }
    await fs.writeFile(enBuilding, content, 'utf-8');
    console.log('Fixed EN building-custom-software translationSlug');
  } catch {
    console.warn('EN building-custom-software file not found');
  }

  const tomlPath = path.join(root, 'netlify.toml');
  let toml = await fs.readFile(tomlPath, 'utf-8');
  const marker = '# SEO audit slug redirects (301)';
  if (toml.includes(marker)) {
    toml = toml.split(marker)[0].trimEnd() + '\n';
  }
  toml += buildRedirectToml();
  await fs.writeFile(tomlPath, toml, 'utf-8');
  console.log('Appended redirects to netlify.toml');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
