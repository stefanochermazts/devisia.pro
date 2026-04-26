import { getCollection } from 'astro:content';

export const GET = async () => {
  const site = 'https://devisia.pro';
  const pages: string[] = [
    `${site}/`,
    `${site}/cosa-facciamo`,
    `${site}/metodo`,
    `${site}/ai-governata`,
    `${site}/compliance-auditabilita`,
    `${site}/prodotti`,
    `${site}/prodotti/auditready`,
    `${site}/chi-siamo`,
    `${site}/contatti`,
    `${site}/blog`,
    `${site}/privacy`,
    `${site}/tools/ai-risk-checklist`,
    `${site}/ai-structure`,
    `${site}/tools/linkedin-post-formatter`,
    `${site}/tools/padel`,
    `${site}/en`,
    `${site}/en/what-we-do`,
    `${site}/en/method`,
    `${site}/en/governed-ai`,
    `${site}/en/compliance-auditability`,
    `${site}/en/products`,
    `${site}/en/products/auditready`,
    `${site}/en/about`,
    `${site}/en/blog`,
    `${site}/en/contact`,
    `${site}/en/privacy`,
    `${site}/en/tools/ai-risk-checklist`,
    `${site}/en/ai-structure`,
    `${site}/en/tools/linkedin-post-formatter`,
    `${site}/en/tools/padel`,
    /* Legacy URLs with redirects; still list canonic target above */
    `${site}/projects/mysafenest`,
    `${site}/en/projects/mysafenest`,
  ];

  const projectsIt = await getCollection('projectsIt');
  projectsIt.forEach((project) => {
    const slug = project.data.slug || project.id.split('/')[1];
    if (slug !== 'auditready') {
      pages.push(`${site}/projects/${slug}`);
    }
  });

  const projectsEn = await getCollection('projectsEn');
  projectsEn.forEach((project) => {
    const slug = project.data.slug || project.id.split('/')[1];
    if (slug !== 'auditready') {
      pages.push(`${site}/en/projects/${slug}`);
    }
  });

  const blogIt = await getCollection('blogIt');
  blogIt.forEach((post) => {
    const slug = post.id.split('/')[1];
    pages.push(`${site}/blog/${slug}`);
  });

  const blogEn = await getCollection('blogEn');
  blogEn.forEach((post) => {
    const slug = post.id.split('/')[1];
    pages.push(`${site}/en/blog/${slug}`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
