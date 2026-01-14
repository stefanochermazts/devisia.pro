import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const keywords = {
  it: {
    home: { primary: "Società Sviluppo Software", secondary: "sviluppo software su misura" },
    services: { primary: "Sviluppo Software su Misura Aziende", secondary: "sviluppo applicazioni web" },
    about: { primary: "Software su Misura Aziende", secondary: "sviluppo SaaS" },
    contact: { primary: "Sviluppo Software su Misura", secondary: "società sviluppo software" },
    privacy: { primary: "AI e Privacy", secondary: "governance intelligenza artificiale" }
  },
  en: {
    home: { primary: "Software Development Company", secondary: "custom software development" },
    services: { primary: "Custom Software for Businesses", secondary: "web application development" },
    about: { primary: "Custom Software Development", secondary: "SaaS development" },
    contact: { primary: "Custom Software Solutions", secondary: "software development company" },
    privacy: { primary: "AI and Privacy", secondary: "AI governance" }
  }
};

const metaData = {
  it: {
    home: {
      title: "Società Sviluppo Software su Misura e Soluzioni AI | Devisia",
      description: "Devisia è una società sviluppo software specializzata in sviluppo software su misura, soluzioni SaaS e integrazione AI per aziende orientata alla qualità."
    },
    services: {
      title: "Sviluppo Software su Misura Aziende e App Web | Devisia",
      description: "Servizi professionali di sviluppo software su misura aziende e sviluppo applicazioni web con integrazione AI responsabile e governance dedicata."
    },
    about: {
      title: "Sviluppo Software su Misura e Visione di Prodotto | Devisia",
      description: "Siamo una software company focalizzata su software su misura aziende e sviluppo SaaS proprietari, con un approccio pragmatico e visione a lungo termine."
    },
    contact: {
      title: "Contatta la nostra Società Sviluppo Software su Misura | Devisia",
      description: "Hai bisogno di uno sviluppo software su misura? Contatta Devisia, la società sviluppo software per trasformare la tua visione in prodotti digitali solidi."
    },
    privacy: {
      title: "AI e Privacy: Informativa GDPR e Cookie | Devisia",
      description: "Informazioni su AI e privacy, gestione dei cookie e governance intelligenza artificiale secondo le normative GDPR vigenti."
    }
  },
  en: {
    home: {
      title: "Custom Software Development Company & AI Integration | Devisia",
      description: "Devisia is a software development company specializing in custom software development, SaaS products, and enterprise AI solutions focused on quality."
    },
    services: {
      title: "Custom Software for Businesses & Web App Development | Devisia",
      description: "Professional custom software for businesses and web application development with responsible AI integration and governance services."
    },
    about: {
      title: "Custom Software Development and Product Vision | Devisia",
      description: "A software company focused on custom software development and proprietary SaaS development, combining technical excellence with business pragmatism."
    },
    contact: {
      title: "Contact our Custom Software Development Company | Devisia",
      description: "Looking for custom software solutions? Contact Devisia, your software development company for building scalable and reliable digital products."
    },
    privacy: {
      title: "AI and Privacy: GDPR & Cookie Policy | Devisia",
      description: "Detailed information on AI and privacy, cookie management, and AI governance in compliance with global data protection regulations."
    }
  }
};

async function updateMeta() {
  const baseDir = path.join(process.cwd(), 'src/content/pages');
  const langs = ['it', 'en'];

  for (const lang of langs) {
    const pages = ['home', 'services', 'about', 'contact', 'privacy'];
    for (const page of pages) {
      const filePath = path.join(baseDir, lang, `${page}.md`);
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const newMeta = metaData[lang][page];
        data.title = newMeta.title;
        data.description = newMeta.description;

        const updatedContent = matter.stringify(content, data);
        await fs.writeFile(filePath, updatedContent);
        console.log(`Updated meta for ${lang}/${page}.md`);
      } catch (err) {
        console.error(`Error updating ${lang}/${page}.md:`, err.message);
      }
    }
  }
}

updateMeta().catch(console.error);
