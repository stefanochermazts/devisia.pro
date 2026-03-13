---
title: 'Come annullare un commit precedente su GitHub: guida per i team di ingegneria'
description: >-
  Scopri come annullare in modo sicuro un commit precedente su GitHub: passaggi
  pratici per i team di ingegneria per invertire le modifiche, ridurre i rischi
  e ripristinare la stabilità del progetto.
pubDate: 2026-03-13T10:22:25.014Z
heroImage: >-
  https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/20d1ffa8-f35c-4d2e-b78b-a218c1bead41/github-revert-to-previous-commit-technical-illustration.jpg
author: Devisia AI
tags:
  - github revert to previous commit
  - git revert
  - version control
  - git best practices
  - code rollback
translationSlug: github-revert-to-previous-commit
translationSourceHash: 88acb47d5f31810eb7b51370cda81b712e23675517aa78df0b16b55390f3c332
---
Per annullare un commit problematico in un repository condiviso, il metodo standard e più sicuro è usare `git revert` seguito dall'hash del commit target. Questo comando non elimina né altera la cronologia esistente. Invece, crea un nuovo commit che inverte esattamente le modifiche del commit specificato, garantendo una cronologia del progetto trasparente e auditabile.

## Il problema: ripristini di codice non gestiti nei progetti collaborativi

In qualsiasi ciclo di vita dello sviluppo software, gli errori sono una realtà operativa. Una nuova funzionalità potrebbe introdurre un bug sottile, una modifica di configurazione potrebbe destabilizzare un ambiente di staging, o un commit potrebbe involontariamente esporre informazioni sensibili. La sfida principale non è prevenire completamente gli errori, ma stabilire un processo robusto per correggerli senza introdurre ulteriore rischio o caos.

Qui la scelta del comando Git ha implicazioni architetturali significative. Per sistemi B2B, dove stabilità, conformità e una chiara traccia di audit sono imprescindibili, il modo in cui le modifiche vengono annullate è tanto critico quanto il modo in cui vengono effettuate. Usare comandi che riscrivono la storia come `git reset` su branch condivisi è un anti-pattern noto. Offusca l'evoluzione del progetto, crea storie divergenti per i membri del team e può portare a perdite irreversibili di codice se altri sviluppatori hanno già eseguito il pull del branch "riscritto". Questo approccio genera debito tecnico e rischio operativo. Per una prospettiva più ampia sulla resilienza dell'infrastruttura, la nostra analisi delle [strategie di disaster recovery per il cloud computing](https://devisia.pro/blog/cloud-computing-disaster-recovery) tratta principi correlati.

### La soluzione: mantenere una cronologia auditabile e quasi immutabile

La soluzione professionale e a basso rischio per correggere errori su branch condivisi è `git revert`.

A differenza dei comandi che cancellano il passato, `git revert` preserva l'integrità del registro dei commit. Opera creando un nuovo commit che inverte in modo programmato le modifiche di uno precedente. Questa metodologia fornisce una cronologia trasparente e verificabile di ogni azione, incluse le misure correttive. Questo non è solo una buona pratica; per industrie regolamentate, è una necessità.

Questa capacità è particolarmente vitale in ambienti di ingegneria ad alta velocità. In Devisia, dove i nostri team costruiscono piattaforme SaaS scalabili e sistemi AI, padroneggiare tecniche sicure di ripristino è fondamentale. Secondo l'analisi 2024 di GitClear su quasi **900,000** developer-years, lo sviluppatore mediano effettua solo **1,200** commit all'anno, ma i più attivi (percentile **90**) raggiungono **4,500**. A questo ritmo, un singolo commit difettoso può propagarsi rapidamente in produzione, rendendo i rollback efficienti e sicuri una capacità operativa critica. `git revert` è progettato per questo, creando un commit "inverso" sicuro lasciando intatta la storia originale. Puoi leggere di più su [productività degli sviluppatori e pattern di commit su GitKraken](https://www.gitkraken.com/learn/git/problems/revert-git-commit).

> Trattando un revert come una modifica standard e tracciata, mantieni una storia pulita e lineare che racconta l'evoluzione completa del progetto—inclusi errori e correzioni. Questa trasparenza è una pietra miliare dell'ingegneria software responsabile e della governance.

## Confronto tra le operazioni di "annulla" di Git: Revert vs. Reset

In Git non esiste un comando universale "annulla". Lo strumento appropriato dipende interamente dal contesto, in particolare se i commit in questione sono stati condivisi con altri sviluppatori. I comandi principali per riportare indietro le modifiche sono `git revert` e `git reset`, ciascuno progettato per un caso d'uso distinto con diversi compromessi.

Il fattore decisionale critico è l'ambito del commit: è locale o è stato pushato su un remoto condiviso? `git revert` è lo standard per qualsiasi modifica presente su un branch condiviso perché non distrugge la cronologia esistente. `git reset` è uno strumento potente per ripulire la cronologia locale dei commit *prima* di condividerla.

Il seguente albero decisionale illustra questo principio fondamentale. Se un commit esiste su un branch condiviso, l'unica opzione sicura è il revert. Se è confinato al tuo repository locale, hai più flessibilità.

![Diagramma di flusso per il ripristino del codice, che mostra i passaggi in base al rilevamento dell'errore e allo stato di push del codice.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/3e0fb175-9ce2-47d0-84cc-4ef0a5347d40/github-revert-to-previous-commit-code-reversion.jpg)

Questo diagramma rafforza la regola d'oro dei workflow Git collaborativi: non riscrivere la storia condivisa. `git revert` sostiene questa regola aggiungendo alla storia, non modificandola.

### Git Revert vs. Reset: un confronto tecnico

| Command | Effect on History | Primary Use Case | Risk on Shared Branches |
| :--- | :--- | :--- | :--- |
| `git revert` | **Non distruttivo.** Crea un nuovo commit che inverte uno precedente. | Annullare in modo sicuro modifiche su un branch pubblico o condiviso. | **Basso.** Preserva la cronologia e si integra pulitamente nei workflow di team. |
| `git reset` | **Distruttivo.** Sposta il puntatore del branch, cancellando di fatto commit e riscrivendo la storia. | Pulire commit locali *prima* di pushare su un branch condiviso. | **Alto.** Riscrive la storia pubblica, costringendo i collaboratori in procedure di recupero complesse e soggette ad errori. |

Questa tabella chiarisce il compromesso fondamentale: `git revert` è per la storia pubblica e condivisa, mentre `git reset` è per la storia privata e locale.

### Git Revert: la soluzione sicura e auditabile

Considera `git revert` come la procedura operativa standard per annullare modifiche in un ambiente collaborativo. Non elimina né nasconde i commit precedenti. Invece, ispeziona il commit target e genera un **nuovo commit** che applica il set inverso di modifiche.

Per esempio, se il commit `abc1234` ha aggiunto una funzione, `git revert abc1234` creerà un nuovo commit che rimuove quella stessa funzione. La cronologia procede in avanti, ma lo stato del codebase torna indietro.

I principali vantaggi architetturali di questo approccio includono:
*   **Conservazione della cronologia:** Il commit originale "sbagliato" rimane nel log, insieme al successivo commit di revert. Questo crea una traccia completa e auditabile di cosa è successo e del motivo per cui è stato annullato—inestimabile per il debugging, gli audit di sicurezza e le code review.
*   **Sicurezza per i branch condivisi:** Poiché `git revert` semplicemente aggiunge un nuovo commit, la modifica risultante può essere pushata su un branch remoto senza interrompere il lavoro dei membri del team. Per loro, è semplicemente un altro commit da pullare.
*   **Comunicazione chiara:** Il messaggio di commit predefinito generato da `revert` dichiara esplicitamente quale commit sta invertendo, rendendo la tua intenzione trasparente all'intero team.

### Git Reset: il riscrittore della cronologia locale

`git reset` è uno strumento fondamentalmente diverso. È un **comando distruttivo** che modifica la storia di un branch riposizionando il puntatore HEAD su un commit precedente. A seconda della modalità usata (`--soft`, `--mixed`, `--hard`), può scartare commit dalla cronologia, rimuovere l'index dei cambiamenti o cancellare il lavoro dalla working directory.

*   `--soft`: Sposta il puntatore del branch ma mantiene tutte le modifiche dei commit scartati staged per un nuovo commit. Utile per unire più commit locali.
*   `--mixed` (default): Sposta il puntatore e deseleziona le modifiche, lasciandole come modifiche nella tua working directory.
*   `--hard`: Sposta il puntatore e **cancella permanentemente** tutte le modifiche dai commit scartati sia dalla cronologia che dalla working directory. Questo dovrebbe essere usato con estrema cautela.

> **Avvertenza:** Non usare mai `git reset` su un branch che è stato pushato e pullato da altri. Un successivo force-push (`git push --force`) riscrive la storia pubblica, creando uno stato divergente che spezzerà i repository locali dei tuoi collaboratori e richiederà una procedura di recupero manuale e soggetta a errori.

Il caso d'uso appropriato per `git reset` è pulire il tuo branch di feature locale *prima* di creare una pull request. Una volta che i commit sono stati condivisi, `git revert` è lo strumento corretto.

## Come ripristinare un singolo commit: scenari pratici

Uno scenario comune è un singolo commit isolato che introduce un difetto. L'obiettivo è eseguire un rollback chirurgico di quella specifica modifica senza impattare i commit successivi nella cronologia del progetto.

Questo è esattamente il problema che `git revert` è progettato per risolvere. Fornisce un modo sicuro e non distruttivo per annullare una modifica già condivisa. A differenza di `git reset`, aggiunge alla cronologia invece di riscriverla, creando un *nuovo* commit che è l'inverso preciso del commit problematico.

![Diagramma che mostra due metodi per ripristinare un commit Git: il comando `git revert` e un'interfaccia web.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/dc5b4e53-c08c-474c-9f90-a0f52262f0d5/github-revert-to-previous-commit-git-revert.jpg)

Gli scenari seguenti ne dimostrano l'uso tramite la riga di comando e l'interfaccia web di [GitHub](https://github.com/).

### Scenario A: ripristino dalla riga di comando

**Problema:** Uno sviluppatore push a un commit che accidentalmente espone un endpoint API interno in un servizio esposto al pubblico. La modifica deve essere invertita immediatamente per mitigare il rischio di sicurezza prima che si propaghi nella pipeline CI/CD.

**Soluzione:**
1.  **Identificare l'hash del commit:** Usa `git log` per trovare l'hash univoco del commit difettoso. Il flag `--oneline` fornisce una vista concisa.

    ```bash
    git log --oneline
    ```

    Dall'output, copia l'hash del commit target (es., `8a2b4e7`).

2.  **Eseguire il revert:** Esegui il comando `git revert` con l'hash del commit.

    ```bash
    git revert 8a2b4e7
    ```

    Git crea un nuovo commit che inverte le modifiche di `8a2b4e7` e apre il tuo editor di testo predefinito per confermare il messaggio di commit.

3.  **Aggiungere contesto al messaggio di commit:** Il messaggio predefinito è tipicamente "Revert '[Original commit message]'". Questo è insufficiente. La best practice è aggiungere una chiara spiegazione del *perché* il revert era necessario. Per esempio: "Reverting to remove public exposure of an internal API endpoint. This addresses security vulnerability [Ticket-ID]." Questo contesto è cruciale per audit futuri e per la comprensione del team.

4.  **Pushare il commit di revert:** Pushare il nuovo commit di revert sul repository remoto per condividere la correzione.

    ```bash
    git push origin main
    ```

Il codice pericoloso è ora rimosso dall'HEAD del branch e la cronologia fornisce un resoconto trasparente dell'incidente e della sua risoluzione.

### Scenario B: ripristino tramite l'interfaccia web di GitHub

**Problema:** Una pull request è stata mergiata, ma introduce un bug UI non critico: un pulsante è allineato male nelle view mobile. Il problema deve essere corretto, ma la modifica può seguire il processo di revisione standard.

**Soluzione:**
Per revert semplici, l'interfaccia GitHub offre un workflow efficiente e controllato.

1.  **Individuare il commit:** Nel repository su GitHub, vai nella scheda "Commits" per vedere la cronologia del progetto.
2.  **Iniziare il revert:** Trova il commit che ha introdotto il bug. A destra dei dettagli del commit, GitHub fornisce un pulsante "Revert".
3.  **Aprire una Pull Request:** Cliccare su "Revert" non committa direttamente sul branch target. Invece, GitHub crea un **nuovo branch** contenente il commit di revert e apre automaticamente una pull request.

Questa è una funzionalità di sicurezza chiave. Impone che anche un revert debba passare attraverso il processo di revisione standard del team, inclusi controlli CI automatizzati, analisi statica e approvazione dei pari. Il team può quindi revisionare, approvare e mergiare la PR di revert, garantendo che il controllo qualità sia mantenuto anche durante un rollback. Questo processo allinea l'azione `github revert to previous commit` con la governance ingegneristica stabilita.

## Ripristino di modifiche complesse: merge commit e codice già inviato (push)

Ripristinare un singolo commit è relativamente semplice. Tuttavia, gli scenari reali spesso coinvolgono storie più complesse, come annullare un'intera pull request (un merge commit) o correggere un errore già pushato e distribuito. Queste situazioni richiedono un approccio più sfumato per evitare di introdurre ulteriori complicazioni.

![Diagramma che illustra il branching, il merging e l'annullamento di un merge commit senza force push.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/55fa241d-5965-41e9-9353-201734900889/github-revert-to-previous-commit-git-revert.jpg)

Quando una pull request viene unita, Git tipicamente crea un merge commit con due genitori: uno che punta allo stato del ramo di destinazione (ad es., `main`) e l'altro alla testa del ramo funzionale. Un semplice `git revert <merge-commit-hash>` fallirà perché Git non sa quale linea di parentela seguire.

### Annullare un Merge Commit

Per annullare correttamente un merge, devi specificare quale commit genitore rappresenta la "mainline" che vuoi preservare. Questo si fa con l'opzione `-m` o `--mainline`.

*   `git revert <merge-commit-hash> -m 1`: Questo è il comando standard per annullare una pull request. Indica a Git di annullare le modifiche introdotte dal secondo genitore (il ramo feature) mantenendo la storia del primo genitore (il ramo di destinazione).
*   `git revert <merge-commit-hash> -m 2`: Questa è un'operazione rara e potenzialmente distruttiva. Annullerebbe tutte le modifiche del ramo di destinazione apportate dopo la creazione della feature, cosa che quasi mai è l'esito desiderato.

Pertanto, se una PR unita rompe il ramo `main`, la procedura corretta è trovare l'hash del merge commit ed eseguire `git revert <hash> -m 1`. Questo rimuove in sicurezza le modifiche della feature difettosa, ripristinando il ramo `main` al suo stato pre-merge senza riscrivere la storia. Gestire correttamente i revert di merge è essenziale per mantenere la stabilità, un principio fondamentale che incorporiamo nella nostra [architettura della pipeline CI/CD](https://devisia.pro/en/blog/pipeline-ci-cd) per proteggere l'integrità delle build.

### Il rischio di riscrivere la storia già pushata

Questo ci porta alla regola più critica dell'ingegneria del software collaborativa: **non riscrivere la cronologia di un ramo condiviso.** Di conseguenza, l'uso di `git push --force` su rami condivisi come `main` o `develop` dovrebbe essere disabilitato tramite le regole del repository. Un force push sovrascrive la cronologia remota, il che può eliminare silenziosamente commit di altri sviluppatori e desincronizzare il repository locale di ogni membro del team, portando a significativo lavoro di rifacimento e confusione.

Considera un team di sviluppo che distribuisce una nuova dashboard per un cliente. Uno sviluppatore pushà un commit difettoso che corrompe le visualizzazioni dei dati in tempo reale. In preda al panico, potrebbe essere tentato di eseguire `git reset` e `git push --force`. Questa è una ricetta per il disastro. Secondo un'analisi, **l'11%** degli incidenti di supporto IT in alcune organizzazioni riguarda il recupero da force push che hanno sovrascritto la storia. Il rischio è amplificato in progetti complessi come le integrazioni aziendali di AI, dove la velocità dei commit è elevata. Per maggiori informazioni, vedi la ricerca sui [modelli di commit e l'attività degli sviluppatori su GitClear](https://www.gitclear.com/research_studies/git_commit_count_percentiles_annual_days_active_from_largest_data_set).

> Lo standard professionale per correggere un errore pushato è il workflow "revert-and-push". Crea un nuovo commit di revert localmente, poi pushalo sul remoto. Questo preserva un registro completo e veritiero della storia del progetto.

Questo approccio tratta la storia del codebase come un registro immutabile, proteggendo la produttività del team e la stabilità del progetto. Mentre i client Git grafici possono semplificare queste operazioni, una solida comprensione dei comandi sottostanti garantisce che tu possa gestire qualsiasi scenario di controllo versione con precisione.

## Buone pratiche per annullare commit in un ambiente di team

L'uso efficace di `git revert` non riguarda solo l'esecuzione tecnica; riguarda l'integrazione di un processo affidabile nella cultura ingegneristica del tuo team. Per le organizzazioni che costruiscono software business-critical, un protocollo coerente per il rollback delle modifiche è fondamentale per mantenere l'integrità del codebase e la fiducia degli sviluppatori.

Questo richiede di andare oltre le soluzioni reattive e ad-hoc ed istituire un workflow chiaro e ripetibile per tutti i rollback.

Il primo passo è sempre la comunicazione. Prima di eseguire `git revert` su un ramo condiviso come `main` o `develop`, informa il team. Un'improvvisa inversione di codice, anche con buone intenzioni, può causare confusione o conflitti con lavori in corso. Un breve messaggio nel canale di comunicazione del team che spieghi *cosa* viene annullato e *perché* evita interruzioni.

### Istituire un protocollo formale per i revert

Una volta che il team è informato, il processo di revert dovrebbe seguire il workflow di sviluppo standard. Un revert è una modifica al codice e dovrebbe essere soggetto alle stesse barriere di qualità di qualsiasi nuova feature.

*   **Creare Pull Request per i revert:** Evita di pushare direttamente i commit di revert su un ramo protetto. Crea invece un nuovo ramo, esegui `git revert`, pushalo e apri una pull request. Questo garantisce che la modifica passi attraverso la tua pipeline CI/CD e riceva una revisione peer adeguata.
*   **Scrivere messaggi di commit descrittivi:** Il messaggio di default "Revert..." è solo un punto di partenza. Arricchiscilo con il contesto critico. Spiega *perché* il revert è stato necessario. Si trattava di un bug critico, di una vulnerabilità di sicurezza o di una feature non allineata? Questa documentazione è inestimabile per i futuri sviluppatori e gli auditor.
*   **Usare `git reflog` come rete di sicurezza locale:** Mentre `git revert` è sicuro per la storia condivisa, gli errori locali possono accadere. `git reflog` agisce come un diario locale, tracciando ogni modifica ai riferimenti dei tuoi rami. Se per errore esegui `git reset --hard` e perdi lavoro locale, `reflog` è lo strumento che ti permette di recuperare quei commit persi.

### Mantenere robustezza su larga scala

L'adesione a queste pratiche favorisce una cultura di governance e processo. Questo diventa ancora più critico per le organizzazioni che integrano l'AI, dove la velocità e la complessità delle modifiche al codice aumentano sostanzialmente. Per le aziende con cui collaboriamo per costruire sistemi AI governati, le statistiche Git rivelano che i revert sono un segno di controllo qualità, non di fallimento.

Uno studio GitClear del 2024 ha rilevato che gli sviluppatori top-performanti (99° percentile) fanno oltre **10.000** commit annuali, e il **35%** di quel lavoro coinvolge revert per mantenere la robustezza del sistema. Come [evidenziato in un issue di GitHub](https://github.com/anuraghazra/github-readme-stats/issues/4098), anche gli strumenti di tracciamento dei commit possono avere bug, rendendo una storia pulita e intenzionale essenziale per metriche di progetto accurate.

> Un processo strutturato di revert è un tratto distintivo di un'organizzazione ingegneristica matura. Segnala un impegno verso trasparenza, qualità e collaborazione—principi che hanno un impatto ben maggiore della pura velocità di commit.

Standardizzando il modo in cui il tuo team gestisce un `github annulla al commit precedente`, rinforzi il principio che la qualità del codice è una responsabilità condivisa. Questo approccio è fondamentale per costruire software affidabile ed è una componente chiave del nostro interno [codice di condotta](https://devisia.pro/blog/codice-di-condotta).

## Domande frequenti sugli annullamenti di commit

Navigare la storia Git di un progetto richiede precisione, specialmente in un contesto di team. Ecco risposte concise alle domande comuni che emergono quando gli sviluppatori hanno bisogno di `github annulla al commit precedente`.

### Cosa succede se annullo un commit di revert?

Annullare un commit di revert riapplica effettivamente le modifiche originali. Un'operazione `git revert` crea un nuovo commit che è l'inverso di un commit target. Annullare questo "commit di revert" crea semplicemente un altro inverso, che ripristina il codice allo stato precedente al primo revert.

Questo fornisce un metodo pulito e completamente tracciabile per reintrodurre una feature o una correzione che era stata precedentemente rimossa. La storia del progetto mostrerà in modo trasparente il commit originale, il revert e la successiva riapplicazione delle modifiche.

### Posso annullare un commit che non è quello più recente?

Sì. `git revert` può prendere di mira qualsiasi commit nella storia del progetto tramite il suo hash univoco. Git è progettato per calcolare le modifiche introdotte in quel commit specifico e applicare una patch inversa all'HEAD del tuo ramo corrente.

Questa è un'operazione chirurgica. Non influisce sui commit fatti dopo quello che stai annullando. Inverte solo le modifiche specifiche del commit target, lasciando intatto tutto il resto del lavoro.

### È meglio annullare o creare una nuova PR con una correzione?

La decisione dipende dall'urgenza e dall'impatto del problema.

*   **Annullare immediatamente:** Se un commit recentemente unito causa un guasto critico—come rompere la build principale, causare un'interruzione di servizio o introdurre una grave vulnerabilità di sicurezza—revertire il merge commit è quasi sempre il percorso più rapido e sicuro per ripristinare la stabilità.

*   **Creare una PR di correzione:** Per bug non critici, regressioni minori o problemi estetici, creare una nuova pull request con una correzione mirata è spesso un approccio più pulito. Questo permette al team di revisionare la soluzione specifica senza il rumore contestuale di un revert completo.

> **Come regola, la comunicazione è fondamentale.** Discute la situazione con il tuo team per determinare la migliore linea d'azione. La priorità immediata dovrebbe essere sempre riportare il ramo condiviso a uno stato stabile e funzionante.

### Qual è la differenza tra Git Revert e Git Reset --hard?

Comprendere questa distinzione è critica per qualsiasi sviluppatore che lavori in un ambiente collaborativo.

*   `git revert` è un'operazione **sicura, non distruttiva**. Crea un *nuovo* commit per annullare le modifiche, preservando la storia del progetto per tutti i collaboratori. È lo standard per correggere errori su rami condivisi.

*   `git reset --hard` è un'operazione **distruttiva**. Scarta commit dalla storia e sposta il puntatore del ramo, riscrivendo effettivamente il passato. Non dovresti **mai** usare `git reset --hard` su un ramo condiviso che altri hanno già pullato. Farlo crea storie divergenti e può causare problemi significativi e difficili da risolvere per i tuoi colleghi.

---
Ad **Devisia**, costruiamo prodotti digitali affidabili con un focus sulla manutenibilità e scelte architetturali chiare. Se hai bisogno di un partner per trasformare la tua visione di business in software robusto e scalabile, scopri come possiamo aiutarti. [Scopri di più sui nostri servizi di sviluppo software personalizzato](https://www.devisia.pro).
