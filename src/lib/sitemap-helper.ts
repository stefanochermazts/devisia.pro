import sitemap from '@astrojs/sitemap';
import { getCollection } from 'astro:content';

export async function serializeSitemap(item: any) {
  return item;
}

export async function getCustomPages() {
  const site = 'https://devisia.pro';
  const pages: string[] = [];

  // 1. Add static pages (already handled by integration usually, but for SSR with customPages we might need to be explicit or let standard sitemap handle static routes if we use customPages for dynamic ones. 
  // However, sitemap() integration in SSR mode with customPages replaces the default behavior or adds to it? 
  // Actually, in SSR mode, sitemap integration mostly relies on us providing the URLs via customPages.
  
  // Let's add dynamic routes from collections
  
  // Projects IT
  const projectsIt = await getCollection('projectsIt');
  projectsIt.forEach((project) => {
    // Assuming slug structure: /projects/[slug]
    // The id is like 'it/slug', we need the slug part or use the filename
    // Based on config.ts: generateId: ({ entry }) => `it/${entry.replace(/\.mdx?$/, '')}`
    // And schema has optional slug. If slug is missing, use ID's filename part.
    const slug = project.data.slug || project.id.split('/')[1];
    pages.push(`${site}/projects/${slug}`);
  });

  // Projects EN
  const projectsEn = await getCollection('projectsEn');
  projectsEn.forEach((project) => {
    const slug = project.data.slug || project.id.split('/')[1];
    pages.push(`${site}/en/projects/${slug}`);
  });

  // Blog IT
  const blogIt = await getCollection('blogIt');
  blogIt.forEach((post) => {
    const slug = post.id.split('/')[1]; // id is it/slug
    pages.push(`${site}/blog/${slug}`);
  });

  // Blog EN
  const blogEn = await getCollection('blogEn');
  blogEn.forEach((post) => {
    const slug = post.id.split('/')[1]; // id is en/slug
    pages.push(`${site}/en/blog/${slug}`);
  });

  // Tools (static but dynamic-ish if we add more tools later)
  pages.push(`${site}/tools/ai-risk-checklist`);
  pages.push(`${site}/en/tools/ai-risk-checklist`);

  return pages;
}
