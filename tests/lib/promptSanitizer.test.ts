import { describe, expect, it } from 'vitest';
import {
  applyLegend,
  applyLegendDetailed,
  buildLlmPrompt,
  sanitizePrompt,
} from '../../src/lib/promptSanitizer';

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

  it('puts legend markers back into a model reply and leaves unknown markers', () => {
    const source = 'Mario Rossi (mario.rossi@devisia.it, 333 123 4567) abita in Via Roma 12, 20121 Milano';
    const { legend } = sanitizePrompt(source);
    const reply = 'Bozza per [NAME_1]: conferma [ADDR_1] e scrivi a [EMAIL_1] o al [PHONE_1]. Resta [UNKNOWN_9].';
    expect(applyLegend(reply, legend)).toBe(
      'Bozza per Mario Rossi: conferma Via Roma 12, 20121 Milano e scrivi a mario.rossi@devisia.it o al 333 123 4567. Resta [UNKNOWN_9].',
    );
  });

  it('replaces a longer placeholder before a shorter one', () => {
    const legend = [
      { placeholder: '[EMAIL_1]', value: 'a@b.co', kind: 'email' as const },
      { placeholder: '[EMAIL_10]', value: 'c@d.co', kind: 'email' as const },
    ];
    expect(applyLegend('x [EMAIL_10] y [EMAIL_1]', legend)).toBe('x c@d.co y a@b.co');
  });

  it('builds a ready-to-copy LLM prompt with or without the marker instruction', () => {
    const instruction = 'Mantieni i segnaposto tra parentesi quadre.';
    const redacted = 'Scrivi a [NAME_1] ([EMAIL_1]).';
    expect(buildLlmPrompt('', instruction, true)).toBe('');
    expect(buildLlmPrompt(redacted, instruction, false)).toBe(redacted);
    expect(buildLlmPrompt(redacted, instruction, true)).toBe(
      `${instruction}\n\n---\n\n${redacted}`,
    );
  });

  it('completes the full round-trip example and counts restored markers', () => {
    const prompt =
      'Scrivi una breve email formale di risposta a Mario Rossi (mario.rossi@devisia.it, tel. 333 123 4567) per confermare che invieremo il contratto in Via Roma 12, 20121 Milano e chiedigli di verificare P.IVA 12345678903 e IBAN IT60X0542811101000000123456 prima della firma.';
    const { text: redacted, legend } = sanitizePrompt(prompt);
    expect(legend.map((entry) => entry.placeholder)).toEqual([
      '[NAME_1]',
      '[EMAIL_1]',
      '[PHONE_1]',
      '[ADDR_1]',
      '[PIVA_1]',
      '[IBAN_1]',
    ]);
    expect(redacted).toContain('[NAME_1]');
    expect(redacted).toContain('[IBAN_1]');

    const simulatedReply =
      "Gentile [NAME_1], invieremo il contratto in [ADDR_1]. Verifica P.IVA [PIVA_1] e IBAN [IBAN_1]. Contatti: [EMAIL_1], [PHONE_1].";
    const detailed = applyLegendDetailed(simulatedReply, legend);
    expect(detailed.replacedCount).toBe(6);
    expect(detailed.text).toBe(
      "Gentile Mario Rossi, invieremo il contratto in Via Roma 12, 20121 Milano. Verifica P.IVA 12345678903 e IBAN IT60X0542811101000000123456. Contatti: mario.rossi@devisia.it, 333 123 4567.",
    );
  });

  it('leaves text without personal data unchanged', () => {
    const input = 'Descrivi un flusso di approvazione fatture senza dati reali.';
    expect(sanitizePrompt(input)).toEqual({ text: input, legend: [] });
  });
});
