import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const h1Mapping = {
  it: {
    home: "Sviluppo Software su Misura e Integrazione AI per Aziende",
    services: "Servizi di Sviluppo Software su Misura Aziende e App Web",
    about: "Società di Sviluppo Software su Misura: Visione e Metodo",
    contact: "Contatta la nostra Società di Sviluppo Software su Misura",
    privacy: "AI e Privacy: Informativa sulla Protezione dei Dati"
  },
  en: {
    home: "Custom Software Development and AI Integration for Businesses",
    services: "Custom Software for Businesses & Web App Development Services",
    about: "Custom Software Development Company: Our Vision and Method",
    contact: "Contact our Custom Software Development Company",
    privacy: "AI and Privacy: Data Protection & Cookie Policy"
  }
};

async function updateH1() {
  const baseDir = path.join(process.cwd(), 'src/content/pages');
  const langs = ['it', 'en'];

  for (const lang of langs) {
    const pages = ['home', 'services', 'about', 'contact', 'privacy'];
    for (const page of pages) {
      const filePath = path.join(baseDir, lang, `${page}.md`);
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const newH1 = h1Mapping[lang][page];
        
        // Remove existing H1 if present and prepend new one
        let newBody = content.trim();
        if (newBody.startsWith('# ')) {
          newBody = newBody.replace(/^# .*(\r?\n|$)/, '').trim();
        }
        
        const finalContent = matter.stringify(`# ${newH1}\n\n${newBody}`, data);
        await fs.writeFile(filePath, finalContent);
        console.log(`Updated H1 for ${lang}/${page}.md`);
      } catch (err) {
        console.error(`Error updating H1 for ${lang}/${page}.md:`, err.message);
      }
    }
  }
}

updateH1().catch(console.error);
