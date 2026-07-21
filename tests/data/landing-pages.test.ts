import { describe, expect, it } from 'vitest';
import { getLandingPage, landingPages, landingSlugs } from '../../src/data/landing/pages';

describe('landing page configs', () => {
  it('exposes exactly the four LinkedIn campaign routes', () => {
    expect(landingSlugs.sort()).toEqual(
      ['evidenze-audit', 'governance-ai', 'processi-prima-automazione', 'sistemi-spiegabili'].sort()
    );
  });

  it('keeps source, form id and asset path aligned for each page', () => {
    for (const slug of landingSlugs) {
      const page = landingPages[slug];
      expect(page.path).toBe(`/landing/${slug}`);
      expect(page.formId).toBe(`landing-${slug}`);
      expect(page.seo.heroImage).toBe(`/images/${slug}.png`);
      expect(page.source.startsWith('landing_')).toBe(true);
      expect(page.method.steps.length).toBeGreaterThanOrEqual(3);
      expect(page.checklist.items.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('returns null for unknown slug', () => {
    expect(getLandingPage('devisia')).toBeNull();
    expect(getLandingPage('missing')).toBeNull();
  });
});
