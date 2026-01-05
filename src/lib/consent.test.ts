import { describe, expect, it, vi } from 'vitest';
import { deleteCookie } from './cookie';
import { CONSENT_COOKIE, getConsent, getDefaultConsent, loadConsent, saveConsent } from './consent';

describe('consent store', () => {
  it('loadConsent returns null when cookie is absent', () => {
    deleteCookie(CONSENT_COOKIE);
    expect(loadConsent()).toBeNull();
  });

  it('getConsent returns default before any save', () => {
    deleteCookie(CONSENT_COOKIE);
    const consent = getConsent();
    expect(consent).toEqual(getDefaultConsent());
  });

  it('saveConsent writes cookie and fires gdpr-consent-updated event', () => {
    deleteCookie(CONSENT_COOKIE);
    const spy = vi.fn();
    window.addEventListener('gdpr-consent-updated', spy as EventListener);

    saveConsent({ essential: true, analytics: true, marketing: false });

    expect(spy).toHaveBeenCalledTimes(1);
    const detail = (spy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toEqual({ essential: true, analytics: true, marketing: false });

    expect(loadConsent()).toEqual({ essential: true, analytics: true, marketing: false });
  });
});

