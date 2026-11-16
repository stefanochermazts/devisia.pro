---
title: Il Digital Markets Act per i leader tecnologici
description: >-
  Una guida pragmatica per CTO e founder sul Digital Markets Act: implicazioni
  tecniche, rischi di compliance e opportunità strategiche da conoscere.
pubDate: 2026-03-19T10:11:46.217Z
heroImage: >-
  https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/5e8c34c9-c250-49c6-8432-595bf8d5838d/digital-market-act-guide.jpg
author: Devisia AI
tags:
  - digital market act
  - EU regulation
  - tech compliance
  - B2B software
  - API economy
translationSlug: digital-market-act
translationSourceHash: 8fd00f57c07ddccdc3f42be32657b640a15fa5005ad328073fc024f7f513906f
---
Il **Digital Markets Act (DMA)** non è soltanto un altro regolamento UE: è una riprogettazione strutturale delle regole fondamentali dell’economia digitale, pensata per creare mercati più equi e più aperti.

Per anni, poche grandi aziende tecnologiche hanno controllato i punti di accesso essenziali al mondo digitale – app store, motori di ricerca e sistemi operativi. Il potere di mercato di questi “gatekeeper” ha permesso loro di costruire ecosistemi chiusi, imponendo spesso condizioni restrittive alle imprese più piccole e limitando il loro accesso alle funzionalità chiave delle piattaforme. Questa dinamica ha frenato la concorrenza e ridotto la scelta per i consumatori.

Il DMA introduce un cambiamento profondo. Invece di sanzionare a posteriori i comportamenti anticoncorrenziali, definisce regole proattive – un insieme chiaro di **‘do’s and don’ts’** – che i gatekeeper designati devono rispettare. È una scelta precisa che allontana il mercato dai “walled garden” chiusi e lo spinge verso un sistema più interoperabile e competitivo.

> Per un responsabile tecnico, il DMA non è una semplice spunta di compliance. È un punto di svolta strategico che ridefinisce le regole dell’interazione digitale, introduce nuovi requisiti architetturali e apre opportunità concrete per le aziende pronte ad ադattarsi.

Questa norma costringe i gatekeeper ad aprire i propri servizi, creando condizioni di maggiore parità competitiva. Avrà un impatto sulle roadmap di prodotto, sulle strategie dati e sull’architettura dei sistemi core. Il DMA si applica in combinazione con altri framework, come il [Data Governance Act](https://devisia.pro/en/blog/data-governance-act), che completa il suo focus sull’equità del mercato con nuove regole per la condivisione e l’intermediazione dei dati.

### Cosa Significa Per Il Tuo Business

Il problema che il DMA affronta – la concentrazione del mercato – crea opportunità per tutti gli altri. Per founder, CTO e responsabili prodotto di aziende che non rientrano nella categoria dei gatekeeper, il DMA rappresenta un’apertura strategica, non un onere di compliance. Offre nuove possibilità alle imprese in grado di sfruttare:

*   **Concorrenza Equa:** Il DMA vieta il self-preferencing. I gatekeeper non possono più riservare ai propri prodotti e servizi un trattamento privilegiato nei ranking rispetto ai concorrenti.
*   **Interoperabilità:** I nuovi obblighi impongono ai gatekeeper di consentire l’integrazione di servizi terzi con le loro piattaforme core, aprendo un potenziale significativo per nuovi prodotti SaaS e AI che prima erano impraticabili dal punto di vista tecnico o commerciale.
*   **Privacy by Design:** Il DMA completa il GDPR, rafforzando la necessità di progettare sistemi con principi solidi di privacy fin dall’inizio. In questo nuovo contesto, la fiducia diventa un differenziatore competitivo decisivo.

In sintesi, il Digital Markets Act sta rimodellando l’ambiente in cui il software viene progettato, distribuito e scalato. Per qualsiasi azienda tecnologica B2B che opera sul mercato europeo, comprenderne le implicazioni architetturali e strategiche è essenziale per crescere.

## Come L’UE Definisce Una Piattaforma Gatekeeper

Il Digital Markets Act evita definizioni vaghe o accademiche del potere di mercato. Al contrario, utilizza soglie chiare e quantitative per identificare i “gatekeeper”. Questo approccio pragmatico, guidato dai numeri, offre un livello di chiarezza fondamentale per il settore tecnologico.

La Commissione europea utilizza un test in due parti per stabilire se un’azienda opera un **core platform service (CPS)** con una “posizione radicata e duratura”. Non si tratta di una valutazione soggettiva, ma di un calcolo basato su metriche specifiche. Capire queste soglie è fondamentale per sapere quali aziende sono soggette agli obblighi del DMA.

### Le Soglie Quantitative Per La Designazione

Un’azienda deve avere un peso economico significativo e una base utenti ampia e consolidata nell’UE per poter essere considerata un potenziale gatekeeper.

Un fornitore di **core platform service** è presunto gatekeeper se soddisfa entrambe queste condizioni:
*   Un fatturato annuo nell’UE di almeno **7,5 miliardi di euro** negli ultimi tre esercizi finanziari OPPURE una capitalizzazione di mercato globale di almeno **75 miliardi di euro** nell’ultimo esercizio finanziario.
*   Almeno **45 milioni di utenti finali attivi mensili nell’UE** e **10.000 utenti business attivi annuali nell’UE** nell’ultimo esercizio finanziario.

Per confermare una posizione “radicata”, un’azienda deve aver mantenuto questi numeri sulla base utenti per gli ultimi tre anni consecutivi. Questa metodologia puntuale ha portato la Commissione europea a designare il primo gruppo di gatekeeper – tra cui Alphabet, Amazon, Apple e Meta – che oggi sono vincolati dalle regole del DMA. Puoi consultare la [metodologia ufficiale per la designazione dei gatekeeper DMA](https://www.europarl.europa.eu/RegData/etudes/ATAG/2022/739226/EPRS-AaG-739226-DMA-Application-timeline-FINAL.pdf) sul sito del Parlamento europeo.

Questo processo, così netto, fa sì che il tuo business ricada in una di due categorie, come mostra questo albero decisionale.

![Un diagramma ad albero per l’impatto del DMA mostra che, se sei un gatekeeper, l’esito è Compliance; se non lo sei, l’esito è Opportunity.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/2f91f1ad-13ee-4a13-9a46-9a30a6be46f8/digital-market-act-decision-tree.jpg)

Per la maggior parte delle aziende, il DMA non riguarda la compliance diretta. Riguarda un’opportunità strategica.

### I Core Platform Services Sotto La Lente

Il DMA prende di mira dieci specifici **core platform services (CPS)**, ambiti in cui i gatekeeper hanno storicamente concentrato il potere di mercato, dettando le condizioni per tutti gli altri partecipanti.

L’elenco dei CPS comprende:
*   **Servizi di intermediazione online:** ad esempio marketplace e app store.
*   **Motori di ricerca online.**
*   **Servizi di social network.**
*   **Servizi di condivisione video.**
*   **Servizi di comunicazione interpersonale indipendenti dal numero:** ad esempio le app di messaggistica.
*   **Sistemi operativi.**
*   **Browser web.**
*   **Assistenti virtuali.**
*   **Servizi di cloud computing.**
*   **Servizi pubblicitari online** controllati dal proprietario della piattaforma.

> Se il tuo business dipende da uno di questi ambiti, si integra con esso o vi compete, i nuovi obblighi del gatekeeper avranno un impatto diretto sulla tua strategia di prodotto, sull’architettura e sull’accesso al mercato.

Per esempio, un’azienda designata come gatekeeper per il proprio sistema operativo (ad esempio Apple con iOS) e per il relativo app store deve ora consentire app store concorrenti e sistemi di pagamento alternativi. Questo apre uno spazio concreto per gli sviluppatori che prima erano bloccati dentro condizioni esclusive della piattaforma, favorendo un mercato software più dinamico e competitivo.

## Implicazioni Tecniche E Architetturali Per Il Tuo Software

Per un CTO o un responsabile engineering, il Digital Markets Act non è un’astrazione giuridica: è un insieme di sfide ingegneristiche che impattano codebase, API e architettura di sistema. Le regole del DMA su interoperabilità, portabilità dei dati e accesso equo, di fatto, sono specifiche di progettazione software.

Un’implementazione superficiale, fatta solo per “spuntare la casella”, produce sistemi fragili e insicuri. Il rischio di un approccio ingenuo – ad esempio esporre schemi interni di database tramite una API pubblica – è quello di introdurre una vulnerabilità di sicurezza importante e un debito tecnico destinato a durare nel tempo. Un approccio attento, invece, può trasformare questi requisiti normativi in un vantaggio competitivo.

Il problema centrale è riprogettare sistemi nati come fortezze chiuse per farli comunicare in modo sicuro e affidabile con l’esterno.

![Un diagramma mostra un API Gateway che collega i servizi API, Auth e Maecity a una app di terze parti, evidenziando la portabilità dei dati.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/42487e08-ad46-4a50-83f9-387fee2360e6/digital-market-act-api-diagram.jpg)

### Progettare Per Interoperabilità E Portabilità Dei Dati

Il cuore tecnico del DMA è la richiesta di API progettate bene. I gatekeeper devono esporre interfacce che consentano ai servizi di terze parti di connettersi alle loro piattaforme e agli utenti di portare con sé i propri dati. Non significa soltanto aprire qualche endpoint: serve una strategia API solida.

*   **Progettazione API Pulita:** Le API devono essere chiare, stabili e documentate in modo meticoloso. Adottare standard come OpenAPI non è più una buona pratica, ma una necessità per fornire specifiche prevedibili e leggibili dalle macchine. Anche una strategia di versioning solida è fondamentale per gestire le evoluzioni senza rompere le integrazioni di terze parti.
*   **Autenticazione e Autorizzazione Sicure:** Aprire i sistemi impone un modello di sicurezza zero trust. Protocolli come **OAuth 2.0** e **OpenID Connect** sono imprescindibili per gestire accessi granulari e basati sul consenso. Devi poter garantire che un’applicazione terza possa accedere solo ai dati che l’utente ha approvato esplicitamente.
*   **Performance e Scalabilità:** Le API imposte dalla norma dovranno reggere carichi di traffico imprevedibili. L’architettura deve gestire questa domanda senza degradare le prestazioni dei servizi core. Questo richiede rate limiting efficace, strategie di caching e, in alcuni casi, infrastrutture dedicate al traffico API. La nostra analisi sui [modelli di deployment on-premises vs cloud](https://devisia.pro/en/blog/on-premises-vs-cloud) offre un contesto utile per queste scelte di scaling.

### Abbracciare La Separazione Dei Servizi Con I Microservizi

Il divieto del DMA di “vincolare” o “raggruppare” i servizi è un altro forte driver tecnico. I gatekeeper non possono più costringere gli utenti di un servizio ad adottarne un altro – per esempio, imponendo che un browser specifico sia legato al sistema operativo.

Questo requisito rende di fatto obsolete le architetture monolitiche. Un sistema in cui browser, OS e app store sono strettamente intrecciati non può rispettare l’obbligo di separazione.

> Il Digital Markets Act impone un passaggio architetturale verso la modularità. I sistemi devono essere composti da servizi indipendenti e debolmente accoppiati, che possano essere attivati, disattivati o sostituiti senza compromettere l’intero prodotto.

È qui che un pattern architetturale come i **microservizi** passa dall’essere una “buona idea” a una necessità concreta per compliance e flessibilità. Suddividere una grande applicazione in una costellazione di servizi più piccoli e indipendenti offre la modularità richiesta dal DMA.

*   **Uno Scenario Reale:** Considera una piattaforma social di un gatekeeper in cui la messaggistica è profondamente integrata nell’app principale. Con il DMA, questi componenti devono essere separabili. In un’architettura a microservizi, la messaggistica sarebbe un servizio distinto con una propria API. Questo servizio potrebbe quindi, come richiesto dalla norma, interoperare con app di messaggistica di terze parti.

Questa scelta architetturale comporta dei compromessi. Da un lato ottieni flessibilità e resilienza, dall’altro introduci la complessità del service discovery, della comunicazione tra servizi e della gestione dei dati distribuiti. È una decisione architetturale consapevole: si scambia complessità operativa con compliance normativa e agilità strategica.

## Capire Enforcement E Tempistiche Del DMA

Il Digital Markets Act non è un quadro teorico: è uno strumento regolatorio attivo, con un calendario di implementazione chiaro e sanzioni economiche rilevanti in caso di mancata conformità. Per i leader tecnologici, questa timeline è una mappa del rischio di business e delle priorità strategiche.

Il regolamento è entrato ufficialmente in vigore alla fine del 2022, con le sue disposizioni chiave applicabili da maggio 2023. Da lì è partito il processo formale con cui i potenziali gatekeeper dovevano autovalutarsi rispetto ai criteri del DMA e notificare la Commissione europea. Questo processo ha già portato a designazioni ufficiali, report di compliance e azioni di enforcement.

### Dalle Scadenze Alle Sanzioni Nel Mondo Reale

Il passaggio dal testo giuridico all’impatto sul mercato è stato rapido. Una volta designati, i gatekeeper hanno avuto una finestra di sei mesi per rendere pienamente conformi i propri core platform services all’elenco di “do’s and don’ts” del DMA.

La Commissione europea ha chiarito che userà tutti i poteri a sua disposizione per far rispettare queste regole. Le sanzioni per la mancata conformità non sono multe simboliche: sono consistenti, pensate per imporre un cambiamento concreto dei comportamenti. Non si tratta di rischi teorici, ma di eventi già documentati.

*   **Multe per mancato rispetto:** il DMA prevede sanzioni fino al **10% del fatturato annuo mondiale totale** di un’azienda, e fino al 20% in caso di violazioni reiterate.
*   **Rimedi strutturali:** nei casi di mancato rispetto sistematico, la Commissione può imporre rimedi strutturali, come costringere un’azienda a cedere parti del proprio business.

Un esempio rilevante è l’indagine sulle regole di Apple contro il *steering* verso canali alternativi, che impediscono agli sviluppatori di indirizzare gli utenti verso opzioni di abbonamento più economiche al di fuori dell’App Store. Indagini di questo tipo mostrano che il DMA è uno strumento regolatorio potente, con effetti concreti, come approfondito nelle analisi su [cosa ha prodotto finora il Digital Markets Act in Europa](https://techpolicy.press/what-europes-digital-markets-act-has-delivered-so-far-and-what-comes-next).

### Principali tappe di attuazione del DMA

L’implementazione graduale del DMA rende tangibile il suo impatto. Ogni tappa ha segnato il momento in cui gli obblighi sono diventati operativi e il rischio di non conformità è diventato reale.

Ecco una timeline semplificata dell’attuazione del DMA.

| Data              | Tappa                         | Significato per le aziende tech                                                      |
| :---------------- | :-------------------------------- | :----------------------------------------------------------------------------------- |
| **Novembre 2022** | Entrata in vigore del DMA     | L’avvio ufficiale, con il conto alla rovescia per tutte le scadenze successive.           |
| **Maggio 2023**      | Applicazione delle disposizioni del DMA              | Gli obblighi chiave sono diventati operativi ed è iniziato il processo formale di designazione dei gatekeeper.   |
| **Luglio 2023**     | Scadenza per la notifica             | Le aziende che rientravano nelle soglie previste per i gatekeeper hanno dovuto notificare la Commissione. |
| **Settembre 2023**| Prime designazioni dei gatekeeper     | Il primo gruppo di aziende è stato designato ufficialmente, facendo partire il periodo di adeguamento. |
| **Marzo 2024**    | Scadenza iniziale per l’adeguamento       | I gatekeeper designati hanno dovuto risultare pienamente conformi a tutti gli obblighi previsti dal DMA.  |
| **In corso**       | Vigilanza e indagini    | La Commissione europea monitora attivamente la conformità, avvia indagini e irroga sanzioni. |

Questa timeline conferma che il DMA non è un tema rimandabile al futuro. I suoi meccanismi sono già in movimento e stanno ridisegnando attivamente i mercati digitali. Per founder e product leader che lavorano in aziende non gatekeeper, ogni azione di enforcement è un segnale di mercato che conferma un contesto più equilibrato. È un via libera per gli innovatori, che possono competere sul merito.

## Capitalizzare le opportunità nel nuovo mercato digitale

Per la maggior parte delle aziende, il Digital Markets Act non riguarda la conformità – riguarda le opportunità. Mentre i gatekeeper designati riorganizzano le proprie piattaforme per rispettare i nuovi obblighi, le altre imprese possono cogliere in modo strategico il valore che si sta liberando.

Gli obblighi del DMA su interoperabilità e portabilità dei dati stanno smantellando in modo sistematico i “giardini recintati” che storicamente hanno limitato la crescita di molte aziende SaaS e AI più piccole. In passato, il potenziale di un prodotto veniva spesso frenato dai vincoli imposti da una piattaforma dominante. Ora sta emergendo un mercato più aperto e competitivo.

Questo cambiamento riequilibra il campo di gioco e consente a startup e PMI di costruire prodotti che prima erano tecnicamente o commercialmente impraticabili. L’attenzione si sposta dal destreggiarsi tra le restrizioni dei gatekeeper al fornire un valore superiore agli utenti.

![Diagramma che mostra un gate aperto di opportunità che conduce ad applicazioni SaaS e AI per una migliore interoperabilità.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/7c8fc812-74ca-48ff-8326-a2286276f953/digital-market-act-digital-transformation.jpg)

### Sfruttare le nuove API aperte e regole più eque

Le opportunità più immediate nascono direttamente dai requisiti fondamentali del DMA. L’accesso alle API imposto dalla normativa e regole più eque per gli app store stanno riducendo l’attrito per gli sviluppatori e aprendo nuove possibilità di integrazione.

*   **Integrazioni SaaS:** immagina di costruire uno strumento B2B specializzato per la collaborazione. Prima, un’integrazione profonda con i servizi di messaggistica core o con i servizi OS di un gatekeeper era difficile o impossibile. Oggi il DMA impone ai gatekeeper di fornire API per questo tipo di interoperabilità, permettendoti di creare esperienze utente più fluide.
*   **Sviluppo di applicazioni personalizzate:** con un accesso più ampio ai dati degli utenti, basato sul consenso, puoi creare applicazioni più personalizzate. Una nuova app fitness, per esempio, potrebbe – con il permesso dell’utente – importare l’intera cronologia sanitaria di una persona dall’ecosistema di un gatekeeper, offrendo valore immediato e riducendo l’attrito del cold start.
*   **Riduzione del time-to-market:** regole più eque negli app store, come la possibilità di usare sistemi di pagamento alternativi, possono abbattere in modo significativo i costi operativi e semplificare le strategie di go-to-market. Questo ti consente di concentrare le risorse di engineering sul core product, invece di impantanarti con gateway di pagamento restrittivi.

Non si tratta di uno scenario futuro. Il quadro normativo è entrato ufficialmente in vigore il **1° novembre 2022**. Entro il **2 maggio 2023**, la maggior parte delle disposizioni era già operativa, avviando il processo di designazione dei “gatekeeper”. Le aziende che superavano le soglie, come un fatturato annuo nell’UE di **7,5 miliardi di euro**, hanno dovuto notificare la Commissione europea. Puoi trovare una sintesi nella [timeline e nel processo ufficiale del DMA](https://actonline.org/wp-content/uploads/DMA-Timeline85-Final-.pdf).

### Sbloccare nuovi flussi di lavoro AI

Il DMA è un catalizzatore importante per l’innovazione AI. Abbattendo i silos di dati e contrastando il lock-in delle piattaforme, crea un terreno fertile per soluzioni AI specializzate che competono sul merito.

> Il Digital Markets Act favorisce il passaggio da ecosistemi AI monovendor a un marketplace più diversificato. Questo consente alle aziende di costruire workflow AI best-of-breed, combinando modelli e servizi diversi senza restare vincolate allo stack di un unico gatekeeper.

Prendiamo una piattaforma logistica basata su AI. Prima del DMA, potresti essere stato vincolato all’ecosistema di un solo gatekeeper per mappe, hosting cloud e servizi AI. Oggi puoi progettare una soluzione più robusta ed efficiente:
*   usare un algoritmo di routing specializzato, di terze parti, per ottimizzare meglio le consegne;
*   integrare più piattaforme di comunicazione per inviare aggiornamenti agli autisti;
*   sfruttare potenti modelli linguistici open source per i chatbot del customer service ed eseguirli sull’infrastruttura che preferisci.

Questo approccio modulare non migliora solo le prestazioni, ma rafforza anche la resilienza del sistema e l’efficienza dei costi. Progettando con una mentalità privacy-first, costruisci anche fiducia, in linea con i principi discussi nella nostra guida su [come costruire una strategia di dati first-party](https://devisia.pro/en/blog/strategia-dati-first-party). Per i product leader, l’obiettivo è chiaro: usare queste nuove aperture per creare prodotti digitali più scalabili, manutenibili e competitivi.

## Conclusione: costruire il tuo business per un mondo post-DMA

Il Digital Market Act non è solo un esercizio di compliance; è una ristrutturazione profonda dell’economia digitale. Per anni, il mercato è stato definito da ecosistemi chiusi. Il DMA sta smantellando sistematicamente quelle barriere e spingendo il settore verso un modello più aperto e interoperabile. Per la maggior parte dei leader tecnologici B2B, non si tratta di una minaccia ma di un invito diretto a costruire in modo diverso.

Le nuove regole obbligano i gatekeeper a separare i servizi, abilitare la portabilità dei dati e consentire la connessione di sistemi terzi. Mentre i grandi player sono assorbiti da progetti di compliance complessi, le aziende più piccole e agili hanno una finestra chiara per sviluppare prodotti che prima non erano sostenibili. La normativa legittima un nuovo scenario competitivo, in cui la qualità del prodotto conta più dell’appartenenza alla piattaforma.

### Una mentalità per il nuovo mercato

Per avere successo in questa nuova realtà, serve una mentalità product ed engineering orientata al futuro. Una strategia solida si basa su principi coerenti con la direzione in cui sta andando il mercato.

Vediamo tre pilastri del successo:

*   **Privacy by Design:** il DMA lavora in parallelo con il GDPR. Progettare la privacy fin dal primo giorno è un vantaggio competitivo concreto, perché costruisce fiducia negli utenti.
*   **Manutenibilità di lungo periodo:** le regole evolveranno. Progettare per modularità, scalabilità e adattabilità garantisce che i sistemi possano assorbire i cambiamenti futuri senza un costoso rifacimento.
*   **Delivery incrementale guidata dal valore:** concentrati sul rilasciare rapidamente valore di business misurabile. Questo approccio ti permette di testare le idee e cambiare direzione in base alla traction reale in questi nuovi segmenti di mercato.

> Il Digital Markets Act è un punto di partenza, non un punto di arrivo. Premia le aziende che mettono al centro affidabilità, fiducia degli utenti e architetture sostenibili, invece dei trucchetti di crescita a breve termine. Il successo nel lungo periodo arriverà costruendo prodotti eccellenti, non aggirando le regole.

In definitiva, la strada più pragmatica è costruire con intenzione. Le nuove regole favoriscono le aziende che realizzano software affidabile, sicuro e centrato sull’utente. Per founder e product leader, questo significa indirizzare gli sforzi di engineering su ciò che conta davvero: risolvere problemi reali e offrire valore eccezionale.

Orientarsi in questi cambiamenti tecnici e strategici richiede competenze profonde. Un partner tecnico come **Devisia** può fornire la chiarezza architetturale e il supporto operativo necessari per costruire sistemi robusti, scalabili e pronti per ciò che verrà. L’opportunità è qui – per chi è pronto a costruirci sopra.

## Domande frequenti sul DMA

Qui affrontiamo le domande pratiche che CTO, product leader e founder si pongono sull’impatto reale del DMA sulla strategia e sullo stack tecnologico.

### Il Digital Market Act si applica alla mia startup B2B SaaS?

Direttamente, gli obblighi del DMA riguardano solo i “gatekeeper” designati. Tuttavia, gli effetti indiretti sono molto ampi. Se il tuo prodotto SaaS compete con una piattaforma di un gatekeeper, si integra con essa o viene venduto tramite essa – come un app store o un sistema operativo – il DMA crea nuove opportunità.

Potresti ottenere accesso più equo, condizioni commerciali migliori e la possibilità di offrire sistemi di pagamento alternativi. Anche i tuoi utenti potrebbero beneficiare di una vera portabilità dei dati. Il punto chiave è mappare dove il tuo modello di business si interseca con i servizi dei gatekeeper e definire come trasformare queste nuove regole in un vantaggio competitivo.

### Qual è il cambiamento tecnico più significativo richiesto dal DMA?

Dal punto di vista architetturale, gli obblighi di **interoperabilità e portabilità dei dati** sono i più profondi. Per i gatekeeper, questo significa ripensare l’architettura, allontanandosi da ecosistemi chiusi e proprietari per costruire API robuste, sicure e ben documentate per i servizi di terze parti.

Per le altre aziende, la sfida è preparare i propri sistemi a connettersi con queste nuove API. Non si tratta di una piccola modifica: richiede una progettazione architetturale attenta per gestire sincronizzazione dei dati, sicurezza e scalabilità. Stiamo andando verso un’economia digitale più interconnessa, API-first.

### Come interagiscono DMA e GDPR?

> DMA e GDPR sono complementari, non intercambiabili. Il GDPR riguarda la protezione dei dati personali e i diritti individuali alla privacy. Il DMA riguarda l’equità economica e la concorrenza aperta nei mercati digitali.

Non puoi usare la conformità al DMA come giustificazione per non rispettare il GDPR. Per esempio, quando un gatekeeper fornisce accesso ai dati ai sensi del DMA, deve comunque farlo in modo conforme al GDPR, con una base giuridica valida e nel rispetto del consenso dell’utente. I tuoi sistemi devono essere progettati per soddisfare contemporaneamente entrambi gli insiemi di requisiti.

### Il DMA renderà più facile sviluppare applicazioni AI?

Sì, in diversi modi importanti. Il DMA è destinato ad abbattere i muri degli ecosistemi AI a fornitore unico, favorendo un mercato più diversificato e competitivo.

*   **Accesso più equo:** Un accesso migliore ai servizi fondamentali della piattaforma e alle funzionalità hardware – come i chip NFC – potrebbe sbloccare nuove categorie di applicazioni AI, prima impossibili da realizzare.
*   **პორტabilità dei dati:** Quando gli utenti possono spostare facilmente i propri dati verso un nuovo servizio AI innovativo, la concorrenza si rafforza. Questo offre anche ai player più piccoli e specializzati una reale opportunità di farsi spazio con modelli migliori.
*   **Nessun auto-preferenziamento:** Vietando ai gatekeeper di promuovere in modo scorretto i propri servizi, il DMA garantisce che le soluzioni AI più piccole possano competere sul merito, non sulle logiche di piattaforma.

Questi fattori, insieme, creano un contesto più aperto in cui può vincere la migliore soluzione AI, non quella più profondamente integrata in una piattaforma chiusa.

---
Affrontare questi cambiamenti richiede un partner che conosca a fondo sia l’architettura tecnica sia le implicazioni strategiche. **Devisia** aiuta le aziende a costruire prodotti digitali affidabili, scalabili e manutenibili, progettati per prosperare in questo nuovo mercato più aperto. Scopri di più su [https://www.devisia.pro](https://www.devisia.pro).
