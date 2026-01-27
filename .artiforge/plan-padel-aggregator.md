# Piano (Artiforge) — Padel aggregator (client-side)

Obiettivo: aggiungere un tool mobile-first, 100% client-side, per incollare richieste padel da WhatsApp, estrarre eventi, ordinarli per data/ora e generare output pronto da reincollare.

## Deliverable principali

- `src/pages/tools/padel.astro` (route `/tools/padel`)
- `src/pages/en/tools/padel.astro` (route `/en/tools/padel`, per coerenza i18n)
- `src/components/PadelAggregator.astro` (UI senza framework)
- `src/lib/padelParser.ts` (solo funzioni pure, no DOM/network)
- `src/styles/padel.css` (mobile-first)

## Parsing (logica)

- Split input in blocchi evento (primario: URL `wansport.com` come fine evento; fallback: doppio newline)
- Parse di:
  - data italiana \(es. “28 gennaio 2026”\)
  - ora \(HH:MM\)
  - struttura/venue (best-effort, preferendo righe attorno a `📌`)
  - campo \(“Campo X”\)
  - livello \(range “da C3 a B4”\)
  - confermati \(righe con `✅`\)
  - posti aperti \(conteggio `❓`\)
  - URL wansport
- Normalizzazione:
  - `dateISO: YYYY-MM-DD`
  - `startDateTime: Date` locale
  - `incomplete: boolean` se manca data o ora
- Ordinamento:
  - completi prima
  - completi per `startDateTime` asc
  - tie-breaker `venueName` asc

## UI (mobile-first)

- Colonna singola, font >= 16px
- Bottoni touch-friendly (min-height 44px)
- Textarea input ~40vh
- Output textarea ~25–30vh
- “Preview” e “Non riconosciuti” con `details/summary`
- Interazioni:
  - “Analizza richieste”: blur + parse + scrollIntoView
  - “Copia negli appunti”: `navigator.clipboard.writeText`, feedback 1.5s, fallback selezione output

