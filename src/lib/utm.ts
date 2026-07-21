const UTM_STORAGE_KEY = 'devisia.lead.utm.v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function readUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const out: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

export function persistUtmParams(params: UtmParams): void {
  if (typeof sessionStorage === 'undefined') return;
  if (Object.keys(params).length === 0) return;
  try {
    const existing = readStoredUtmParams();
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({ ...existing, ...params }));
  } catch {
    // ignore storage failures
  }
}

export function readStoredUtmParams(): UtmParams {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmParams;
    const out: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = parsed[key];
      if (typeof value === 'string' && value.trim()) out[key] = value.trim().slice(0, 200);
    }
    return out;
  } catch {
    return {};
  }
}

export function captureUtmFromLocation(): UtmParams {
  if (typeof window === 'undefined') return {};
  const fromQuery = readUtmFromSearch(window.location.search);
  persistUtmParams(fromQuery);
  return { ...readStoredUtmParams(), ...fromQuery };
}
