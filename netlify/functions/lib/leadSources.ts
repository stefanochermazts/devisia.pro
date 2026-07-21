export type LeadSource =
  | 'landing_system_explainability'
  | 'landing_ai_governance'
  | 'landing_process_automation'
  | 'landing_audit_evidence'
  | 'landing_devisia'
  | 'website_contact';

export type LeadFormVariant = 'contact' | 'landing';

export type LeadSourceConfig = {
  source: LeadSource;
  formId: string;
  paths: readonly string[];
  variant: LeadFormVariant;
  lang: 'it' | 'en';
};

const LEAD_SOURCE_CONFIGS: readonly LeadSourceConfig[] = [
  {
    source: 'landing_system_explainability',
    formId: 'landing-sistemi-spiegabili',
    paths: ['/landing/sistemi-spiegabili'],
    variant: 'landing',
    lang: 'it',
  },
  {
    source: 'landing_ai_governance',
    formId: 'landing-governance-ai',
    paths: ['/landing/governance-ai'],
    variant: 'landing',
    lang: 'it',
  },
  {
    source: 'landing_process_automation',
    formId: 'landing-processi-prima-automazione',
    paths: ['/landing/processi-prima-automazione'],
    variant: 'landing',
    lang: 'it',
  },
  {
    source: 'landing_audit_evidence',
    formId: 'landing-evidenze-audit',
    paths: ['/landing/evidenze-audit'],
    variant: 'landing',
    lang: 'it',
  },
  {
    source: 'landing_devisia',
    formId: 'landing-devisia',
    paths: ['/landing/devisia'],
    variant: 'contact',
    lang: 'it',
  },
  {
    source: 'website_contact',
    formId: 'website-contact-it',
    paths: ['/contatti'],
    variant: 'contact',
    lang: 'it',
  },
  {
    source: 'website_contact',
    formId: 'website-contact-en',
    paths: ['/en/contact'],
    variant: 'contact',
    lang: 'en',
  },
] as const;

const normalizePath = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, 'https://devisia.pro');
    const path = url.pathname.replace(/\/+$/, '') || '/';
    return path;
  } catch {
    return trimmed.replace(/\/+$/, '') || '/';
  }
};

export const getLeadSourceConfigs = (): readonly LeadSourceConfig[] => LEAD_SOURCE_CONFIGS;

export const resolveLeadSource = (
  formIdRaw: string,
  pagePathRaw: string
): LeadSourceConfig | null => {
  const formId = formIdRaw.trim();
  const pagePath = normalizePath(pagePathRaw);
  if (!formId || !pagePath) return null;

  return (
    LEAD_SOURCE_CONFIGS.find(
      (entry) => entry.formId === formId && entry.paths.includes(pagePath)
    ) ?? null
  );
};

export const isLeadSource = (value: string): value is LeadSource =>
  LEAD_SOURCE_CONFIGS.some((entry) => entry.source === value);
