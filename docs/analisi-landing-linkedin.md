Analizza il progetto Devisia esistente e implementa quattro nuove landing page collegate agli annunci LinkedIn della campagna di notorietà.

Il sito dovrebbe essere basato su Astro e pubblicato su Netlify, ma verifica la struttura reale del repository prima di modificare il codice.

L’obiettivo non è creare quattro pagine promozionali generiche. Ogni pagina deve approfondire il problema sollevato dall’annuncio, offrire una prima struttura utile per affrontarlo e terminare con un form di contatto semplice.

## Principi generali

Prima di iniziare:

1. Analizza la struttura del progetto.
2. Individua:

   * layout utilizzati dal sito;
   * componenti header e footer;
   * design system, font, colori e spaziature;
   * landing page esistente `/landing/devisia`;
   * tutti i form di contatto presenti nel sito;
   * componenti condivisi già utilizzati dai form;
   * logica di validazione;
   * gestione dei messaggi di errore e conferma;
   * implementazione con cui il consenso della chat viene salvato in una tabella Netlify;
   * client database, API route o Netlify Function utilizzata;
   * sistema di variabili ambiente;
   * eventuali sistemi antispam già presenti.

Riutilizza il più possibile ciò che esiste.

Non introdurre framework, librerie o dipendenze nuove se non sono realmente necessarie.

Non modificare il consenso chat e non salvare i lead nella tabella utilizzata dalla chat.

## Struttura tecnica delle landing

Crea queste quattro route:

* `/landing/sistemi-spiegabili`
* `/landing/governance-ai`
* `/landing/processi-prima-automazione`
* `/landing/evidenze-audit`

Le quattro pagine devono condividere:

* un unico layout;
* gli stessi componenti;
* un componente form comune;
* la stessa struttura responsive;
* la stessa gestione delle submission;
* la stessa struttura SEO;
* la stessa logica di tracciamento della provenienza.

Evita di duplicare intere pagine.

Preferisci una struttura configurabile, per esempio attraverso un oggetto o file dati contenente:

* slug;
* titolo;
* descrizione;
* eyebrow;
* testo introduttivo;
* immagine;
* sezioni;
* checklist;
* risultati attesi;
* testo della CTA;
* identificativo della sorgente.

Se la struttura attuale del progetto rende più corretto creare quattro file Astro distinti, mantieni comunque contenuti e componenti condivisi.

## Design

Mantieni il linguaggio visivo già utilizzato da Devisia.

Le pagine devono essere:

* sobrie;
* tecniche;
* leggibili;
* mobile-first;
* accessibili;
* prive di animazioni inutili;
* prive di effetti futuristici;
* prive di statistiche o testimonianze inventate.

Usa una gerarchia tipografica chiara e molto spazio bianco.

La pagina deve avere una struttura semplice:

1. Header minimale.
2. Hero.
3. Inquadramento del problema.
4. Checklist o modello operativo.
5. Metodo di intervento Devisia.
6. Risultati concreti dell’analisi.
7. Form finale.
8. Footer esistente.

Nel menu o nell’header non inserire elementi che distraggano dall’obiettivo della pagina.

Il pulsante nella hero deve portare tramite anchor al form finale.

Utilizza le creatività della campagna come immagine hero se sono già presenti nel repository.

Se non sono presenti, configura questi percorsi senza generare nuove immagini:

* `/images/landing/sistemi-spiegabili.webp`
* `/images/landing/governance-ai.webp`
* `/images/landing/processi-prima-automazione.webp`
* `/images/landing/evidenze-audit.webp`

Gestisci correttamente l’eventuale assenza temporanea dell’immagine, evitando errori o layout rotti.

## Landing 1 — Sistemi spiegabili

Route:

`/landing/sistemi-spiegabili`

Sorgente form:

`landing_system_explainability`

SEO title:

`Sistemi spiegabili e verificabili | Devisia`

Meta description:

`Rendi espliciti flussi di dati, responsabilità, controlli ed evidenze del tuo sistema.`

Eyebrow:

`Architettura e governance`

Titolo hero:

`Un sistema che funziona ma non si sa spiegare è già un rischio.`

Testo hero:

`Dati, responsabilità, approvazioni e controlli non dovrebbero dipendere dalla memoria delle persone. Un sistema solido deve poter essere compreso, governato e verificato.`

CTA hero:

`Analizza il tuo sistema`

### Sezione problema

Titolo:

`Il problema emerge durante l’audit. Ma nasce molto prima.`

Testo:

`Quando un sistema cresce senza una rappresentazione esplicita dei suoi flussi, le risposte rimangono distribuite tra codice, documenti, configurazioni e conoscenza personale. Il sistema può continuare a funzionare, ma diventa difficile capire chi è responsabile, quali controlli esistono e quali dati vengono realmente trattati.`

### Checklist

Titolo:

`Le domande a cui il sistema deve saper rispondere`

Mostra questi punti:

* Quali dati entrano nel sistema e da dove provengono?
* Dove vengono trasferiti, trasformati e conservati?
* Chi può approvare, modificare o cancellare le informazioni?
* Quali controlli sono automatici e quali dipendono dalle persone?
* Quali attività producono una traccia verificabile?
* Chi è responsabile quando qualcosa non funziona?

### Metodo

Titolo:

`Rendere il sistema comprensibile`

Mostra tre passaggi:

1. `Mappare`
   `Ricostruiamo sistemi, integrazioni, dati, attori e passaggi decisionali.`

2. `Assegnare`
   `Rendiamo esplicite responsabilità, ownership e punti di approvazione.`

3. `Verificare`
   `Colleghiamo controlli ed evidenze ai punti realmente critici del processo.`

### Risultati

Titolo:

`Cosa deve rimanere dopo l’analisi`

Mostra:

* mappa dell’architettura e dei flussi;
* matrice delle responsabilità;
* inventario dei dati e delle integrazioni;
* controlli esistenti e controlli mancanti;
* evidenze disponibili;
* punti che dipendono ancora da conoscenza implicita.

### Form

Titolo:

`Il tuo sistema riesce a spiegare come funziona?`

Testo:

`Descrivi brevemente il sistema o il processo che vuoi analizzare. Il primo passo è capire dove si trovano le informazioni mancanti.`

Pulsante:

`Richiedi un confronto`

## Landing 2 — Governance AI

Route:

`/landing/governance-ai`

Sorgente form:

`landing_ai_governance`

SEO title:

`Governance dei sistemi AI | Devisia`

Meta description:

`Definisci scopo, dati, responsabilità, limiti e controlli prima di introdurre un sistema AI.`

Eyebrow:

`AI governance`

Titolo hero:

`Prima del modello, serve un perimetro.`

Testo hero:

`La scelta della tecnologia arriva dopo. Prima bisogna stabilire quale problema deve risolvere il sistema AI, quali dati può utilizzare, chi ne risponde e come verificarne il comportamento.`

CTA hero:

`Definisci il perimetro`

### Sezione problema

Titolo:

`Un sistema AI senza ownership diventa un rischio non gestito.`

Testo:

`Molte iniziative AI iniziano dalla scelta del modello o da una sperimentazione tecnica. Quando il progetto entra in un processo reale emergono però domande diverse: chi autorizza l’utilizzo, quali dati sono ammessi, quali decisioni può influenzare, chi controlla gli output e come vengono gestiti gli errori.`

### Checklist

Titolo:

`Il perimetro minimo di un sistema AI`

Mostra:

* Purpose: quale problema deve risolvere?
* Data: quali dati può utilizzare e quali sono esclusi?
* Owner: chi è responsabile del sistema?
* Users: chi può utilizzarlo e in quali condizioni?
* Decisions: quali decisioni può supportare o influenzare?
* Human oversight: quando deve intervenire una persona?
* Controls: quali controlli verificano il comportamento?
* Evidence: quali informazioni devono essere conservate?

### Metodo

Titolo:

`Portare l’AI dentro un processo reale`

Mostra tre passaggi:

1. `Definire`
   `Formalizziamo scopo, utenti, dati ammessi e risultati attesi.`

2. `Limitare`
   `Stabiliamo confini operativi, decisioni escluse e supervisione umana.`

3. `Controllare`
   `Definiamo verifiche, logging, responsabilità ed evidenze.`

### Risultati

Titolo:

`Cosa deve esistere prima della produzione`

Mostra:

* scheda del sistema AI;
* scopo e perimetro di utilizzo;
* owner tecnico e owner di processo;
* dati consentiti e dati esclusi;
* matrice dei rischi;
* controlli operativi;
* supervisione umana;
* evidenze necessarie;
* criteri per sospendere o correggere il sistema.

### Form

Titolo:

`Stai valutando un sistema AI?`

Testo:

`Descrivi il caso d’uso, il processo coinvolto e i dati che il sistema dovrebbe trattare. La valutazione deve iniziare dal perimetro, non dal modello.`

Pulsante:

`Richiedi un confronto`

## Landing 3 — Processi prima dell’automazione

Route:

`/landing/processi-prima-automazione`

Sorgente form:

`landing_process_automation`

SEO title:

`Analisi dei processi prima dell’automazione | Devisia`

Meta description:

`Rendi espliciti responsabilità, decisioni ed eccezioni prima di automatizzare un processo.`

Eyebrow:

`Processi e automazione`

Titolo hero:

`Automatizzare un processo confuso significa renderlo confuso più velocemente.`

Testo hero:

`Il software non corregge automaticamente ambiguità, passaggi informali e responsabilità implicite. Prima di automatizzare bisogna definire come il processo dovrebbe realmente funzionare.`

CTA hero:

`Analizza il processo`

### Sezione problema

Titolo:

`Il debito tecnico può iniziare prima del codice.`

Testo:

`Quando un processo non è stato analizzato, il software finisce per incorporare eccezioni, duplicazioni e decisioni non formalizzate. Il risultato è un sistema pieno di correzioni manuali, integrazioni fragili e regole conosciute soltanto da alcune persone.`

### Segnali da mostrare

Titolo:

`Segnali di un processo non ancora pronto per essere automatizzato`

Mostra:

* le richieste arrivano attraverso canali diversi;
* la stessa informazione viene copiata più volte;
* le approvazioni avvengono tramite email o messaggi;
* alcune eccezioni dipendono dalla persona che gestisce il caso;
* nessuno possiede realmente il processo completo;
* le integrazioni compensano regole mai formalizzate;
* gli errori vengono corretti manualmente senza modificare il processo.

### Metodo

Titolo:

`Prima chiarire. Poi automatizzare.`

Mostra quattro passaggi:

1. `Stato attuale`
   `Ricostruiamo attività, attori, sistemi, documenti e passaggi manuali.`

2. `Decisioni`
   `Rendiamo esplicite regole, approvazioni, eccezioni e responsabilità.`

3. `Stato futuro`
   `Definiamo il processo corretto prima di tradurlo in software.`

4. `Perimetro tecnico`
   `Stabiliamo cosa automatizzare, cosa integrare e cosa deve restare sotto controllo umano.`

### Risultati

Titolo:

`Cosa deve essere definito prima dello sviluppo`

Mostra:

* mappa del processo attuale;
* colli di bottiglia e duplicazioni;
* responsabilità e punti decisionali;
* eccezioni operative;
* processo futuro;
* perimetro dell’automazione;
* integrazioni necessarie;
* requisiti verificabili.

### Form

Titolo:

`Quale processo stai cercando di automatizzare?`

Testo:

`Descrivi i passaggi attuali, i sistemi coinvolti e le attività che richiedono ancora interventi manuali.`

Pulsante:

`Richiedi un confronto`

## Landing 4 — Evidenze per l’audit

Route:

`/landing/evidenze-audit`

Sorgente form:

`landing_audit_evidence`

SEO title:

`Evidenze e preparazione all’audit | Devisia`

Meta description:

`Collega controlli, owner ed evidenze per evitare di ricostruire tutto durante un audit.`

Eyebrow:

`Audit readiness`

Titolo hero:

`L’audit dovrebbe verificare. Non ricostruire.`

Testo hero:

`Le evidenze devono nascere durante il processo, essere collegate ai controlli e avere ownership, data, validità e tracciabilità.`

CTA hero:

`Organizza le evidenze`

### Sezione problema

Titolo:

`Il giorno dell’audit è troppo tardi per iniziare a cercare le prove.`

Testo:

`Quando documenti, approvazioni e responsabilità sono distribuiti tra cartelle, email e persone diverse, ogni verifica diventa un lavoro di ricostruzione. Il problema non è soltanto trovare i file: è dimostrare a quale controllo appartengono, chi li ha prodotti e se sono ancora validi.`

### Modello operativo

Titolo:

`Ogni evidenza deve avere un contesto`

Mostra cinque elementi collegati:

* Control: quale requisito o controllo dimostra?
* Owner: chi è responsabile?
* Evidence: quale documento, registro o attività produce la prova?
* Frequency: con quale frequenza deve essere aggiornata?
* Validity: fino a quando può essere considerata valida?
* Traceability: chi l’ha prodotta e quando?

### Metodo

Titolo:

`Dalla raccolta manuale alla disponibilità continua`

Mostra tre passaggi:

1. `Collegare`
   `Associamo ogni controllo alle evidenze realmente necessarie.`

2. `Assegnare`
   `Definiamo owner, frequenza e responsabilità di aggiornamento.`

3. `Verificare`
   `Identifichiamo evidenze mancanti, scadute o non sufficientemente tracciabili.`

### Risultati

Titolo:

`Cosa deve essere disponibile prima dell’audit`

Mostra:

* registro dei controlli;
* mappa delle evidenze;
* owner per controllo ed evidenza;
* data di raccolta e validità;
* evidenze mancanti o scadute;
* storico delle verifiche;
* struttura esportabile per revisori e auditor.

### Form

Titolo:

`Quanto tempo richiede oggi ricostruire le evidenze?`

Testo:

`Descrivi il framework, l’audit o il processo di verifica che devi gestire. Il primo obiettivo è capire dove si trovano le prove e chi ne è responsabile.`

Pulsante:

`Richiedi un confronto`

# Form condiviso

Individua il form già utilizzato dal sito e dalla landing `/landing/devisia`.

Estrai o adatta un componente condiviso, evitando implementazioni diverse per ciascuna pagina.

Il form delle quattro nuove landing deve mantenere gli stessi campi, controlli, messaggi e stile dei form esistenti.

Quando possibile, usa questi campi normalizzati:

* nome e cognome;
* email di lavoro;
* azienda;
* ruolo, facoltativo;
* telefono, soltanto se già presente nei form esistenti;
* messaggio o descrizione;
* consenso privacy obbligatorio;
* consenso marketing facoltativo, soltanto se già previsto.

Non aggiungere campi non necessari.

Il link alla privacy policy deve utilizzare la pagina già presente nel sito.

Ogni form deve contenere automaticamente:

* `source`;
* `form_id`;
* `page_path`;
* `utm_source`;
* `utm_medium`;
* `utm_campaign`;
* `utm_content`;
* `utm_term`;
* `referrer`.

I parametri UTM devono essere letti dalla query string e mantenuti fino all’invio del form.

Non salvarli in cookie se non è necessario. Puoi conservarli temporaneamente in sessionStorage per evitare di perderli durante la navigazione interna.

Il form deve prevedere:

* validazione client-side;
* validazione server-side;
* messaggi di errore accessibili;
* stato di caricamento;
* prevenzione dei doppi invii;
* conferma dopo il salvataggio;
* honeypot invisibile;
* controllo di una durata minima ragionevole tra caricamento e invio;
* limiti di lunghezza lato server.

Non introdurre CAPTCHA salvo che sia già utilizzato nel progetto.

# Nuova tabella centralizzata dei lead

Riutilizza la stessa infrastruttura database utilizzata dal consenso chat, ma crea una tabella distinta.

Nome consigliato:

`lead_submissions`

Non modificare la tabella della chat.

Crea la nuova tabella seguendo il sistema di migration o inizializzazione già presente nel repository.

La tabella deve poter contenere submission provenienti da form leggermente diversi.

Struttura minima consigliata:

* `id`: UUID o identificativo equivalente;
* `created_at`: timestamp UTC;
* `source`: provenienza logica del lead;
* `form_id`: identificativo del form;
* `page_path`: pagina dalla quale è stato inviato;
* `full_name`;
* `email`;
* `company`;
* `role`, nullable;
* `phone`, nullable;
* `message`, nullable;
* `privacy_accepted`;
* `privacy_accepted_at`;
* `marketing_accepted`;
* `utm_source`, nullable;
* `utm_medium`, nullable;
* `utm_campaign`, nullable;
* `utm_content`, nullable;
* `utm_term`, nullable;
* `referrer`, nullable;
* `status`, con valore iniziale `new`;
* `metadata`, JSON o equivalente per eventuali campi aggiuntivi.

Se il database esistente non supporta UUID o JSON, adatta i tipi mantenendo lo stesso significato.

Aggiungi almeno gli indici utili per:

* data di creazione;
* email;
* source;
* status.

Non salvare:

* indirizzo IP;
* fingerprint;
* identificativi pubblicitari;
* dati del browser non necessari;
* informazioni non presenti esplicitamente nel form.

# Sorgenti da utilizzare

Usa valori coerenti e stabili:

* `/landing/sistemi-spiegabili`

  * `source = landing_system_explainability`

* `/landing/governance-ai`

  * `source = landing_ai_governance`

* `/landing/processi-prima-automazione`

  * `source = landing_process_automation`

* `/landing/evidenze-audit`

  * `source = landing_audit_evidence`

* `/landing/devisia`

  * `source = landing_devisia`

* form di contatto principale del sito

  * `source = website_contact`

Per eventuali altri form esistenti, assegna una source descrittiva e documentala.

`source` non deve essere accettato ciecamente dal browser.

Nel backend crea una whitelist delle sorgenti consentite oppure ricava la sorgente dal `form_id` e dal percorso previsto.

# Endpoint condiviso

Crea un solo endpoint server-side o una sola Netlify Function per salvare tutte le submission.

Nome indicativo:

`submit-lead`

Adatta il nome alle convenzioni del repository.

L’endpoint deve:

1. accettare soltanto richieste POST;
2. verificare il content type;
3. validare tutti i campi;
4. normalizzare email e testi;
5. verificare il consenso privacy;
6. controllare honeypot e tempo minimo;
7. verificare la source;
8. salvare nella tabella `lead_submissions`;
9. restituire una risposta JSON coerente;
10. non esporre errori interni o credenziali;
11. registrare gli errori tecnici nei log Netlify;
12. non stampare nei log l’intero contenuto del form.

Riutilizza il client database e le variabili ambiente già adottate dal consenso chat.

Le credenziali devono rimanere esclusivamente lato server.

Non creare una connessione diretta al database dal browser.

# Migrazione dei form esistenti

Aggiorna anche:

* tutti i form di contatto presenti nel sito;
* il form della landing `/landing/devisia`.

Questi form devono salvare nella nuova tabella `lead_submissions` attraverso lo stesso endpoint.

Mantieni invariati, per quanto possibile:

* aspetto;
* campi;
* testi;
* validazione;
* comportamento visibile;
* eventuali notifiche email già esistenti.

Se oggi una submission attiva anche una notifica email, mantieni la notifica dopo il corretto salvataggio nel database.

Evita di generare due record per lo stesso invio.

La nuova tabella deve diventare la fonte unica per le submission dei form del sito e delle landing.

Non migrare nella nuova tabella i consensi della chat.

# Accessibilità

Verifica:

* label associate ai campi;
* navigazione da tastiera;
* focus visibile;
* contrasto;
* messaggi di errore collegati ai campi;
* `aria-live` per stato di invio e conferma;
* heading ordinati;
* immagini con alt text corretto;
* rispetto di `prefers-reduced-motion`.

# SEO e condivisione

Per ogni pagina configura:

* title;
* meta description;
* canonical;
* Open Graph title;
* Open Graph description;
* Open Graph image;
* Twitter card;
* robots index e follow.

Utilizza come Open Graph image la creatività corrispondente, se presente.

Aggiungi dati strutturati soltanto se il progetto li gestisce già. Non introdurre markup artificiale o non pertinente.

# Tracciamento

Se il sito usa già Matomo, Google Analytics o un altro sistema, mantieni il sistema esistente.

Registra, se già compatibile con l’implementazione corrente:

* visualizzazione landing;
* click sulla CTA;
* avvio compilazione;
* invio completato;
* errore di invio.

Non aggiungere nuovi tracker.

Non inviare dati personali agli strumenti analytics.

# Qualità del codice

Mantieni:

* TypeScript, se già utilizzato;
* naming coerente;
* componenti piccoli;
* assenza di codice duplicato;
* separazione tra contenuti, presentazione e persistenza;
* gestione centralizzata delle source;
* gestione centralizzata della validazione;
* gestione centralizzata degli errori.

Non riscrivere parti non collegate alla richiesta.

Non modificare il design globale del sito.

# Verifiche finali

Prima di considerare concluso il lavoro, verifica:

1. Le quattro route rispondono correttamente.
2. Le pagine sono leggibili su desktop e mobile.
3. Tutti i form salvano nella nuova tabella.
4. Il form `/landing/devisia` continua a funzionare.
5. I form di contatto esistenti continuano a funzionare.
6. Ogni record contiene la source corretta.
7. I parametri UTM vengono salvati.
8. I consensi vengono salvati correttamente.
9. Un errore database viene mostrato all’utente con un messaggio comprensibile.
10. Un doppio click non genera due record.
11. Il consenso chat continua a usare la sua tabella originale.
12. Nessuna chiave database è presente nel bundle client.
13. La build Astro termina senza errori.
14. Le Netlify Function vengono compilate correttamente.
15. Non ci sono errori nella console del browser.

# Output finale richiesto

Al termine:

* elenca i file creati;
* elenca i file modificati;
* descrivi la tabella `lead_submissions`;
* indica le source configurate;
* segnala le variabili ambiente richieste;
* spiega come verificare una submission in locale e su Netlify;
* indica eventuali migration o comandi da eseguire;
* segnala chiaramente eventuali aspetti che non hai potuto verificare;
* non limitarti a descrivere il codice: implementa le modifiche nel repository.

# Email di conferma per le quattro landing

Dopo il corretto salvataggio della submission nella tabella `lead_submissions`, invia all’utente un’email transazionale di conferma.

L’email deve:

* essere inviata soltanto dopo il salvataggio riuscito del record;
* utilizzare l’indirizzo email inserito nel form;
* essere diversa per ciascuna delle quattro landing;
* essere coerente con il problema affrontato dalla pagina;
* essere semplice, testuale e leggibile;
* non avere un tono commerciale;
* non contenere promesse automatiche sui tempi di risposta;
* non iscrivere l’utente a newsletter o comunicazioni marketing;
* non dipendere dal consenso marketing;
* non contenere pixel di tracciamento;
* non includere dati personali oltre al nome, se disponibile;
* includere i riferimenti essenziali di Devisia e il link alla privacy policy.

Il messaggio di conferma è una comunicazione di servizio relativa alla richiesta inviata.

## Infrastruttura email

Prima di implementare l’invio:

1. verifica se il repository utilizza già un provider email;
2. individua eventuali funzioni condivise per l’invio;
3. individua mittente, reply-to, template e variabili ambiente già configurati;
4. riutilizza l’infrastruttura esistente.

Non introdurre un nuovo provider se è già disponibile una soluzione funzionante.

Se non esiste ancora un sistema di invio email:

* crea un servizio server-side isolato;
* non effettuare invii direttamente dal browser;
* configura il provider tramite variabili ambiente;
* non inserire credenziali nel repository;
* utilizza preferibilmente il provider già compatibile con l’infrastruttura Netlify del progetto.

Nome mittente consigliato:

`Devisia`

Indirizzo mittente:

riutilizza l’indirizzo transazionale già configurato nel progetto.

Reply-to:

utilizza l’indirizzo di contatto Devisia già presente nel sito.

## Flusso della submission

Il flusso deve essere:

1. validazione server-side;
2. salvataggio nella tabella `lead_submissions`;
3. eventuale notifica interna già prevista;
4. invio dell’email di conferma all’utente;
5. risposta positiva al browser.

Il record non deve essere annullato se l’invio email fallisce.

Se il salvataggio riesce ma l’email non viene inviata:

* conserva comunque il lead;
* registra nei log soltanto l’identificativo del record e il tipo di errore;
* non registrare l’intero contenuto del form;
* restituisci comunque all’utente la conferma della ricezione;
* non mostrare dettagli tecnici.

Evita che un retry della richiesta generi:

* un secondo record;
* una seconda email di conferma.

Se il progetto dispone già di un meccanismo di idempotenza, riutilizzalo.

In alternativa, valuta un identificativo univoco della submission generato lato client e verificato lato server.

## Template condiviso

Crea un unico template email configurabile.

Il template deve ricevere almeno:

* `fullName`;
* `email`;
* `source`;
* `subject`;
* `heading`;
* `bodyParagraphs`;
* `nextStepText`;
* `privacyUrl`;
* `contactUrl`.

Il saluto deve essere:

* `Buongiorno [Nome],` se il nome è disponibile;
* `Buongiorno,` se il nome non è disponibile.

Utilizza sia una versione HTML sia una versione plain text.

L’HTML deve essere minimale:

* larghezza massima leggibile;
* font di sistema;
* nessuna immagine obbligatoria;
* nessuna animazione;
* nessun contenuto remoto non necessario;
* link chiaramente riconoscibili;
* struttura accessibile;
* compatibilità con i principali client email.

Non utilizzare allegati.

## Email landing 1 — Sistemi spiegabili

Source:

`landing_system_explainability`

Oggetto:

`Abbiamo ricevuto la tua richiesta sul sistema`

Titolo email:

`Rendere un sistema comprensibile è il primo controllo`

Testo:

`Abbiamo ricevuto la tua richiesta.`

`Un sistema può funzionare correttamente e, allo stesso tempo, essere difficile da spiegare. In questi casi il primo passo non è aggiungere altra documentazione, ma ricostruire in modo chiaro flussi di dati, responsabilità, approvazioni, controlli ed evidenze.`

`Le informazioni che hai inviato ci aiuteranno a capire quale parte del sistema o del processo richiede maggiore chiarezza e quali elementi dipendono ancora da conoscenza implicita.`

Passaggio successivo:

`Esamineremo la richiesta e ti contatteremo utilizzando i riferimenti che hai indicato nel form.`

Chiusura:

`Stefano Chermaz`
`Devisia`

Versione completa indicativa:

`Buongiorno [Nome],`

`abbiamo ricevuto la tua richiesta.`

`Un sistema può funzionare correttamente e, allo stesso tempo, essere difficile da spiegare. In questi casi il primo passo non è aggiungere altra documentazione, ma ricostruire in modo chiaro flussi di dati, responsabilità, approvazioni, controlli ed evidenze.`

`Le informazioni che hai inviato ci aiuteranno a capire quale parte del sistema o del processo richiede maggiore chiarezza e quali elementi dipendono ancora da conoscenza implicita.`

`Esamineremo la richiesta e ti contatteremo utilizzando i riferimenti che hai indicato nel form.`

`Stefano Chermaz`
`Devisia`

## Email landing 2 — Governance AI

Source:

`landing_ai_governance`

Oggetto:

`Abbiamo ricevuto la tua richiesta sulla governance AI`

Titolo email:

`La governance inizia prima della scelta del modello`

Testo:

`Abbiamo ricevuto la tua richiesta.`

`Per valutare correttamente un sistema AI è necessario partire dal suo perimetro: problema da risolvere, dati utilizzabili, responsabilità, utenti, decisioni influenzate, limiti e controlli.`

`Le informazioni che hai condiviso serviranno a inquadrare il caso d’uso e a capire quali elementi devono essere definiti prima di portare il sistema dentro un processo aziendale reale.`

Passaggio successivo:

`Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.`

Chiusura:

`Stefano Chermaz`
`Devisia`

Versione completa indicativa:

`Buongiorno [Nome],`

`abbiamo ricevuto la tua richiesta.`

`Per valutare correttamente un sistema AI è necessario partire dal suo perimetro: problema da risolvere, dati utilizzabili, responsabilità, utenti, decisioni influenzate, limiti e controlli.`

`Le informazioni che hai condiviso serviranno a inquadrare il caso d’uso e a capire quali elementi devono essere definiti prima di portare il sistema dentro un processo aziendale reale.`

`Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.`

`Stefano Chermaz`
`Devisia`

## Email landing 3 — Processi prima dell’automazione

Source:

`landing_process_automation`

Oggetto:

`Abbiamo ricevuto la tua richiesta sul processo`

Titolo email:

`Prima dell’automazione viene la chiarezza`

Testo:

`Abbiamo ricevuto la tua richiesta.`

`Quando un processo contiene passaggi informali, duplicazioni, eccezioni non documentate o responsabilità implicite, l’automazione tende a trasferire la stessa complessità nel software.`

`Le informazioni che hai inviato ci permetteranno di comprendere il processo attuale, individuare i punti che richiedono ancora interventi manuali e distinguere ciò che deve essere chiarito da ciò che può essere realmente automatizzato.`

Passaggio successivo:

`Esamineremo il processo descritto e ti contatteremo utilizzando i riferimenti indicati nel form.`

Chiusura:

`Stefano Chermaz`
`Devisia`

Versione completa indicativa:

`Buongiorno [Nome],`

`abbiamo ricevuto la tua richiesta.`

`Quando un processo contiene passaggi informali, duplicazioni, eccezioni non documentate o responsabilità implicite, l’automazione tende a trasferire la stessa complessità nel software.`

`Le informazioni che hai inviato ci permetteranno di comprendere il processo attuale, individuare i punti che richiedono ancora interventi manuali e distinguere ciò che deve essere chiarito da ciò che può essere realmente automatizzato.`

`Esamineremo il processo descritto e ti contatteremo utilizzando i riferimenti indicati nel form.`

`Stefano Chermaz`
`Devisia`

## Email landing 4 — Evidenze per l’audit

Source:

`landing_audit_evidence`

Oggetto:

`Abbiamo ricevuto la tua richiesta sulle evidenze`

Titolo email:

`Le evidenze devono esistere prima dell’audit`

Testo:

`Abbiamo ricevuto la tua richiesta.`

`Prepararsi a un audit non dovrebbe significare ricostruire attività, responsabilità e documenti distribuiti tra cartelle, email e persone diverse. Le evidenze devono essere collegate ai controlli, avere un owner ed essere disponibili durante il normale funzionamento del processo.`

`Le informazioni che hai inviato ci aiuteranno a comprendere il framework o la verifica da affrontare e a individuare dove si trovano oggi le principali difficoltà nella raccolta delle prove.`

Passaggio successivo:

`Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.`

Chiusura:

`Stefano Chermaz`
`Devisia`

Versione completa indicativa:

`Buongiorno [Nome],`

`abbiamo ricevuto la tua richiesta.`

`Prepararsi a un audit non dovrebbe significare ricostruire attività, responsabilità e documenti distribuiti tra cartelle, email e persone diverse. Le evidenze devono essere collegate ai controlli, avere un owner ed essere disponibili durante il normale funzionamento del processo.`

`Le informazioni che hai inviato ci aiuteranno a comprendere il framework o la verifica da affrontare e a individuare dove si trovano oggi le principali difficoltà nella raccolta delle prove.`

`Esamineremo il contesto indicato e ti contatteremo utilizzando i riferimenti presenti nel form.`

`Stefano Chermaz`
`Devisia`

## Link finali

In fondo a tutte le email aggiungi:

* link al sito Devisia;
* link alla pagina contatti;
* link alla privacy policy.

Testo indicativo:

`Hai ricevuto questa email perché hai inviato una richiesta attraverso il sito Devisia.`

Non inserire il link di disiscrizione, perché non si tratta di una comunicazione marketing.

## Configurazione centralizzata

Crea una configurazione centralizzata associata alla source, per esempio:

```ts
const leadEmailTemplates = {
  landing_system_explainability: {
    subject: "Abbiamo ricevuto la tua richiesta sul sistema",
    heading: "Rendere un sistema comprensibile è il primo controllo",
    // ...
  },
  landing_ai_governance: {
    subject: "Abbiamo ricevuto la tua richiesta sulla governance AI",
    heading: "La governance inizia prima della scelta del modello",
    // ...
  },
  landing_process_automation: {
    subject: "Abbiamo ricevuto la tua richiesta sul processo",
    heading: "Prima dell’automazione viene la chiarezza",
    // ...
  },
  landing_audit_evidence: {
    subject: "Abbiamo ricevuto la tua richiesta sulle evidenze",
    heading: "Le evidenze devono esistere prima dell’audit",
    // ...
  }
};
```

Non inserire i testi direttamente nella Netlify Function.

Mantieni separati:

* contenuti delle email;
* rendering HTML;
* rendering plain text;
* provider di invio;
* logica della submission.

## Form esistenti

Per il form della landing `/landing/devisia` e per i form di contatto già presenti, verifica se viene già inviata un’email automatica.

Se esiste:

* mantieni il comportamento attuale;
* adegua l’invio al nuovo endpoint condiviso;
* evita email duplicate.

Se non esiste:

* non creare nuovi testi senza verificare il contenuto e il contesto dei form;
* predisponi comunque l’architettura affinché possano utilizzare lo stesso sistema di template.

## Stato dell’invio email

Valuta l’aggiunta nella tabella `lead_submissions` dei seguenti campi:

* `confirmation_email_status`, con valori `pending`, `sent`, `failed`;
* `confirmation_email_sent_at`, nullable;
* `confirmation_email_error`, nullable e limitato a un codice tecnico non sensibile.

Valore iniziale:

`pending`

Dopo l’invio corretto:

* `confirmation_email_status = sent`;
* valorizza `confirmation_email_sent_at`.

In caso di errore:

* `confirmation_email_status = failed`;
* salva soltanto un codice sintetico;
* non salvare stack trace, credenziali o risposta completa del provider.

Se l’architettura esistente rende più corretto utilizzare una tabella separata per gli eventi email, mantieni `lead_submissions` semplice e documenta la scelta.

## Verifiche finali aggiuntive

Prima di considerare concluso il lavoro, verifica anche:

1. Ogni landing invia il template corretto.
2. Il nome viene utilizzato correttamente nel saluto.
3. Il fallback senza nome funziona.
4. La versione HTML viene visualizzata correttamente.
5. La versione plain text contiene tutte le informazioni.
6. Nessuna email viene inviata se il salvataggio fallisce.
7. Il lead rimane salvato se il provider email non risponde.
8. Un doppio invio non produce due email.
9. Il reply-to è corretto.
10. Nessuna credenziale email è presente nel codice client.
11. I link a sito, contatti e privacy sono corretti.
12. Le email non dipendono dal consenso marketing.
13. Il consenso chat continua a funzionare senza modifiche.
14. Lo stato dell’email viene registrato correttamente.

Nell’output finale indica anche:

* provider email utilizzato;
* file dei template creati;
* variabili ambiente necessarie;
* mittente e reply-to configurati;
* modalità di test locale;
* modalità di test su Netlify;
* eventuali limiti del provider;
* risultato di un invio di prova per ciascuna source.
