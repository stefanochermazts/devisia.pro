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

**Creative North Star: "Schema di processo"**

Il sito brand parla la grammatica di un foglio P&ID: linee di flusso, nodi, cancelli (gate), bolle di strumento, legenda e cartiglio. Non e' una "sala controllo" ne' un dashboard SaaS: e' un disegno di processo dove software, AI governata e compliance convergono in un sistema leggibile, con responsabilita' ed evidenze sui cancelli. Palette e tipografia restano quelle gia' bloccate (ink / ivory / ember / pine; Bitter / Lexend / Manrope); cambia il mondo formale, non i token.

Il codice sorgente dei token e' in `src/styles/tokens.css` (OKLCH). Per il lavoro giornaliero riferirsi a `--ds-*` nel CSS.

**Key Characteristics:**

- Tre famiglie tipografiche invariate: **Bitter** (titoli), **Manrope** (chrome, tag, legende), **Lexend** (corpo).
- Composizione a foglio: margini da disegno, leader lines, cartiglio (title block), legenda laterale o inferiore — non griglie di card marketing.
- Ember = percorso a rischio / cancello non verificato; pine = percorso verificato / evidenza ok; ink = linee di processo e testo.
- Interazione firma: focus/hover su un cancello rivela owner, limite e tipo di prova. Motion sobrio (120–180ms), niente rimbalzi.
- Hero tint resta disponibile per bande dense, ma il default marketing e' ivory/paper da foglio, non "control room" scura.

## Colors

Token invariati. Ruoli nel mondo Schema:

- **Ink / ink-deep:** linee di processo, testo, cartiglio, CTA primaria.
- **Ivory / paper / surface:** campo del foglio e strati (legenda, note, pannelli).
- **Ember:** anomalia, rischio, cancello aperto/non verificato, hot path.
- **Pine:** verificato, evidenza ok, cold path controllato.
- **Hero tint:** solo dove serve un blocco invertito (raro); non e' il default del primo viewport.

Light e' il default. Dark via `[data-theme="dark"]` / `prefers-color-scheme` senza neon.

**The OKLCH Source Rule.** Valori normativi in `:root` come OKLCH.

## Typography

Invariata: Bitter display/titoli, Lexend body, Manrope UI/legenda/nav, mono di sistema per tag tipo `FIC-101` / audit trail.

**The Three-Family Rule.** Non mescolare i ruoli.

Nei diagrammi, le micro-label Manrope in caps con tracking elevato fungono da tag di strumento; i titoli Bitter restano fuori dalle bolle ISA.

## Layout

- Pagina come foglio: contenitore con respiro da margine di disegno; sezioni come fogli o zone di un unico schema.
- Flusso narrativo fisso: contesto → problema (flusso opaco) → metodo (cancelli) → prova → azione.
- Primo viewport preferito: argomento a due facce (opaco vs governato) con cucitura, oppure schema a tre flussi che convergono — mai hero metriche + tre card.
- Landing campaign (`/landing/*`) sono fuori da questo mondo fino a un lavoro dedicato; non ereditano automaticamente i nuovi componenti schema.

## Elevation & Depth

Superfici piatte a differenza tonale (ivory / paper / surface). Ombre solo dove il foglio "si solleva" (header scrolled, overlay). Niente glass di default.

Motion: `--ds-motion-fast` / `--ds-motion-base` / `--ds-ease-standard`. Misregister o "tremolio stampa" vietati in questo mondo; i cancelli si aprono/chiudono con trasformazioni minime.

## Shapes

Raggi esistenti (`--ds-radius-*`). Bolle di strumento e diamanti di gate sono SVG/CSS a tratto ink, non pillole marketing `rounded-full` come pattern dominante. Bordi 1px/2px; niente bande laterali colorate >1px su card o liste.

## Components

### Buttons (`.ds-btn`)

Invariati nei token: primary ink-deep, secondary bordo, ghost trasparente. Nella voce Schema possono apparire come "timbro" rettangolare vicino al cartiglio, senza ombre 3D.

### Cards

Usare con parsimonia. Preferire zone di foglio, righe di legenda, nodi di schema. Se compare una card, e' un contenitore di interazione, non il ritmo di default della pagina.

### Navigation

Header sticky Manrope; language switcher presso il wordmark; CTA Contatti primary. Su mobile: menu a colonna + CTA sticky dove gia' previsto.

### Componenti distintivi Schema

- **Process split / schema hero:** confronto opaco vs governato, o tre linee (Software / AI / Compliance) verso un header "sistema leggibile".
- **Gate reveal:** pannello o popover accessibile su focus che espone ruolo, limite, evidenza.
- **Title block / cartiglio:** metadati di foglio (rev, data, sheet) come chiusura di sezione o footer di blocco — non decorazione vuota.
- **Legend rail:** definizioni simbolo/colore in Manrope, non icon row SaaS.

## Do's and Don'ts

Allineati a PRODUCT.md (Anti-references e Design Principles).

### Do:

- **Do** mostrare il meccanismo (flussi, cancelli, evidenze), non solo dichiararlo.
- **Do** usare ember/pine solo con significato di stato nel diagramma.
- **Do** mantenere claim fattuali veri; riscrivere voce e gerarchia liberamente nel perimetro brand.
- **Do** WCAG AA (AAA dove non rompe la gerarchia); `prefers-reduced-motion` ferma aperture decorative dei cancelli.

### Don't:

- **Don't** tornare a "sala controllo", glassmorphism, metriche hero, griglie di 6 card identiche.
- **Don't** far sembrare il sito un prodotto SCADA o un dashboard di monitoraggio.
- **Don't** usare gradient text, bande laterali spesse, neon, viola di default.
- **Don't** toccare le landing campaign in questo ciclo.
- **Don't** inventare clienti, prezzi, benchmark o capacita' non vere.

---

_Aggiorna con `$impeccable document` (scan mode) dopo il build. Frontmatter allineato a `src/styles/tokens.css`. Seed direzione: Schema di processo (key `a3ccc5dc`, assigned index 4)._
