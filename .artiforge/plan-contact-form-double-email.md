# Plan: Contact Form Double Email Implementation

## Overview
Implementare un sistema di doppia email per il form di contatto: quando un utente compila il form, devono essere inviate due email:
1. Email di ringraziamento all'utente che ha compilato il form
2. Email di notifica al gestore del sito

## Technology Stack
- Astro 5.16.6
- Netlify (SSR con @astrojs/netlify)
- Netlify Forms
- TypeScript
- Node.js 20

## Steps

### Step 1: Analyze Current Contact Form
**Action**: Analizzare l'implementazione attuale del form di contatto per verificare il markup Netlify Form, il campo honeypot e il metodo di submission.

**Reasoning**: Capire il markup attuale è essenziale per non rompere la cattura Netlify Form esistente mentre aggiungiamo il nuovo flusso di doppia email.

**Implementation Details**:
- Aprire entrambe le versioni linguistiche della pagina contatti
- Confermare che il `<form>` contiene: `data-netlify="true"`, attributo `name`, input honeypot nascosto, e campi standard (name, email, subject, message)
- Notare il metodo form attuale (POST) e enctype

### Step 2: Add Language Field
**Action**: Aggiungere un campo nascosto `lang` a ciascun form di contatto per indicare la lingua (sarà usato per selezionare il template email di ringraziamento corretto).

**Reasoning**: Il sito è multilingue (IT/EN). L'email di ringraziamento deve essere inviata nella stessa lingua in cui l'utente ha compilato il form.

**Implementation Details**:
- In `src/pages/contact.astro` (IT) aggiungere: `<input type="hidden" name="lang" value="it" />`
- In `src/pages/en/contact.astro` (EN) aggiungere: `<input type="hidden" name="lang" value="en" />`

### Step 3: Install Email Dependencies
**Action**: Installare dipendenze per l'invio email e aggiungere variabili d'ambiente richieste.

**Reasoning**: Serve un modo affidabile per inviare email da una Netlify Function. Nodemailer con SMTP esterno (o SendGrid) è una scelta comune e ben supportata.

**Implementation Details**:
- Eseguire: `npm i nodemailer dotenv`
- Definire variabili d'ambiente:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SITE_MANAGER_EMAIL` (indirizzo che riceve la notifica)
  - `FROM_EMAIL` (es. `no-reply@devisia.pro`)
- Aggiungere file `.env.example` con i nomi delle variabili e brevi descrizioni

### Step 4: Create Email Templates
**Action**: Creare file template email per i messaggi di ringraziamento (italiano e inglese).

**Reasoning**: Separare i template mantiene la funzione pulita e facilita aggiornamenti futuri.

**Implementation Details**:
- Creare directory `src/email-templates/`
- Aggiungere `thank-you.it.html` e `thank-you.en.html`
- Usare HTML semplice con placeholder (`{{name}}`, `{{subject}}`, ecc.)

### Step 5: Implement Netlify Function
**Action**: Implementare una Netlify Function `contact-email.ts` che processa la submission del form, invia l'email di ringraziamento all'utente e invia l'email di notifica al gestore del sito.

**Reasoning**: Questa funzione è il cuore del sistema di doppia email e sarà triggerata ad ogni POST del form.

**Implementation Details**:
- File location: `netlify/functions/contact-email.ts`
- Export handler con signature Netlify Function
- Parsing del body (url-encoded)
- Controllo honeypot
- Validazione base
- Invio email di ringraziamento all'utente
- Invio email di notifica al gestore
- Redirect a pagina di successo

### Step 6: Update Form Markup
**Action**: Aggiornare il markup del form per fare POST alla Netlify Function preservando la gestione Netlify Forms.

**Reasoning**: Netlify continuerà a catturare la submission perché il form mantiene `data-netlify="true"`; l'attributo `action` dirige il POST alla nostra funzione per il processing email.

**Implementation Details**:
- Modificare il tag form in entrambe le pagine contatti:
  ```html
  <form
    name="contact"
    method="POST"
    netlify
    netlify-honeypot="bot-field"
    data-netlify="true"
    action="/.netlify/functions/contact-email"
  >
  ```

### Step 7: Configure Netlify
**Action**: Configurare Netlify per esporre la funzione e assicurarsi che le variabili d'ambiente siano disponibili in produzione.

**Reasoning**: Netlify deve sapere la directory delle funzioni e le env vars per il servizio email.

**Implementation Details**:
- Verificare che `netlify.toml` contenga:
  ```toml
  [functions]
    directory = "netlify/functions"
  ```
- Aggiungere le env vars via Netlify UI sotto Site Settings → Build & Deploy → Environment → Environment variables

### Step 8: Add Tests
**Action**: Aggiungere test unit/integration per la nuova funzione e aggiornare CI (se presente).

**Reasoning**: Assicurare che cambiamenti futuri non rompano il workflow email.

**Implementation Details**:
- Creare `netlify/functions/__tests__/contact-email.test.ts`
- Mock `nodemailer` con Jest
- Test cases:
  1. Submission riuscita (entrambe le email inviate, redirect corretto)
  2. Honeypot compilato (funzione ritorna 200 senza inviare email)
  3. Email/name mancanti (ritorna 400)
  4. Fallimento email gestore (funzione ritorna 500)

### Step 9: Update Documentation
**Action**: Aggiornare documentazione (README o file docs dedicato) per descrivere il nuovo flusso di doppia email e le variabili d'ambiente richieste.

**Reasoning**: Gli sviluppatori futuri hanno bisogno di chiare linee guida su configurazione e considerazioni operative.

**Implementation Details**:
- Aggiungere sezione "Contact Form Double Email" con:
  - Overview del flusso
  - Lista delle env vars richieste con valori esempio
  - Istruzioni per sviluppo locale (es. usando Mailhog)
  - Nota sul handling i18n
- Aggiornare `.env.example` di conseguenza

### Step 10: End-to-End Testing
**Action**: Eseguire un test end-to-end completo su un deploy preview (Netlify preview branch) per confermare:
- Netlify Form entry appare nel dashboard
- Email di ringraziamento arriva nella mailbox dell'utente nella lingua corretta
- Email di notifica raggiunge il gestore del sito
- Redirect atterra sulla pagina di successo appropriata

**Reasoning**: Verifica nel mondo reale assicura che la soluzione funzioni nella pipeline di produzione.

**Implementation Details**:
- Pushare le modifiche a un feature branch
- Aprire un Netlify Deploy Preview
- Usare indirizzi email di test e controllare le inbox
- Catturare log dalle funzioni preview per debugging se necessario
