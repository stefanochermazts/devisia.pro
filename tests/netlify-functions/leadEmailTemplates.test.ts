import { describe, expect, it } from 'vitest';
import {
  renderContactConfirmationEmail,
  renderLandingConfirmationEmail,
} from '../../netlify/functions/lib/leadEmailRender';
import { getLeadEmailTemplate } from '../../netlify/functions/lib/leadEmailTemplates';

describe('lead email templates', () => {
  it('maps each LinkedIn source to the expected subject and heading', () => {
    expect(getLeadEmailTemplate('landing_system_explainability')?.subject).toContain('sistema');
    expect(getLeadEmailTemplate('landing_ai_governance')?.heading).toContain('governance');
    expect(getLeadEmailTemplate('landing_process_automation')?.heading).toContain('automazione');
    expect(getLeadEmailTemplate('landing_audit_evidence')?.heading).toContain('evidenze');
  });

  it('renders landing confirmation with named greeting and privacy links', () => {
    const email = renderLandingConfirmationEmail({
      source: 'landing_system_explainability',
      fullName: 'Mario Rossi',
    });

    expect(email).not.toBeNull();
    if (!email) return;
    expect(email.text).toContain('Buongiorno Mario,');
    expect(email.html).toContain('https://devisia.pro/privacy');
    expect(email.html).toContain('https://devisia.pro/contatti');
    expect(email.subject).toBe('Abbiamo ricevuto la tua richiesta sul sistema');
  });

  it('falls back to greeting without name', () => {
    const email = renderLandingConfirmationEmail({
      source: 'landing_ai_governance',
      fullName: '   ',
    });

    expect(email).not.toBeNull();
    if (!email) return;
    expect(email.text).toContain('Buongiorno,');
  });

  it('keeps contact thank-you templates for website forms', () => {
    const email = renderContactConfirmationEmail({
      lang: 'it',
      fullName: 'Anna Bianchi',
      subject: 'Nuovo progetto',
    });

    expect(email.subject).toBe('Grazie per averci contattato');
    expect(email.text).toContain('Nuovo progetto');
  });
});
