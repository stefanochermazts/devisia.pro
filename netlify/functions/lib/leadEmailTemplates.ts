import type { LeadSource } from './leadSources';

export type LeadEmailTemplate = {
  subject: string;
  heading: string;
  bodyParagraphs: string[];
  nextStepText: string;
  closingName: string;
  closingOrg: string;
};

const sharedFooterNote =
  'Hai ricevuto questa email perché hai inviato una richiesta attraverso il sito Devisia.';

export const LEAD_EMAIL_FOOTER_NOTE = sharedFooterNote;

export const leadEmailTemplates: Partial<Record<LeadSource, LeadEmailTemplate>> = {
  landing_system_explainability: {
    subject: 'Abbiamo ricevuto la tua richiesta sul sistema',
    heading: 'Rendere un sistema comprensibile è il primo controllo',
    bodyParagraphs: [
      'Abbiamo ricevuto la tua richiesta.',
      'Un sistema può funzionare correttamente e, allo stesso tempo, essere difficile da spiegare. In questi casi il primo passo non è aggiungere altra documentazione, ma ricostruire in modo chiaro flussi di dati, responsabilità, approvazioni, controlli ed evidenze.',
      'Le informazioni che hai inviato ci aiuteranno a capire quale parte del sistema o del processo richiede maggiore chiarezza e quali elementi dipendono ancora da conoscenza implicita.',
    ],
    nextStepText:
      'Esamineremo la richiesta e ti contatteremo utilizzando i riferimenti che hai indicato nel form.',
    closingName: 'Stefano Chermaz',
    closingOrg: 'Devisia',
  },
  landing_ai_governance: {
    subject: 'Abbiamo ricevuto la tua richiesta sulla governance AI',
    heading: 'La governance inizia prima della scelta del modello',
    bodyParagraphs: [
      'Abbiamo ricevuto la tua richiesta.',
      'Per valutare correttamente un sistema AI è necessario partire dal suo perimetro: problema da risolvere, dati utilizzabili, responsabilità, utenti, decisioni influenzate, limiti e controlli.',
      'Le informazioni che hai condiviso serviranno a inquadrare il caso d’uso e a capire quali elementi devono essere definiti prima di portare il sistema dentro un processo aziendale reale.',
    ],
    nextStepText:
      'Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.',
    closingName: 'Stefano Chermaz',
    closingOrg: 'Devisia',
  },
  landing_process_automation: {
    subject: 'Abbiamo ricevuto la tua richiesta sul processo',
    heading: 'Prima dell’automazione viene la chiarezza',
    bodyParagraphs: [
      'Abbiamo ricevuto la tua richiesta.',
      'Quando un processo contiene passaggi informali, duplicazioni, eccezioni non documentate o responsabilità implicite, l’automazione tende a trasferire la stessa complessità nel software.',
      'Le informazioni che hai inviato ci permetteranno di comprendere il processo attuale, individuare i punti che richiedono ancora interventi manuali e distinguere ciò che deve essere chiarito da ciò che può essere realmente automatizzato.',
    ],
    nextStepText:
      'Esamineremo il processo descritto e ti contatteremo utilizzando i riferimenti indicati nel form.',
    closingName: 'Stefano Chermaz',
    closingOrg: 'Devisia',
  },
  landing_audit_evidence: {
    subject: 'Abbiamo ricevuto la tua richiesta sulle evidenze',
    heading: 'Le evidenze devono esistere prima dell’audit',
    bodyParagraphs: [
      'Abbiamo ricevuto la tua richiesta.',
      'Prepararsi a un audit non dovrebbe significare ricostruire attività, responsabilità e documenti distribuiti tra cartelle, email e persone diverse. Le evidenze devono essere collegate ai controlli, avere un owner ed essere disponibili durante il normale funzionamento del processo.',
      'Le informazioni che hai inviato ci aiuteranno a comprendere il framework o la verifica da affrontare e a individuare dove si trovano oggi le principali difficoltà nella raccolta delle prove.',
    ],
    nextStepText:
      'Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.',
    closingName: 'Stefano Chermaz',
    closingOrg: 'Devisia',
  },
};

export const contactThankYouTemplates = {
  it: {
    subject: 'Grazie per averci contattato',
    greeting: (name: string) => `Ciao ${name},`,
    body: (subject: string | null) =>
      [
        `Grazie per averci contattato${subject ? ` riguardo "${subject}"` : ''}.`,
        'Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto. Di solito rispondiamo entro 24-48 ore lavorative.',
        'Nel frattempo, se hai domande urgenti, puoi contattarci direttamente all’indirizzo info@devisia.it.',
      ],
    closing: 'Il team Devisia',
  },
  en: {
    subject: 'Thank you for contacting Devisia',
    greeting: (name: string) => `Hello ${name},`,
    body: (subject: string | null) =>
      [
        `Thank you for contacting us${subject ? ` regarding "${subject}"` : ''}.`,
        'We have received your message and will get back to you as soon as possible. We typically respond within 24-48 business hours.',
        'In the meantime, if you have urgent questions, you can contact us directly at info@devisia.it.',
      ],
    closing: 'The Devisia Team',
  },
} as const;

export const getLeadEmailTemplate = (source: LeadSource): LeadEmailTemplate | null =>
  leadEmailTemplates[source] ?? null;
