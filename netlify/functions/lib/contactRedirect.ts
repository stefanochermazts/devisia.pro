export type ContactLang = 'it' | 'en';

const FALLBACK_REDIRECTS: Record<ContactLang, string> = {
  it: '/contatti',
  en: '/en/contact',
};

const SUCCESS_ANCHORS: Record<string, string> = {
  '/landing/devisia': '#contatto',
};

const ALLOWED_RETURN_PATHS = new Set([
  '/contatti',
  '/en/contact',
  '/landing/devisia',
]);

export const getSingleFormValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

export const normalizeContactLang = (value: string | string[] | undefined): ContactLang =>
  getSingleFormValue(value) === 'en' ? 'en' : 'it';

export const normalizeContactSource = (value: string | string[] | undefined): string => {
  const source = getSingleFormValue(value).trim();
  return source.slice(0, 80);
};

export const contactRedirectUrl = (
  lang: ContactLang,
  returnToValue?: string | string[]
): string => {
  const returnTo = getSingleFormValue(returnToValue);
  const path = ALLOWED_RETURN_PATHS.has(returnTo) ? returnTo : FALLBACK_REDIRECTS[lang];
  return `${path}?success=true${SUCCESS_ANCHORS[path] ?? ''}`;
};
