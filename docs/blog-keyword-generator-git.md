# Branch del generatore blog da keyword SEO

La pipeline di generazione articoli (coda `data/blog-keywords.json`, script `scripts/generate-blog-from-keywords.js`, workflow `.github/workflows/generate-blog-daily.yml`) è mantenuta sul branch **`feature/blog-keyword-generator`** per non integrarla subito in `main`.

## Situazione attuale

- Il branch **`feature/blog-keyword-generator`** contiene i commit dedicati a questa funzionalità.
- Il branch **`main`** locale può restare senza queste modifiche finché non decidi di fare merge o una Pull Request.
- Non è necessario pushare su `main` per lavorare sul feature branch; puoi anche **non pushare affatto** finché vuoi tenere tutto solo in locale.

## Comandi utili

| Obiettivo | Comando |
|-----------|--------|
| Passare a `main` (senza i file del feature branch nel working tree, se tutto è committato sul branch) | `git checkout main` |
| Tornare a lavorare sul feature branch | `git checkout feature/blog-keyword-generator` |
| Pubblicare **solo il feature branch** su GitHub (`main` remoto **non** cambia) | `git push -u origin feature/blog-keyword-generator` |
| Aprire una Pull Request quando sei pronto | Su GitHub: *Compare* `feature/blog-keyword-generator` → `main` |

## Note

- Finché non fai **merge** (o un push diretto) su `main`, la generazione automatica degli articoli da keyword resta isolata su quel branch (e, se presente, sulla copia remota dello stesso branch).
- Dopo il merge in `main`, il workflow schedulato sarà attivo solo se il file `.github/workflows/generate-blog-daily.yml` è presente sul branch predefinito del repository che GitHub Actions usa (di solito `main`).

## Documentazione correlata

- Variabili d’ambiente: `ENV_VARS.md` (sezione *SEO keyword blog generator*).
- Coda keyword: `data/blog-keywords.json`.
- Generazione manuale: `npm run generate:blog` (richiede `OPENAI_API_KEY`).
