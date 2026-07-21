export type ThankYouLang = 'it' | 'en';

export type ThankYouCopy = {
  documentTitle: string;
  eyebrow: string;
  title: string;
  lede: string;
  nextStep: string;
  backLabel: string;
  homeLabel: string;
  contactLabel: string;
};

const ALLOWED_RETURN_PATHS = new Set([
  '/contatti',
  '/en/contact',
  '/landing/devisia',
  '/landing/sistemi-spiegabili',
  '/landing/governance-ai',
  '/landing/processi-prima-automazione',
  '/landing/evidenze-audit',
]);

const SOURCE_COPY: Record<
  string,
  {
    it: Pick<ThankYouCopy, 'title' | 'lede' | 'nextStep'>;
    en: Pick<ThankYouCopy, 'title' | 'lede' | 'nextStep'>;
  }
> = {
  landing_system_explainability: {
    it: {
      title: 'Richiesta ricevuta sul sistema',
      lede: 'Abbiamo ricevuto il contesto che hai condiviso. Il primo passo è capire dove mancano chiarezza su flussi, responsabilità, controlli ed evidenze.',
      nextStep: 'Esamineremo la richiesta e ti contatteremo utilizzando i riferimenti indicati nel form.',
    },
    en: {
      title: 'Request received about your system',
      lede: 'We received the context you shared. The first step is to understand where clarity is missing around flows, ownership, controls and evidence.',
      nextStep: 'We will review the request and contact you using the details you provided in the form.',
    },
  },
  landing_ai_governance: {
    it: {
      title: 'Richiesta ricevuta sulla governance AI',
      lede: 'Abbiamo ricevuto il caso d’uso indicato. La valutazione parte dal perimetro: scopo, dati, responsabilità, limiti e controlli.',
      nextStep: 'Esamineremo il contesto e ti contatteremo utilizzando i riferimenti presenti nel form.',
    },
    en: {
      title: 'Request received about AI governance',
      lede: 'We received the use case you described. Evaluation starts from the perimeter: purpose, data, ownership, limits and controls.',
      nextStep: 'We will review the context and contact you using the details in the form.',
    },
  },
  landing_process_automation: {
    it: {
      title: 'Richiesta ricevuta sul processo',
      lede: 'Abbiamo ricevuto la descrizione del processo. Prima di automatizzare serve chiarire decisioni, eccezioni e responsabilità.',
      nextStep: 'Esamineremo il processo descritto e ti contatteremo utilizzando i riferimenti indicati nel form.',
    },
    en: {
      title: 'Request received about your process',
      lede: 'We received the process description. Before automation, decisions, exceptions and ownership need to be made explicit.',
      nextStep: 'We will review the process and contact you using the details you provided.',
    },
  },
  landing_audit_evidence: {
    it: {
      title: 'Richiesta ricevuta sulle evidenze',
      lede: 'Abbiamo ricevuto il contesto di verifica. L’obiettivo è capire dove si trovano oggi le prove e chi ne è responsabile.',
      nextStep: 'Esamineremo il framework o l’audit indicato e ti contatteremo utilizzando i riferimenti presenti nel form.',
    },
    en: {
      title: 'Request received about audit evidence',
      lede: 'We received the verification context. The goal is to understand where evidence lives today and who owns it.',
      nextStep: 'We will review the framework or audit and contact you using the details in the form.',
    },
  },
  landing_devisia: {
    it: {
      title: 'Messaggio ricevuto',
      lede: 'Grazie. Leggiamo la richiesta e ti rispondiamo con domande mirate o un primo passo chiaro.',
      nextStep: 'Ti contatteremo utilizzando i riferimenti indicati nel form.',
    },
    en: {
      title: 'Message received',
      lede: 'Thank you. We will review your request and reply with focused questions or a clear next step.',
      nextStep: 'We will contact you using the details you provided in the form.',
    },
  },
  website_contact: {
    it: {
      title: 'Messaggio ricevuto',
      lede: 'Grazie. Leggiamo la richiesta e ti rispondiamo entro 24 ore lavorative con domande mirate o un primo passo chiaro.',
      nextStep: 'Ti contatteremo utilizzando i riferimenti indicati nel form.',
    },
    en: {
      title: 'Message received',
      lede: 'Thank you. We will review your request and reply within 24 business hours with focused questions or a clear next step.',
      nextStep: 'We will contact you using the details you provided in the form.',
    },
  },
};

const DEFAULT_COPY = SOURCE_COPY.website_contact;

export const normalizeThankYouSource = (value: string | null | undefined): string => {
  const source = (value || '').trim();
  return source in SOURCE_COPY ? source : 'website_contact';
};

export const normalizeReturnPath = (
  value: string | null | undefined,
  lang: ThankYouLang
): string => {
  const path = (value || '').trim().replace(/\/+$/, '') || '';
  if (ALLOWED_RETURN_PATHS.has(path)) return path;
  return lang === 'en' ? '/en/contact' : '/contatti';
};

export const getThankYouCopy = (params: {
  lang: ThankYouLang;
  source?: string | null;
}): ThankYouCopy => {
  const source = normalizeThankYouSource(params.source);
  const localized = SOURCE_COPY[source]?.[params.lang] ?? DEFAULT_COPY[params.lang];

  if (params.lang === 'en') {
    return {
      documentTitle: 'Thank you | Devisia',
      eyebrow: 'Request received',
      title: localized.title,
      lede: localized.lede,
      nextStep: localized.nextStep,
      backLabel: 'Back to the previous page',
      homeLabel: 'Go to homepage',
      contactLabel: 'Contact page',
    };
  }

  return {
    documentTitle: 'Grazie | Devisia',
    eyebrow: 'Richiesta ricevuta',
    title: localized.title,
    lede: localized.lede,
    nextStep: localized.nextStep,
    backLabel: 'Torna alla pagina precedente',
    homeLabel: 'Vai alla home',
    contactLabel: 'Pagina contatti',
  };
};
