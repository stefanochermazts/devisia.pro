export type LocalizedText = { it: string; en: string };

export type ShowcaseSlide = {
  /**
   * Percorso sotto `public/`, es. `/uploads/hooplytics/calendario.png`.
   * Lascia `null` finché non carichi lo screenshot.
   */
  image: string | null;
  imageAlt: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};

export const hooplyticsShowcase = {
  sectionTitle: {
    it: 'Mostra il prodotto',
    en: 'See the product',
  } satisfies LocalizedText,

  /** Slide del carousel: lunghezza libera (1, 3, 10…). Aggiungi o rimuovi oggetti qui. */
  slides: [
    {
      image: '/public/uploads/hooplytics/calendario.png',
      imageAlt: {
        it: 'Schermata calendario torneo con partite e gironi',
        en: 'Tournament schedule screen with games and groups',
      },
      title: {
        it: 'Calendario torneo',
        en: 'Tournament schedule',
      },
      description: {
        it: 'Gironi, partite programmate e tabellone playoff con la logica del basket.',
        en: 'Groups, scheduled games and playoff brackets with basketball logic.',
      },
    },
    {
      image: '/public/uploads/hooplytics/statistiche.jpg',
      imageAlt: {
        it: 'Tabellino di gara con statistiche individuali dei giocatori',
        en: 'Game box score with individual player statistics',
      },
      title: {
        it: 'Tabellino di gara',
        en: 'Game box score',
      },
      description: {
        it: 'Statistiche per giocatore, minuti e totali di squadra pronti per la pubblicazione.',
        en: 'Per-player stats, minutes and team totals ready for publishing.',
      },
    },
    {
      image: '/public/uploads/hooplytics/classifiche.jpg',
      imageAlt: {
        it: 'Classifica aggiornata del torneo con risultati e posizioni',
        en: 'Updated tournament standings with results and positions',
      },
      title: {
        it: 'Classifica live',
        en: 'Live standings',
      },
      description: {
        it: 'Posizioni, differenza reti e risultati aggiornati man mano che le partite si concludono.',
        en: 'Positions, point differential and results updated as games finish.',
      },
    },
    {
      image: '/public/uploads/hooplytics/app-rilevazione-poster.png',
      imageAlt: {
        it: 'Schermata rilevazione statistiche a bordocampo su mobile',
        en: 'Courtside statistics tracking screen on mobile',
      },
      title: {
        it: 'Rilevazione a bordocampo',
        en: 'Courtside tracking',
      },
      description: {
        it: 'PWA offline-first per inserire dati in partita e sincronizzare quando torna la connessione.',
        en: 'Offline-first PWA to enter data during games and sync when the connection returns.',
      },
    },
    {
      image: '/public/uploads/hooplytics/admin-roster-import.webp',
      imageAlt: {
        it: 'Schermata gestione roster e anagrafica giocatori',
        en: 'Roster and player profile management screen',
      },
      title: {
        it: 'Roster e anagrafica',
        en: 'Rosters and profiles',
      },
      description: {
        it: 'Squadre, giocatori e ruoli organizzati per stagione o torneo, con controllo su cosa esporre.',
        en: 'Teams, players and roles organised per season or tournament, with control over what is public.',
      },
    },
  ] satisfies ShowcaseSlide[],
};

export const caseStudyCarouselLabels = {
  it: {
    region: 'Galleria schermate prodotto',
    previous: 'Slide precedente',
    next: 'Slide successiva',
    chooseSlide: 'Vai alla slide',
    status: 'Slide {n} di {total}: {title}',
  },
  en: {
    region: 'Product screenshot gallery',
    previous: 'Previous slide',
    next: 'Next slide',
    chooseSlide: 'Go to slide',
    status: 'Slide {n} of {total}: {title}',
  },
} as const;
