## Piano (Artiforge) — Ottimizzazione Lighthouse TBT

Obiettivo: ridurre il **Total Blocking Time (TBT)** in Lighthouse minimizzando lavoro sul main thread (JS, third‑party, hydration) senza regressioni SEO/A11y.

### Step 1 — Baseline e analisi
- Eseguire Lighthouse su pagine chiave (Home, Services, Blog articolo) in Chrome DevTools.
- Isolare i **Long Tasks** (>50ms) nel main thread e identificare script/risorse responsabili.
- Ripetere più run (mobile/desktop) in incognito.

### Step 2 — Ottimizzare third‑party (GTM / Fonts)
- Evitare esecuzione di script third‑party durante il parsing dell’HTML.
- Caricare GTM in modo differito (idle/timeout) o condizionale (consenso) per ridurre TBT.
- Verificare comportamento font (swap/preconnect) e possibili ottimizzazioni aggiuntive.

### Step 3 — Ridurre JS client-side (Astro hydration)
- Audit di eventuali `client:*` e rimozione hydration non necessaria.
- Lazy/dynamic import per componenti pesanti; `client:visible`/`client:idle` per interattività non critica.

### Step 4 — Ottimizzare caricamento risorse
- Ridurre risorse render‑blocking, valutare critical CSS e lazy-load per contenuti non critici.
- Verificare headers/caching appropriati per asset statici.

### Step 5 — Misurazione continua
- Setup Lighthouse CI e budget prestazionali (in particolare TBT) per prevenire regressioni.
- Checklist di verifica: performance, SEO meta/JSON‑LD, A11y, funzionalità.

### Step 6 — Documentazione
- Documentare modifiche e linee guida per mantenere i guadagni nel tempo.

### Note sullo stato attuale (implementazione in repo)
- In `src/layouts/Layout.astro` GTM è stato reso **lazy-load** (iniezione in idle/timeout) per ridurre TBT.
- `PUBLIC_GTM_ID` può sovrascrivere l’id GTM senza hardcoding lato CMS.

