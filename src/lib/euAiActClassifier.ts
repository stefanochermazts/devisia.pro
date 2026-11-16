export type OperatorRole = 'deployer' | 'provider' | 'product_manufacturer';

export type ProhibitedPractice =
  | 'none'
  | 'emotion_work_edu'
  | 'social_scoring_manipulative'
  | 'biometric_scraping_categorization';

export type SafetyComponentScope = 'none' | 'annex_i_safety';

export type AnnexIiiDomain =
  | 'none'
  | 'employment_hr'
  | 'essential_services_credit'
  | 'education_vocational'
  | 'biometrics_critical_infra'
  | 'law_justice_migration';

export type DecisionAutonomy =
  | 'narrow_procedural'
  | 'influences_decision'
  | 'profiles_individuals';

export type TransparencyTrigger =
  | 'none'
  | 'chatbot_human_interaction'
  | 'synthetic_content_gen'
  | 'deepfake_emotion_permitted';

export interface AiActClassifierInput {
  operatorRole: OperatorRole;
  prohibitedCheck: ProhibitedPractice;
  safetyComponent: SafetyComponentScope;
  annexIiiDomain: AnnexIiiDomain;
  decisionAutonomy: DecisionAutonomy;
  transparencyTrigger: TransparencyTrigger;
}

export type AiActRiskTier =
  | 'prohibited'
  | 'high_risk'
  | 'annex_iii_derogation'
  | 'limited_transparency'
  | 'minimal_risk';

export interface AiActEvidenceItem {
  id: string;
  articleRef: string;
  title: string;
  description: string;
  priority: 'mandatory' | 'recommended';
}

export interface AiActClassificationResult {
  tier: AiActRiskTier;
  tierCode: string;
  badgeTone: 'danger' | 'warning' | 'info' | 'success' | 'neutral';
  tierLabel: string;
  primaryArticle: string;
  applicabilityTimeline: string;
  summary: string;
  rationale: string[];
  evidences: AiActEvidenceItem[];
  recommendedToolHref: string;
  recommendedToolLabel: string;
}

export interface AiActPresetScenario {
  id: string;
  label: string;
  shortDesc: string;
  input: AiActClassifierInput;
}

export const DEFAULT_AI_ACT_INPUT: AiActClassifierInput = {
  operatorRole: 'deployer',
  prohibitedCheck: 'none',
  safetyComponent: 'none',
  annexIiiDomain: 'none',
  decisionAutonomy: 'narrow_procedural',
  transparencyTrigger: 'chatbot_human_interaction',
};

const PRESETS_IT: AiActPresetScenario[] = [
  {
    id: 'customer-rag-chatbot',
    label: 'Chatbot clienti / RAG',
    shortDesc: 'Assistente su documentazione aziendale a contatto con utenti esterni',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'none',
      decisionAutonomy: 'narrow_procedural',
      transparencyTrigger: 'chatbot_human_interaction',
    },
  },
  {
    id: 'hr-cv-screening',
    label: 'Screening CV e selezione HR',
    shortDesc: 'Valutazione e ranking automatico dei candidati per offerte di lavoro',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'profiles_individuals',
      transparencyTrigger: 'chatbot_human_interaction',
    },
  },
  {
    id: 'internal-doc-copilot',
    label: 'Assistente interno documenti',
    shortDesc: 'Sintesi e ricerca interna per il team senza decisioni su persone',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'none',
      decisionAutonomy: 'narrow_procedural',
      transparencyTrigger: 'none',
    },
  },
  {
    id: 'workplace-emotion-ai',
    label: 'Analisi emozioni dipendenti',
    shortDesc: 'Monitoraggio dello stato emotivo da webcam o chiamate interne',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'emotion_work_edu',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'profiles_individuals',
      transparencyTrigger: 'deepfake_emotion_permitted',
    },
  },
];

const PRESETS_EN: AiActPresetScenario[] = [
  {
    id: 'customer-rag-chatbot',
    label: 'Customer RAG chatbot',
    shortDesc: 'Knowledge-base assistant interacting directly with external users',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'none',
      decisionAutonomy: 'narrow_procedural',
      transparencyTrigger: 'chatbot_human_interaction',
    },
  },
  {
    id: 'hr-cv-screening',
    label: 'HR CV screening & ranking',
    shortDesc: 'Automated candidate scoring and filtering for job openings',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'profiles_individuals',
      transparencyTrigger: 'chatbot_human_interaction',
    },
  },
  {
    id: 'internal-doc-copilot',
    label: 'Internal document copilot',
    shortDesc: 'Back-office summarization and search with no decisions on people',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'none',
      safetyComponent: 'none',
      annexIiiDomain: 'none',
      decisionAutonomy: 'narrow_procedural',
      transparencyTrigger: 'none',
    },
  },
  {
    id: 'workplace-emotion-ai',
    label: 'Workplace emotion tracking',
    shortDesc: 'Inferring employee emotions from calls or video feeds',
    input: {
      operatorRole: 'deployer',
      prohibitedCheck: 'emotion_work_edu',
      safetyComponent: 'none',
      annexIiiDomain: 'employment_hr',
      decisionAutonomy: 'profiles_individuals',
      transparencyTrigger: 'deepfake_emotion_permitted',
    },
  },
];

export function getAiActPresets(lang: 'it' | 'en' = 'it'): AiActPresetScenario[] {
  return lang === 'en' ? PRESETS_EN : PRESETS_IT;
}

const DOMAIN_LABELS_IT: Record<AnnexIiiDomain, string> = {
  none: 'Fuori dagli ambiti elencati nell’Allegato III',
  employment_hr: 'Occupazione, selezione del personale e gestione dei lavoratori (Allegato III, punto 4)',
  essential_services_credit:
    'Accesso a servizi essenziali, credit scoring, assicurazioni vita/salute o triage (Allegato III, punto 5)',
  education_vocational: 'Istruzione e formazione professionale (Allegato III, punto 3)',
  biometrics_critical_infra:
    'Biometria consentita o infrastrutture critiche (Allegato III, punti 1–2)',
  law_justice_migration: 'Giustizia, processi democratici, migrazione o contrasto (Allegato III, punti 6–8)',
};

const DOMAIN_LABELS_EN: Record<AnnexIiiDomain, string> = {
  none: 'Outside the domains listed in Annex III',
  employment_hr: 'Employment, recruitment and workers management (Annex III, point 4)',
  essential_services_credit:
    'Access to essential services, credit scoring, life/health insurance or triage (Annex III, point 5)',
  education_vocational: 'Education and vocational training (Annex III, point 3)',
  biometrics_critical_infra:
    'Permitted biometrics or critical infrastructure safety (Annex III, points 1–2)',
  law_justice_migration: 'Justice, democratic processes, migration or law enforcement (Annex III, points 6–8)',
};

function buildTransparencyEvidences(
  trigger: TransparencyTrigger,
  lang: 'it' | 'en',
): AiActEvidenceItem[] {
  if (trigger === 'none') return [];
  const isEn = lang === 'en';

  const items: AiActEvidenceItem[] = [];
  if (trigger === 'chatbot_human_interaction') {
    items.push({
      id: 'art50-interaction-notice',
      articleRef: 'Art. 50(1)',
      title: isEn
        ? 'Clear disclosure of AI interaction'
        : 'Informativa chiara sull’interazione con un sistema AI',
      description: isEn
        ? 'Inform users at the first interaction that they are communicating with an AI system, clearly stating its scope and escalation path to a human operator.'
        : 'Informa la persona fisica fin dal primo contatto che sta interagendo con un sistema AI, dichiarando perimetro, fonti e modalità di passaggio a un operatore umano.',
      priority: 'mandatory',
    });
  }

  if (trigger === 'synthetic_content_gen') {
    items.push({
      id: 'art50-synthetic-marking',
      articleRef: 'Art. 50(2) & 50(4)',
      title: isEn
        ? 'Machine-readable marking and public-interest text disclosure'
        : 'Marcatura tecnica degli output sintetici ed etichettatura editoriale',
      description: isEn
        ? 'Ensure synthetic audio, image, video or text outputs are detectable as artificially generated (metadata/watermarking) and disclose AI generation when publishing text on matters of public interest without human editorial responsibility.'
        : 'Assicura che gli output sintetici (audio, immagini, video, testo) siano riconoscibili in formato leggibile meccanicamente e dichiara la generazione AI per testi pubblicati su materie di interesse pubblico privi di revisione editoriale umana.',
      priority: 'mandatory',
    });
  }

  if (trigger === 'deepfake_emotion_permitted') {
    items.push({
      id: 'art50-deepfake-emotion',
      articleRef: 'Art. 50(3)–(4)',
      title: isEn
        ? 'Explicit notice for biometric categorization, emotion recognition or deepfakes'
        : 'Notifica esplicita per riconoscimento emozioni, categorizzazione o deepfake',
      description: isEn
        ? 'Notify exposed individuals before processing and ensure GDPR legal basis (Art. 9) and explicit labeling of manipulated media.'
        : 'Informa preventivamente le persone fisiche esposte al sistema, verifica la base giuridica GDPR (Art. 9) ed etichetta in modo visibile i contenuti deepfake.',
      priority: 'mandatory',
    });
  }

  return items;
}

function buildAiLiteracyEvidence(lang: 'it' | 'en'): AiActEvidenceItem {
  const isEn = lang === 'en';
  return {
    id: 'art4-ai-literacy',
    articleRef: 'Art. 4',
    title: isEn
      ? 'AI literacy and operational guidelines for staff'
      : 'Alfabetizzazione AI del personale e linee guida operative',
    description: isEn
      ? 'Ensure staff and contractors operating or reviewing the AI system understand its capabilities, limits, hallucination risks and data-protection rules (applicable since 2 February 2025).'
      : 'Garantisci che il personale e i collaboratori che utilizzano o supervisionano il sistema AI conoscano capacità, limiti tecnici, rischio di allucinazioni e regole sul trattamento dei dati (obbligo applicabile dal 2 febbraio 2025).',
    priority: 'mandatory',
  };
}

export function classifyAiActUseCase(
  input: AiActClassifierInput,
  lang: 'it' | 'en' = 'it',
): AiActClassificationResult {
  const isEn = lang === 'en';
  const domainLabel = isEn
    ? DOMAIN_LABELS_EN[input.annexIiiDomain]
    : DOMAIN_LABELS_IT[input.annexIiiDomain];

  // 1. Prohibited practices (Art. 5)
  if (input.prohibitedCheck !== 'none') {
    const prohibitionReasonIt: Record<Exclude<ProhibitedPractice, 'none'>, string> = {
      emotion_work_edu:
        'Il riconoscimento delle emozioni sul luogo di lavoro o negli istituti di istruzione è vietato dall’Art. 5(1)(f) (salvo stretti motivi medici o di sicurezza).',
      social_scoring_manipulative:
        'Il social scoring e i sistemi che usano tecniche subliminali/manipolative o sfruttano vulnerabilità specifiche sono vietati dall’Art. 5(1)(a)–(c).',
      biometric_scraping_categorization:
        'Lo scraping non mirato di immagini facciali, la categorizzazione biometrica su dati sensibili e la polizia predittiva basata solo sul profilo sono vietati dall’Art. 5(1)(d)–(g).',
    };
    const prohibitionReasonEn: Record<Exclude<ProhibitedPractice, 'none'>, string> = {
      emotion_work_edu:
        'Emotion recognition in the workplace or educational institutions is prohibited under Art. 5(1)(f) (unless strictly for medical or safety reasons).',
      social_scoring_manipulative:
        'Social scoring and systems deploying subliminal/manipulative techniques or exploiting vulnerabilities are prohibited under Art. 5(1)(a)–(c).',
      biometric_scraping_categorization:
        'Untargeted scraping of facial images, biometric categorization on sensitive attributes, and profile-only predictive policing are prohibited under Art. 5(1)(d)–(g).',
    };

    return {
      tier: 'prohibited',
      tierCode: 'TIER · ART. 5',
      badgeTone: 'danger',
      tierLabel: isEn
        ? 'Unacceptable Risk · Prohibited Practice (Art. 5)'
        : 'Rischio Inaccettabile · Pratica Vietata (Art. 5)',
      primaryArticle: 'Art. 5 Reg. (UE) 2024/1689',
      applicabilityTimeline: isEn
        ? 'Prohibition in force since 2 February 2025 (fines up to €35M or 7% of global turnover under Art. 99).'
        : 'Divieto applicabile dal 2 febbraio 2025 (sanzioni fino a 35M € o al 7% del fatturato globale ex Art. 99).',
      summary: isEn
        ? 'This use case triggers one of the prohibitions in Article 5 of the EU AI Act. It cannot be placed on the market, put into service, or used in the EU in its current form.'
        : 'Questo caso d’uso rientra tra le pratiche vietate dall’Articolo 5 dell’EU AI Act. Non può essere immesso sul mercato, messo in servizio né utilizzato nell’Unione Europea in questa configurazione.',
      rationale: [
        isEn
          ? prohibitionReasonEn[input.prohibitedCheck]
          : prohibitionReasonIt[input.prohibitedCheck],
        isEn
          ? 'Regardless of whether you act as provider or deployer, prohibited practices must be removed or redesigned before any deployment.'
          : 'Il divieto vale sia per chi sviluppa (Provider) sia per chi utilizza il sistema (Deployer) e prevale su ogni altra classificazione.',
      ],
      evidences: [
        {
          id: 'art5-redesign-blocker',
          articleRef: 'Art. 5',
          title: isEn
            ? 'Immediate scope redesign and removal of the prohibited feature'
            : 'Blocco del rilascio e riprogettazione del perimetro funzionale',
          description: isEn
            ? 'Remove the prohibited biometric, emotional or manipulative capability and replace it with objective, transparent operational metrics.'
            : 'Rimuovi la funzionalità biometrica, emotiva o manipolativa vietata e sostituiscila con metriche operative oggettive, verificabili e trasparenti.',
          priority: 'mandatory',
        },
        {
          id: 'art5-decommission-audit',
          articleRef: 'Art. 5 & Art. 99',
          title: isEn
            ? 'Documented non-use / decommissioning record'
            : 'Evidenza documentale di dismissione o esclusione d’uso',
          description: isEn
            ? 'If an off-the-shelf vendor tool includes this feature, disable it at tenant level and record the technical configuration and DPO sign-off.'
            : 'Se uno strumento di terze parti include questa funzione opzionale, disattivala a livello di tenant e conserva la prova tecnica della disattivazione con validazione DPO/legale.',
          priority: 'mandatory',
        },
      ],
      recommendedToolHref: isEn ? '/en/governed-ai' : '/ai-governata',
      recommendedToolLabel: isEn
        ? 'Review Governed AI architecture'
        : 'Approfondisci l’architettura di AI governata',
    };
  }

  // 2. High-Risk (Art. 6(1) Annex I OR Art. 6(2) Annex III without Art. 6(3) derogation)
  const isAnnexISafety = input.safetyComponent === 'annex_i_safety';
  const isAnnexIiiActive =
    input.annexIiiDomain !== 'none' && input.decisionAutonomy !== 'narrow_procedural';

  if (isAnnexISafety || isAnnexIiiActive) {
    const rationale: string[] = [];
    if (isAnnexISafety) {
      rationale.push(
        isEn
          ? 'The system acts as a safety component of a product covered by EU harmonization legislation in Annex I requiring third-party conformity assessment (Art. 6(1)).'
          : 'Il sistema opera come componente di sicurezza di un prodotto disciplinato dalla normativa di armonizzazione UE dell’Allegato I soggetto a valutazione di conformità di terzi (Art. 6(1)).',
      );
    }
    if (isAnnexIiiActive) {
      rationale.push(
        isEn
          ? `The use case falls under a high-impact domain: ${domainLabel}.`
          : `Il caso d’uso rientra in un ambito ad alto impatto: ${domainLabel}.`,
      );
      rationale.push(
        input.decisionAutonomy === 'profiles_individuals'
          ? isEn
            ? 'Because the system performs profiling of natural persons, the Art. 6(3) exemption never applies.'
            : 'Poiché il sistema effettua profilazione di persone fisiche, la deroga dell’Art. 6(3) è sempre esclusa per legge.'
          : isEn
            ? 'The AI output materially influences the decision outcome, triggering full High-Risk obligations under Art. 6(2).'
            : 'L’output del sistema influenza materialmente la decisione finale, attivando gli obblighi completi per i sistemi ad Alto Rischio ex Art. 6(2).',
      );
    }

    const isProviderLike =
      input.operatorRole === 'provider' || input.operatorRole === 'product_manufacturer';

    const roleEvidences: AiActEvidenceItem[] = isProviderLike
      ? [
          {
            id: 'art9-risk-management',
            articleRef: 'Art. 9 & Art. 10',
            title: isEn
              ? 'Continuous risk management system & data governance'
              : 'Sistema di gestione dei rischi continuo e governance dei dati',
            description: isEn
              ? 'Maintain an iterative risk register across the lifecycle, document training/validation datasets, and test for biases and edge cases.'
              : 'Mantieni un registro dei rischi iterativo lungo l’intero ciclo di vita, documenta la provenienza dei dataset e verifica assenza di bias discriminatori.',
            priority: 'mandatory',
          },
          {
            id: 'art11-12-tech-doc-logs',
            articleRef: 'Art. 11, Art. 12 & Allegato IV',
            title: isEn
              ? 'Annex IV technical documentation and automatic event logging'
              : 'Fascicolo tecnico Allegato IV e logging automatico degli eventi',
            description: isEn
              ? 'Prepare the Annex IV technical file before market placement and build immutable logging of system operation, reference databases and human verifiers.'
              : 'Redigi la documentazione tecnica conforme all’Allegato IV e implementa la registrazione automatica degli eventi (traceability log, database di riferimento, revisori umani).',
            priority: 'mandatory',
          },
          {
            id: 'art13-15-oversight-security',
            articleRef: 'Art. 13, Art. 14 & Art. 15',
            title: isEn
              ? 'Instructions for deployers, Human-in-the-Loop controls & cybersecurity'
              : 'Istruzioni per i deployer, presidi Human-in-the-Loop e robustezza',
            description: isEn
              ? 'Provide clear instructions for use, build stop/override mechanisms against automation bias, and test resilience against prompt injection or data poisoning.'
              : 'Fornisci istruzioni d’uso trasparenti ai deployer, integra comandi di override/stop contro l’automation bias e testa la resilienza contro prompt injection e poisoning.',
            priority: 'mandatory',
          },
          {
            id: 'art43-49-conformity-eu-db',
            articleRef: 'Art. 16, Art. 43 & Art. 49',
            title: isEn
              ? 'Conformity assessment, CE marking and EU database registration'
              : 'Valutazione di conformità, marcatura CE e registrazione nel database UE',
            description: isEn
              ? 'Complete the conformity assessment procedure, draw up the EU declaration of conformity (Art. 47) and register the system in the EU database before release.'
              : 'Completa la valutazione di conformità, redigi la dichiarazione UE di conformità (Art. 47) e registra il sistema nella banca dati UE prima della messa in servizio.',
            priority: 'mandatory',
          },
        ]
      : [
          {
            id: 'art26-oversight-instructions',
            articleRef: 'Art. 26(1)–(4)',
            title: isEn
              ? 'Compliance with provider instructions & qualified human oversight'
              : 'Uso conforme alle istruzioni e supervisione umana qualificata',
            description: isEn
              ? 'Implement technical and organizational measures per the provider instructions, assign human oversight to trained personnel with authority to override outputs, and verify input data relevance.'
              : 'Adotta misure tecniche e organizzative conformi alle istruzioni del fornitore, assegna la supervisione umana a personale formato con potere di intervento e verifica la pertinenza dei dati di input.',
            priority: 'mandatory',
          },
          {
            id: 'art26-log-retention',
            articleRef: 'Art. 26(5)–(6)',
            title: isEn
              ? 'Operational monitoring, incident reporting and 6-month log retention'
              : 'Monitoraggio operativo, gestione incidenti e conservazione log (≥ 6 mesi)',
            description: isEn
              ? 'Keep automatically generated logs under your control for at least 6 months and immediately suspend use and notify the provider if a serious risk or incident arises.'
              : 'Conserva i log generati automaticamente sotto il tuo controllo per almeno 6 mesi e sospendi l’uso segnalando al fornitore eventuali rischi gravi o incidenti.',
            priority: 'mandatory',
          },
          {
            id: 'art26-27-fria-dpia-workers',
            articleRef: 'Art. 26(7)–(9) & Art. 27',
            title: isEn
              ? 'DPIA coordination, workplace notice & Fundamental Rights Impact Assessment (FRIA)'
              : 'Coordinamento DPIA GDPR, informativa lavoratori e FRIA (Art. 27)',
            description: isEn
              ? 'Use the provider documentation to conduct your GDPR DPIA, inform workers/representatives before workplace deployment, and complete the FRIA if you are a public body or provide essential/credit/insurance services.'
              : 'Usa le informazioni del fornitore per redigere la DPIA GDPR, informa preventivamente i lavoratori/rappresentanti (se usato in azienda) ed esegui la valutazione d’impatto sui diritti fondamentali (FRIA) per servizi essenziali, credito o assicurazioni.',
            priority: 'mandatory',
          },
        ];

    return {
      tier: 'high_risk',
      tierCode: 'TIER · ART. 6',
      badgeTone: 'warning',
      tierLabel: isEn
        ? 'High-Risk AI System (Art. 6 & Annex I / III)'
        : 'Sistema AI ad Alto Rischio (Art. 6 e Allegato I / III)',
      primaryArticle: isAnnexISafety
        ? 'Art. 6(1) & Allegato I Reg. (UE) 2024/1689'
        : 'Art. 6(2) & Allegato III Reg. (UE) 2024/1689',
      applicabilityTimeline: isEn
        ? 'Annex III obligations apply from 2 August 2026; Annex I regulated products from 2 August 2027.'
        : 'Obblighi Allegato III applicabili dal 2 agosto 2026; prodotti regolamentati Allegato I dal 2 agosto 2027.',
      summary: isEn
        ? 'This system falls into the High-Risk tier. Before production release, you must establish traceable governance, human oversight, logging, and formal compliance documentation tailored to your role (Provider vs Deployer).'
        : 'Il sistema ricade nella fascia ad Alto Rischio. Prima della messa in produzione richiede presidi tecnici verificabili, supervisione umana effettiva, conservazione dei log e un fascicolo di evidenze calibrato sul tuo ruolo (Provider o Deployer).',
      rationale,
      evidences: [
        ...roleEvidences,
        ...buildTransparencyEvidences(input.transparencyTrigger, lang),
        buildAiLiteracyEvidence(lang),
      ],
      recommendedToolHref: isEn ? '/en/tools/ai-risk-checklist' : '/tools/ai-risk-checklist',
      recommendedToolLabel: isEn
        ? 'Run the technical AI Risk & Privacy Checklist'
        : 'Esegui la Checklist tecnica rischio AI e privacy',
    };
  }

  // 3. Annex III domain but narrow procedural / preparatory task without profiling (Art. 6(3) derogation)
  if (input.annexIiiDomain !== 'none' && input.decisionAutonomy === 'narrow_procedural') {
    return {
      tier: 'annex_iii_derogation',
      tierCode: 'TIER · ART. 6(3)',
      badgeTone: 'info',
      tierLabel: isEn
        ? 'Annex III Domain · Candidate for Documented Exemption (Art. 6(3))'
        : 'Ambito Allegato III · Candidato a Deroga Documentata (Art. 6(3))',
      primaryArticle: 'Art. 6(3) & Art. 49(2) Reg. (UE) 2024/1689',
      applicabilityTimeline: isEn
        ? 'Self-assessment documentation and EU registration required before putting into service (by 2 August 2026).'
        : 'Autovalutazione documentata e registrazione obbligatorie prima della messa in servizio (entro il 2 agosto 2026).',
      summary: isEn
        ? 'The use case touches an Annex III sector, but because it only performs a narrow procedural or preparatory task without profiling natural persons, it can qualify for the Art. 6(3) exemption — provided you formally document the assessment beforehand.'
        : 'Il caso d’uso opera in un settore dell’Allegato III, ma svolge solo un compito procedurale ristretto o preparatorio senza profilazione di persone fisiche. Può beneficiare della deroga dell’Art. 6(3), a condizione di documentare formalmente la valutazione prima dell’uso.',
      rationale: [
        isEn
          ? `Sector involved: ${domainLabel}.`
          : `Settore coinvolto: ${domainLabel}.`,
        isEn
          ? 'Under Art. 6(3), an Annex III system is not considered high-risk if it does not pose a significant risk to health, safety or fundamental rights (narrow procedural task, preparatory task, or quality improvement of prior human activity) and does NOT profile individuals.'
          : 'Ai sensi dell’Art. 6(3), un sistema in ambito Allegato III non è considerato ad alto rischio se esegue un compito procedurale ristretto o preparatorio, non influenza materialmente la decisione senza revisione e NON effettua profilazione.',
      ],
      evidences: [
        {
          id: 'art6-3-documented-assessment',
          articleRef: 'Art. 6(3)–(4)',
          title: isEn
            ? 'Written Art. 6(3) non-high-risk justification dossier'
            : 'Fascicolo scritto di giustificazione della deroga Art. 6(3)',
          description: isEn
            ? 'Document why the system does not materially influence decisions or perform profiling before placing it on the market or putting it into service, ready for supervisory authority inspection.'
            : 'Documenta prima della messa in servizio perché il sistema svolge solo un’attività procedurale/preparatoria e non effettua profilazione, conservando il documento a disposizione delle autorità.',
          priority: 'mandatory',
        },
        {
          id: 'art49-2-registration',
          articleRef: 'Art. 49(2)',
          title: isEn
            ? 'Summary registration in the EU database (for Providers)'
            : 'Registrazione sintetica nella banca dati UE (per i Provider)',
          description: isEn
            ? 'Providers relying on the Art. 6(3) exemption must still register the system and the summary justification in the EU database under Art. 49(2).'
            : 'I fornitori che si avvalgono della deroga dell’Art. 6(3) sono comunque tenuti a registrare il sistema e la sintesi della motivazione nella banca dati UE ex Art. 49(2).',
          priority: 'mandatory',
        },
        ...buildTransparencyEvidences(input.transparencyTrigger, lang),
        buildAiLiteracyEvidence(lang),
      ],
      recommendedToolHref: isEn ? '/en/tools/ai-risk-checklist' : '/tools/ai-risk-checklist',
      recommendedToolLabel: isEn
        ? 'Verify technical guardrails with the AI Risk Checklist'
        : 'Verifica i guardrail tecnici con la Checklist rischio AI',
    };
  }

  // 4. Limited / Specific Transparency Risk (Art. 50)
  if (input.transparencyTrigger !== 'none') {
    return {
      tier: 'limited_transparency',
      tierCode: 'TIER · ART. 50',
      badgeTone: 'info',
      tierLabel: isEn
        ? 'Transparency Risk · Specific Disclosure Obligations (Art. 50)'
        : 'Rischio Specifico di Trasparenza · Obblighi Informativi (Art. 50)',
      primaryArticle: 'Art. 50 & Art. 4 Reg. (UE) 2024/1689',
      applicabilityTimeline: isEn
        ? 'Art. 4 AI literacy applies since 2 February 2025; Art. 50 transparency obligations apply from 2 August 2026.'
        : 'Alfabetizzazione AI (Art. 4) applicabile dal 2 febbraio 2025; obblighi di trasparenza (Art. 50) dal 2 agosto 2026.',
      summary: isEn
        ? 'The system is not High-Risk, but because it interacts directly with people or generates synthetic content, it must comply with the transparency and marking obligations of Article 50.'
        : 'Il sistema non rientra nell’Alto Rischio, ma poiché interagisce direttamente con gli utenti o genera contenuti sintetici è soggetto agli obblighi specifici di trasparenza e marcatura dell’Articolo 50.',
      rationale: [
        isEn
          ? 'Outside Annex I safety components and Annex III high-impact domains.'
          : 'Il caso d’uso è esterno sia ai componenti di sicurezza (Allegato I) sia ai settori critici dell’Allegato III.',
        isEn
          ? 'Direct user interaction or synthetic media generation triggers Art. 50 disclosure and watermarking rules.'
          : 'L’interazione con gli utenti o la generazione di contenuti sintetici attiva gli obblighi di trasparenza e riconoscibilità dell’Art. 50.',
      ],
      evidences: [
        ...buildTransparencyEvidences(input.transparencyTrigger, lang),
        buildAiLiteracyEvidence(lang),
        {
          id: 'gdpr-prompt-hygiene',
          articleRef: 'GDPR Art. 5 & Art. 25',
          title: isEn
            ? 'Data minimization, prompt boundary and source grounding'
            : 'Minimizzazione dati GDPR, perimetro dei prompt e controllo delle fonti',
          description: isEn
            ? 'Restrict the assistant to approved knowledge sources, block PII leakage in prompts, and log interactions according to your retention policy.'
            : 'Limita l’assistente a fonti documentali verificate, previeni l’invio di PII nei prompt e definisci una policy di conservazione dei log.',
          priority: 'recommended',
        },
      ],
      recommendedToolHref: isEn ? '/en/tools/prompt-sanitizer' : '/tools/prompt-sanitizer',
      recommendedToolLabel: isEn
        ? 'Try the Local Prompt Sanitizer (PII-06)'
        : 'Prova il Sanitizzatore Prompt e PII (PII-06)',
    };
  }

  // 5. Minimal Risk (Art. 4 + Art. 95 voluntary codes)
  return {
    tier: 'minimal_risk',
    tierCode: 'TIER · ART. 4 & 95',
    badgeTone: 'success',
    tierLabel: isEn
      ? 'Minimal Risk · AI Literacy & Internal Governance (Art. 4)'
      : 'Rischio Minimo · Alfabetizzazione AI e Governance Interna (Art. 4)',
    primaryArticle: 'Art. 4 & Art. 95 Reg. (UE) 2024/1689',
    applicabilityTimeline: isEn
      ? 'Art. 4 AI literacy applies since 2 February 2025; no CE marking or EU database registration required.'
      : 'Alfabetizzazione AI (Art. 4) applicabile dal 2 febbraio 2025; nessuna marcatura CE o registrazione UE richiesta.',
    summary: isEn
      ? 'This use case falls into the Minimal Risk tier under the EU AI Act. It does not require conformity assessment or Art. 50 public disclosures, but still requires staff AI literacy (Art. 4) and GDPR/security guardrails.'
      : 'Questo caso d’uso rientra nella fascia di Rischio Minimo dell’EU AI Act. Non richiede valutazioni di conformità né informative ex Art. 50, ma resta soggetto all’obbligo di alfabetizzazione AI del personale (Art. 4) e alle regole GDPR e di sicurezza tecnica.',
    rationale: [
      isEn
        ? 'No prohibited practices (Art. 5), no regulated safety component (Annex I), and outside Annex III domains.'
        : 'Assenza di pratiche vietate (Art. 5), nessun componente di sicurezza regolamentato (Allegato I) e ambito esterno all’Allegato III.',
      isEn
        ? 'Back-office or internal workflow without unannounced AI interaction or public synthetic media.'
        : 'Flusso operativo interno o di back-office senza interazione inconsapevole con il pubblico né diffusione di media sintetici.',
    ],
    evidences: [
      buildAiLiteracyEvidence(lang),
      {
        id: 'internal-ai-policy-gdpr',
        articleRef: 'Art. 95 & GDPR',
        title: isEn
          ? 'Internal AI usage policy, PII minimization and vendor review'
          : 'Policy interna d’uso AI, minimizzazione PII e verifica dei fornitori',
        description: isEn
          ? 'Document approved models, forbid pasting unredacted personal data or secrets into external LLMs, and verify vendor data-retention clauses.'
          : 'Definisci i modelli approvati in azienda, vieta l’inserimento di dati personali o segreti non redatti in LLM esterni e verifica le clausole di data retention dei fornitori.',
        priority: 'recommended',
      },
    ],
    recommendedToolHref: isEn ? '/en/tools/prompt-sanitizer' : '/tools/prompt-sanitizer',
    recommendedToolLabel: isEn
      ? 'Sanitize prompts before sending to LLMs'
      : 'Sanitizza i prompt prima dell’invio a un LLM',
  };
}

export function formatAiActReport(
  result: AiActClassificationResult,
  lang: 'it' | 'en' = 'it',
): string {
  const isEn = lang === 'en';
  const header = isEn
    ? `EU AI ACT PRELIMINARY CLASSIFICATION (${result.tierCode})`
    : `CLASSIFICAZIONE PRELIMINARE EU AI ACT (${result.tierCode})`;
  const tierLine = `${isEn ? 'Tier' : 'Fascia'}: ${result.tierLabel}`;
  const refLine = `${isEn ? 'Primary reference' : 'Riferimento normativo'}: ${result.primaryArticle}`;
  const timelineLine = `${isEn ? 'Timeline' : 'Scadenze'}: ${result.applicabilityTimeline}`;
  const rationaleHeader = isEn ? 'Rationale:' : 'Motivazione:';
  const rationaleLines = result.rationale.map((line) => `- ${line}`).join('\n');
  const evidenceHeader = isEn ? 'Required evidence & actions:' : 'Evidenze e azioni richieste:';
  const evidenceLines = result.evidences
    .map((ev) => `- [${ev.articleRef}] ${ev.title}: ${ev.description}`)
    .join('\n');

  return [
    header,
    tierLine,
    refLine,
    timelineLine,
    '',
    result.summary,
    '',
    rationaleHeader,
    rationaleLines,
    '',
    evidenceHeader,
    evidenceLines,
  ].join('\n');
}
