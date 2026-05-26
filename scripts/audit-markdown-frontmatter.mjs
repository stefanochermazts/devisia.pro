import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();

function walkMarkdown(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkMarkdown(full));
    else if (/\.mdx?$/i.test(ent.name)) out.push(full);
  }
  return out;
}

function rel(full) {
  return path.relative(ROOT, full).replace(/\\/g, '/');
}

function checkFile(full) {
  const raw = fs.readFileSync(full, 'utf8');
  const issues = [];

  if (/^---[\s\S]*?\r?\n---\r?\n---/m.test(raw)) {
    issues.push('double-fence-after-frontmatter');
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    issues.push(`parse-error: ${err instanceof Error ? err.message.split('\n')[0] : err}`);
    return issues;
  }

  if (/^\s*---/.test(parsed.content)) {
    issues.push('body-starts-with-fence');
  }

  try {
    const body = String(parsed.content ?? '').replace(/^\s*---\s*(?:\r?\n|$)/, '').trimStart();
    matter(matter.stringify(body, parsed.data));
  } catch (err) {
    issues.push(`roundtrip-error: ${err instanceof Error ? err.message.split('\n')[0] : err}`);
  }

  return issues;
}

const targets = [
  path.join(ROOT, 'src/content/blog/en'),
  path.join(ROOT, 'src/content/blog/it'),
];

const rows = [];
for (const dir of targets) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walkMarkdown(dir)) {
    const issues = checkFile(file);
    if (issues.length) rows.push({ file: rel(file), issues });
  }
}

console.log(`Checked blog markdown in EN/IT`);
if (!rows.length) {
  console.log('No frontmatter fence issues found.');
  process.exit(0);
}

console.log(`Found ${rows.length} file(s) with issues:`);
for (const row of rows) {
  console.log(`- ${row.file}`);
  for (const issue of row.issues) console.log(`  - ${issue}`);
}
process.exit(1);
