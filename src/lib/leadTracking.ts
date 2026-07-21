export type LeadTrackingEvent =
  | 'landing_view'
  | 'hero_cta_click'
  | 'lead_form_start'
  | 'lead_submit_success'
  | 'lead_submit_error';

type TrackPayload = {
  event: LeadTrackingEvent;
  source?: string;
  pagePath?: string;
};

declare global {
  interface Window {
    _paq?: Array<unknown>;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackLeadEvent(payload: TrackPayload): void {
  if (typeof window === 'undefined') return;

  const safe = {
    event: payload.event,
    source: payload.source || '',
    page_path: payload.pagePath || '',
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'devisia_lead',
      devisia_lead_event: safe.event,
      devisia_lead_source: safe.source,
      devisia_lead_page_path: safe.page_path,
    });
  } catch {
    // ignore analytics failures
  }

  try {
    window._paq = window._paq || [];
    window._paq.push(['trackEvent', 'Lead', safe.event, safe.source || safe.page_path]);
  } catch {
    // ignore analytics failures
  }
}
