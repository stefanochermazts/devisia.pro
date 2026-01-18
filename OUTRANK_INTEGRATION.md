# Integrazione Outrank.so / Artiforge

Questa guida spiega come configurare l'integrazione automatica per pubblicare articoli direttamente sul sito Devisia tramite il webhook di Outrank.so (Artiforge).

## Come funziona

1.  **Outrank.so** genera un articolo e invia un webhook `POST` all'endpoint di Devisia.
2.  Una **Netlify Function** (`netlify/functions/outrank-webhook.ts`) riceve il payload.
3.  La funzione crea un nuovo file Markdown nella cartella `src/content/blog/{it|en}/` tramite l'API di GitHub.
4.  GitHub riceve il commit, attivando automaticamente un nuovo build su **Netlify**.
5.  L'articolo diventa visibile sul sito.

## Configurazione

### 1. Preparazione su GitHub
Devi creare un Token che abbia i permessi di **scrittura** sul repository.

#### Opzione A: Token Classico (Consigliato per semplicità)
1.  Vai su [GitHub Developer Settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2.  Clicca **Generate new token (classic)**.
3.  Dai un nome (es. "Devisia Outrank").
4.  **IMPORTANTE**: Seleziona la casella **`repo`** (Full control of private repositories). Se il repo è pubblico, basta `public_repo`, ma `repo` è più sicuro per evitare errori.
5.  Copia il token (inizia con `ghp_`).

#### Opzione B: Fine-grained Token (Più sicuro)
1.  Vai su [GitHub Developer Settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta).
2.  Clicca **Generate new token**.
3.  Seleziona il proprietario e il repository `devisia.pro`.
4.  In **Repository permissions**, cerca **Contents**.
5.  Imposta Access su **Read and write**.
6.  Copia il token (inizia con `github_pat_`).

### 2. Configurazione su Netlify
Aggiungi le seguenti variabili d'ambiente nel pannello di controllo di Netlify (**Site Settings > Build & deploy > Environment variables**):

*   `GITHUB_TOKEN`: Incolla il token creato al punto 1.
*   `OUTRANK_SECRET`: Crea una stringa casuale e sicura (es. `my-secure-webhook-token`).
*   `GITHUB_REPO_OWNER`: `stefanochermazts` (opzionale se già impostato nel codice).
*   `GITHUB_REPO_NAME`: `devisia.pro` (opzionale se già impostato nel codice).

### 3. Configurazione su Outrank.so
Nella dashboard di Outrank/Artiforge, vai alla sezione **Integrations > Webhooks** e configura l'invio:

*   **Webhook URL**: `https://devisia.pro/.netlify/functions/outrank-webhook`
*   **Authorization Header**: Inserisci `Bearer ` seguito dalla stringa scelta per `OUTRANK_SECRET`.
    *   Esempio: `Bearer my-secure-webhook-token`
*   **Event**: Seleziona l'evento di pubblicazione articolo.

## Struttura del Payload Atteso

Il webhook deve inviare un JSON con questa struttura (simile a quella di Outrank/Artiforge):

```json
{
  "event_type": "publish_articles",
  "timestamp": "2023-04-01T12:00:00Z",
  "data": {
    "articles": [
      {
        "title": "Titolo dell'Articolo",
        "content_markdown": "# Markdown Content",
        "slug": "article-slug",
        "meta_description": "SEO description",
        "image_url": "https://example.com/image.jpg",
        "tags": ["tag1", "tag2"],
        "language": "it"
      }
    ]
  }
}
```

## Note Tecniche
*   La funzione supporta l'elaborazione di **più articoli** contemporaneamente (array `articles`).
*   La funzione gestisce sia la **creazione** che l'**aggiornamento** degli articoli.
*   Il campo `language` determina la cartella di destinazione (`it` o `en`). Se omesso, il default è `it`.
*   Il build di Astro viene innescato dal commit su GitHub, quindi l'articolo apparirà online dopo pochi minuti (tempo del build).
