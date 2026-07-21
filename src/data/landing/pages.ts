import type { LandingPageConfig, LandingSlug } from './types';

export const landingPages: Record<LandingSlug, LandingPageConfig> = {
  'sistemi-spiegabili': {
    slug: 'sistemi-spiegabili',
    path: '/landing/sistemi-spiegabili',
    source: 'landing_system_explainability',
    formId: 'landing-sistemi-spiegabili',
    seo: {
      documentTitle: 'Sistemi spiegabili e verificabili | Devisia',
      description: 'Rendi espliciti flussi di dati, responsabilità, controlli ed evidenze del tuo sistema.',
      heroImage: '/images/sistemi-spiegabili.png',
    },
    hero: {
      eyebrow: 'Architettura e governance',
      title: 'Un sistema che funziona ma non si sa spiegare è già un rischio.',
      lede: 'Dati, responsabilità, approvazioni e controlli non dovrebbero dipendere dalla memoria delle persone. Un sistema solido deve poter essere compreso, governato e verificato.',
      ctaLabel: 'Analizza il tuo sistema',
      imageAlt: 'Diagramma che confronta un sistema spiegabile con uno opaco',
    },
    problem: {
      title: 'Il problema emerge durante l’audit. Ma nasce molto prima.',
      text: 'Quando un sistema cresce senza una rappresentazione esplicita dei suoi flussi, le risposte rimangono distribuite tra codice, documenti, configurazioni e conoscenza personale. Il sistema può continuare a funzionare, ma diventa difficile capire chi è responsabile, quali controlli esistono e quali dati vengono realmente trattati.',
    },
    checklist: {
      title: 'Le domande a cui il sistema deve saper rispondere',
      kind: 'questions',
      items: [
        'Quali dati entrano nel sistema e da dove provengono?',
        'Dove vengono trasferiti, trasformati e conservati?',
        'Chi può approvare, modificare o cancellare le informazioni?',
        'Quali controlli sono automatici e quali dipendono dalle persone?',
        'Quali attività producono una traccia verificabile?',
        'Chi è responsabile quando qualcosa non funziona?',
      ],
    },
    method: {
      title: 'Rendere il sistema comprensibile',
      steps: [
        {
          label: 'Mappare',
          text: 'Ricostruiamo sistemi, integrazioni, dati, attori e passaggi decisionali.',
        },
        {
          label: 'Assegnare',
          text: 'Rendiamo esplicite responsabilità, ownership e punti di approvazione.',
        },
        {
          label: 'Verificare',
          text: 'Colleghiamo controlli ed evidenze ai punti realmente critici del processo.',
        },
      ],
    },
    results: {
      title: 'Cosa deve rimanere dopo l’analisi',
      items: [
        'mappa dell’architettura e dei flussi',
        'matrice delle responsabilità',
        'inventario dei dati e delle integrazioni',
        'controlli esistenti e controlli mancanti',
        'evidenze disponibili',
        'punti che dipendono ancora da conoscenza implicita',
      ],
    },
    form: {
      title: 'Il tuo sistema riesce a spiegare come funziona?',
      text: 'Descrivi brevemente il sistema o il processo che vuoi analizzare. Il primo passo è capire dove si trovano le informazioni mancanti.',
      submitLabel: 'Richiedi un confronto',
    },
  },
  'governance-ai': {
    slug: 'governance-ai',
    path: '/landing/governance-ai',
    source: 'landing_ai_governance',
    formId: 'landing-governance-ai',
    seo: {
      documentTitle: 'Governance dei sistemi AI | Devisia',
      description: 'Definisci scopo, dati, responsabilità, limiti e controlli prima di introdurre un sistema AI.',
      heroImage: '/images/governance-ai.png',
    },
    hero: {
      eyebrow: 'AI governance',
      title: 'Prima del modello, serve un perimetro.',
      lede: 'La scelta della tecnologia arriva dopo. Prima bisogna stabilire quale problema deve risolvere il sistema AI, quali dati può utilizzare, chi ne risponde e come verificarne il comportamento.',
      ctaLabel: 'Definisci il perimetro',
      imageAlt: 'Schema di governance AI con scopo, dati, owner, controlli ed evidenze',
    },
    problem: {
      title: 'Un sistema AI senza ownership diventa un rischio non gestito.',
      text: 'Molte iniziative AI iniziano dalla scelta del modello o da una sperimentazione tecnica. Quando il progetto entra in un processo reale emergono però domande diverse: chi autorizza l’utilizzo, quali dati sono ammessi, quali decisioni può influenzare, chi controlla gli output e come vengono gestiti gli errori.',
    },
    checklist: {
      title: 'Il perimetro minimo di un sistema AI',
      kind: 'model',
      items: [
        'Purpose: quale problema deve risolvere?',
        'Data: quali dati può utilizzare e quali sono esclusi?',
        'Owner: chi è responsabile del sistema?',
        'Users: chi può utilizzarlo e in quali condizioni?',
        'Decisions: quali decisioni può supportare o influenzare?',
        'Human oversight: quando deve intervenire una persona?',
        'Controls: quali controlli verificano il comportamento?',
        'Evidence: quali informazioni devono essere conservate?',
      ],
    },
    method: {
      title: 'Portare l’AI dentro un processo reale',
      steps: [
        {
          label: 'Definire',
          text: 'Formalizziamo scopo, utenti, dati ammessi e risultati attesi.',
        },
        {
          label: 'Limitare',
          text: 'Stabiliamo confini operativi, decisioni escluse e supervisione umana.',
        },
        {
          label: 'Controllare',
          text: 'Definiamo verifiche, logging, responsabilità ed evidenze.',
        },
      ],
    },
    results: {
      title: 'Cosa deve esistere prima della produzione',
      items: [
        'scheda del sistema AI',
        'scopo e perimetro di utilizzo',
        'owner tecnico e owner di processo',
        'dati consentiti e dati esclusi',
        'matrice dei rischi',
        'controlli operativi',
        'supervisione umana',
        'evidenze necessarie',
        'criteri per sospendere o correggere il sistema',
      ],
    },
    form: {
      title: 'Stai valutando un sistema AI?',
      text: 'Descrivi il caso d’uso, il processo coinvolto e i dati che il sistema dovrebbe trattare. La valutazione deve iniziare dal perimetro, non dal modello.',
      submitLabel: 'Richiedi un confronto',
    },
  },
  'processi-prima-automazione': {
    slug: 'processi-prima-automazione',
    path: '/landing/processi-prima-automazione',
    source: 'landing_process_automation',
    formId: 'landing-processi-prima-automazione',
    seo: {
      documentTitle: 'Analisi dei processi prima dell’automazione | Devisia',
      description: 'Rendi espliciti responsabilità, decisioni ed eccezioni prima di automatizzare un processo.',
      heroImage: '/images/processi-prima-automazione.png',
    },
    hero: {
      eyebrow: 'Processi e automazione',
      title: 'Automatizzare un processo confuso significa renderlo confuso più velocemente.',
      lede: 'Il software non corregge automaticamente ambiguità, passaggi informali e responsabilità implicite. Prima di automatizzare bisogna definire come il processo dovrebbe realmente funzionare.',
      ctaLabel: 'Analizza il processo',
      imageAlt: 'Diagramma che mostra come l’automazione accelera un processo ancora ambiguo',
    },
    problem: {
      title: 'Il debito tecnico può iniziare prima del codice.',
      text: 'Quando un processo non è stato analizzato, il software finisce per incorporare eccezioni, duplicazioni e decisioni non formalizzate. Il risultato è un sistema pieno di correzioni manuali, integrazioni fragili e regole conosciute soltanto da alcune persone.',
    },
    checklist: {
      title: 'Segnali di un processo non ancora pronto per essere automatizzato',
      kind: 'signals',
      items: [
        'le richieste arrivano attraverso canali diversi',
        'la stessa informazione viene copiata più volte',
        'le approvazioni avvengono tramite email o messaggi',
        'alcune eccezioni dipendono dalla persona che gestisce il caso',
        'nessuno possiede realmente il processo completo',
        'le integrazioni compensano regole mai formalizzate',
        'gli errori vengono corretti manualmente senza modificare il processo',
      ],
    },
    method: {
      title: 'Prima chiarire. Poi automatizzare.',
      steps: [
        {
          label: 'Stato attuale',
          text: 'Ricostruiamo attività, attori, sistemi, documenti e passaggi manuali.',
        },
        {
          label: 'Decisioni',
          text: 'Rendiamo esplicite regole, approvazioni, eccezioni e responsabilità.',
        },
        {
          label: 'Stato futuro',
          text: 'Definiamo il processo corretto prima di tradurlo in software.',
        },
        {
          label: 'Perimetro tecnico',
          text: 'Stabiliamo cosa automatizzare, cosa integrare e cosa deve restare sotto controllo umano.',
        },
      ],
    },
    results: {
      title: 'Cosa deve essere definito prima dello sviluppo',
      items: [
        'mappa del processo attuale',
        'colli di bottiglia e duplicazioni',
        'responsabilità e punti decisionali',
        'eccezioni operative',
        'processo futuro',
        'perimetro dell’automazione',
        'integrazioni necessarie',
        'requisiti verificabili',
      ],
    },
    form: {
      title: 'Quale processo stai cercando di automatizzare?',
      text: 'Descrivi i passaggi attuali, i sistemi coinvolti e le attività che richiedono ancora interventi manuali.',
      submitLabel: 'Richiedi un confronto',
    },
  },
  'evidenze-audit': {
    slug: 'evidenze-audit',
    path: '/landing/evidenze-audit',
    source: 'landing_audit_evidence',
    formId: 'landing-evidenze-audit',
    seo: {
      documentTitle: 'Evidenze e preparazione all’audit | Devisia',
      description: 'Collega controlli, owner ed evidenze per evitare di ricostruire tutto durante un audit.',
      heroImage: '/images/evidenze-audit.png',
    },
    hero: {
      eyebrow: 'Audit readiness',
      title: 'L’audit dovrebbe verificare. Non ricostruire.',
      lede: 'Le evidenze devono nascere durante il processo, essere collegate ai controlli e avere ownership, data, validità e tracciabilità.',
      ctaLabel: 'Organizza le evidenze',
      imageAlt: 'Confronto tra evidenze sparse e un modello strutturato di verifica',
    },
    problem: {
      title: 'Il giorno dell’audit è troppo tardi per iniziare a cercare le prove.',
      text: 'Quando documenti, approvazioni e responsabilità sono distribuiti tra cartelle, email e persone diverse, ogni verifica diventa un lavoro di ricostruzione. Il problema non è soltanto trovare i file: è dimostrare a quale controllo appartengono, chi li ha prodotti e se sono ancora validi.',
    },
    checklist: {
      title: 'Ogni evidenza deve avere un contesto',
      kind: 'model',
      items: [
        'Control: quale requisito o controllo dimostra?',
        'Owner: chi è responsabile?',
        'Evidence: quale documento, registro o attività produce la prova?',
        'Frequency: con quale frequenza deve essere aggiornata?',
        'Validity: fino a quando può essere considerata valida?',
        'Traceability: chi l’ha prodotta e quando?',
      ],
    },
    method: {
      title: 'Dalla raccolta manuale alla disponibilità continua',
      steps: [
        {
          label: 'Collegare',
          text: 'Associamo ogni controllo alle evidenze realmente necessarie.',
        },
        {
          label: 'Assegnare',
          text: 'Definiamo owner, frequenza e responsabilità di aggiornamento.',
        },
        {
          label: 'Verificare',
          text: 'Identifichiamo evidenze mancanti, scadute o non sufficientemente tracciabili.',
        },
      ],
    },
    results: {
      title: 'Cosa deve essere disponibile prima dell’audit',
      items: [
        'registro dei controlli',
        'mappa delle evidenze',
        'owner per controllo ed evidenza',
        'data di raccolta e validità',
        'evidenze mancanti o scadute',
        'storico delle verifiche',
        'struttura esportabile per revisori e auditor',
      ],
    },
    form: {
      title: 'Quanto tempo richiede oggi ricostruire le evidenze?',
      text: 'Descrivi il framework, l’audit o il processo di verifica che devi gestire. Il primo obiettivo è capire dove si trovano le prove e chi ne è responsabile.',
      submitLabel: 'Richiedi un confronto',
    },
  },
};

export const landingSlugs = Object.keys(landingPages) as LandingSlug[];

export const getLandingPage = (slug: string): LandingPageConfig | null => {
  if (!(slug in landingPages)) return null;
  return landingPages[slug as LandingSlug];
};
