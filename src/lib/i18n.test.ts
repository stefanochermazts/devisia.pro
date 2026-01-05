import { describe, expect, it } from 'vitest';
import { t } from './i18n';

describe('i18n', () => {
  it('returns Italian translation', () => {
    expect(t('acceptAll', 'it')).toBe('Accetta tutto');
  });

  it('falls back to English for missing locale key', () => {
    // @ts-expect-error testing runtime fallback
    expect(t('acceptAll', 'xx')).toBe('Accept all');
  });
});

