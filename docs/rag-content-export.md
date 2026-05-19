# Export contenuti italiani per RAG

Script che scarica il sito **già renderizzato** (HTML pubblico), estrae il contenuto del `<main>`, converte il testo in **Markdown** (un file per percorso) e produce **`index.jsonl`** con chunk per indicizzazione RAG.

## Cosa viene incluso

- Pagine dall’elenco pubblico **`/sitemap.xml`** del sito (solo host configurato in `--base`, percorsi **italiani**, **senza `/blog`** e **senza `/en`**).
- Aggiunta esplicita del percorso **`/projects`** (allineamento con le route pubbliche).
- Nessun contenuto dalla cartella Markdown del blog: l’HTML del blog non è nemmeno nelle URL filtrate.

## Output

Cartella configurabile (default relativamente a cwd), struttura tipica:

| File / cartella       | Descrizione |
|----------------------|-------------|
| `pages/*.md`         | Markdown + frontmatter YAML (`title`, `description`, `url`, `path`, `lang`, …) |
| `index.jsonl`        | Una riga JSON per chunk (`id`, `path`, `url`, `title`, `content`, …) |
| `manifest.json`      | Riepilogo: timestamp, lista URL exportate, errori |

## Utilizzo

```bash
# Produzione (default dello script npm)
npm run export:rag:it
```

Equivalente manuale:

```bash
node scripts/export-rag-content.mjs --base https://devisia.pro --out rag-export/it
```

Sviluppo locale (sitio su `astro dev`, es. porta 4321):

```bash
node scripts/export-rag-content.mjs --base http://127.0.0.1:4321 --out rag-export/it-local
```

### Opzioni

| Flag | Significato | Default |
|------|-------------|---------|
| `--base` | Origine sito (`https://devisia.pro` o dev) | `https://devisia.pro` |
| `--out` | Directory di output | `rag-export/it` (sotto cwd) |
| `--chunk-size` | Caratteri max per campo `content` in JSONL (min 500) | `4000` |

## Git

L’output in `rag-export/` è principalmente artefatto ricostruibile: è ignorato dal repository (`.gitignore`).

## Limitazioni

- L’estrazione segue solo il primo `<main>` (`main#main` o `main`): pagine senza `<main>` compaiono in `manifest.json` → `errors`.
- Alcuni blocchi ricchi (timeline, carousel) possono perdere gerarchia: il target è **testo recuperabile**, non parity 1:1 con layout.
- Ridirezioni duplicate (stessa `finalPath`) vengono **deduplicate**.
