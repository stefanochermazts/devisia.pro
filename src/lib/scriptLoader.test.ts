import { describe, expect, it } from 'vitest';
import type { ConsentData } from './consent';
import { loadThirdPartyScripts } from './scriptLoader';

const consentBase: ConsentData = { essential: true, analytics: false, marketing: false };

describe('scriptLoader', () => {
  it('does not inject analytics script when analytics consent is false', () => {
    loadThirdPartyScripts(consentBase, { gaId: 'G-TEST' });
    expect(document.querySelector('script[data-gdpr="analytics"]')).toBeNull();
  });

  it('injects analytics script when analytics consent is true and gaId provided', () => {
    loadThirdPartyScripts({ ...consentBase, analytics: true }, { gaId: 'G-TEST' });
    const s = document.querySelector('script[data-gdpr="analytics"][data-provider="gtag"][data-id="G-TEST"]');
    expect(s).not.toBeNull();
  });

  it('does not inject duplicate analytics script', () => {
    loadThirdPartyScripts({ ...consentBase, analytics: true }, { gaId: 'G-TEST' });
    loadThirdPartyScripts({ ...consentBase, analytics: true }, { gaId: 'G-TEST' });
    const scripts = document.querySelectorAll('script[data-gdpr="analytics"][data-id="G-TEST"]');
    expect(scripts.length).toBe(1);
  });
});

