---
title: Google Consent Mode v2 per technical leader
description: >-
  Una guida pragmatica per CTO su Google Consent Mode v2: architettura, opzioni
  di implementazione e come mantenere la conformità al GDPR.
pubDate: 2026-03-11T10:25:17.587Z
heroImage: >-
  https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/df70cce6-a33c-4397-ba53-13f420c6c7ca/consent-mode-v2-guide.jpg
author: Devisia AI
tags:
  - consent mode v2
  - gdpr compliance
  - data privacy
  - google analytics
  - data governance
translationSlug: consent-mode-v-2
translationSourceHash: 52af6c3c8701ae4264d625110a52e6cf353023e5fb2bd22732d819cafb671117
---
A partire da marzo 2024, Google Consent Mode v2 è un requisito non negoziabile per le aziende che servono utenti nello Spazio economico europeo (SEE) e nel Regno Unito. Se non viene implementato correttamente, si traduce in una perdita immediata di dati e in un calo delle performance pubblicitarie. Per founder, CTO e leader di prodotto, non si tratta di un’astrazione legale, ma di un problema architetturale urgente con conseguenze dirette sul business.

## Il problema: perché non agire non è più un’opzione

Normative sulla privacy come il GDPR e il Digital Markets Act (DMA) hanno cambiato in modo sostanziale le regole per la raccolta dei dati. L’epoca del consenso presunto è finita. Ignorare il nuovo contesto crea due criticità immediate per qualsiasi business data-driven.

Il problema di fondo è questo: le tue piattaforme di analytics e advertising, in particolare quelle di Google, richiedono un flusso continuo di dati degli utenti per misurare le performance, creare audience e ottimizzare la spesa. Senza un consenso esplicito e segnalato dagli utenti, questo flusso si interrompe per una parte significativa del tuo pubblico, generando lacune critiche nella visibilità.

### Le conseguenze di un’implementazione ingenua

Trattare Consent Mode v2 come una semplice casella da spuntare per marketing o compliance è un errore strategico. Un approccio superficiale basato sul solo “cookie banner” non basta più ed espone il business a rischi rilevanti.

*   **Perdita di dati e peggioramento delle performance:** senza una corretta implementazione di Consent Mode v2, Google blocca i nuovi dati degli utenti del SEE e del Regno Unito per advertising e personalizzazione. In pratica, le audience di remarketing smettono di crescere e il targeting delle campagne diventa progressivamente meno efficace.
*   **Sanzioni legali e finanziarie pesanti:** il DMA offre ai regolatori un mandato chiaro per imporre multe sostanziali in caso di non conformità. Non è un rischio teorico, ma una minaccia economica concreta per le organizzazioni che non adeguano la propria architettura tecnica.

Per un’azienda B2B software, l’impatto è tangibile. Immagina campagne di lead generation che perdono la capacità di ritargetizzare prospect ad alto intento che hanno visitato la pagina dei prezzi. Oppure il team di prodotto che perde visibilità su come gli utenti dei mercati europei chiave interagiscono con le nuove funzionalità. Questa è la realtà di un’operatività senza una corretta architettura di Consent Mode v2.

> Un approccio superficiale considera Consent Mode v2 come un ostacolo legale da superare con un banner. Un approccio pragmatico, orientato all’architettura, lo riconosce per quello che è: un sistema necessario per governare i flussi di dati e garantire la continuità operativa in un contesto privacy-centric. È una scelta tecnica di base, non un’attività di compliance da affrontare all’ultimo minuto.

Questo cambiamento ha reso un’implementazione robusta una necessità centrale, sia per il business sia per la tecnologia.

## La soluzione: una nuova architettura per la segnalazione del consenso

Consent Mode v2 non è un semplice aggiornamento: introduce un nuovo pattern architetturale per la gestione dei segnali di consenso degli utenti. Il cambiamento fondamentale consiste nel separare l’archiviazione dei dati dal loro utilizzo.

La versione originale di Consent Mode introduceva due parametri: `analytics_storage` e `ad_storage`. Questi controllano se i tag Google possono leggere o scrivere cookie per finalità di analytics e advertising. Se l’utente nega il consenso, il cookie non viene memorizzato. Questi parametri restano anche nella v2.

### I nuovi segnali che governano il trattamento dei dati

Consent Mode v2 aggiunge due nuovi parametri, più rilevanti, che governano il modo in cui i dati vengono *trattati* e *utilizzati* dai servizi Google, anche quando sono raccolti senza cookie.

*   **`ad_user_data`**: questo parametro controlla se i dati dell’utente possono essere inviati a Google per finalità pubblicitarie. Se un utente nega `ad_user_data`, tutti gli identificativi utente vengono rimossi dai dati prima della trasmissione, anche se `ad_storage` è stato concesso.
*   **`ad_personalization`**: questo parametro governa in modo specifico il remarketing e la pubblicità personalizzata. Quando un utente nega `ad_personalization`, stai dicendo a Google di non usare i suoi dati per creare o targettizzare audience pubblicitarie.

Questo controllo granulare allinea il comportamento dei tag in modo più coerente con i principi GDPR di limitazione delle finalità e minimizzazione dei dati. Consente a un utente di acconsentire alla misurazione aggregata degli annunci (`ad_storage`) e, allo stesso tempo, di rifiutare il tracciamento personalizzato (`ad_personalization`).

![Mappa concettuale di Consent Mode V2 che mostra i requisiti business principali legati alle normative privacy, all’evitamento delle sanzioni e alla riduzione della perdita di dati.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/4cc81f95-a4aa-4cc2-8ea7-0093dbd287a0/consent-mode-v2-concept-map.jpg)

La nuova architettura collega direttamente i requisiti legali all’implementazione tecnica, rendendo la compliance una funzione del design di sistema, non del controllo manuale.

### Confronto dei segnali: Consent Mode v1 vs. v2

| Segnale | Consent Mode v1 | Consent Mode v2 | Funzione principale |
| :--- | :---: | :---: | :--- |
| `analytics_storage` | ✓ | ✓ | Controlla l’archiviazione dei cookie di analytics. |
| `ad_storage` | ✓ | ✓ | Controlla l’archiviazione dei cookie pubblicitari. |
| `ad_user_data` | | ✓ | Regola l’invio dei dati utente a Google per finalità pubblicitarie. |
| `ad_personalization` | | ✓ | Regola la pubblicità personalizzata e il remarketing. |

L’aggiunta dei due nuovi segnali cambia in modo sostanziale la gestione del consenso, passando da un modello semplice basato sull’archiviazione a uno più evoluto, basato sull’utilizzo dei dati.

### Tracciare il flusso dei segnali: un pattern architetturale

L’implementazione segue un pattern chiaro e prevedibile:

1.  **Interazione dell’utente**: un utente visita il sito e visualizza un banner della Consent Management Platform (CMP). Effettua una scelta (ad esempio “Accetta tutto”, “Rifiuta tutto” oppure una selezione personalizzata).
2.  **Trasmissione del segnale**: la CMP traduce questa scelta nei quattro segnali di consenso (`granted` o `denied`) e li comunica al tag Google (`gtag.js`) presente nella pagina.
3.  **Adattamento del comportamento**: il tag Google modifica il proprio comportamento in tempo reale in base ai segnali ricevuti. Se `ad_personalization` è `denied`, le funzionalità di remarketing vengono disattivate immediatamente per quell’utente.

Questo approccio automatizzato e programmabile riduce al minimo il rischio di errori umani nelle configurazioni dei tag. Evidenzia anche perché sia fondamentale conoscere bene i modelli [explicit opt-in vs opt-out](https://devisia.pro/blog/opt-in-opt-out) per realizzare un’implementazione conforme.

## Trade-off di implementazione: modalità Basic vs Advanced

La prima decisione architetturale in un’implementazione di Consent Mode v2 è la scelta tra modalità “Basic” e “Advanced”. Non si tratta solo di un interruttore tecnico, ma di una decisione strategica con trade-off rilevanti tra privacy assoluta ed esigenza pratica di modellazione dei dati.

![Illustrazione che confronta le modalità di gestione base e avanzata dei dati, mostrando dati bloccati contro ping anonimizzati per la modellazione.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/8edc84f8-56fd-4446-9948-ce399d24567d/consent-mode-v2-data-modes.jpg)

### Implementazione Basic: il blocco totale

La modalità Basic funziona come un semplice interruttore on/off. Se l’utente nega il consenso, tutti i tag Google vengono bloccati e non attivano alcuna chiamata. Nessun dato viene inviato a Google da quell’utente.

*   **Architettura**: la CMP o il tag manager impedisce il caricamento dei tag Google se il consenso non viene concesso.
*   **Vantaggio**: è il percorso più semplice verso la compliance e offre la tutela privacy più rigorosa per gli utenti che rifiutano. L’argomentazione in termini di conformità è lineare.
*   **Vincolo**: crea un buco nero di dati per gli utenti che non acconsentono. Questo comporta **zero visibilità** su quel segmento di traffico, con il rischio di alterare in modo significativo le analytics e peggiorare le performance dei modelli pubblicitari basati su machine learning.

Per le organizzazioni con un’interpretazione estremamente restrittiva delle regole privacy o che privilegiano la semplicità implementativa rispetto alla completezza dei dati, la modalità Basic è una scelta valida. Però comporta una perdita di dati rilevante.

### Implementazione Advanced: l’approccio sfumato

La modalità Advanced offre una soluzione più sofisticata. Invece di bloccare i tag, li lascia caricarsi ma ne modifica il comportamento in base allo stato di consenso dell’utente. Se l’utente nega il consenso, i tag inviano a Google segnali **anonimizzati** e senza cookie (ping).

Questi ping non contengono identificativi personali e vengono usati per la modellazione statistica aggregata, così da stimare il comportamento degli utenti e le conversioni che altrimenti andrebbero perse.

> **Importante**: la modalità Advanced non è un escamotage per la compliance. È una tecnologia specifica, orientata alla privacy, progettata per la modellazione statistica tramite segnali anonimizzati, non per tracciare singoli utenti che hanno negato il consenso.

Questa implementazione richiede una configurazione tecnica più attenta. I tag devono essere impostati per caricarsi *prima* che compaia il banner del consenso, con uno stato predefinito “denied”. Poi ascoltano la scelta dell’utente e adattano la raccolta dati in tempo reale.

Se implementata correttamente, la modalità Advanced abilita la conversion modeling, che aiuta a mantenere accurata la misurazione delle performance e l’efficacia delle strategie di bidding automatico. Puoi approfondire i dati sull’impatto su revenue e performance degli annunci per capire il razionale di business.

### Principali trade-off architetturali

| Fattore | Implementazione Basic | Implementazione Advanced |
| :--- | :--- | :--- |
| **Dati dagli utenti non consenzienti** | **Zero.** Perdita totale dei dati. | **Ping anonimizzati.** Consente la modellazione. |
| **Conversion modeling** | **Non possibile.** Restano lacune nei dati. | **Abilitato.** Recupera i dati di conversione persi. |
| **Complessità di implementazione** | **Più bassa.** Logica più semplice per bloccare i tag. | **Più alta.** Richiede stati di consenso predefiniti e un sequencing accurato dei tag. |
| **Rischio di compliance** | **Più basso.** Più semplice da difendere e da auditare. | **Basso, ma richiede validazione.** Deve essere coerente con l’interpretazione legale ed essere implementato correttamente. |

La scelta tra modalità Basic e Advanced è architetturale e ha conseguenze di lungo periodo. Per la maggior parte delle aziende data-driven, la modalità Advanced offre vantaggi significativi, ma richiede un’implementazione rigorosa e ben documentata.

## L’impatto business della modellazione dei dati

La scelta tra implementazione Basic e Advanced ha implicazioni finanziarie dirette. La capacità della modalità Advanced di abilitare la conversion modeling è il suo principale vantaggio di business, perché aiuta a mitigare l’impatto negativo della perdita di dati su ricavi e return on ad spend (ROAS).

<iframe width="100%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/CUR6rKrIEGc" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Recuperare conversioni perse con dati anonimizzati

Quando un utente nega il consenso in un’implementazione Advanced, i ping senza cookie inviati a Google contengono informazioni aggregate e non identificative, come il tipo di dispositivo o l’evento di conversione attivato.

I modelli di Google usano questi dati per stimare le conversioni del cluster di utenti non consenzienti, colmando le lacune di misurazione create dai dinieghi del consenso. Questo restituisce una lettura più accurata delle performance delle campagne, fondamentale per prendere decisioni corrette su budget e prodotto.

### Il vincolo della soglia dati

Questa capacità di modellazione non è automatica. È soggetta a una soglia di volume dati, un vincolo critico per molte aziende.

> Advanced Mode can recover a significant portion of lost conversions, but only if the property meets specific data thresholds. A Google Analytics property needs at least **1,000 daily events with `ad_storage` or `analytics_storage` set to 'denied' for a minimum of 7 days**, alongside 1,000 daily users sending events with consent. For early-stage companies or products with niche audiences, meeting this threshold is a significant challenge. Failing to meet it means you get no modeling benefit, even with an Advanced setup. More details can be found in [this analysis of Consent Mode v2](https://matomo.org/blog/2024/05/consent-mode-v2/).

Questo minimo di dati è un vincolo rigido. Se il tuo sito o la tua applicazione non genera traffico sufficiente, non potrai sbloccare la conversion modeling.

### Uno scenario reale per un B2B SaaS

Prendi il caso di un’azienda B2B SaaS che usa Google Ads per generare richieste di demo da un pubblico europeo con tassi di consenso bassi.

*   **Con la Basic Mode:** vedi solo le conversioni degli utenti che hanno prestato consenso. Il ROAS riportato risulta artificialmente basso, le strategie di bidding automatico hanno meno dati su cui lavorare e potresti concludere per errore che una campagna non sia redditizia, con conseguenti decisioni sbagliate sull’allocazione del budget.
*   **Con la Advanced Mode (e traffico sufficiente):** il sistema modella una parte delle conversioni del gruppo che non ha prestato consenso. Il ROAS riportato in Google Ads è più accurato. Gli algoritmi di smart bidding hanno un dataset più ricco e i report di GA4 restituiscono un quadro più fedele delle performance.

Questi dati recuperati forniscono la stabilità necessaria per una gestione efficace delle campagne e per decisioni guidate dai dati. Integrare questa capacità è un tassello fondamentale per costruire una [Data Management Platform](https://devisia.pro/blog/data-management-platform) resiliente, capace di adattarsi a un contesto di privacy in continua evoluzione.

## A Practical Implementation and Migration Checklist

Il rollout di Consent Mode v2, se fatto bene, è un progetto infrastrutturale metodico. Richiede un audit preciso dell’architettura attuale, una scelta accurata degli strumenti e delle integrazioni, oltre a test rigorosi.

![Una clipboard con una checklist per la configurazione del tracciamento web, inclusi GTM e l’integrazione CMP.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/4e02c8bc-f63d-4df5-b646-1bcde55ec0d2/consent-mode-v2-checklist.jpg)

Segui questa checklist per fasi per un’implementazione solida e conforme.

### Phase 1: Audit the Current Technical Framework

Prima di introdurre qualsiasi modifica, devi avere una mappa precisa dell’architettura di raccolta dati già in uso.

1.  **Map All Tracking Tags:** identifica ogni script presente sul sito o sull’applicazione che raccoglie dati utente. Non si tratta solo dei tag Google, ma anche di pixel di analytics, script pubblicitari, strumenti di session replay e tracker CRM. Documenta quali dati raccolgono e dove li inviano.
2.  **Review Existing Consent Mechanism:** il banner attuale è conforme agli standard del [GDPR](https://gdpr-info.eu/)? Blocca i tag prima del consenso, come nel pattern Basic, oppure consente il caricamento con uno stato predefinito `denied` – requisito necessario per la Advanced Mode?
3.  **Document Data Flows:** traccia il percorso dei dati utente dalle tue proprietà digitali verso piattaforme di terze parti come [Google Analytics](https://analytics.google.com/) e [Google Ads](https://ads.google.com/). Questo lavoro mette in evidenza i gap di conformità che Consent Mode v2 è pensato per colmare.

### Phase 2: Select and Integrate a Certified CMP

La tua Consent Management Platform (CMP) è il cardine dell’implementazione. È il motore che traduce la scelta dell’utente nei segnali tecnici richiesti dai tag di Google.

*   **Mandate Google-Certified CMPs:** non è opzionale. Devi scegliere una CMP presente nella [lista dei partner certificati di Google](https://cmppartnerprogram.withgoogle.com/). Queste piattaforme sono progettate per dialogare con Consent Mode v2 e garantire che i nuovi segnali `ad_user_data` e `ad_personalization` vengano trasmessi correttamente. Usare una soluzione non certificata espone a un rischio elevato di errori nei segnali e di non conformità.
*   **Configure CMP Categories:** mappa le categorie di consenso visibili all’utente nella tua CMP, per esempio “Marketing” e “Analytics”, sui quattro segnali di consenso di Google. Ad esempio, se un utente deseleziona la categoria “Marketing”, la CMP deve essere configurata per impostare `ad_storage`, `ad_user_data` e `ad_personalization` su `denied`. Questo mapping è uno dei punti più delicati e più esposti a errori.

> Un errore comune è pensare che qualsiasi banner cookie sia sufficiente. Una CMP certificata è uno strumento di orchestrazione, non un semplice elemento di interfaccia. Gestisce l’intero processo di signaling del consenso, assicurando che l’implementazione tecnica rifletta davvero l’intenzione dell’utente e i requisiti normativi.

### Phase 3: Configure Tags and Default States

Questa fase si concentra sull’implementazione tecnica nel tuo sistema di tag management. L’obiettivo è assicurare che nessun dato venga raccolto prima che sia stato dichiarato il corretto stato di consenso. È un passaggio obbligatorio per un’implementazione conforme della Advanced Mode.

1.  **Set Default Consent States:** prima che qualsiasi tag Google venga eseguito, devi impostare uno stato di consenso predefinito su `denied` per tutti e quattro i parametri. Questo comando indica ai tag di assumere che il consenso non sia stato concesso finché l’utente non comunica esplicitamente il contrario.

    ```javascript
    // Set default consent to 'denied' before any tags fire
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
    ```

2.  **Fire Tags Unconditionally (Advanced Mode):** in una configurazione Advanced, imposta i trigger di [Google Tag Manager](https://tagmanager.google.com/) in modo che i tag Google si attivino al caricamento della pagina, indipendentemente dal consenso. Saranno i tag stessi a regolarsi in base allo stato predefinito `denied`.
3.  **Update Consent on User Interaction:** la CMP intercetta la scelta dell’utente e, al momento dell’interazione, invia un comando di consenso `update`, modificando gli stati da `denied` a `granted` in base al caso.

### Phase 4: Validate and Monitor the Implementation

I test rigorosi, basati su scenari reali, non sono negoziabili. Devi verificare che la configurazione si comporti come previsto in ogni possibile stato di consenso.

*   **Use Google Tag Assistant:** in modalità preview, usa la scheda "Consent" per verificare che lo stato "On-Page Default" sia `denied` per tutti i parametri. Poi interagisci con il banner di consenso e osserva "On-Page Update" per confermare che gli stati cambino correttamente.
*   **Inspect GA4's DebugView:** dopo aver concesso il consenso, esamina le richieste di rete in DebugView. Cerca il parametro `gcs` associato agli eventi, per esempio `gcs=G111`. Questo parametro fornisce una conferma leggibile dalle macchine dello stato di consenso inviato con ogni hit. Uno stato come `G100` indicherebbe che il consenso per la pubblicità è stato negato, come previsto.

Seguire questi passaggi ti permette di costruire un sistema architettonicamente solido, conforme e con basi affidabili per la tua strategia dati.

## Long-Term Governance and Compliance Risks

Implementare Consent Mode v2 non è un progetto da chiudere una volta sola: è l’inizio di un impegno continuativo di governance. Trattarlo come un’attività da "imposta e dimentica" espone l’organizzazione a rischi legali e finanziari significativi.

Il mandato del 2024 ha alzato la posta in gioco sul piano legale, soprattutto per le aziende europee. Le sanzioni previste dal GDPR possono essere pesanti e [i dettagli del mandato Consent Mode v2](https://www.globalreach.com/global-reach-media/blog/2026/01/12/consent-mode-v2-explained) indicano che i controlli diventeranno più rigorosi.

### Aligning Technical Implementation with Legal Policy

Un punto di rottura frequente è lo scollamento tra la privacy policy pubblica dell’azienda e l’implementazione tecnica. Una privacy policy è un documento con valore legale. Se afferma che i dati non saranno usati per attività pubblicitarie senza consenso, la configurazione di Consent Mode v2 deve far rispettare quella regola senza eccezioni.

> Il rischio di conformità più grande non è un bug tecnico, ma il disallineamento tra ciò che i documenti legali promettono e ciò che i sistemi fanno davvero. Gli audit servono proprio a trovare questo scarto.

Gestire questo rischio richiede una governance proattiva:

*   **Document Everything:** conserva una documentazione dettagliata della logica di consenso, incluso il mapping tra le categorie della CMP e i segnali di Google, oltre alla motivazione della scelta tra implementazione Basic o Advanced.
*   **Conduct Regular Audits:** pianifica audit interni periodici per rivedere e confermare la configurazione con strumenti come Google Tag Assistant. Verifica che i tag vengano eseguiti, o bloccati, come previsto e che non siano stati introdotti nuovi script non governati.
*   **Version Control for Policies and Configurations:** la privacy policy e la configurazione del consenso devono essere gestite in modo coordinato. Una modifica all’una deve attivare una revisione e, se necessario, un aggiornamento dell’altra.

### Building a Sustainable First-Party Data Strategy

Consent Mode v2 è parte integrante del più ampio passaggio architetturale verso una strategia dati first-party, orientata alla privacy. Il vantaggio competitivo di lungo periodo andrà alle aziende che costruiscono sistemi basati sulla fiducia degli utenti e sulla trasparenza.

Questo richiede un approccio di "privacy by design". Una governance dei dati solida, supportata da un chiaro [Data Processing Agreement](https://devisia.pro/blog/contratto-trattamento-dati), è il fondamento di questa strategia. Costruendo sistemi che rispettano le scelte degli utenti, non stai solo adempiendo a un obbligo legale: stai creando un’azienda più resiliente e più preziosa.

## Frequently Asked Questions About Consent Mode V2

Di seguito trovi le risposte alle domande tecniche e strategiche più comuni su Consent Mode v2.

### Do I need Consent Mode v2 if I do not use Google Ads?

Sì. Se usi Google Analytics e hai visitatori provenienti dallo SEE o dal Regno Unito, Consent Mode v2 è indispensabile per l’integrità dei dati.

Senza di esso, perderai i dati di tutti gli utenti che rifiutano il consenso, anche per l’analytics di base. Questo significa che conteggi delle sessioni, insight sul comportamento degli utenti e metriche di engagement dentro GA4 saranno incompleti. La tua capacità di capire come viene usato il prodotto ne risulterà fortemente compromessa.

### Can I implement Consent Mode v2 without a CMP?

Anche se tecnicamente è possibile costruire una soluzione di consenso custom, la scelta è fortemente sconsigliata. Introduce un debito tecnico importante e aumenta il rischio legale.

Le [Consent Management Platform (CMP)](https://cmppartnerprogram.withgoogle.com/) certificate da Google sono progettate per integrarsi con Consent Mode v2 e supportano framework come il TCF v2.2 dell’IAB. Garantiscono che i segnali vengano trasmessi in modo corretto e affidabile.

> Un gestore del consenso sviluppato internamente può sembrare un modo per risparmiare sui costi di abbonamento, ma il costo potenziale di una configurazione errata, sia in termini di perdita di dati sia di sanzioni legali, è di gran lunga superiore. Una CMP certificata è uno strumento di mitigazione del rischio.

### How do I verify my implementation is working correctly?

Usa **Google Tag Assistant** per osservare in tempo reale lo stato di consenso dei tuoi tag. Carica il sito in modalità preview e apri la scheda "Consent". Qui puoi verificare lo stato predefinito e vedere come si aggiorna dopo l’interazione dell’utente con la tua CMP.

In GA4, usa **DebugView** per ispezionare i singoli eventi. Cerca il parametro `gcs` allegato alle richieste di rete. Questo parametro conferma lo stato di consenso inviato con ogni hit, per esempio `G111` indica che tutto il consenso è stato concesso, fornendo una prova definitiva che la configurazione funziona come previsto.

---
Costruire software robusto, orientato alla privacy, è una scelta architetturale. **Devisia** aiuta le aziende a tradurre requisiti complessi come Consent Mode v2 in sistemi affidabili e manutenibili, capaci di generare valore di business misurabile. Scopri di più su [https://www.devisia.pro](https://www.devisia.pro).
