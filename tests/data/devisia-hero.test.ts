import { describe, expect, it } from 'vitest';
import {
  devisiaHeroDefault,
  devisiaHeroVariantKeys,
  devisiaHeroVariants,
  resolveDevisiaHero,
} from '../../src/data/landing/devisiaHero';

describe('devisia landing hero variants', () => {
  it('exposes exactly the three LinkedIn creative themes', () => {
    expect(devisiaHeroVariantKeys.sort()).toEqual(['ai', 'integrazioni', 'processi']);
  });

  it('resolves each utm_content value to its creative headline', () => {
    expect(resolveDevisiaHero('processi').title).toBe('Meno passaggi manuali. Più controllo.');
    expect(resolveDevisiaHero('ai').title).toBe('AI in azienda. Con controllo.');
    expect(resolveDevisiaHero('integrazioni').title).toBe('I sistemi devono parlarsi.');
  });

  it('normalises casing and surrounding whitespace', () => {
    expect(resolveDevisiaHero('  AI  ')).toEqual(devisiaHeroVariants.ai);
    expect(resolveDevisiaHero('Integrazioni')).toEqual(devisiaHeroVariants.integrazioni);
  });

  it('falls back to the default hero for direct visits and unknown values', () => {
    expect(resolveDevisiaHero(null)).toEqual(devisiaHeroDefault);
    expect(resolveDevisiaHero(undefined)).toEqual(devisiaHeroDefault);
    expect(resolveDevisiaHero('')).toEqual(devisiaHeroDefault);
    expect(resolveDevisiaHero('   ')).toEqual(devisiaHeroDefault);
    expect(resolveDevisiaHero('altro-tema')).toEqual(devisiaHeroDefault);
  });

  it('does not resolve inherited object keys', () => {
    expect(resolveDevisiaHero('constructor')).toEqual(devisiaHeroDefault);
    expect(resolveDevisiaHero('toString')).toEqual(devisiaHeroDefault);
  });

  it('gives every variant a headline and a supporting line', () => {
    for (const key of devisiaHeroVariantKeys) {
      expect(devisiaHeroVariants[key].title.length).toBeGreaterThan(0);
      expect(devisiaHeroVariants[key].lede.length).toBeGreaterThan(0);
    }
  });
});
