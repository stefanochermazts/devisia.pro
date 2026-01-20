# SEO Strategy & Maintenance Guide — Devisia

This guide outlines the SEO strategy implemented for Devisia and provides instructions on how to maintain and improve search engine rankings for Italian and English versions.

## 1. Strategy Overview
Our SEO approach is based on a hierarchical structure:
- **Primary Keywords**: High-volume, broad terms used in `title` (meta tag) and `H1` (main header).
- **Secondary Keywords**: Specific, "long-tail" terms used in `H2`, `H3`, and naturally within paragraph text.
- **Bilingual Consistency**: Every optimization is applied to both Italian and English versions to ensure global relevance.

## 2. Targeted Keywords
The current focus is on these core areas:
- **Custom Software**: "sviluppo software su misura", "custom software development", "software personalizzato per aziende".
- **SaaS**: "sviluppo SaaS", "SaaS development".
- **AI & Governance**: "integrazione AI", "AI governance", "AI by design", "sicurezza AI".

Reference file: `src/content/seo/keywords.yaml`

## 3. SEO Checklist for New Content
When adding a new page or blog post, follow these rules:

### Metadata (Front-matter)
- **Title**: Keep it under 70 characters. Place the primary keyword at the beginning if possible.
- **Description**: 150-160 characters. Include the primary keyword and one secondary keyword.

### Content Structure
- **H1 Header**: Exactly one `# ` header per page. It MUST contain the primary keyword.
- **H2/H3 Headers**: Use secondary keywords here to structure your sections.
- **Body Copy**: Include target phrases naturally (1-2 times per page). Use **bold** sparingly for emphasis on key terms.

### Internationalization (i18n)
- Ensure the `translationSlug` (for blog posts) is correctly set to link IT and EN versions.
- The `Layout.astro` component automatically handles `canonical` and `hreflang` tags.

## 4. Maintenance Tools
We have included scripts to help you monitor SEO health:

### Run an SEO Audit
This script scans all markdown pages and generates a report (`seo-audit-report.json`) with the current status of Titles, Descriptions, and Headers.
```bash
npx tsx scripts/seo-audit.ts
```

### Keyword Reference
Check `src/content/seo/keywords.yaml` to see the definitive list of keywords we are currently targeting.

## 5. Deployment
The sitemap is automatically generated on every build:
- **Sitemap URL**: `https://devisia.pro/sitemap-index.xml`
- **Robots.txt**: Updated to point to the sitemap.

---
*Maintained by the Devisia Technical Team*
