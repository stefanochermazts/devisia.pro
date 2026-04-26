---
name: Devisia
description: Sito brand, software governabile, AI e compliance operativa
colors:
  ink: "oklch(0.22 0.02 250)"
  ink-deep: "oklch(0.18 0.025 255)"
  ivory: "oklch(0.98 0.01 90)"
  paper: "oklch(0.96 0.012 85)"
  ember: "oklch(0.45 0.1 30)"
  pine: "oklch(0.45 0.08 195)"
  hero-tint: "oklch(0.2 0.028 255)"
  surface: "oklch(0.99 0.006 90)"
typography:
  display:
    fontFamily: '"Bitter Variable", Bitter, ui-serif, Georgia, serif'
    fontSize: "clamp(2.65rem, 1.9rem + 2.8vw, 3.75rem)"
    fontWeight: 780
    lineHeight: 1.12
    letterSpacing: "-0.028em"
  headline:
    fontFamily: '"Bitter Variable", Bitter, ui-serif, Georgia, serif'
    fontSize: "clamp(2.2rem, 1.7rem + 2.1vw, 3.1rem)"
    fontWeight: 720
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  title:
    fontFamily: '"Bitter Variable", Bitter, ui-serif, Georgia, serif'
    fontSize: "clamp(1.85rem, 1.45rem + 1.5vw, 2.5rem)"
    fontWeight: 680
    lineHeight: 1.12
  body:
    fontFamily: '"Lexend Variable", Lexend, system-ui, sans-serif'
    fontSize: "clamp(1rem, 0.97rem + 0.22vw, 1.08rem)"
    fontWeight: 450
    lineHeight: 1.62
  label:
    fontFamily: '"Manrope Variable", Manrope, ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(0.9rem, 0.88rem + 0.2vw, 0.98rem)"
    fontWeight: 560
    letterSpacing: "-0.01em"
rounded:
  sm: "0.3rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-deep}"
    textColor: "#fefefe"
    rounded: "{rounded.md}"
    padding: "0.7rem 0.95rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.7rem 0.95rem"
  nav-link:
    typography: "{typography.label}"
    textColor: "{colors.ink}"
    height: "2.75rem"
---

# Design System: Devisia

## Overview

**Creative North Star: "La sala controllo leggibile"**

Il sistema visivo del sito Devisia nasce da un manuale tecnico caldo e da una regia a contrasto: fondali avorio e carta, inchiostro blu-freddo, accenti arancio-terra (ember) e verde-blu (pine) per segnalare controlli e struttura. La superficie non e' decorazione: ogni sezione segue un flusso riconoscibile (contesto, problema, metodo, prova, azione) come chiede il prodotto. L'utente percepisce ordine, continuita' e possibilita' di verifica, non "tech hype".

Il codice sorgente dei token e' in `src/styles/tokens.css` (OKLCH). I valori qui e nel frontmatter allineano quei token; per il lavoro giornaliero gli agenti devono riferirsi a `--ds-*` nel CSS, non duplicare costanti in prose con valori diversi.

**Key Characteristics:**

- Tre famiglie: **Bitter Variable** (titoli e display marketing), **Manrope Variable** (header, footer, UI chrome), **Lexend Variable** (corpo e lettura continua).
- Committed ma non "drenched": hero scuri (hero-tint) e superfici carta, senza glassmorphism come default.
- Profondita' con ombre leggere (due livelli) e bordi 1px/2px, non strisce laterali colorate su card o liste.
- Stati interattivi con transizione rapida (120ms) o base (180ms) e `ease-standard`, senza rimbalzi.

## Colors

Le chiavi semantiche in `tokens.css` mappano ruoli, non nomi "palette generic": testo, superficie, confini, focus, pericolo, successo, informazione. Light e' il default; dark e' ottenuto con `[data-theme="dark"]` e `prefers-color-scheme` senza forzare il viola o il neon.

### Primary

- **Inchiostro (ink)** (`oklch(0.22 0.02 250)`): testo principale, gerarchia di lettura, legato al blu notturno, non nero puro.
- **Inchiostro profondo (ink-deep)** (`oklch(0.18 0.025 255)`): primary UI (bottoni pieni, barre dense), CTA in header.

### Secondary (accents)

- **Ember (accent)** (`oklch(0.45 0.1 30)`): collegamenti, accento caldo, sottigliezze sotto CTA, stati "caldi" controllati.
- **Pine (accent-2)** (`oklch(0.45 0.08 195)`): seconda coda cromatica (griglie hero, linee, numeri di sezione), freddo ma non "tech turquoise" da startup.

### Neutral

- **Ivory (bg)** (`oklch(0.98 0.01 90)`): sfondo di pagina, base calda.
- **Paper (surface-2)** (`oklch(0.96 0.012 85)`): strati, blocchi, citazioni, input su superficie.
- **Surface** (`oklch(0.99 0.006 90)`): card e contenitori rialzati rispetto al bg.
- **Hero tint** (`oklch(0.2 0.028 255)`): sezioni hero e blocchi "control room" a testo chiaro, gradienti locali in componenti (es. `site-hero`).

**The OKLCH Source Rule.** I valori normativi per colore stanno in `:root` come OKLCH. Se serve hex per un export (Figma, Stitch), convertire da li', non scrivere un secondo "colore ufficiale" in markdown che diverge.

## Typography

**Display / titoli:** Bitter Variable (con fallback Source Serif, Georgia, `ui-serif`).

**Body:** Lexend Variable (con fallback system-ui).

**UI chrome (nav, footer, CTA fissa mobile):** Manrope Variable.

**Mono:** stack di sistema (`ui-monospace`, ...), per codice e audit trail in contenuti.

**Character:** coppia slab + sans geometrica: i titoli hanno presenza editoriale, il corpo resta neutro e leggibile a lungo, l'interfaccia e' compatta e diretta. Nessun seriffato nel menu: Manrope mantiene la voce "strumento" separata dalla voce "manifesto" dei titoli.

### Hierarchy

- **Display (Bitter, ~h1, hero):** 780, `var(--ds-text-4xl)` o hero piu' grande, `line-height: var(--ds-leading-tight)` (1.12), interlettera compatta.
- **Headline (Bitter, h2):** 720, `var(--ds-text-3xl)`.
- **Title (Bitter, h3-h4):** 680-640, `var(--ds-text-2xl)` / `var(--ds-text-xl)`.
- **Section minor (Bitter, h5-h6):** 640-620, con interlettera che si avvicina a zero su h6.
- **Body (Lexend, 450):** `var(--ds-text-md)`, `line-height: 1.62`, `max-width` su paragrafi ~65ch.
- **Label / nav (Manrope, 500-700 per contesto):** link nav ~560, caps per eyebrow e micro-label con `letter-spacing: var(--ds-tracking-caps)` dove gia' definito.

### Named Rules

**The Three-Family Rule.** Non mescolare Bitter nel corpo lungo o Manrope nei titoli `h1-h6` salvo casi gia' codificati (es. componenti legacy): tre ruoli, tre stack.

## Elevation

Il sistema e' ibrido: superfici piatte a riposo con differenza tonale (ivory, paper, surface), piu' ombre a bassa diffusione per rialzo (header in scroll, card, pannelli) e ombra piu' ampia solo dove serve enfatizzare un overlay (es. `ds-shadow-2`).

**The No-Default-Glass Rule.** Niente `backdrop-filter` o vetro come estetica di default; se usato, e' un caso eccezionale e motivato in componente, non in landing generica. Coerente con l'anti-reference "SaaS generica" in PRODUCT.md.

### Shadow Vocabulary

- **Sombra 1** (`0 1px 2px oklch(0.2 0.02 250 / 0.07)` in light): separazione leggera, header dopo scroll, card discrete.
- **Sombra 2** (`0 8px 24px ... / 0.1` in light, equivalente piu' scuro in dark): modali, toast, pannelli che stanno "sopra" il flusso.

Movimento: durate `--ds-motion-fast` (120ms), `--ds-motion-base` (180ms), `--ds-ease-standard` (cubic-bezier(0.2, 0, 0, 1)). Transizioni su `color`, `background`, `transform` dove gia' definito, non su `height` o layout strutturale.

## Components

### Buttons (`.ds-btn`)

- **Shape:** raggio `var(--ds-radius-2)` (0.5rem), bordo 1px.
- **Primary:** sfondo `var(--ds-color-primary)` (ink-deep), testo bianco, bordo scurito rispetto al fill; hover `translateY(-1px)` e schiarimento dello sfondo, senza ombre finte 3D.
- **Secondary:** superficie e bordo strong; **Ghost:** trasparente, senza bordo visibile a riposo.
- **Focus:** anello tramite stili di focus su `:focus-visible` a livello base (e token focus), non ring colorati casuali.
- **Padding:** `0.7rem 0.95rem` default; `data-size="sm"|"lg"` riduce o aumenta padding e altezza minima.

### Cards (`.ds-card`)

- Raggio `var(--ds-radius-3)` (0.75rem), bordo `var(--ds-color-border)`, ombra `var(--ds-shadow-1)`, padding `var(--ds-space-6)` nel body, immagine 16/9 in testa se presente.

### Inputs (`.ds-input`, `.ds-textarea`, `.ds-select`)

- Sfondo surface, bordo colore bordo, raggio 2, focus con bordo piu' accent e `var(--ds-focus-ring)` dove applicato; invalidazione con mix verso `danger`.

### Navigation

- Header sticky, font **Manrope**; link con peso intermedio, `min-height` 2.75rem, stato `aria-current` con tinta accento in superficie, CTA "Contatti" in variante piena (primary) in header.
- Mobile: hamburger, menu a colonna, stessi pesi; CTA sticky in basso (Manrope) su `max-width: 48rem` quando visibile.
- **Language switcher** accanto al wordmark, caps, spaziatura lettere elevata, non e' un ottavo elemento del menu principale: resta a ridosso del brand.

### Componenti distintivi di marketing

- **Site hero / site layers** (`src/styles/site.css`, `SystemLayers.astro`, `WhatWeDoLayers.astro`): pannelli "control room", assi, nodi numerati, niente griglia di 6 card identiche come unica struttura narrativa.
- **Method graph** (pagina Metodo): flusso a nodi in scheda, linea "Ritorno" per il loop, stile "carta" separato dal diagramma home.

## Do's and Don'ts

Riferimenti espliciti a **Anti-references** e **Design Principles** in [PRODUCT.md](PRODUCT.md).

### Do:

- **Do** mantenere un flusso per sezione: contesto, problema, metodo, prova, prossima azione.
- **Do** usare i token `--ds-*` e variabili gia' definite per colore, spazio, raggio e ombra.
- **Do** rispettare WCAG AA come baseline e puntare a AAA dove non rovina la gerarchia, come da PRODUCT.
- **Do** trattare messaggi su AI con perimetro, limiti, supervisione, auditabilita' (principio 5 in PRODUCT), anche in scelta visiva (nessun "magico" da hero stock).

### Don't:

- **Don't** lasciare la pagina disordinata, con gerarchie confuse o sezioni equivalenti impilate senza ritmo, come in Anti-references.
- **Don't** usare l'estetica SaaS generica: gradienti vistosi ovunque, metriche da hero template, griglie infinite di icone+ titolo+ testo, promesse AI rumorose, consulenza corporate fredda in stock language: tutto esplicitamente vietato in Anti-references.
- **Don't** usare bordo sinistro o destro spesso come unica cifra su card o voci di lista: bande laterali >1px come accento, vietate (legge condivisa del progetto / skill).
- **Don't** usare `background-clip: text` con gradiente per enfasi: enfasi con peso, dimensione, spazio, non finta metallizzazione.
- **Don't** reintrodurre il pieno "hero metric" (numero enorme, label piccola, quattro stat, gradient dietro) come pattern di home.

---

_Aggiorna questo file con `$impeccable document` (scan mode) dopo significativi cambi a token o componenti. Frontmatter: valori allineati a `src/styles/tokens.css`._
