import fs from 'fs';
import path from 'path';

const keywords = [
  "software basato su ai",
  "sviluppo applicazioni web",
  "ai e privacy",
  "governance intelligenza artificiale",
  "società sviluppo software",
  "ai responsabile",
  "integrazione ai nei software",
  "software personalizzato per aziende",
  "software su misura aziende",
  "integrazione api ai",
  "sviluppo saas",
  "ai by design",
  "sicurezza ai",
  "sviluppo software su misura",
  "ai per aziende",
  "sviluppo software con intelligenza artificiale"
];

const contentDirs = [
  'src/content/pages/it',
  'src/content/blog/it',
  'src/content/projects/it'
];

const audit = {};

contentDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
    const found = keywords.filter(k => content.includes(k.toLowerCase()));
    const missing = keywords.filter(k => !content.includes(k.toLowerCase()));
    audit[filePath] = { found, missing };
  });
});

fs.writeFileSync('keyword-audit.json', JSON.stringify(audit, null, 2));
console.log('Audit complete. Results saved to keyword-audit.json');
