import it from '../locales/it.json';
import en from '../locales/en.json';

export type Locale = 'it' | 'en';

const dictionaries = {
  it,
  en,
} as const;

export type TranslationKey = keyof typeof en;

/**
 * Translation helper with fallback to English.
 * Logs missing keys in dev.
 */
export function t(key: TranslationKey, locale: Locale): string {
  const dict = dictionaries[locale] ?? dictionaries.en;
  const value = (dict as Record<string, string>)[key];

  if (value) return value;

  const fallback = (dictionaries.en as Record<string, string>)[key];
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
  }
  return fallback ?? key;
}

