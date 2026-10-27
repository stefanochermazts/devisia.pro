import { describe, expect, it } from 'vitest';
import { sanitizePrompt } from '../../src/lib/promptSanitizer';

describe('prompt sanitizer', () => {
  it('reuses one placeholder for the same email', () => {
    const result = sanitizePrompt('Scrivi a mario.rossi@devisia.it e poi a mario.rossi@devisia.it');
    expect(result.text).toBe('Scrivi a [EMAIL_1] e poi a [EMAIL_1]');
    expect(result.legend).toEqual([
      { placeholder: '[EMAIL_1]', value: 'mario.rossi@devisia.it', kind: 'email' },
    ]);
  });

  it('accepts a valid codice fiscale and rejects a broken check character', () => {
    const result = sanitizePrompt('CF RSSMRA85T10A562S e quasi RSSMRA85T10A562X');
    expect(result.text).toBe('CF [CF_1] e quasi RSSMRA85T10A562X');
    expect(result.legend.map((entry) => entry.kind)).toEqual(['cf']);
  });

  it('redacts a valid partita IVA and leaves an 11-digit near-miss', () => {
    const result = sanitizePrompt('P.IVA 12345678903 non è 12345678901');
    expect(result.text).toBe('P.IVA [PIVA_1] non è 12345678901');
  });

  it('keeps an IBAN and an API key intact instead of splitting them', () => {
    const fakeKey = ['sk', 'proj', 'abc123def456ghi789jkl012'].join('-');
    const input = `IBAN IT60X0542811101000000123456 key ${fakeKey}`;
    const result = sanitizePrompt(input);
    expect(result.text).toBe('IBAN [IBAN_1] key [SECRET_1]');
    expect(result.legend.map((entry) => entry.value)).toEqual([
      'IT60X0542811101000000123456',
      fakeKey,
    ]);
    expect(result.text).not.toMatch(/\d{6,}/);
  });

  it('redacts assigned secrets, Italian phones and E.164 numbers', () => {
    const result = sanitizePrompt('api_key=supersecretvalue12345 chiama 333 123 4567 o +14155552671');
    expect(result.text).toBe('api_key=[SECRET_1] chiama [PHONE_1] o [PHONE_2]');
  });

  it('redacts an Italian address and a minimal English street', () => {
    const result = sanitizePrompt('Sede in Via Roma 12, 20121 Milano e anche 123 Main Street.');
    expect(result.text).toContain('[ADDR_1]');
    expect(result.text).toContain('[ADDR_2]');
    expect(result.legend.find((entry) => entry.kind === 'address')?.value).toMatch(/Via Roma 12/);
    expect(result.legend.some((entry) => entry.value === '123 Main Street')).toBe(true);
  });

  it('redacts a given name plus surname and ignores a capitalized sentence', () => {
    const result = sanitizePrompt('Mario Rossi ha scritto. The Project starts Monday.');
    expect(result.text).toBe('[NAME_1] ha scritto. The Project starts Monday.');
    expect(result.legend).toEqual([{ placeholder: '[NAME_1]', value: 'Mario Rossi', kind: 'name' }]);
  });

  it('restores a suppressed value everywhere and leaves the other matches', () => {
    const input = 'Mario Rossi scrive a mario.rossi@devisia.it. Copia per Mario Rossi.';
    const redacted = sanitizePrompt(input);
    expect(redacted.text).toBe('[NAME_1] scrive a [EMAIL_1]. Copia per [NAME_1].');
    const restored = sanitizePrompt(input, ['Mario Rossi']);
    expect(restored.text).toBe('Mario Rossi scrive a [EMAIL_1]. Copia per Mario Rossi.');
    expect(restored.legend.map((entry) => entry.kind)).toEqual(['email']);
  });

  it('leaves text without personal data unchanged', () => {
    const input = 'Descrivi un flusso di approvazione fatture senza dati reali.';
    expect(sanitizePrompt(input)).toEqual({ text: input, legend: [] });
  });
});
