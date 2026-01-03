# Plan — Services page (EN/IT)

## Goal

Refresh the Services page for both locales (English + Italian) using the provided English copy, with a modern block-based layout using the existing Devisia design system (`ds-*` classes), keeping content CMS-editable via Astro Content Layer.

## Scope

- Update content:
  - `src/content/pages/en/services.md`
  - `src/content/pages/it/services.md`
- Update templates (wider marketing layout, container-query friendly):
  - `src/pages/en/services.astro`
  - `src/pages/services.astro`

## Requirements

- English page uses the provided copy verbatim (incl. CTA wording and SEO description).
- Italian page is a faithful, professional translation with consistent terminology.
- Layout: modern marketing blocks (hero/intro, service cards, engagement models, CTA).
- CTA links:
  - EN: `/en/contact`
  - IT: `/contact`
- SEO:
  - Use frontmatter `title` + `description` passed to `Layout.astro`.

## Implementation notes

- Prefer semantic HTML sections inside Markdown (as done in `about.md`) using `ds-stack`, `ds-grid`, `ds-card`, `ds-muted`, `ds-btn`, `ds-tag`.
- Add `style="container-type: inline-size"` on wrappers hosting `ds-grid` to enable container-query responsiveness.
- Remove narrow `max-width: 800px` wrappers in Services templates to allow grids/cards to breathe.

## Validation

- `npm run dev`: verify `/services` and `/en/services` render correctly.
- Check responsive behavior (grid collapses at smaller widths).
- Verify `<title>` and meta description match frontmatter.
- Verify CTA routes to the correct contact pages.
