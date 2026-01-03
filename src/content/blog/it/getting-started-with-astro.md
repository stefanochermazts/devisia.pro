---
title: "Iniziare con Astro: uno static site generator moderno"
description: "Una panoramica di Astro: islands architecture, performance e un approccio \"zero-JS by default\"."
pubDate: 2026-01-02
author: "Marco Rossi"
tags: ["astro", "web-development", "tutorial", "javascript"]
heroImage: "/uploads/blog/astro-tutorial.jpg"
---

# Iniziare con Astro

Astro è uno static site generator moderno che punta su performance e semplicità. Grazie alla sua “islands architecture” e all’approccio “zero JavaScript di default”, consente di creare siti velocissimi senza rinunciare a una buona developer experience.

## Perché Astro?

Ecco alcuni vantaggi chiave:

1. **Performance first**: niente JS inutile se non serve
2. **Framework agnostic**: puoi integrare React, Vue, Svelte, ecc.
3. **Content Collections**: contenuti tipizzati e validati con schema
4. **SEO friendly**: ottimo per siti e blog

## Key Features

### Islands Architecture

Astro introduce il concetto di “islands”: componenti interattivi che si idratano in modo indipendente, riducendo il JavaScript inviato al browser.

### Content Collections

Gestisci i contenuti con schema TypeScript/Zod per validazione e autocompletamento.

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
  }),
});
```

### Zero-JS by Default

Astro invia JavaScript solo quando serve davvero, migliorando tempi di caricamento e Core Web Vitals.

## Getting Started

To create a new Astro project:

```bash
npm create astro@latest
```

Follow the prompts to set up your project with TypeScript and your preferred framework integrations.

## Conclusion

Astro è un’ottima scelta per siti content-first, blog e documentazione. L’approccio performance-first e le features per developer lo rendono molto piacevole da usare.

Vuoi provarlo? Parti dalla [documentazione ufficiale](https://docs.astro.build).
