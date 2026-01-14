import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

async function auditSEO() {
  const contentDir = path.join(process.cwd(), 'src/content/pages');
  const report: any[] = [];

  async function walk(dir: string) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await walk(fullPath);
      } else if (file.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const { data, content: body } = matter(content);
        
        const h1 = body.match(/^# (.*)$/m)?.[1] || '';
        const h2s = Array.from(body.matchAll(/^## (.*)$/mg)).map(m => m[1]);
        const h3s = Array.from(body.matchAll(/^### (.*)$/mg)).map(m => m[1]);

        report.push({
          path: path.relative(process.cwd(), fullPath),
          title: data.title || '',
          description: data.description || '',
          h1,
          h2s,
          h3s
        });
      }
    }
  }

  await walk(contentDir);
  await fs.writeFile('seo-audit-report.json', JSON.stringify(report, null, 2));
  console.log('SEO Audit report generated: seo-audit-report.json');
}

auditSEO().catch(console.error);
