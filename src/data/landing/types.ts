export type LandingSlug =
  | 'sistemi-spiegabili'
  | 'governance-ai'
  | 'processi-prima-automazione'
  | 'evidenze-audit';

export type LandingSource =
  | 'landing_system_explainability'
  | 'landing_ai_governance'
  | 'landing_process_automation'
  | 'landing_audit_evidence';

export type LandingMethodStep = {
  label: string;
  text: string;
};

export type LandingPageConfig = {
  slug: LandingSlug;
  path: `/landing/${LandingSlug}`;
  source: LandingSource;
  formId: string;
  seo: {
    documentTitle: string;
    description: string;
    heroImage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    ctaLabel: string;
    imageAlt: string;
  };
  problem: {
    title: string;
    text: string;
  };
  checklist: {
    title: string;
    kind: 'questions' | 'signals' | 'model';
    items: string[];
  };
  method: {
    title: string;
    steps: LandingMethodStep[];
  };
  results: {
    title: string;
    items: string[];
  };
  form: {
    title: string;
    text: string;
    submitLabel: string;
  };
};
