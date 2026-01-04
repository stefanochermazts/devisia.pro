import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const optionalString = z.string().optional().nullable();
const stringList = z.preprocess((v) => (v == null ? [] : v), z.array(z.string()));

// Schema for feature card in home page
const featureCardSchema = z.object({
  tag: z.string(),
  title: z.string(),
  description: z.string(),
});

const howWeWorkItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const aiCapabilityItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Schema for static pages (home, about, services, contact)
// NOTE: slug is optional and used by Decap CMS for filename generation.
// Astro ignores it and uses the filename to determine the entry ID.
const pageSchema = z.object({
  slug: optionalString,
  title: z.string(),
  description: optionalString,
  heroTitle: optionalString,
  heroSubtitle: optionalString,
  heroImage: optionalString,
  // Home page blocks (optional, only used for home page)
  homeWhatWeDoTitle: optionalString,
  homeWhatWeDoDescription: optionalString,
  homeWhatWeDoCards: z.array(featureCardSchema).optional().nullable(),
  homeHowWeWorkTitle: optionalString,
  homeHowWeWorkDescription: optionalString,
  // Backward compatible: accept either string[] (legacy) or {title, description}[]
  homeHowWeWorkItems: z
    .union([z.array(z.string()), z.array(howWeWorkItemSchema)])
    .optional()
    .nullable(),
  homeAICapabilitiesTitle: optionalString,
  homeAICapabilitiesDescription: optionalString,
  homeAICapabilitiesItems: z.array(aiCapabilityItemSchema).optional().nullable(),
  homeAICapabilitiesCtaLabel: optionalString,
  homeAICapabilitiesCtaHref: optionalString,
  homeAIChecklistTitle: optionalString,
  homeAIChecklistDescription: optionalString,
  homeProjectsTitle: optionalString,
  homeProjectsDescription: optionalString,
  homeProjectsImage: optionalString,
  homeContactTitle: optionalString,
  homeContactDescription: optionalString,
});

const pagesItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages/it',
    // NOTE: IDs must be globally unique across collections in Astro Content Layer.
    generateId: ({ entry }) => `it/${entry.replace(/\.mdx?$/, '')}`,
  }),
  schema: pageSchema,
});

const pagesEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages/en',
    generateId: ({ entry }) => `en/${entry.replace(/\.mdx?$/, '')}`,
  }),
  schema: pageSchema,
});

// Schema for blog posts
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  heroImage: optionalString,
  author: z.string(),
  tags: stringList,
});

const blogItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog/it',
    generateId: ({ entry }) => `it/${entry.replace(/\.mdx?$/, '')}`,
  }),
  schema: blogSchema,
});

const blogEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog/en',
    generateId: ({ entry }) => `en/${entry.replace(/\.mdx?$/, '')}`,
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
    .optional()
    .nullable(),
  description: z.string().min(1).max(200),
  coverImage: z.string().min(1),
  logo: optionalString,
  ogImage: optionalString,
  websiteUrl: z.string().url(),
  tags: stringList,
  status: z.enum(['active', 'beta', 'archived']),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

const projectsItCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects/it',
    generateId: ({ entry }) => `it/${entry.replace(/\.mdx?$/, '')}`,
  }),
  schema: projectSchema,
});

const projectsEnCollection = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects/en',
    generateId: ({ entry }) => `en/${entry.replace(/\.mdx?$/, '')}`,
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
