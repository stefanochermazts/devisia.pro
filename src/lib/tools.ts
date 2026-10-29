export type ToolCategory = 'ai' | 'governance' | 'operations';

export interface MicroTool {
  id: string;
  code: string;
  instrumentTag: string;
  category: ToolCategory;
  categoryLabel: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  perimeterBadge: string;
  inputSpec: string;
  guardrailSpec: string;
  outputSpec: string;
  ctaLabel: string;
  relatedServiceHref: string;
  relatedServiceLabel: string;
  featuredOnHome: boolean;
}

export interface UpcomingMicroTool {
  id: string;
  instrumentTag: string;
  category: ToolCategory;
  categoryLabel: string;
  title: string;
  description: string;
  targetIntent: string;
  outputPreview: string;
  relatedPillarHref: string;
  relatedPillarLabel: string;
}

const toolsIt: MicroTool[] = [
  {
    id: 'ai-structure',
    code: '01',
    instrumentTag: 'AIT-01',
    category: 'ai',
    categoryLabel: 'AI e Architettura',
    title: 'AI Structure: da idea a prima struttura tecnica',
    shortTitle: 'AI Structure',
    description:
      'Trasforma un processo o un caso d’uso AI in una prima lettura tecnica di dominio, flussi, rischi privacy e vincoli architetturali prima di scrivere codice.',
    href: '/ai-structure',
    perimeterBadge: 'Analisi guidata · Zero dati sensibili',
    inputSpec: 'Idea o processo (80–1500 caratteri)',
    guardrailSpec: 'Perimetro senza segreti/PII + scomposizione dominio',
    outputSpec: 'Panoramica sistema, modello dominio, flussi e rischi',
    ctaLabel: 'Apri AI Structure',
    relatedServiceHref: '/ai-governata',
    relatedServiceLabel: 'AI governata',
    featuredOnHome: true,
  },
  {
    id: 'ai-risk-checklist',
    code: '02',
    instrumentTag: 'RIC-02',
    category: 'governance',
    categoryLabel: 'Governance e Compliance',
    title: 'Checklist rischio AI e privacy',
    shortTitle: 'Checklist rischio AI e privacy',
    description:
      'Valuta in 8 parametri sensibilità dei dati, impatto degli output, supervisione umana, accessi, logging e retention per ottenere le misure di sicurezza consigliate.',
    href: '/tools/ai-risk-checklist',
    perimeterBadge: '100% nel browser · Nessun salvataggio',
    inputSpec: '8 criteri operativi (dati, input, impatto, controllo)',
    guardrailSpec: 'Matrice di rischio deterministica locale',
    outputSpec: 'Livello di rischio + salvaguardie tecniche prioritizzate',
    ctaLabel: 'Avvia la checklist',
    relatedServiceHref: '/compliance-auditabilita',
    relatedServiceLabel: 'Compliance e auditabilità',
    featuredOnHome: true,
  },
  {
    id: 'linkedin-post-formatter',
    code: '03',
    instrumentTag: 'FMT-03',
    category: 'operations',
    categoryLabel: 'Operatività e Testo',
    title: 'LinkedIn Post Formatter',
    shortTitle: 'LinkedIn Post Formatter',
    description:
      'Sistema a-capo, spaziature, elenchi puntati, hook e leggibilità mobile di un post LinkedIn senza inviare bozze a server esterni.',
    href: '/tools/linkedin-post-formatter',
    perimeterBadge: '100% nel browser · Privacy-first',
    inputSpec: 'Bozza testuale o appunti non strutturati',
    guardrailSpec: 'Controllo ritmo, hook, liste e densità paragrafi',
    outputSpec: 'Testo formattato con anteprima mobile e copia rapida',
    ctaLabel: 'Formatta un post',
    relatedServiceHref: '/blog/come-formattare-un-post-linkedin-guida-rapida',
    relatedServiceLabel: 'Guida rapida formattazione',
    featuredOnHome: true,
  },
  {
    id: 'prompt-pii-sanitizer',
    code: '04',
    instrumentTag: 'PII-06',
    category: 'ai',
    categoryLabel: 'AI e Architettura',
    title: 'Sanitizzatore prompt e redazione PII',
    shortTitle: 'Sanitizzatore prompt',
    description:
      'Sostituisce nel browser email, codici fiscali, P.IVA, IBAN, telefoni, chiavi, indirizzi e nomi prima di incollare un testo in un LLM, e rimette i marcatori della legenda nella risposta.',
    href: '/tools/prompt-sanitizer',
    perimeterBadge: '100% nel browser · Legenda solo in memoria',
    inputSpec: 'Prompt, log o ticket incollato',
    guardrailSpec: 'Rilevatori locali e segnaposto stabili, senza invio',
    outputSpec: 'Testo redatto, legenda locale e risposta con i marcatori rimessi',
    ctaLabel: 'Apri il sanitizzatore',
    relatedServiceHref: '/ai-governata',
    relatedServiceLabel: 'AI governata',
    featuredOnHome: true,
  },
];

const toolsEn: MicroTool[] = [
  {
    id: 'ai-structure',
    code: '01',
    instrumentTag: 'AIT-01',
    category: 'ai',
    categoryLabel: 'AI & Architecture',
    title: 'AI Structure: from idea to first technical structure',
    shortTitle: 'AI Structure',
    description:
      'Turn a process or AI use case into an initial technical reading of domain model, key flows, privacy risks and architectural constraints before writing code.',
    href: '/en/ai-structure',
    perimeterBadge: 'Guided analysis · Zero sensitive data',
    inputSpec: 'Idea or process (80–1500 characters)',
    guardrailSpec: 'No-secret/PII perimeter + domain decomposition',
    outputSpec: 'System overview, domain model, key flows and risks',
    ctaLabel: 'Open AI Structure',
    relatedServiceHref: '/en/governed-ai',
    relatedServiceLabel: 'Governed AI',
    featuredOnHome: true,
  },
  {
    id: 'ai-risk-checklist',
    code: '02',
    instrumentTag: 'RIC-02',
    category: 'governance',
    categoryLabel: 'Governance & Compliance',
    title: 'AI Risk & Privacy Checklist',
    shortTitle: 'AI Risk & Privacy Checklist',
    description:
      'Assess data sensitivity, output impact, human oversight, access control, logging and retention across 8 criteria to generate prioritized technical safeguards.',
    href: '/en/tools/ai-risk-checklist',
    perimeterBadge: '100% in-browser · Zero storage',
    inputSpec: '8 operational criteria (data, input, impact, oversight)',
    guardrailSpec: 'Client-side deterministic risk matrix',
    outputSpec: 'Risk score + prioritized technical safeguards',
    ctaLabel: 'Run the checklist',
    relatedServiceHref: '/en/compliance-auditability',
    relatedServiceLabel: 'Compliance & auditability',
    featuredOnHome: true,
  },
  {
    id: 'linkedin-post-formatter',
    code: '03',
    instrumentTag: 'FMT-03',
    category: 'operations',
    categoryLabel: 'Operations & Copy',
    title: 'LinkedIn Post Formatter',
    shortTitle: 'LinkedIn Post Formatter',
    description:
      'Clean up line breaks, spacing, bullet lists, hooks and mobile readability for LinkedIn posts without sending drafts to external servers.',
    href: '/en/tools/linkedin-post-formatter',
    perimeterBadge: '100% in-browser · Privacy-first',
    inputSpec: 'Raw text draft or unstructured notes',
    guardrailSpec: 'Hook, rhythm, bullet and paragraph density check',
    outputSpec: 'Formatted post with mobile preview and one-click copy',
    ctaLabel: 'Format a post',
    relatedServiceHref: '/en/blog',
    relatedServiceLabel: 'Insights',
    featuredOnHome: true,
  },
  {
    id: 'prompt-pii-sanitizer',
    code: '04',
    instrumentTag: 'PII-06',
    category: 'ai',
    categoryLabel: 'AI & Architecture',
    title: 'Local prompt sanitizer and PII redactor',
    shortTitle: 'Prompt sanitizer',
    description:
      'Replace emails, tax IDs, IBANs, phone numbers, secrets, addresses and names in the browser before pasting text into an LLM, then put the legend markers back into the reply.',
    href: '/en/tools/prompt-sanitizer',
    perimeterBadge: '100% in-browser · Legend stays in memory',
    inputSpec: 'Pasted prompt, log or ticket',
    guardrailSpec: 'Local detectors and stable placeholders, nothing sent',
    outputSpec: 'Redacted text, local legend, and a reply with markers restored',
    ctaLabel: 'Open the sanitizer',
    relatedServiceHref: '/en/governed-ai',
    relatedServiceLabel: 'Governed AI',
    featuredOnHome: true,
  },
];

const upcomingToolsIt: UpcomingMicroTool[] = [
  {
    id: 'eu-ai-act-classifier',
    instrumentTag: 'CLS-05',
    category: 'governance',
    categoryLabel: 'Governance e Compliance',
    title: 'Classificatore livello di rischio EU AI Act',
    description:
      'Verifica rapida per capire se un caso d’uso AI rientra tra pratiche vietate, alto rischio (Allegato III), obblighi di trasparenza (Art. 50) o rischio minimo.',
    targetIntent: 'Classificazione AI Act e obblighi documentali',
    outputPreview: 'Fascia normativa + checklist di evidenze richieste',
    relatedPillarHref: '/ai-governata',
    relatedPillarLabel: 'AI governata',
  },
  {
    id: 'nis2-dora-scope-check',
    instrumentTag: 'N2D-07',
    category: 'governance',
    categoryLabel: 'Governance e Compliance',
    title: 'Autovalutazione perimetro NIS2, DORA e prontezza evidenze',
    description:
      'Stima se l’organizzazione o la catena di fornitura IT rientra nei requisiti NIS2/DORA e misura il livello di tracciabilità delle prove operative.',
    targetIntent: 'Verifica applicabilità NIS2/DORA e gap analysis evidenze',
    outputPreview: 'Mappa di esposizione + priorità di raccolta prove (AuditReady)',
    relatedPillarHref: '/prodotti/auditready',
    relatedPillarLabel: 'AuditReady',
  },
  {
    id: 'dpia-threshold-evaluator',
    instrumentTag: 'DPA-08',
    category: 'governance',
    categoryLabel: 'Governance e Compliance',
    title: 'Valutatore soglia DPIA (GDPR Art. 35) per software e AI',
    description:
      'Applica i 9 criteri EDPB/Garante (scoring, decisioni automatizzate, dati vulnerabili, larga scala, matching) per capire quando la DPIA è obbligatoria.',
    targetIntent: 'Valutazione d’impatto privacy (DPIA) prima dello sviluppo',
    outputPreview: 'Indice criteri superati + schema sintetico pre-DPIA esportabile',
    relatedPillarHref: '/compliance-auditabilita',
    relatedPillarLabel: 'Compliance e auditabilità',
  },
  {
    id: 'copilot-m365-readiness',
    instrumentTag: 'M36-09',
    category: 'ai',
    categoryLabel: 'AI e Architettura',
    title: 'Checklist Readiness Microsoft 365 Copilot e SharePoint',
    description:
      'Analizza permessi SharePoint, rischio di oversharing, struttura librerie e regole di ciclo di vita documentale prima di abilitare Copilot aziendale.',
    targetIntent: 'Governance SharePoint e preparazione Microsoft 365 Copilot',
    outputPreview: 'Score di igiene permessi + piano di messa in sicurezza librerie',
    relatedPillarHref: '/sharepoint-microsoft-365-laravel',
    relatedPillarLabel: 'M365 e Laravel',
  },
  {
    id: 'build-vs-buy-matrix',
    instrumentTag: 'BVB-10',
    category: 'operations',
    categoryLabel: 'Operatività e Testo',
    title: 'Matrice decisionale: SaaS vs Power Automate vs Software su misura',
    description:
      'Confronta vincoli di processo, integrazioni API, TCO a 36 mesi e rischio di lock-in per scegliere tra strumento pronto, automazione M365 o web app dedicata.',
    targetIntent: 'Scelta architetturale Build vs Buy e stima complessità',
    outputPreview: 'Raccomandazione motivata + rischi operativi da presidiare',
    relatedPillarHref: '/cosa-facciamo',
    relatedPillarLabel: 'Cosa facciamo',
  },
];

const upcomingToolsEn: UpcomingMicroTool[] = [
  {
    id: 'eu-ai-act-classifier',
    instrumentTag: 'CLS-05',
    category: 'governance',
    categoryLabel: 'Governance & Compliance',
    title: 'EU AI Act Risk Tier Classifier',
    description:
      'Quick assessment to check whether an AI use case falls under prohibited practices, high-risk (Annex III), transparency obligations (Art. 50) or minimal risk.',
    targetIntent: 'EU AI Act classification and documentation readiness',
    outputPreview: 'Regulatory tier + required evidence checklist',
    relatedPillarHref: '/en/governed-ai',
    relatedPillarLabel: 'Governed AI',
  },
  {
    id: 'nis2-dora-scope-check',
    instrumentTag: 'N2D-07',
    category: 'governance',
    categoryLabel: 'Governance & Compliance',
    title: 'NIS2 & DORA Scope and Evidence Readiness Check',
    description:
      'Estimate whether your organization or IT supply chain falls under NIS2/DORA requirements and measure the traceability of your operational evidence.',
    targetIntent: 'NIS2/DORA applicability check and evidence gap analysis',
    outputPreview: 'Exposure map + evidence collection priorities (AuditReady)',
    relatedPillarHref: '/en/products/auditready',
    relatedPillarLabel: 'AuditReady',
  },
  {
    id: 'dpia-threshold-evaluator',
    instrumentTag: 'DPA-08',
    category: 'governance',
    categoryLabel: 'Governance & Compliance',
    title: 'GDPR Art. 35 DPIA Threshold Evaluator for Software & AI',
    description:
      'Apply the 9 EDPB criteria (scoring, automated decisions, vulnerable subjects, large-scale processing, dataset matching) to see when a formal DPIA is mandatory.',
    targetIntent: 'Privacy Impact Assessment (DPIA) screening before development',
    outputPreview: 'Triggered criteria count + exportable pre-DPIA summary schema',
    relatedPillarHref: '/en/compliance-auditability',
    relatedPillarLabel: 'Compliance & auditability',
  },
  {
    id: 'copilot-m365-readiness',
    instrumentTag: 'M36-09',
    category: 'ai',
    categoryLabel: 'AI & Architecture',
    title: 'Microsoft 365 Copilot & SharePoint Readiness Checklist',
    description:
      'Evaluate SharePoint permissions, oversharing exposure, library structure and document lifecycle rules before enabling Microsoft 365 Copilot.',
    targetIntent: 'SharePoint governance and Microsoft 365 Copilot preparation',
    outputPreview: 'Permission hygiene score + library hardening action plan',
    relatedPillarHref: '/en/sharepoint-microsoft-365-laravel',
    relatedPillarLabel: 'M365 & Laravel',
  },
  {
    id: 'build-vs-buy-matrix',
    instrumentTag: 'BVB-10',
    category: 'operations',
    categoryLabel: 'Operations & Copy',
    title: 'Decision Matrix: SaaS vs Power Automate vs Custom Software',
    description:
      'Compare process constraints, API integrations, 36-month TCO and vendor lock-in risk to choose between off-the-shelf SaaS, M365 automation or a custom Laravel app.',
    targetIntent: 'Build vs Buy architectural decision and complexity scoping',
    outputPreview: 'Grounded recommendation + operational risks to govern',
    relatedPillarHref: '/en/what-we-do',
    relatedPillarLabel: 'What we do',
  },
];

export function getMicroTools(lang: 'it' | 'en' = 'it'): MicroTool[] {
  return lang === 'en' ? toolsEn : toolsIt;
}

export function getHomeFeaturedTools(lang: 'it' | 'en' = 'it'): MicroTool[] {
  return getMicroTools(lang).filter((tool) => tool.featuredOnHome);
}

export function getUpcomingMicroTools(lang: 'it' | 'en' = 'it'): UpcomingMicroTool[] {
  return lang === 'en' ? upcomingToolsEn : upcomingToolsIt;
}

export function getToolCategories(lang: 'it' | 'en' = 'it'): Array<{ id: 'all' | ToolCategory; label: string; tag: string }> {
  if (lang === 'en') {
    return [
      { id: 'all', label: 'All flows', tag: 'ALL' },
      { id: 'ai', label: 'AI & Architecture', tag: 'TAG · AI' },
      { id: 'governance', label: 'Governance & Compliance', tag: 'TAG · CP' },
      { id: 'operations', label: 'Operations & Copy', tag: 'TAG · OP' },
    ];
  }
  return [
    { id: 'all', label: 'Tutti i flussi', tag: 'ALL' },
    { id: 'ai', label: 'AI e Architettura', tag: 'TAG · AI' },
    { id: 'governance', label: 'Governance e Compliance', tag: 'TAG · CP' },
    { id: 'operations', label: 'Operatività e Testo', tag: 'TAG · OP' },
  ];
}
