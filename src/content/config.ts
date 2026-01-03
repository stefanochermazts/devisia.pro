import { defineCollection, z } from 'astro:content';

// Schema for static pages (home, about, services, contact)
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

// Schema for blog posts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
  blog: blogCollection,
};
