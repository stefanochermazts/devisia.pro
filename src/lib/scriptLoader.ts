import type { ConsentData } from './consent';

export type ScriptLoaderConfig = {
  /** Google Analytics measurement id (e.g. G-XXXX). If omitted, uses import.meta.env.PUBLIC_GA_ID */
  gaId?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const hasScript = (selector: string): boolean => Boolean(document.querySelector(selector));

const ensureGtag = (): void => {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (...args: any[]) => {
    window.dataLayer?.push(args);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag = (window as any).gtag || gtag;
};

/**
 * Inject third-party scripts ONLY when consent allows it.
 * Note: once a script is injected, we don't attempt to "remove" it on later opt-out.
 * (GDPR-wise, opt-out should prevent future tracking; removal is complex and vendor-specific.)
 */
export function loadThirdPartyScripts(consent: ConsentData, config: ScriptLoaderConfig = {}): void {
  try {
    // Analytics (Google Analytics / gtag)
    const gaId = config.gaId ?? import.meta.env.PUBLIC_GA_ID;
    if (consent.analytics && gaId) {
      const tagSelector = `script[data-gdpr="analytics"][data-provider="gtag"][data-id="${gaId}"]`;
      if (!hasScript(tagSelector)) {
        const s = document.createElement('script');
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        s.async = true;
        s.dataset.gdpr = 'analytics';
        s.dataset.provider = 'gtag';
        s.dataset.id = gaId;
        document.head.appendChild(s);

        ensureGtag();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gtag = (window as any).gtag as (...args: any[]) => void;
        gtag('js', new Date());
        gtag('config', gaId, { anonymize_ip: true });
      }
    }

    // Marketing (placeholder hook)
    // if (consent.marketing) { ... }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[gdpr] script loader error', err);
  }
}

