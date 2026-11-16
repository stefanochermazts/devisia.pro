import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const REPO_ROOT = process.cwd();

const CORE_DIRS = [
  'src/pages',
  'src/components/site',
  'src/data/landing',
  'src/content/projects',
  'src/content/pages',
];

const BLOG_DIRS = [
  'src/content/blog/it',
  'src/content/blog/en',
];

const SEO_STUFFING_PATTERNS = [
  {
    id: 'awkward-it-ai-governance',
    re: /\bgovernance intelligenza artificiale\b/gi,
    hint: 'Manca la preposizione ("governance dell\'intelligenza artificiale" o "governance AI")',
  },
  {
    id: 'bold-keyword-stuffing-it',
    re: /\b(approccio di|soluzione di|supporto di|questo)\s+\*\*(AI e privacy|AI responsabile|sviluppo software su misura|software basato su AI|sviluppo SaaS)\*\*/gi,
    hint: 'Keyword SEO forzata in grassetto dentro la frase',
  },
  {
    id: 'bold-keyword-stuffing-en',
    re: /\b(through an|designed with a|It is a|This)\s+\*\*(AI and privacy|responsible AI|custom software development|AI-based software|SaaS development)\*\*/gi,
    hint: 'Forced bold SEO keyword phrase in prose',
  },
];

const STEREOTYPED_OPENERS = [
  {
    id: 'not-measured-by-x-but-y-it',
    re: /non si misura in base a[^.?!]+\.\s*Si misura in base a/i,
    hint: 'Incipit formulaico "non si misura in base a X. Si misura in base a Y"',
  },
  {
    id: 'not-measured-by-x-but-y-en',
    re: /is not measured by[^.?!]+\.\s*It is measured by/i,
    hint: 'Formulaic opener "is not measured by X. It is measured by Y"',
  },
  {
    id: 'in-todays-landscape',
    re: /\b(nel panorama (digitale|tecnologico|aziendale) odierno|in today's fast-paced|in an era where)\b/i,
    hint: 'Cliché di apertura tipico dei modelli LLM vecchi',
  },
];

const BINARY_CONTRAST_PATTERNS_IT = [
  /\bnon\s+[^,.;:?!\n]{3,45},\s*ma\s+/gi,
  /,\s+non\s+(?:un|una|uno|il|lo|la|i|gli|le|solo|semplicemente|promesse|archivi|moduli|policy|teatro|demo)\b/gi,
  /\bNon\s+(?:moduli|policy|promesse|teatro|scaffale|agenzia)\b[^.!?\n]{0,40}:/g,
];

const BINARY_CONTRAST_PATTERNS_EN = [
  /\bnot\s+[^,.;:?!\n]{3,45},\s*but\s+/gi,
  /,\s+not\s+(?:a|an|the|just|merely|magical|archives|disconnected|decorative|theatre|demo)\b/gi,
  /\bNot\s+(?:disconnected|decorative|magical|theatre)\b[^.!?\n]{0,40}:/g,
];

async function walkFiles(dirPath, exts) {
  const results = [];
  let entries = [];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkFiles(full, exts)));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results.sort();
}

function extractReadableText(raw, ext) {
  if (ext === '.md' || ext === '.mdx') {
    try {
      const parsed = matter(raw);
      const fmText = [parsed.data?.title, parsed.data?.description].filter(Boolean).join('\n');
      return { text: `${fmText}\n${parsed.content}`, body: parsed.content };
    } catch {
      return { text: raw, body: raw };
    }
  }

  if (ext === '.astro') {
    const parts = raw.split('---');
    let frontmatter = '';
    let template = raw;
    if (parts.length >= 3 && raw.trimStart().startsWith('---')) {
      frontmatter = parts[1];
      template = parts.slice(2).join('---');
    }
    const fmStrings = Array.from(frontmatter.matchAll(/['"`]([^'"`\n]{12,})['"`]/g))
      .map((m) => m[1])
      .filter((s) => !s.startsWith('../') && !s.startsWith('./') && !s.startsWith('http') && !s.startsWith('/'));

    const cleanTemplate = template
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ');

    const propStrings = Array.from(
      cleanTemplate.matchAll(/\b(?:title|h1|lede|copy|description|ctaLabel|eyebrow)\s*=\s*["']([^"']+)["']/g)
    ).map((m) => m[1].trim());

    const paragraphs = Array.from(cleanTemplate.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map((m) =>
      m[1]
        .replace(/\{[^}]+\}/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    );

    const stripped = cleanTemplate
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      text: `${fmStrings.join('\n')}\n${propStrings.join('\n')}\n${stripped}`,
      body: `${propStrings.join('\n')}\n${stripped}`,
      paragraphs,
    };
  }

  if (ext === '.ts') {
    const strings = Array.from(raw.matchAll(/['"`]([^'"`\n]{12,})['"`]/g))
      .map((m) => m[1])
      .filter((s) => !s.startsWith('../') && !s.startsWith('./') && !s.startsWith('http') && !s.startsWith('/'));
    return { text: strings.join('\n'), body: strings.join('\n') };
  }

  return { text: raw, body: raw };
}

function isVerblessNominalList(paragraph) {
  if (!paragraph || paragraph.length < 65) return false;
  const commas = (paragraph.match(/,/g) || []).length;
  if (commas < 5) return false;
  // Check if common Italian or English finite verbs appear
  const hasVerb =
    /\b(è|sono|ha|hanno|fa|fanno|può|possono|deve|devono|permette|aiuta|aiutiamo|collega|progettiamo|costruiamo|integriamo|applichiamo|pubblichiamo|supporta|sostituisce|riduce|we|are|is|has|have|can|must|should|connect|build|design|help|supports|enables|makes|replaces|cover|written)\b/i.test(
      paragraph
    );
  return !hasVerb;
}

function analyzeFile(relPath, raw) {
  const ext = path.extname(relPath);
  const { text, body, paragraphs = [] } = extractReadableText(raw, ext);
  const issues = [];

  // 1. Unspaced em-dash (word—word)
  const unspacedEmDashes = Array.from(text.matchAll(/[A-Za-zÀ-ÿ0-9]—[A-Za-zÀ-ÿ0-9“"']/g));
  if (unspacedEmDashes.length > 0) {
    issues.push({
      type: 'unspaced_em_dash',
      count: unspacedEmDashes.length,
      detail: `${unspacedEmDashes.length} em-dash non spaziati (es. "${unspacedEmDashes[0][0]}")`,
    });
  }

  // 2. High density of spaced em-dashes in short pages
  const allEmDashes = (text.match(/—/g) || []).length;
  const isBlog = relPath.includes('src/content/blog/');
  const emDashThreshold = isBlog ? 4 : 2;
  if (allEmDashes >= emDashThreshold) {
    issues.push({
      type: 'em_dash_overuse',
      count: allEmDashes,
      detail: `${allEmDashes} occorrenze di "—" nel file (soglia consigliata < ${emDashThreshold})`,
    });
  }

  // 3. SEO keyword stuffing / awkward grammar
  for (const pat of SEO_STUFFING_PATTERNS) {
    const matches = Array.from(raw.matchAll(pat.re));
    if (matches.length > 0) {
      issues.push({
        type: 'seo_keyword_stuffing',
        count: matches.length,
        detail: `${pat.hint}: "${matches[0][0]}"`,
      });
    }
  }

  // 4. Binary contrast overuse ("X, non Y" / "Non X: Y")
  const contrastMatches = [
    ...BINARY_CONTRAST_PATTERNS_IT.flatMap((re) => Array.from(text.matchAll(re)).map((m) => m[0].trim())),
    ...BINARY_CONTRAST_PATTERNS_EN.flatMap((re) => Array.from(text.matchAll(re)).map((m) => m[0].trim())),
  ];
  const contrastThreshold = isBlog ? 4 : 2;
  if (contrastMatches.length >= contrastThreshold) {
    issues.push({
      type: 'binary_contrast_overuse',
      count: contrastMatches.length,
      detail: `${contrastMatches.length} formule avversative ("X, non Y" / "Non X: Y"): ${contrastMatches
        .slice(0, 3)
        .map((s) => `"${s}"`)
        .join(', ')}`,
    });
  }

  // 5. Verbless nominal list paragraph in Astro pages
  for (const p of paragraphs) {
    if (isVerblessNominalList(p)) {
      issues.push({
        type: 'nominal_list_sentence',
        count: 1,
        detail: `Paragrafo nominale a elenco senza verbo: "${p.slice(0, 90)}…"`,
      });
    }
  }

  // 6. Stereotyped blog openers & monotonous bold bullets
  if (isBlog) {
    const intro = body.slice(0, 650);
    for (const pat of STEREOTYPED_OPENERS) {
      const m = intro.match(pat.re);
      if (m) {
        issues.push({
          type: 'stereotyped_blog_intro',
          count: 1,
          detail: `${pat.hint}: "${m[0]}"`,
        });
      }
    }

    const boldBullets = Array.from(body.matchAll(/^[ \t]*[*-][ \t]+\*\*[^*\n]+:\*\*/gm));
    if (boldBullets.length >= 8) {
      issues.push({
        type: 'monotonous_bold_bullets',
        count: boldBullets.length,
        detail: `${boldBullets.length} bullet point consecutivi con pattern "**Titolo:** spiegazione"`,
      });
    }
  }

  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  const scopeArg = args.find((a) => a.startsWith('--scope='))?.split('=')[1] ?? 'all';
  const asJson = args.includes('--json');

  const files = [];
  if (scopeArg === 'core' || scopeArg === 'all') {
    for (const dir of CORE_DIRS) {
      files.push(...(await walkFiles(path.join(REPO_ROOT, dir), ['.astro', '.ts', '.md'])));
    }
  }
  if (scopeArg === 'blog' || scopeArg === 'all') {
    for (const dir of BLOG_DIRS) {
      files.push(...(await walkFiles(path.join(REPO_ROOT, dir), ['.md', '.mdx'])));
    }
  }

  const findings = [];
  const totalsByType = {};

  for (const filePath of files) {
    const relPath = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');
    if (relPath.startsWith('src/pages/api/')) continue;
    const raw = await fs.readFile(filePath, 'utf8');
    if (raw.includes('Astro.redirect(') && raw.split('\n').length <= 6) continue;

    const issues = analyzeFile(relPath, raw);
    if (issues.length > 0) {
      findings.push({ file: relPath, issues });
      for (const issue of issues) {
        totalsByType[issue.type] = (totalsByType[issue.type] ?? 0) + issue.count;
      }
    }
  }

  if (asJson) {
    console.log(JSON.stringify({ scope: scopeArg, scannedFiles: files.length, flaggedFiles: findings.length, totalsByType, findings }, null, 2));
    return;
  }

  console.log(`=== DEVISIA EDITORIAL & ANTI-AI COPY AUDIT (scope: ${scopeArg}) ===`);
  console.log(`File analizzati: ${files.length} | File con segnalazioni: ${findings.length}`);
  console.log('Riepilogo per categoria:', totalsByType);
  console.log('');

  const coreFindings = findings.filter((f) => !f.file.includes('src/content/blog/'));
  const blogFindings = findings.filter((f) => f.file.includes('src/content/blog/'));

  if (coreFindings.length > 0) {
    console.log(`--- PAGINE CORE, COMPONENTI, LANDING E PROGETTI (${coreFindings.length} file) ---`);
    for (const item of coreFindings) {
      console.log(`\n• ${item.file}`);
      for (const issue of item.issues) {
        console.log(`  [${issue.type}] ${issue.detail}`);
      }
    }
    console.log('');
  }

  if (blogFindings.length > 0) {
    console.log(`--- ARTICOLI BLOG (${blogFindings.length} file con pattern AI-like) ---`);
    for (const item of blogFindings.slice(0, 15)) {
      console.log(`• ${item.file}: ${item.issues.map((i) => `${i.type}(${i.count})`).join(', ')}`);
    }
    if (blogFindings.length > 15) {
      console.log(`  ... e altri ${blogFindings.length - 15} articoli del blog.`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
