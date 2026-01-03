import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema for static pages (home, about, services, contact)
const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  heroImage: z.string().optional(),
});

const pagesItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages/it',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: pageSchema,
});

const pagesEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages/en',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: pageSchema,
});

// Schema for blog posts
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  heroImage: z.string().optional(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
});

const blogItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog/it',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: blogSchema,
});

const blogEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog/en',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: blogSchema,
});

const projectSchema = z.object({
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
});

const projectsItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects/it',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: projectSchema,
});

const projectsEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects/en',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: projectSchema,
});

export const collections = {
  pagesIt: pagesItCollection,
  pagesEn: pagesEnCollection,
  blogIt: blogItCollection,
  blogEn: blogEnCollection,
  projectsIt: projectsItCollection,
  projectsEn: projectsEnCollection,
};
