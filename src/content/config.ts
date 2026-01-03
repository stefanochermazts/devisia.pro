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

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    // NOTE: Astro reserves `slug` as a computed field (derived from filename).
    // Decap uses the slug to generate the filename via `slug: "{{fields.slug}}"`.
    // We keep this optional to avoid schema failures if Astro strips it from `data`.
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
      .optional(),
    description: z.string().min(1).max(200),
    coverImage: z.string().min(1),
    logo: z.string().optional(),
    ogImage: z.string().optional(),
    websiteUrl: z.string().url(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['active', 'beta', 'archived']),
    featured: z.boolean().default(false),
    order: z.number().int().nonnegative().default(0),
  }),
});

export const collections = {
  pages: pagesCollection,
  blog: blogCollection,
  projects: projectsCollection,
};
