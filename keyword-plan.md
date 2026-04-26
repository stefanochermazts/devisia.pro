# Piano di Mappatura Keyword SEO

## 1. Home Page (`src/pages/index.astro`, `src/pages/en/index.astro`)
**Obiettivo**: Definire l'identità core come società di sviluppo software governabile, AI con perimetro e compliance operativa.

| Keyword | Tipo | Posizionamento Suggerito |
|---------|------|--------------------------|
| società sviluppo software | Primaria | Meta title / hero |
| sviluppo software su misura | Primaria | H1 o lede hero |
| software basato su ai | Primaria | Sezione sistema / H2 |
| ai per aziende | Primaria | Sezione AI governata |
| software personalizzato per aziende | Secondaria | Testo descrittivo |
| software su misura aziende | Secondaria | Testo descrittivo |

## 2. Cosa facciamo / What we do (`src/pages/cosa-facciamo.astro`, `src/pages/en/what-we-do.astro`)
**Obiettivo**: Dettagliare le competenze tecniche e le soluzioni verticali.

| Keyword | Tipo | Posizionamento Suggerito |
|---------|------|--------------------------|
| sviluppo applicazioni web | Primaria | H2 / Sezione Web App |
| sviluppo saas | Primaria | H2 / Sezione SaaS |
| integrazione ai nei software | Primaria | H2 / Sezione AI |
| integrazione api ai | Primaria | Testo tecnico AI |

## 3. Metodo, AI governata, Compliance, Prodotti
**Obiettivo**: Rafforzare prova, metodo e governabilità senza keyword stuffing.

| Keyword | Tipo | Destinazione Suggerita |
|---------|------|--------------------------|
| ai e privacy | Secondaria | AI governata / Compliance / MySafeNest |
| governance intelligenza artificiale | Secondaria | AI governata / Metodo |
| ai responsabile | Secondaria | Chi siamo / AI governata |
| ai by design | Secondaria | Metodo / AuditReady |
| sicurezza ai | Secondaria | Compliance / AuditReady |
| sviluppo software con intelligenza artificiale | Secondaria | Home / Progetti |

## 4. Progetti e tool non-blog
**Obiettivo**: Usare schede progetto e strumenti pubblici come prova concreta, mantenendo descrizioni brevi e naturali.

| Area | Keyword target | Vincolo |
|------|----------------|---------|
| `src/content/projects/it/*.md` | software basato su ai, ai e privacy, sicurezza ai | `description` max 200 caratteri |
| `src/pages/tools/*.astro` | ai per aziende, sicurezza ai, integrazione ai | Copy utile e non promozionale |
| `src/pages/ai-structure.astro` | software basato su ai, sviluppo software con intelligenza artificiale | Messaggi privacy e limiti chiari |

## 5. English equivalents
Apply the same intent natively to English routes:

| Italian intent | English keyword |
|----------------|-----------------|
| sviluppo software su misura | custom software development |
| sviluppo saas | SaaS development |
| integrazione ai | AI integration |
| società sviluppo software | software development company |
| ai per aziende | AI for businesses |
| governance intelligenza artificiale | AI governance |
| sicurezza ai | AI security |
| software basato su ai | AI-based software |
| software personalizzato per aziende | custom software for businesses |

---

## Prossimi Passi
- **Step 3**: Implementazione sulle route Astro live.
- **Step 4**: Allineamento collection non-blog usate da contatti, privacy e progetti.
- **Step 5**: Validazione SEO/build senza modificare il blog.
