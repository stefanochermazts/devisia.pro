---
title: Guida pratica per ingegneri all'articolo 30 del GDPR (RoPA)
description: >-
  Guida per team di sviluppo all'articolo 30 del GDPR: impara a creare e
  mantenere il Registro delle attività di trattamento (RoPA) con esempi pratici.
pubDate: 2026-01-20T06:44:18.464Z
heroImage: >-
  https://cdn.outrank.so/66a41ce6-7698-4d58-8459-ed7623e4e974/aaa4d3b3-b2c3-4de4-bf1b-9567abe655a2/article-30-gdpr-gdpr-guide.jpg
author: Devisia AI
tags:
  - article 30 gdpr
  - gdpr ropa
  - gdpr for software
  - data processing records
  - privacy by design
translationSlug: article-30-gdpr
---
L'articolo 30 del GDPR non è una formalità legale da affidare al reparto compliance. Per i team software, è un mandato tecnico che richiede un registro dettagliato delle attività di trattamento dei dati — una mappa vivente di come il vostro software gestisce i dati personali. Questo registro è ufficialmente noto come il **Registro delle attività di trattamento (RoPA)**. Lungi dall'essere un semplice compito amministrativo, mantenerlo è una sfida ingegneristica critica.

Questa guida inquadra la conformità all'**articolo 30 del GDPR** non come un ostacolo burocratico, ma come una disciplina essenziale per costruire sistemi software robusti, sicuri e conformi dal punto di vista legale.

## Il problema: Perché l'articolo 30 è una sfida ingegneristica critica

Molti leader tecnici trattano l'articolo 30 come un problema legale, delegando il RoPA a team non tecnici. Questa è una visione ingenua e ad alto rischio. Il vostro RoPA è un riflesso diretto dell'architettura del sistema, dei flussi di dati e della postura di sicurezza. Richiede un livello di trasparenza che rivela se comprendete veramente come i dati si muovono attraverso i vostri servizi, dove vengono memorizzati e quali API di terze parti vi accedono.

Per le aziende che costruiscono piattaforme SaaS, software personalizzato o sistemi guidati dall'IA, un RoPA mal tenuto segnala rischi operativi e tecnici profondi. È un indicatore principale di un approccio reattivo, piuttosto che proattivo, alla governance dei dati.

![Un diagramma di architettura di sistema che illustra il trattamento dei dati coinvolgendo il RoPA, gli utenti, il frontend, il database e componenti di terze parti.](https://cdn.outrank.so/66a41ce6-7698-4d58-8459-ed7623e4e974/96c99d33-4659-49fe-9d54-42432b7ba433/article-30-gdpr-gdpr-architecture.jpg)

### Le conseguenze di un approccio superficiale

La mancata produzione di un RoPA accurato e aggiornato su richiesta può innescare sanzioni severe e un intenso controllo regolatorio. Questo vale anche se le vostre pratiche di gestione dei dati sono altrimenti conformi. L'incapacità di dimostrare responsabilità è, di per sé, una violazione significativa.

> **Il problema centrale:** un RoPA non è un documento che create una sola volta. È l'output di un processo continuo. Ogni nuova funzionalità, microservizio o integrazione di terze parti che coinvolge dati personali deve essere riflessa nei vostri registri.

Questa esigenza dinamica pone la responsabilità saldamente sui team di engineering e product. Le conseguenze di un errore sono alte. Le multe per non conformità possono essere severe, ma il rischio maggiore è spesso la perdita di fiducia dei clienti e il caos operativo che segue un'indagine regolatoria. Potete [scoprire ulteriori approfondimenti sulle tendenze di enforcement del GDPR e imparare dai casi passati](https://www.enforcementtracker.com/).

Per questo sosteniamo che [**la privacy è una scelta architetturale, non una funzionalità**](https://devisia.pro/privacy). Il RoPA è la prova tangibile di quella scelta.

## Definire il vostro ruolo: Titolare del trattamento vs. Responsabile del trattamento

Ai sensi dell'articolo 30 del GDPR, i requisiti di documentazione dipendono da una questione architetturale fondamentale: siete un **titolare del trattamento** o un **responsabile del trattamento**? Questa è una determinazione di base. Una classificazione errata invalida l'intero sforzo di conformità fin dall'inizio.

*   Un **titolare del trattamento** è l'entità che determina il "perché" e il "come" del trattamento dei dati. Pensatelo come l'architetto del sistema. Se la vostra azienda SaaS decide quali dati personali raccogliere dagli utenti e per quale scopo, siete il titolare.
*   Un **responsabile del trattamento**, al contrario, tratta i dati personali _per conto_ del titolare. Sono i costruttori che eseguono i piani dell'architetto. Per esempio, se la vostra piattaforma utilizza un provider cloud di terze parti (es. AWS, Azure) per memorizzare i dati degli utenti, quel provider è il vostro responsabile. Agisce solo sulle vostre istruzioni documentate.

### Il mandato del RoPA per il titolare

Come titolare, detenete la responsabilità primaria. Il vostro RoPA deve essere una mappa completa del vostro ecosistema dati, dimostrando che gestite l'intero ciclo di vita del trattamento.

I vostri registri devono includere:

*   **Nome e dettagli di contatto** dell'organizzazione e del Responsabile della protezione dei dati (DPO), se applicabile.
*   **Finalità del trattamento:** Siate specifici. "Autenticazione degli utenti", "elaborazione dei pagamenti degli abbonamenti" o "invio di email transazionali". Descrizioni generiche sono un campanello d'allarme.
*   **Categorie di interessati e dati personali:** Definite i soggetti dei dati che trattate (es. "visitatori del sito web", "utenti abbonati") e quali dati raccogliete (es. "indirizzi email", "indirizzi IP", "storico dei pagamenti").
*   **Categorie di destinatari:** Elencate tutte le terze parti con cui i dati sono condivisi, inclusi servizi di hosting cloud, piattaforme di analytics e altri sub-responsabili.
*   **Trasferimenti internazionali di dati:** Documentate qualsiasi trasferimento di dati personali al di fuori dello Spazio economico europeo (SEE) e le garanzie legali in atto, come le Clausole Contrattuali Standard (SCC).
*   **Tempi previsti per la cancellazione:** Specificate le vostre politiche di conservazione dei dati. Affermazioni vaghe come "fino a quando necessario" non sono conformi.
*   **Una descrizione generale delle misure tecniche e organizzative di sicurezza (TOMS):** Questo include l'indicazione degli standard di crittografia, delle politiche di controllo accessi e dei protocolli di risposta agli incidenti.

### Il mandato del RoPA per il responsabile

Se operate come responsabile del trattamento — per esempio fornendo un'API white-label ad altre aziende — i vostri obblighi ai sensi dell'articolo 30 sono più focalizzati ma ugualmente importanti. Dovete documentare meticolosamente le attività che svolgete per ciascun titolare.

Il vostro RoPA deve contenere:

*   **Nome e dettagli di contatto** della vostra organizzazione, di ciascun titolare per cui operate e dei rispettivi DPO.
*   **Categorie di trattamento** effettuate per conto di ciascun titolare. Questo dettaglia i compiti specifici che svolgete, come "archiviazione dei dati", "aggregazione dei dati" o "generazione di report".
*   **Trasferimenti internazionali di dati** e le garanzie utilizzate se spostate dati fuori dal SEE su istruzione del titolare.
*   **Una descrizione generale delle vostre misure tecniche e organizzative di sicurezza.**

> Il RoPA del titolare risponde a "cosa e perché", mentre il RoPA del responsabile risponde a "per conto di chi e come". Questa distinzione è centrale per costruire sistemi software responsabili.

La tabella qui sotto offre un confronto diretto per aiutare ad auditare i vostri registri esistenti o a costruire un RoPA conforme da zero.

### Requisiti del RoPA: Titolare vs. Responsabile

| Requisito | Richiesto per il Titolare | Richiesto per il Responsabile |
| --- | --- | --- |
| Dettagli di contatto dell'organizzazione e del DPO | ✔️ | ✔️ |
| Finalità del trattamento | ✔️ | ❌ |
| Categorie di interessati e dati personali | ✔️ | ❌ |
| Categorie di destinatari | ✔️ | ❌ |
| Dettagli dei titolari serviti | ❌ | ✔️ |
| Categorie di trattamento svolte per ciascun titolare | ❌ | ✔️ |
| Trasferimenti internazionali e garanzie | ✔️ | ✔️ |
| Tempi previsti per la cancellazione dei dati | ✔️ | ❌ |
| Descrizione delle misure tecniche e organizzative di sicurezza | ✔️ | ✔️ |

## Soluzione: Costruire e mantenere il RoPA in un ambiente agile

Un Registro delle attività di trattamento (RoPA) non è un documento statico. In un ambiente agile con sprint settimanali o bisettimanali, un RoPA statico è un fallimento di compliance che aspetta solo di accadere. La soluzione è integrare la manutenzione del RoPA direttamente nel vostro ciclo di vita di sviluppo (SDLC), trattandolo come un registro dinamico che evolve insieme al software.

Se il vostro RoPA è scollegato dal flusso di lavoro dell'ingegneria, inevitabilmente diventerà obsoleto, impreciso e una responsabilità durante un audit regolatorio.

### 1. Iniziare con una scoperta completa dei dati

Prima di documentare le attività di trattamento, dovete sapere quali sono. Questo richiede un'analisi tecnica approfondita per tracciare ogni pezzo di dato personale attraverso il vostro stack tecnologico. Questo è l'aspetto più sottovalutato del rispetto dell'**articolo 30 del GDPR**.

Questo processo comporta l'identificazione e il tracciamento dei dati attraverso:

*   **Applicazioni e microservizi:** Individuare ogni servizio che raccoglie, trasforma o memorizza dati personali.
*   **Database e archivi dati:** Mappare quali tabelle, colonne o documenti contengono informazioni personali, dai database SQL principali alle cache e alle code di messaggi.
*   **API di terze parti e sub-responsabili:** Documentare ogni servizio esterno che entra in contatto con dati personali, dai gateway di pagamento agli strumenti di analytics.

Questo non è un audit una tantum; deve diventare una parte standard e ripetibile del vostro processo di progettazione e revisione del sistema.

### 2. Integrare gli aggiornamenti del RoPA nel vostro SDLC

Il punto di fallimento più comune per un RoPA è la dipendenza da aggiornamenti manuali e ad-hoc. La soluzione è incorporare trigger di aggiornamento direttamente nei flussi di lavoro ingegneristici esistenti. Il principio è semplice: se una modifica al codice tocca dati personali, deve anche innescare un aggiornamento del RoPA.

Integrate questo nel vostro processo di sviluppo:

*   **Aggiungete una sezione "Impatto sulla privacy" alle storie utente o ai template delle pull request.** Prima di effettuare il merge, lo sviluppatore deve rispondere:
    -   Questa funzionalità raccoglie nuove categorie di dati personali?
    -   Introduce un nuovo sub-responsabile di terze parti?
    -   Cambia il modo in cui i dati esistenti sono memorizzati, usati o condivisi?
    -   Modifica il periodo di conservazione dei dati?
*   **Segnalare per revisione.** Se la risposta a una qualsiasi di queste domande è "sì", il ticket dovrebbe essere segnalato per una revisione del RoPA prima del rilascio.

> Un RoPA obsoleto è più di un errore di documentazione; è una falsa rappresentazione della vostra architettura dei dati. Integrando gli aggiornamenti nella pipeline CI/CD, trasformate il RoPA da onere di conformità a una mappa vivente e accurata del vostro sistema.

### 3. Automatizzare dove possibile, rivedere costantemente

Sebbene l'automazione completa sia irrealistica, potete automatizzare parti del processo di scoperta e aggiornamento. Gli scanner del codice possono rilevare i dati personali (PII) in nuovi schemi di database, e gli script di infrastructure-as-code possono segnalare l'aggiunta di nuovi servizi che gestiscono i dati. Questi strumenti possono generare bozze di aggiornamento del RoPA per la revisione umana.

L'automazione deve essere affiancata da revisioni regolari guidate da persone, sincronizzate con i vostri cicli di sviluppo.

*   **Stabilite una cadenza di revisione legata agli sprint o ai rilasci principali.** Un product owner o un privacy champion designato dovrebbe essere responsabile della verifica dell'accuratezza del RoPA alla fine di ogni sprint o prima di un rilascio importante. Questo garantisce che il registro rimanga una vera riflessione dell'ambiente di produzione.

Questo approccio strutturato è cruciale per sistemi complessi come l'IA, dove i flussi di dati possono essere meno prevedibili. La nostra [**Checklist Rischi & Privacy per l'IA**](https://devisia.pro/tools/ai-risk-checklist) gratuita può aiutare a valutare e documentare i rischi potenziali legati ai vostri modelli di machine learning.

## Errori comuni nel RoPA che attirano l'attenzione dei regolatori

Un Registro delle attività di trattamento (RoPA) superficiale può essere più pericoloso che non averne affatto. Per un regolatore, un documento vago o incompleto segnala una comprensione fondamentale errata dei vostri obblighi ai sensi dell'**articolo 30 del GDPR** e spesso invita a un'indagine più approfondita. Suggerisce che la governance dei dati è un ripiego, non un principio architetturale centrale.

### Descrizioni vaghe delle misure di sicurezza

Uno degli errori più frequenti è fornire descrizioni generiche della sicurezza. Dichiarare "è usata la crittografia" o "sono in atto misure di sicurezza di settore" è privo di significato. Questa mancanza di specificità suggerisce che o non conoscete i dettagli o li state intenzionalmente oscurando.

Un RoPA conforme richiede precisione. Dovete essere pronti a specificare dettagli come:

*   **Protocolli di crittografia** per i dati in transito (es. TLS 1.3) e a riposo (es. AES-256).
*   **Meccanismi di controllo accessi**, come controllo accessi basato sui ruoli (RBAC), autenticazione a più fattori (MFA) e il principio del minimo privilegio.
*   **Tecniche di pseudonimizzazione o anonimizzazione** utilizzate per ridurre il rischio sui dati.
*   **Procedure di logging e monitoraggio** per rilevare e rispondere agli incidenti di sicurezza.

Senza questo livello di dettaglio, il vostro RoPA non fornisce le garanzie richieste.
![Un diagramma di flusso che illustra il processo Agile di manutenzione del RoPA con tre passaggi chiave: Scoprire, Automatizzare e Revisionare.](https://cdn.outrank.so/66a41ce6-7698-4d58-8459-ed7623e4e974/cb7fd2f0-fba7-4709-b1a4-34a0643f6536/article-30-gdpr-ropa-process.jpg)

Questo processo ciclico—Scoprire, Automatizzare e Revisionare—assicura che il tuo RoPA rimanga un documento vivo che riflette accuratamente la tua architettura attuale e i controlli di sicurezza.

### Mappatura dei flussi di dati imprecisa o mancante

Un altro errore critico è non mappare accuratamente i flussi di dati verso sub-processori e servizi di terze parti. Uno stack tecnologico moderno può coinvolgere dozzine di applicazioni SaaS, e ciascuna che tratta dati personali deve essere documentata.

> Il tuo RoPA deve essere una rappresentazione onesta di ogni sistema che elabora dati personali per tuo conto. Omettere un servizio chiave, che sia un CRM, una piattaforma di analytics o un database cloud, rende l'intero registro impreciso e inaffidabile.

Questo errore è un sintomo classico di un processo di compliance disconnesso dal ciclo di vita dell'ingegneria.

### Mancata documentazione di una base giuridica

Ogni attività di trattamento nel tuo RoPA deve essere giustificata da una delle sei basi giuridiche previste dal GDPR (ad es. consenso, contratto, interesse legittimo). Non basta elencare _cosa_ fai con i dati; devi documentare _perché_ sei legalmente autorizzato a farlo.

Errori comuni includono:

*   **Omettere completamente la base giuridica.**
*   **Assegnare una base errata,** come dichiarare “interesse legittimo” per un'attività che richiede l'“esplicito consenso.”
*   **Non documentare il concreto interesse legittimo** quando viene utilizzata questa base.

Una base giuridica mancante o errata è una violazione diretta dei principi fondamentali del GDPR e un segnale di allarme immediato per qualsiasi revisore. Dimostra una mancanza di comprensione delle basi del diritto alla protezione dei dati e mina qualsiasi affermazione di essere [**pronto per la verifica e conforme per progettazione**](https://devisia.pro/projects/auditready).

## Usare il tuo RoPA per promuovere la Privacy by Design

La maggior parte dei team considera il RoPA un fastidio di compliance. Questa prospettiva perde il suo valore strategico. Un RoPA ben mantenuto è uno degli strumenti più potenti che un team di ingegneria abbia per implementare la **Privacy by Design**.

Invece di un rapporto statico, il tuo RoPA diventa una blueprint dinamica per costruire sistemi più sicuri, efficienti e affidabili.

![Uno schizzo che illustra il framework 'Privacy by Design' con minimizzazione dei dati, trattamento e anonimizzazione.](https://cdn.outrank.so/66a41ce6-7698-4d58-8459-ed7623e4e974/801aefc1-bd2b-45ee-8f23-7d92edd5e21a/article-30-gdpr-data-privacy.jpg)

### Dalla mappatura dei dati agli insight architetturali

La mappatura dei dati richiesta dall'**Articolo 30 del GDPR** è di fatto una revisione architetturale. Tracciare i dati dall'input dell'utente attraverso microservizi, database e API di terze parti inevitabilmente scopre insight che vanno oltre la semplice conformità.

Questo processo evidenzia problemi sistemici:

*   **Raccolta di dati ridondante:** Potresti scoprire che tre microservizi differenti raccolgono gli stessi dati sulle preferenze utente, creando costi di storage inutili ed espandendo la tua superficie di rischio.
*   **Percorsi dei dati non sicuri:** La mappatura dei flussi può rivelare vulnerabilità, come un servizio interno che invia dati personali su un canale non crittografato o un'integrazione legacy che utilizza protocolli di sicurezza obsoleti.
*   **Opportunità per la minimizzazione dei dati:** Il RoPA ti costringe a documentare lo _scopo_ per ogni dato personale. Questo spesso rivela dati che vengono raccolti ma mai utilizzati, fornendo un chiaro caso aziendale per la loro rimozione.

### Informare le decisioni tecniche e ridurre il rischio

Un RoPA vivo diventa una fonte centrale di verità per decisioni chiave di ingegneria, fornendo evidenze oggettive per giustificare scelte che migliorano la privacy.

*   **Implementazione di tecnologie a tutela della privacy (PETs):** Quando il tuo RoPA documenta trattamenti di dati sensibili, costruisce un solido caso per implementare PET come la pseudonimizzazione per l'analisi o la privacy differenziale per la ricerca.
*   **Giustificare le politiche di conservazione dei dati:** Il RoPA richiede che tu specifichi i tempi di cancellazione, forzando discussioni tecniche concrete che portano a script automatici che eliminano i dati una volta raggiunto lo scopo.
*   **Innescare Valutazioni d'impatto sulla protezione dei dati (DPIA):** Il RoPA funge da sistema di allerta precoce. Quando una nuova funzionalità propone di trattare dati in modo nuovo o ad alto rischio (ad es. con l'IA), l'aggiornamento del RoPA attiva la necessità di una DPIA, assicurando che i rischi siano valutati _prima_ che venga scritto codice.

> Un RoPA attivo è uno strumento proattivo per modellare ciò che costruirai dopo. Fornisce la base guidata dai dati per una cultura in cui ogni ingegnere comprende le implicazioni sulla privacy del proprio codice.

In ultima analisi, integrare il RoPA nel tuo processo architetturale fa più che soddisfare l'**Articolo 30 del GDPR**. Porta a sistemi più puliti, più efficienti e più facili da mantenere e mettere in sicurezza.

## Azioni pratiche per responsabili dell'ingegneria e del prodotto

<iframe width="100%" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/LzxvpZNaYIY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Rispettare l'Articolo 30 è una disciplina di buon ingegneria e gestione del rischio. Per i leader tecnici, il Registro delle attività di trattamento (RoPA) è un artefatto architetturale essenziale—una mappa che rivela la salute, la sicurezza e l'integrità dei tuoi sistemi software.

Un RoPA ben mantenuto è prova di controllo. Dimostra una comprensione pratica di come i dati personali fluiscono attraverso i tuoi prodotti. Questa chiarezza non è solo per i regolatori; è per il tuo team. Guida decisioni tecniche migliori, riduce il debito architetturale e costruisce la fiducia degli utenti, critica per il successo commerciale. Ignorarlo non è solo un rischio di conformità—è un significativo punto cieco ingegneristico.

### Punti chiave

> Padroneggiare l'**Articolo 30 del GDPR** non significa solo evitare sanzioni. Significa instaurare una disciplina di trasparenza e responsabilità che porta a software fondamentalmente migliori e più sicuri.

Ecco le azioni chiave su cui concentrarsi:

*   **Tratta il RoPA come un documento architetturale vivo.** Integra gli aggiornamenti del RoPA nel tuo Software Development Lifecycle (SDLC). Una modifica al modello dati, l'aggiunta di un'API di terze parti o una nuova funzionalità che raccoglie dati devono attivare un aggiornamento del RoPA. Rendilo parte della tua "definition of done."
*   **Usa il RoPA per le revisioni architetturali.** Sfrutta la mappa dei dati per identificare ed eliminare raccolte ridondanti, trovare percorsi non sicuri e applicare la minimizzazione dei dati. Un RoPA pulito spesso si correla a un'architettura di sistema più pulita ed efficiente.
*   **Pretendi specificità tecnica nella documentazione.** Descrizioni vaghe come "misure di sicurezza standard" sono segnali di allarme inaccettabili. Assicurati che il tuo RoPA contenga dettagli precisi che riflettano la tua implementazione reale—dai protocolli di crittografia specifici ai esatti programmi di retention dei dati.
*   **Chiarire i ruoli: titolare del trattamento vs. responsabile del trattamento.** Assicurati che il tuo team comprenda se sta agendo come titolare del trattamento o come responsabile del trattamento per una determinata attività. Questa distinzione definisce i tuoi obblighi legali ai sensi dell'Articolo 30 ed è la base di una posizione di conformità difendibile.

## Domande frequenti sull'Articolo 30

Qui trovi le risposte alle domande comuni che team software e IT incontrano durante l'implementazione dell'Articolo 30.

### L'esenzione per le organizzazioni con meno di 250 dipendenti si applica alle aziende tecnologiche?

Quasi mai. L'Articolo 30 include un'esenzione per le organizzazioni con meno di 250 dipendenti, ma le sue eccezioni la rendono irrilevante per quasi ogni azienda software.

L'esenzione è nulla se il tuo trattamento dei dati è:

*   Non occasionale (cioè è un'attività aziendale fondamentale).
*   Probabilmente suscettibile di generare un rischio per i diritti e le libertà degli interessati.
*   Involve categorie particolari di dati (ad es. informazioni sulla salute).

Poiché quasi tutte le piattaforme SaaS e i prodotti software comportano **un trattamento continuo dei dati degli utenti**, rientrano nella prima eccezione. Se stai costruendo e gestendo software, presumi di dover mantenere un RoPA, indipendentemente dalla dimensione dell'azienda.

### Un foglio di calcolo è sufficiente per il nostro RoPA?

Un foglio di calcolo può essere un punto di partenza per un'azienda molto semplice, ma non scala con la complessità del software moderno. Diventa rapidamente difficile da mantenere, versionare e riesaminare, specialmente in team agili dove l'architettura è in costante evoluzione.

Sebbene il GDPR permetta registri in formati elettronici, un foglio di calcolo spesso si trasforma in una responsabilità obsoleta. Piattaforme dedicate alla gestione della privacy o strumenti di documentazione ben integrati (come Confluence con template rigorosi e processi di revisione) sono molto più efficaci per creare un documento vivo di cui ingegneria, prodotto e legale possono fidarsi.

### Quanto spesso dobbiamo aggiornare il nostro RoPA?

Il tuo RoPA deve essere un **documento vivo**. Non è un rapporto che si archivia trimestralmente. Dovrebbe riflettere le tue attività di trattamento in tempo quasi reale.

Qualsiasi cambiamento significativo—come integrare una nuova API di terze parti, lanciare una funzionalità che raccoglie nuovi dati o modificare una politica di conservazione—richiede un aggiornamento immediato. La best practice è incorporare gli aggiornamenti del RoPA nel tuo ciclo di sviluppo del software e pianificare revisioni formali almeno trimestrali per assicurarti che nulla sia stato tralasciato.

---

Al **Devisia**, crediamo che la privacy sia una scelta architetturale, non solo una funzionalità di conformità. Costruiamo sistemi software robusti, manutenibili e pronti per la verifica, progettati per il mondo reale. Scopri come possiamo aiutarti a trasformare la visione del tuo business in un prodotto digitale affidabile su [https://www.devisia.pro](https://www.devisia.pro).

_Articolo creato utilizzando [Outrank](https://outrank.so)_
