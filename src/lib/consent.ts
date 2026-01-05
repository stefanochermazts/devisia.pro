import { getJsonCookie, setJsonCookie } from './cookie';

export type ConsentCategory = 'essential' | 'analytics' | 'marketing';

export interface ConsentData {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_COOKIE = 'gdpr_consent';

const DEFAULT_CONSENT: ConsentData = {
  essential: true,
  analytics: false,
  marketing: false,
};

let inMemoryConsent: ConsentData = { ...DEFAULT_CONSENT };
let hydrated = false;

/**
 * Read consent from cookie.
 * Returns null if cookie missing or invalid.
 */
export function loadConsent(): ConsentData | null {
  const parsed = getJsonCookie<unknown>(CONSENT_COOKIE);
  if (!parsed || typeof parsed !== 'object') return null;

  const data = parsed as Partial<ConsentData>;
  if (data.essential !== true) return null;
  if (typeof data.analytics !== 'boolean') return null;
  if (typeof data.marketing !== 'boolean') return null;

  return {
    essential: true,
    analytics: data.analytics,
    marketing: data.marketing,
  };
}

/**
 * Persist consent to cookie and update in-memory state.
 * Also dispatches a CustomEvent `gdpr-consent-updated` with `detail: ConsentData`.
 */
export function saveConsent(data: ConsentData): void {
  // Always keep essential = true
  const safe: ConsentData = {
    essential: true,
    analytics: Boolean(data.analytics),
    marketing: Boolean(data.marketing),
  };

  inMemoryConsent = safe;
  hydrated = true;

  try {
    setJsonCookie(CONSENT_COOKIE, safe, 180);
  } catch {
    // ignore persistence errors; keep in-memory
  }

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gdpr-consent-updated', { detail: safe }));
    }
  } catch {
    // ignore
  }
}

/**
 * Get current consent state.
 * Hydrates from cookie on first call.
 */
export function getConsent(): ConsentData {
  if (!hydrated) {
    const fromCookie = loadConsent();
    if (fromCookie) inMemoryConsent = fromCookie;
    hydrated = true;
  }
  return inMemoryConsent;
}

export function getDefaultConsent(): ConsentData {
  return { ...DEFAULT_CONSENT };
}

