export const LEAD_INTERESTS = ['processi', 'auditready'] as const;

export type LeadInterest = (typeof LEAD_INTERESTS)[number];

export const LEAD_INTEREST_FIELDS: Record<LeadInterest, string> = {
  processi: 'interest_processi',
  auditready: 'interest_auditready',
};

export const LEAD_INTEREST_LABELS: Record<LeadInterest, string> = {
  processi: 'Processi e Microsoft 365',
  auditready: 'AuditReady',
};

export type LeadInterestSelection = LeadInterest | 'both';

/** Collapses the selected areas into the single case the copy has to address. */
export const selectionFromInterests = (
  interests: readonly LeadInterest[]
): LeadInterestSelection | null => {
  const hasProcessi = interests.includes('processi');
  const hasAuditReady = interests.includes('auditready');
  if (hasProcessi && hasAuditReady) return 'both';
  if (hasProcessi) return 'processi';
  if (hasAuditReady) return 'auditready';
  return null;
};

export const formatInterests = (interests: readonly LeadInterest[]): string =>
  LEAD_INTERESTS.filter((key) => interests.includes(key))
    .map((key) => LEAD_INTEREST_LABELS[key])
    .join(' + ');
