import { describe, expect, it } from 'vitest';
import {
  contactRedirectUrl,
  normalizeContactLang,
  normalizeContactSource,
} from '../../netlify/functions/lib/contactRedirect';

describe('contactRedirectUrl', () => {
  it('keeps landing submissions on the landing page', () => {
    expect(contactRedirectUrl('it', '/landing/devisia')).toBe('/landing/devisia?success=true#contatto');
  });

  it('falls back to the localized contact page when returnTo is missing', () => {
    expect(contactRedirectUrl('it')).toBe('/contatti?success=true');
    expect(contactRedirectUrl('en')).toBe('/en/contact?success=true');
  });

  it('rejects external or unknown return destinations', () => {
    expect(contactRedirectUrl('it', 'https://example.com')).toBe('/contatti?success=true');
    expect(contactRedirectUrl('it', '/admin')).toBe('/contatti?success=true');
  });
});

describe('contact form metadata normalization', () => {
  it('normalizes language safely', () => {
    expect(normalizeContactLang('en')).toBe('en');
    expect(normalizeContactLang('fr')).toBe('it');
  });

  it('limits source length for email output', () => {
    expect(normalizeContactSource('x'.repeat(120))).toHaveLength(80);
  });
});
