import { describe, expect, it } from 'vitest';
import {
  renderContactConfirmationEmail,
  renderLandingConfirmationEmail,
  renderManagerNotificationEmail,
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

  it('adapts the brochure confirmation to the chosen interests', () => {
    const render = (interests: Array<'processi' | 'auditready'>) =>
      renderLandingConfirmationEmail({ source: 'landing_brochure', fullName: 'Mario Rossi', interests });

    const processi = render(['processi']);
    const audit = render(['auditready']);
    const both = render(['processi', 'auditready']);

    expect(processi?.text).toContain('processi e Microsoft 365');
    expect(processi?.text).not.toContain('AuditReady');
    expect(audit?.text).toContain('AuditReady');
    expect(audit?.text).not.toContain('Microsoft 365');
    expect(both?.text).toContain('entrambe le aree');
    expect(both?.subject).toBe('Abbiamo ricevuto la tua richiesta');
    expect(both?.html).toContain('https://devisia.pro/privacy');
  });

  it('adds the interest line to the manager notification only when present', () => {
    const base = {
      fullName: 'Mario Rossi',
      email: 'mario@example.com',
      source: 'landing_brochure',
      lang: 'it' as const,
      company: 'Acme SpA',
      role: null,
      subject: null,
      message: 'Ciao',
      pagePath: '/brochure',
    };

    const withInterest = renderManagerNotificationEmail({ ...base, interests: ['processi', 'auditready'] });
    expect(withInterest.text).toContain('Interest: Processi e Microsoft 365 + AuditReady');
    expect(withInterest.html).toContain('<strong>Interest:</strong>');

    const without = renderManagerNotificationEmail(base);
    expect(without.text).not.toContain('Interest:');
  });
});
