/**
 * Hero copy for `/landing/devisia`, keyed by the `utm_content` value carried by
 * the three LinkedIn creatives. Resolved server-side so the variant is part of
 * the first HTML response: no client swap, no content flash, no layout shift.
 */

export type DevisiaHeroVariant = 'processi' | 'ai' | 'integrazioni';

export type DevisiaHero = {
  title: string;
  lede: string;
};

export const devisiaHeroDefault: DevisiaHero = {
  title: 'Un partner che tiene insieme software, AI e controllo operativo.',
  lede: 'Partiamo dal processo critico: mettiamo a fuoco architettura, priorità e prossimo passo concreto, senza forzare soluzioni preconfezionate.',
};

export const devisiaHeroVariants: Record<DevisiaHeroVariant, DevisiaHero> = {
  processi: {
    title: 'Meno passaggi manuali. Più controllo.',
    lede: 'Software e automazioni costruiti partendo dal processo reale, dai ruoli e dai dati che devono attraversarlo.',
  },
  ai: {
    title: 'AI in azienda. Con controllo.',
    lede: 'Integrare l’AI significa definire quali dati può utilizzare, chi può accedere e come restano visibili responsabilità e attività.',
  },
  integrazioni: {
    title: 'I sistemi devono parlarsi.',
    lede: 'Colleghiamo ERP, Microsoft 365, applicazioni e API per ridurre duplicazioni e passaggi manuali.',
  },
};

export const devisiaHeroVariantKeys = Object.keys(devisiaHeroVariants) as DevisiaHeroVariant[];

const isVariantKey = (value: string): value is DevisiaHeroVariant =>
  Object.prototype.hasOwnProperty.call(devisiaHeroVariants, value);

/** Falls back to the default hero for direct visits and unknown values. */
export function resolveDevisiaHero(utmContent: string | null | undefined): DevisiaHero {
  if (typeof utmContent !== 'string') return devisiaHeroDefault;
  const key = utmContent.trim().toLowerCase();
  if (!key || !isVariantKey(key)) return devisiaHeroDefault;
  return devisiaHeroVariants[key];
}
