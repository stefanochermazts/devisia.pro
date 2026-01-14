import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const headerUpdates = [
  {
    path: 'it/services.md',
    replacements: [
      { old: 'Sviluppo software su misura per il tuo business', new: 'Sviluppo software su misura e personalizzato per aziende' },
      { old: 'I Nostri Servizi', new: 'I Nostri Servizi di Sviluppo Applicazioni Web' }
    ]
  },
  {
    path: 'en/services.md',
    replacements: [
      { old: 'Custom software development for your business', new: 'Custom software development and solutions for businesses' },
      { old: 'Our Services', new: 'Our Web Application Development Services' }
    ]
  },
  {
    path: 'it/about.md',
    replacements: [
      { old: 'Cosa facciamo', new: 'Cosa facciamo: Software su misura aziende e SaaS' },
      { old: 'Come lavoriamo', new: 'Come lavoriamo nello Sviluppo SaaS e Custom' }
    ]
  },
  {
    path: 'en/about.md',
    replacements: [
      { old: 'What we do', new: 'What we do: Custom software development and SaaS' },
      { old: 'How we work', new: 'How we work in SaaS and Custom Software Development' }
    ]
  },
  {
    path: 'it/contact.md',
    replacements: [
      { old: 'Scrivici', new: 'Scrivici per il tuo Sviluppo Software su Misura' }
    ]
  },
  {
    path: 'en/contact.md',
    replacements: [
      { old: 'Get In Touch', new: 'Get In Touch for Custom Software Solutions' }
    ]
  }
];

async function updateHeaders() {
  const baseDir = path.join(process.cwd(), 'src/content/pages');

  for (const update of headerUpdates) {
    const filePath = path.join(baseDir, update.path);
    try {
      let fileContent = await fs.readFile(filePath, 'utf-8');
      
      for (const replacement of update.replacements) {
        // Match both plain markdown ## Header and <h2 style="...">Header</h2>
        const markdownRegex = new RegExp(`^## ${replacement.old}$`, 'm');
        const htmlRegex = new RegExp(`<h2([^>]*)>${replacement.old}</h2>`, 'g');
        
        fileContent = fileContent.replace(markdownRegex, `## ${replacement.new}`);
        fileContent = fileContent.replace(htmlRegex, `<h2$1>${replacement.new}</h2>`);
      }

      await fs.writeFile(filePath, fileContent);
      console.log(`Updated H2s for ${update.path}`);
    } catch (err) {
      console.error(`Error updating ${update.path}:`, err.message);
    }
  }
}

updateHeaders().catch(console.error);
