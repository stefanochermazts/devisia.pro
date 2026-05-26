import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const SITE_SUFFIX = ' | Devisia';
const MAX_FULL_TITLE = 65;
const MAX_TITLE = MAX_FULL_TITLE - SITE_SUFFIX.length;

const csvPath = path.join(process.cwd(), 'seo-audit/title_tag_too_long.csv');

function shortenTitle(title: string): string {
  let t = title.trim();
  if (t.length <= MAX_TITLE) return t;

  const replacements: Array<[RegExp, string]> = [
    [/\s*:\s*guida all'architettura$/i, ''],
    [/\s*:\s*una guida(?: all'architettura)?$/i, ''],
    [/\s*:\s*guida pragmatica$/i, ''],
    [/\s*:\s*An Architectural Guide$/i, ''],
    [/\s*:\s*A Pragmatic Guide$/i, ''],
    [/\s*:\s*A Guide for Engineering Teams$/i, ''],
    [/\s*:\s*A Guide for Technical Leaders$/i, ''],
    [/\s*:\s*A Practical Guide$/i, ''],
    [/\s*:\s*guida per .+$/i, ''],
    [/\s*:\s*guida del .+$/i, ''],
    [/^Guida pragmatica (?:al|ai|all'|alla|alle|agli|per )/i, ''],
    [/^Una guida pragmatica (?:al|ai|all'|alla|alle|agli|per )/i, ''],
    [/^A Pragmatic Guide to /i, ''],
    [/^A Practical Guide to /i, ''],
    [/^A Guide to /i, ''],
    [/^Guida (?:al|ai|all'|alla|alle|agli|per )/i, ''],
    [/^A CTO's Guide to /i, 'CTO guide: '],
    [/^Il moderno /i, ''],
    [/^The modern /i, ''],
    [/^Mastering the /i, ''],
    [/^Padroneggiare /i, ''],
    [/\s*\|\s*Evidence for audit.+$/i, ''],
  ];

  for (const [pattern, replacement] of replacements) {
    t = t.replace(pattern, replacement).trim();
    if (t.length <= MAX_TITLE) return t;
  }

  if (t.length > MAX_TITLE) {
    const cut = t.slice(0, MAX_TITLE);
    const lastSpace = cut.lastIndexOf(' ');
    t = lastSpace > 20 ? cut.slice(0, lastSpace) : cut;
  }

  return t.trim();
}

function parseCsvLine(line: string): { url: string; title: string } | null {
  const idx = line.indexOf(',');
  if (idx === -1) return null;
  const url = line.slice(0, idx).trim();
  let title = line.slice(idx + 1).trim();
  if (title.startsWith('"') && title.endsWith('"')) {
    title = title.slice(1, -1);
  }
  title = title.replace(/\s*\|\s*Devisia\s*$/i, '').trim();
  return { url, title };
}

function resolveMarkdownPath(url: string): string | null {
  const u = new URL(url);
  const parts = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean);

  if (parts[0] === 'blog' && parts.length === 2) {
    return path.join('src/content/blog/it', `${parts[1]}.md`);
  }
  if (parts[0] === 'en' && parts[1] === 'blog' && parts.length === 3) {
    return path.join('src/content/blog/en', `${parts[2]}.md`);
  }
  return null;
}

async function main() {
  const csv = await fs.readFile(csvPath, 'utf-8');
  const lines = csv.trim().split(/\r?\n/).slice(1);
  let updated = 0;
  let skipped = 0;
  let missing = 0;
  let stillLong = 0;

  for (const line of lines) {
    const parsedLine = parseCsvLine(line);
    if (!parsedLine) continue;

    const { url } = parsedLine;
    const filePath = resolveMarkdownPath(url);
    if (!filePath) {
      skipped++;
      continue;
    }

    const absPath = path.join(process.cwd(), filePath);
    try {
      await fs.access(absPath);
    } catch {
      console.warn(`Missing file: ${filePath}`);
      missing++;
      continue;
    }

    const source = await fs.readFile(absPath, 'utf-8');
    const parsed = matter(source);
    const currentTitle = String(parsed.data.title ?? '').trim();
    const shortened = shortenTitle(currentTitle);

    if (`${shortened}${SITE_SUFFIX}`.length > MAX_FULL_TITLE) {
      stillLong++;
      console.warn(`Still too long (${shortened.length}): ${filePath}`);
    }

    if (shortened === currentTitle) {
      skipped++;
      continue;
    }

    parsed.data.title = shortened;
    const next = matter.stringify(parsed.content, parsed.data);
    await fs.writeFile(absPath, next, 'utf-8');
    updated++;
  }

  console.log(`Done. Updated: ${updated}, skipped: ${skipped}, missing: ${missing}, stillLong: ${stillLong}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
