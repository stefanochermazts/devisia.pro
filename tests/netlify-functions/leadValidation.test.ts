import { describe, expect, it } from 'vitest';
import { parseLeadBody, validateLeadPayload } from '../../netlify/functions/lib/leadValidation';

const validLandingBody = {
  submission_id: '11111111-1111-4111-8111-111111111111',
  form_id: 'landing-sistemi-spiegabili',
  page_path: '/landing/sistemi-spiegabili',
  lang: 'it',
  name: 'Mario Rossi',
  email: 'mario@example.com',
  company: 'Acme SpA',
  role: 'CTO',
  message: 'Dobbiamo rendere spiegabile il sistema ordini.',
  privacy_consent: 'true',
  form_loaded_at: String(Date.now() - 5000),
  'bot-field': '',
};

describe('validateLeadPayload', () => {
  it('accepts a valid landing submission and ignores client source', () => {
    const result = validateLeadPayload(
      parseLeadBody({
        ...validLandingBody,
        source: 'spoofed_source',
      })
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.sourceConfig.source).toBe('landing_system_explainability');
    expect(result.data.company).toBe('Acme SpA');
    expect(result.data.email).toBe('mario@example.com');
  });

  it('requires company on landing variant', () => {
    const result = validateLeadPayload(
      parseLeadBody({
        ...validLandingBody,
        company: '',
      })
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors?.company).toBeTruthy();
  });

  it('treats honeypot fills as silent spam success', () => {
    const result = validateLeadPayload(
      parseLeadBody({
        ...validLandingBody,
        'bot-field': 'https://spam.example',
      })
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.spam).toBe(true);
    expect(result.status).toBe(200);
  });

  it('rejects submissions that are too fast', () => {
    const result = validateLeadPayload(
      parseLeadBody({
        ...validLandingBody,
        form_loaded_at: String(Date.now() - 200),
      })
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors?.form).toBeTruthy();
  });

  it('accepts website contact without company', () => {
    const result = validateLeadPayload(
      parseLeadBody({
        submission_id: '22222222-2222-4222-8222-222222222222',
        form_id: 'website-contact-it',
        page_path: '/contatti',
        lang: 'it',
        name: 'Anna Bianchi',
        email: 'anna@example.com',
        subject: 'Nuovo progetto',
        message: 'Vorrei un confronto sul processo ordini.',
        privacy_consent: 'true',
        form_loaded_at: String(Date.now() - 4000),
      })
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.sourceConfig.source).toBe('website_contact');
    expect(result.data.company).toBeNull();
  });
});
