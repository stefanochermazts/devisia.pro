import { describe, expect, it } from 'vitest';
import { resolveLeadSource } from '../../netlify/functions/lib/leadSources';

describe('resolveLeadSource', () => {
  it('resolves LinkedIn landing sources from form_id and path', () => {
    expect(resolveLeadSource('landing-sistemi-spiegabili', '/landing/sistemi-spiegabili')?.source).toBe(
      'landing_system_explainability'
    );
    expect(resolveLeadSource('landing-governance-ai', '/landing/governance-ai')?.source).toBe(
      'landing_ai_governance'
    );
    expect(
      resolveLeadSource('landing-processi-prima-automazione', '/landing/processi-prima-automazione')?.source
    ).toBe('landing_process_automation');
    expect(resolveLeadSource('landing-evidenze-audit', '/landing/evidenze-audit')?.source).toBe(
      'landing_audit_evidence'
    );
  });

  it('resolves website and devisia sources', () => {
    expect(resolveLeadSource('website-contact-it', '/contatti')?.source).toBe('website_contact');
    expect(resolveLeadSource('website-contact-en', '/en/contact')?.source).toBe('website_contact');
    expect(resolveLeadSource('landing-devisia', '/landing/devisia')?.source).toBe('landing_devisia');
  });

  it('rejects spoofed source mismatches', () => {
    expect(resolveLeadSource('landing-sistemi-spiegabili', '/contatti')).toBeNull();
    expect(resolveLeadSource('website-contact-it', '/landing/governance-ai')).toBeNull();
    expect(resolveLeadSource('landing-devisia', '/landing/devisia/')).toEqual(
      expect.objectContaining({ source: 'landing_devisia' })
    );
  });
});
