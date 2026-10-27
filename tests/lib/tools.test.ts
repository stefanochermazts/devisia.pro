import { describe, expect, it } from 'vitest';
import {
  getMicroTools,
  getHomeFeaturedTools,
  getUpcomingMicroTools,
  getToolCategories,
} from '../../src/lib/tools';
import { getHreflangPaths, switchLocalePath } from '../../src/lib/localePath';

describe('micro-tools catalog and SEO hub configuration', () => {
  it('exposes the active micro-tools in both Italian and English with matching IDs and tags', () => {
    const itTools = getMicroTools('it');
    const enTools = getMicroTools('en');

    expect(itTools).toHaveLength(4);
    expect(enTools).toHaveLength(4);

    expect(itTools.map((t) => t.id)).toEqual(enTools.map((t) => t.id));
    expect(itTools.map((t) => t.id)).not.toContain('padel-aggregator');
    expect(itTools.map((t) => t.id)).toContain('prompt-pii-sanitizer');
    expect(itTools.map((t) => t.instrumentTag)).toEqual(['AIT-01', 'RIC-02', 'FMT-03', 'PII-06']);
    expect(enTools.map((t) => t.instrumentTag)).toEqual(['AIT-01', 'RIC-02', 'FMT-03', 'PII-06']);
  });

  it('ensures all Italian tools use root paths and English tools use /en paths', () => {
    for (const tool of getMicroTools('it')) {
      expect(tool.href.startsWith('/')).toBe(true);
      expect(tool.href.startsWith('/en/')).toBe(false);
      expect(tool.inputSpec.length).toBeGreaterThan(0);
      expect(tool.guardrailSpec.length).toBeGreaterThan(0);
      expect(tool.outputSpec.length).toBeGreaterThan(0);
    }

    for (const tool of getMicroTools('en')) {
      expect(tool.href.startsWith('/en/')).toBe(true);
      expect(tool.inputSpec.length).toBeGreaterThan(0);
      expect(tool.guardrailSpec.length).toBeGreaterThan(0);
      expect(tool.outputSpec.length).toBeGreaterThan(0);
    }
  });

  it('returns featured tools for the home page section', () => {
    expect(getHomeFeaturedTools('it')).toHaveLength(4);
    expect(getHomeFeaturedTools('en')).toHaveLength(4);
    expect(getHomeFeaturedTools('it').map((t) => t.id)).not.toContain('padel-aggregator');
  });

  it('exposes upcoming SEO blueprint tools with bilingual parity', () => {
    const itUpcoming = getUpcomingMicroTools('it');
    const enUpcoming = getUpcomingMicroTools('en');

    expect(itUpcoming.length).toBeGreaterThanOrEqual(5);
    expect(itUpcoming.map((t) => t.id)).not.toContain('prompt-pii-sanitizer');
    expect(itUpcoming.map((t) => t.id)).toEqual(enUpcoming.map((t) => t.id));
    expect(itUpcoming.map((t) => t.instrumentTag)).toEqual(enUpcoming.map((t) => t.instrumentTag));
  });

  it('provides filter categories in both languages', () => {
    expect(getToolCategories('it').map((c) => c.id)).toEqual(['all', 'ai', 'governance', 'operations']);
    expect(getToolCategories('en').map((c) => c.id)).toEqual(['all', 'ai', 'governance', 'operations']);
  });

  it('resolves hreflang and locale switch paths for /tools and /en/tools', () => {
    expect(switchLocalePath('/tools', 'it')).toBe('/en/tools');
    expect(switchLocalePath('/en/tools', 'en')).toBe('/tools');
    expect(getHreflangPaths('/tools')).toEqual({ itPath: '/tools', enPath: '/en/tools' });
    expect(getHreflangPaths('/en/tools')).toEqual({ itPath: '/tools', enPath: '/en/tools' });
  });
});
