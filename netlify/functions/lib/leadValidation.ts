import { getSingleFormValue } from './contactRedirect';
import { resolveLeadSource, type LeadSourceConfig } from './leadSources';

export const LEAD_MIN_SUBMIT_MS = 3000;

export const LEAD_LIMITS = {
  fullName: 120,
  email: 254,
  company: 160,
  role: 120,
  phone: 40,
  subject: 200,
  message: 4000,
  utm: 200,
  referrer: 500,
  submissionId: 36,
} as const;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LeadFieldErrors = Partial<
  Record<'full_name' | 'email' | 'company' | 'role' | 'message' | 'privacy_consent' | 'form', string>
>;

export type ParsedLeadPayload = {
  submissionId: string;
  formId: string;
  pagePath: string;
  lang: 'it' | 'en';
  fullName: string;
  email: string;
  company: string | null;
  role: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  formLoadedAt: number | null;
  honeypot: string;
  sourceConfig: LeadSourceConfig;
};

export type LeadValidationResult =
  | { ok: true; data: ParsedLeadPayload }
  | { ok: false; status: number; error: string; fieldErrors?: LeadFieldErrors; spam?: boolean };

type RawLeadBody = Record<string, string | string[] | undefined>;

const trimToNull = (value: string, max: number): string | null => {
  const trimmed = value.trim().slice(0, max);
  return trimmed ? trimmed : null;
};

const readString = (body: RawLeadBody, key: string): string => getSingleFormValue(body[key]);

const hasConsent = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === 'on' || normalized === '1' || normalized === 'yes';
};

const messages = {
  it: {
    missing: 'Compila i campi obbligatori.',
    email: 'Inserisci un’email di lavoro valida.',
    privacy: 'Il consenso privacy è obbligatorio.',
    company: 'Indica l’azienda.',
    form: 'La richiesta non è valida.',
    tooFast: 'Attendi un momento e riprova.',
  },
  en: {
    missing: 'Please fill in the required fields.',
    email: 'Enter a valid work email.',
    privacy: 'Privacy consent is required.',
    company: 'Please enter your company.',
    form: 'This request is not valid.',
    tooFast: 'Please wait a moment and try again.',
  },
} as const;

export const parseLeadBody = (raw: unknown): RawLeadBody => {
  if (typeof raw === 'string') {
    const params = new URLSearchParams(raw);
    const out: RawLeadBody = {};
    params.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  }

  if (typeof raw === 'object' && raw !== null) {
    const out: RawLeadBody = {};
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value === 'string' || Array.isArray(value) || value === undefined) {
        out[key] = value as string | string[] | undefined;
      } else if (value == null) {
        out[key] = '';
      } else {
        out[key] = String(value);
      }
    }
    return out;
  }

  return {};
};

export const validateLeadPayload = (body: RawLeadBody): LeadValidationResult => {
  const honeypot = readString(body, 'bot-field');
  if (honeypot.trim()) {
    return { ok: false, status: 200, error: 'Thanks!', spam: true };
  }

  const formId = readString(body, 'form_id');
  const pagePath = readString(body, 'page_path');
  const sourceConfig = resolveLeadSource(formId, pagePath);
  const langHint = readString(body, 'lang') === 'en' ? 'en' : 'it';
  const lang = sourceConfig?.lang ?? langHint;
  const copy = messages[lang];

  if (!sourceConfig) {
    return { ok: false, status: 400, error: copy.form, fieldErrors: { form: copy.form } };
  }

  const submissionId = readString(body, 'submission_id').trim();
  if (!UUID_RE.test(submissionId)) {
    return { ok: false, status: 400, error: copy.form, fieldErrors: { form: copy.form } };
  }

  const fullName = readString(body, 'name').trim().slice(0, LEAD_LIMITS.fullName);
  const email = readString(body, 'email').trim().toLowerCase().slice(0, LEAD_LIMITS.email);
  const company = trimToNull(readString(body, 'company'), LEAD_LIMITS.company);
  const role = trimToNull(readString(body, 'role'), LEAD_LIMITS.role);
  const phone = trimToNull(readString(body, 'phone'), LEAD_LIMITS.phone);
  const subject = trimToNull(readString(body, 'subject'), LEAD_LIMITS.subject);
  const message = readString(body, 'message').trim().slice(0, LEAD_LIMITS.message);
  const privacyAccepted = hasConsent(readString(body, 'privacy_consent'));
  const marketingAccepted = hasConsent(readString(body, 'marketing_consent'));

  const fieldErrors: LeadFieldErrors = {};
  if (!fullName) fieldErrors.full_name = copy.missing;
  if (!email) fieldErrors.email = copy.missing;
  else if (!EMAIL_RE.test(email)) fieldErrors.email = copy.email;
  if (!message) fieldErrors.message = copy.missing;
  if (!privacyAccepted) fieldErrors.privacy_consent = copy.privacy;
  if (sourceConfig.variant === 'landing' && !company) fieldErrors.company = copy.company;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      error: copy.missing,
      fieldErrors,
    };
  }

  const formLoadedAtRaw = readString(body, 'form_loaded_at').trim();
  const formLoadedAt = formLoadedAtRaw ? Number(formLoadedAtRaw) : null;
  if (formLoadedAt != null && Number.isFinite(formLoadedAt)) {
    const elapsed = Date.now() - formLoadedAt;
    if (elapsed >= 0 && elapsed < LEAD_MIN_SUBMIT_MS) {
      return { ok: false, status: 400, error: copy.tooFast, fieldErrors: { form: copy.tooFast } };
    }
  }

  return {
    ok: true,
    data: {
      submissionId,
      formId: sourceConfig.formId,
      pagePath: sourceConfig.paths[0],
      lang: sourceConfig.lang,
      fullName,
      email,
      company: sourceConfig.variant === 'landing' ? company : company,
      role,
      phone,
      subject,
      message,
      privacyAccepted,
      marketingAccepted,
      utmSource: trimToNull(readString(body, 'utm_source'), LEAD_LIMITS.utm),
      utmMedium: trimToNull(readString(body, 'utm_medium'), LEAD_LIMITS.utm),
      utmCampaign: trimToNull(readString(body, 'utm_campaign'), LEAD_LIMITS.utm),
      utmContent: trimToNull(readString(body, 'utm_content'), LEAD_LIMITS.utm),
      utmTerm: trimToNull(readString(body, 'utm_term'), LEAD_LIMITS.utm),
      referrer: trimToNull(readString(body, 'referrer'), LEAD_LIMITS.referrer),
      formLoadedAt: formLoadedAt != null && Number.isFinite(formLoadedAt) ? formLoadedAt : null,
      honeypot,
      sourceConfig,
    },
  };
};
