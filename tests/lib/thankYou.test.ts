import { describe, expect, it } from 'vitest';
import { getThankYouCopy, normalizeReturnPath, normalizeThankYouSource } from '../../src/lib/thankYou';

describe('thankYou helpers', () => {
  it('normalizes known and unknown sources', () => {
    expect(normalizeThankYouSource('landing_ai_governance')).toBe('landing_ai_governance');
    expect(normalizeThankYouSource('spoofed')).toBe('website_contact');
  });

  it('allows only known return paths', () => {
    expect(normalizeReturnPath('/landing/sistemi-spiegabili', 'it')).toBe('/landing/sistemi-spiegabili');
    expect(normalizeReturnPath('https://evil.example', 'it')).toBe('/contatti');
    expect(normalizeReturnPath('/admin', 'en')).toBe('/en/contact');
  });

  it('returns source-specific Italian copy for LinkedIn landings', () => {
    const copy = getThankYouCopy({ lang: 'it', source: 'landing_system_explainability' });
    expect(copy.documentTitle).toBe('Grazie | Devisia');
    expect(copy.title).toContain('sistema');
    expect(copy.nextStep).toContain('contatteremo');
  });
});
