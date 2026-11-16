---
title: Come tornare a un commit precedente su GitHub
description: >-
  Impara a ripristinare in sicurezza un commit precedente su GitHub con passaggi
  pratici per i team, per annullare le modifiche, ridurre i rischi e mantenere
  stabile il progetto.
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
translationSourceHash: 869e7307518b6628362f087e6e5d7e83b2f468d27312b3f1d478c47fccdf2001
---
Per riportare indietro un commit problematico in un repository condiviso, il metodo standard e più sicuro è usare `git revert` seguito dall'hash del commit di destinazione. Questo comando non elimina né modifica la cronologia esistente. Al contrario, crea un nuovo commit che annulla in modo preciso le modifiche del commit specificato, garantendo una history di progetto trasparente e verificabile.

## Il problema: revert del codice non governati nei progetti collaborativi

In qualunque ciclo di sviluppo software, l'errore è una realtà operativa. Una nuova funzionalità può introdurre un bug subdolo, una modifica alla configurazione può destabilizzare un ambiente di staging, oppure un commit può esporre per errore informazioni sensibili. La sfida principale non è eliminare del tutto gli errori, ma definire un processo solido per correggerli senza introdurre ulteriore rischio o caos.

È qui che la scelta del comando Git ha implicazioni architetturali importanti. Nei sistemi B2B, dove stabilità, compliance e una traccia di audit chiara non sono negoziabili, il modo in cui si annullano le modifiche è importante quanto il modo in cui vengono introdotte. Usare comandi che riscrivono la history, come `git reset`, su branch condivisi è un anti-pattern ben noto. Offusca l'evoluzione del progetto, crea storie divergenti per i membri del team e può portare a una perdita irreversibile di codice se altri sviluppatori hanno già eseguito il pull del branch “riscritto”. Questo approccio genera debito tecnico e rischio operativo. Per una prospettiva più ampia sulla resilienza dell'infrastruttura, la nostra analisi sulle [strategie di disaster recovery per il cloud computing](https://devisia.pro/blog/cloud-computing-disaster-recovery) affronta principi correlati.

### La soluzione: mantenere una history verificabile e immutabile per quanto possibile

La soluzione professionale e a basso rischio per correggere errori su branch condivisi è `git revert`.

A differenza dei comandi che cancellano il passato, `git revert` preserva l'integrità del registro dei commit. Funziona creando un nuovo commit che, in modo programmatico, inverte le modifiche di uno precedente. Questo metodo fornisce una history trasparente e verificabile di ogni azione, comprese quelle correttive. Non è solo una buona pratica: per i settori regolamentati è una necessità.

Questa capacità è particolarmente critica in contesti di engineering ad alta velocità. In Devisia, dove i nostri team costruiscono piattaforme SaaS scalabili e sistemi AI, padroneggiare tecniche di reversione sicure è fondamentale. Secondo l'analisi GitClear 2024 su quasi **900.000** developer-years, il developer mediano esegue solo **1.200** commit all'anno, ma i più attivi (**90° percentile**) arrivano a **4.500**. Con questi volumi, un singolo commit errato può propagarsi rapidamente in produzione, rendendo i rollback efficienti e sicuri una capacità operativa critica. `git revert` è pensato proprio per questo: crea un commit “inverso” in sicurezza, lasciando intatta la history originale. Puoi approfondire il tema su [produttività degli sviluppatori e pattern di commit su GitKraken](https://www.gitkraken.com/learn/git/problems/revert-git-commit).

> Trattando un revert come una modifica standard e tracciata, mantieni una history pulita e lineare che racconta l'intera evoluzione del progetto – errori e correzioni inclusi. Questa trasparenza è un pilastro del software engineering responsabile e della governance.

## Confronto tra le operazioni di "undo" di Git: Revert vs Reset

In Git non esiste un comando universale di "annulla". Lo strumento corretto dipende interamente dal contesto, in particolare dal fatto che i commit in questione siano già stati condivisi con altri sviluppatori. I comandi principali per riportare indietro le modifiche sono `git revert` e `git reset`, ciascuno progettato per un caso d'uso diverso e con trade-off distinti.

Il fattore decisionale critico è l'ambito del commit: è locale oppure è già stato pushato su un remote condiviso? `git revert` è lo standard per qualunque modifica presente su un branch condiviso, perché non è distruttivo per la history esistente. `git reset` è uno strumento potente per ripulire la history dei commit locali *prima* di condividerla.

Il seguente albero decisionale illustra questo principio cardine. Se un commit esiste su un branch condiviso, l'unica opzione sicura è revertirlo. Se invece è confinato al repository locale, hai più flessibilità.

![Diagramma di flusso per il revert del codice, con i passaggi basati sull'individuazione dell'errore e sullo stato di push del codice.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/3e0fb175-9ce2-47d0-84cc-4ef0a5347d40/github-revert-to-previous-commit-code-reversion.jpg)

Questo diagramma rafforza la regola d'oro dei workflow Git collaborativi: non riscrivere la history condivisa. `git revert` rispetta questa regola perché aggiunge alla history, non la modifica.

### Git Revert vs Reset: confronto tecnico

| Comando | Effetto sulla history | Caso d'uso principale | Rischio sui branch condivisi |
| :--- | :--- | :--- | :--- |
| `git revert` | **Non distruttivo.** Crea un nuovo commit che inverte un commit precedente. | Annullare in sicurezza modifiche su un branch pubblico o condiviso. | **Basso.** Conserva la history e si integra bene nei workflow del team. |
| `git reset` | **Distruttivo.** Sposta il puntatore del branch, cancellando di fatto commit e riscrivendo la history. | Ripulire commit locali *prima* del push su un branch condiviso. | **Alto.** Riscrive la history pubblica, costringendo i collaboratori a procedure di recupero complesse e soggette a errori. |

Questa tabella chiarisce il trade-off fondamentale: `git revert` è per la history pubblica e condivisa, mentre `git reset` è per la history privata e locale.

### Git Revert: la soluzione sicura e verificabile

Considera `git revert` la procedura operativa standard per annullare modifiche in un contesto collaborativo. Non elimina né nasconde i commit precedenti. Al contrario, esamina il commit di destinazione e genera un **nuovo commit** che applica l'insieme inverso delle modifiche.

Per esempio, se il commit `abc1234` ha aggiunto una funzione, `git revert abc1234` creerà un nuovo commit che rimuove quella stessa funzione. La history va avanti, ma lo stato della codebase torna indietro.

I principali vantaggi architetturali di questo approccio sono:
*   **Conservazione della history:** il commit originale “errato” resta nel log, insieme al successivo commit di revert. Questo crea una traccia completa e verificabile di ciò che è accaduto e del motivo per cui è stato annullato – un elemento prezioso per debugging, security audit e code review.
*   **Sicurezza sui branch condivisi:** poiché `git revert` aggiunge semplicemente un nuovo commit, la modifica risultante può essere pushata su un branch remoto senza interrompere il lavoro dei membri del team. Per loro è solo un altro commit da pullare.
*   **Comunicazione chiara:** il messaggio di commit predefinito generato da `revert` indica esplicitamente quale commit viene annullato, rendendo l'intento trasparente per tutto il team.

### Git Reset: il riscrittore della history locale

`git reset` è uno strumento profondamente diverso. È un **comando distruttivo** che modifica la history di un branch riposizionando il puntatore HEAD su un commit precedente. A seconda della modalità utilizzata (`--soft`, `--mixed`, `--hard`), può scartare commit dalla history, rimuovere modifiche dall'area di staging o cancellare lavoro dalla working directory.

*   `--soft`: sposta il puntatore del branch ma mantiene tutte le modifiche dei commit scartati in staging, pronte per un nuovo commit. Utile per fare squash di più commit locali.
*   `--mixed` (predefinito): sposta il puntatore e rimuove le modifiche dallo staging, lasciandole come modifiche nella working directory.
*   `--hard`: sposta il puntatore e **elimina in modo permanente** tutte le modifiche dei commit scartati sia dalla history sia dalla working directory. Va usato con estrema cautela.

> **Attenzione:** non usare mai `git reset` su un branch che è stato già pushato e pullato da altri. Un successivo force push (`git push --force`) riscrive la history pubblica, creando uno stato divergente che romperà i repository locali dei collaboratori e richiederà un processo di recupero manuale e soggetto a errori.

Il caso d'uso corretto di `git reset` è ripulire il tuo branch feature locale *prima* di aprire una pull request. Quando i commit sono condivisi, `git revert` è lo strumento giusto.

## Come revertire un singolo commit: scenari pratici

Uno scenario comune è un singolo commit isolato che introduce un difetto. L'obiettivo è eseguire un rollback chirurgico di quella modifica specifica senza impattare i commit successivi nella history del progetto.

È esattamente il problema che `git revert` è progettato per risolvere. Fornisce un modo sicuro e non distruttivo per annullare una modifica già condivisa. A differenza di `git reset`, aggiunge alla history invece di riscriverla, creando un *nuovo* commit che è l'esatto inverso di quello problematico.

![Diagramma che mostra due metodi per revertire un commit Git: comando `git revert` e interfaccia web.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/dc5b4e53-c08c-474c-9f90-a0f52262f0d5/github-revert-to-previous-commit-git-revert.jpg)

Gli scenari seguenti ne mostrano l'uso da riga di comando e tramite l'interfaccia web di [GitHub](https://github.com/).

### Scenario A: revert dalla riga di comando

**Problema:** uno sviluppatore pusha un commit che espone per errore un endpoint API interno in un servizio esposto al pubblico. La modifica va annullata subito per mitigare il rischio di sicurezza prima che si propaghi nella pipeline CI/CD.

**Soluzione:**
1.  **Identificare l'hash del commit:** usa `git log` per trovare l'hash univoco del commit difettoso. L'opzione `--oneline` fornisce una vista sintetica.

    ```bash
    git log --oneline
    ```

    Dall'output, copia l'hash del commit di destinazione (ad esempio, `8a2b4e7`).

2.  **Eseguire il revert:** lancia il comando `git revert` con l'hash del commit.

    ```bash
    git revert 8a2b4e7
    ```

    Git crea un nuovo commit che inverte le modifiche di `8a2b4e7` e apre l'editor di testo predefinito per confermare il messaggio di commit.

3.  **Aggiungere contesto al messaggio di commit:** il messaggio predefinito è in genere "Revert '[messaggio originale del commit]'". Non basta. La best practice è aggiungere una spiegazione chiara del *perché* il revert era necessario. Per esempio: "Revert per rimuovere l'esposizione pubblica di un endpoint API interno. Questo risolve la vulnerabilità di sicurezza [Ticket-ID]." Questo contesto è fondamentale per audit futuri e per la comprensione del team.

4.  **Pushare il commit di revert:** pusha il nuovo commit di revert nel repository remoto per condividere la correzione.

    ```bash
    git push origin main
    ```

Il codice pericoloso è ora rimosso dalla HEAD del branch, e la history fornisce una traccia trasparente dell'incidente e della sua risoluzione.

### Scenario B: revert tramite l'interfaccia web di GitHub

**Problema:** una pull request viene mergiata, ma introduce un bug UI non critico – un pulsante risulta disallineato nella visualizzazione mobile. Il problema va corretto, ma la modifica può seguire il normale processo di review.

**Soluzione:**
Per i revert più semplici, la UI di GitHub offre un flusso di lavoro efficiente e controllato.

1.  **Individuare il commit:** nel repository su GitHub, vai alla scheda "Commits" per visualizzare la history del progetto.
2.  **Avviare il revert:** trova il commit che ha introdotto il bug. All'estrema destra dei dettagli del commit, GitHub offre un pulsante "Revert".
3.  **Aprire una pull request:** facendo clic su "Revert" non si committa direttamente sul branch di destinazione. GitHub crea invece un **nuovo branch** contenente il commit di revert e apre automaticamente una pull request.

Questa è una funzione di sicurezza importante. Impone che anche un revert debba passare attraverso il normale processo di review del team, inclusi i controlli CI automatizzati, l'analisi statica e l'approvazione dei pari. Il team può quindi revisionare, approvare e mergiare la PR di revert, garantendo che il controllo qualità resti attivo anche durante un rollback. Questo processo allinea l'azione `github revert to previous commit` alle pratiche consolidate di governance engineering.

## Revert di modifiche complesse: merge commit e codice già pushato
Revertire un singolo commit è relativamente semplice. Nei casi reali, però, ci si trova spesso davanti a storie molto più complesse, per esempio quando bisogna annullare un intero pull request (un merge commit) oppure correggere un errore che è già stato pushato e distribuito in produzione. In queste situazioni serve un approccio più attento, per evitare di introdurre ulteriori complicazioni.

![Diagramma che illustra il branching Git, il merge e il revert di un merge commit senza force push.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/55fa241d-5965-41e9-9353-201734900889/github-revert-to-previous-commit-git-revert.jpg)

Quando un pull request viene mergiato, Git in genere crea un merge commit con due parent: uno punta allo stato del branch di destinazione, ad esempio `main`, e l’altro alla testa del branch di feature. Un semplice `git revert <merge-commit-hash>` fallirà, perché Git non sa quale linea di parent deve seguire.

### Revertire un Merge Commit

Per revertire correttamente un merge, devi indicare quale commit parent rappresenta la “mainline” da preservare. Lo si fa con l’opzione `-m` oppure `--mainline`.

*   `git revert <merge-commit-hash> -m 1`: è il comando standard per revertire un pull request. Dice a Git di annullare le modifiche introdotte dal secondo parent (il branch di feature), mantenendo invece la storia del primo parent (il branch di destinazione).
*   `git revert <merge-commit-hash> -m 2`: è un’operazione rara e potenzialmente distruttiva. Annullerebbe tutte le modifiche del branch di destinazione dalla creazione della feature in poi, cosa che quasi mai corrisponde all’obiettivo reale.

Di conseguenza, se un PR mergiato rompe il branch `main`, la procedura corretta è trovare l’hash del merge commit ed eseguire `git revert <hash> -m 1`. In questo modo si rimuovono in sicurezza le modifiche difettose della feature, riportando il branch `main` allo stato precedente al merge senza riscrivere la storia. Gestire correttamente i revert dei merge è essenziale per mantenere la stabilità, un principio chiave che integriamo nella nostra [architettura CI/CD](https://devisia.pro/en/blog/pipeline-ci-cd) per proteggere l’integrità delle build.

### Il Rischio di Riscrivere la Storia già Pushata

Qui arriviamo alla regola più importante dell’ingegneria software collaborativa: **non riscrivere la storia di un branch condiviso.** Di conseguenza, l’uso di `git push --force` su branch condivisi come `main` o `develop` dovrebbe essere disabilitato tramite le regole del repository. Un force push sovrascrive la storia remota e può cancellare in silenzio i commit di altri sviluppatori, oltre a disallineare il repository locale di ogni membro del team, con conseguente lavoro extra e confusione.

Immagina un team di sviluppo che sta distribuendo un nuovo dashboard per un cliente. Uno sviluppatore pusha un commit difettoso che corrompe le visualizzazioni dei dati in tempo reale. Nel panico, potrebbe essere tentato di fare `git reset` e poi `git push --force`. È una ricetta per il disastro. Secondo un’analisi, l’**11%** degli incidenti di supporto IT in alcune organizzazioni riguarda il recupero da force push che hanno sovrascritto la storia. Il rischio aumenta in modo significativo nei progetti complessi, come le integrazioni enterprise di AI, dove il ritmo dei commit è elevato. Per maggiori dettagli, vedi la ricerca sui [pattern dei commit e sull’attività degli sviluppatori su GitClear](https://www.gitclear.com/research_studies/git_commit_count_percentiles_annual_days_active_from_largest_data_set).

> Lo standard professionale per correggere un errore già pushato è il flusso di lavoro “revert-and-push”. Crea prima localmente un nuovo commit di revert, poi pushalo sul remoto. In questo modo mantieni uno storico completo e veritiero del progetto.

Questo approccio tratta la storia del codice come un registro immutabile, proteggendo produttività del team e stabilità del progetto. Gli strumenti Git visuali possono semplificare queste operazioni, ma una solida comprensione dei comandi sottostanti ti permette di gestire qualsiasi scenario di versionamento con precisione.

## Best Practice per Revertire Commit in un Contesto di Team

Usare `git revert` in modo efficace non significa solo eseguire bene il comando: vuol dire anche inserire un processo affidabile nella cultura ingegneristica del team. Per le organizzazioni che sviluppano software business-critical, un protocollo coerente per il rollback delle modifiche è fondamentale per mantenere l’integrità del codebase e la fiducia degli sviluppatori.

Questo richiede di andare oltre le correzioni improvvisate e reattive, costruendo un workflow chiaro e ripetibile per tutti i rollback.

Il primo passo è sempre la comunicazione. Prima di eseguire `git revert` su un branch condiviso come `main` o `develop`, avvisa il team. Un’inversione improvvisa del codice, anche se fatta con buone intenzioni, può creare confusione o entrare in conflitto con lavoro già in corso. Un breve messaggio nel canale di comunicazione del team, che spieghi *cosa* viene revertito e *perché*, evita interruzioni inutili.

### Definire un Protocollo Formale di Revert

Una volta informato il team, il processo di revert dovrebbe seguire il workflow standard di sviluppo. Un revert è una modifica al codice e va quindi sottoposto agli stessi quality gate di una nuova feature.

*   **Creare Pull Request anche per i Revert:** evita di pushare direttamente i commit di revert su un branch protetto. Crea invece un nuovo branch, esegui `git revert`, pushalo e apri una pull request. In questo modo la modifica passa dalla tua pipeline CI/CD e riceve una revisione adeguata da parte dei colleghi.
*   **Scrivere Commit Message Descrittivi:** il messaggio predefinito “Revert...” è solo un punto di partenza. Arricchiscilo con il contesto davvero utile. Spiega *perché* il revert era necessario. Si trattava di un bug critico, di una vulnerabilità di sicurezza o di una feature fuori target? Questa documentazione è preziosa per gli sviluppatori futuri e per gli auditor.
*   **Usare `git reflog` come rete di sicurezza locale:** mentre `git revert` è sicuro per la storia condivisa, gli errori locali capitano. `git reflog` funziona come un registro locale e traccia ogni cambiamento dei puntatori del branch. Se esegui per sbaglio `git reset --hard` e perdi lavoro locale, `reflog` è lo strumento che ti permette di recuperare i commit persi.

### Garantire Robustezza su Scala

Seguire queste pratiche favorisce una cultura di governance e di processo. Questo diventa ancora più importante per le organizzazioni che integrano AI, dove velocità e complessità delle modifiche al codice aumentano sensibilmente. Per le aziende con cui collaboriamo nella costruzione di sistemi di AI governata, le statistiche Git mostrano che i revert sono un segnale di controllo qualità, non di fallimento.

Uno studio GitClear del 2024 ha rilevato che gli sviluppatori con le performance migliori (99° percentile) effettuano oltre **10.000** commit all’anno e che il **35%** di quel lavoro riguarda revert necessari a mantenere la robustezza del sistema. Come evidenzia [un issue su GitHub](https://github.com/anuraghazra/github-readme-stats/issues/4098), anche gli strumenti di tracking dei commit possono avere bug, quindi una storia pulita e intenzionale è essenziale per metriche di progetto affidabili.

> Un processo strutturato di revert è il segno distintivo di un’organizzazione ingegneristica matura. Indica un impegno concreto verso trasparenza, qualità e collaborazione – principi molto più importanti della sola velocità di commit.

Standardizzando il modo in cui il tuo team gestisce un `github revert to previous commit`, rafforzi il principio che la qualità del codice è una responsabilità condivisa. Questo approccio è fondamentale per costruire software affidabile ed è una componente chiave del nostro [codice di condotta](https://devisia.pro/blog/codice-di-condotta) interno.

## Domande Frequenti sul Revert dei Commit

Gestire la storia Git di un progetto richiede precisione, soprattutto in un contesto di team. Ecco risposte sintetiche alle domande più comuni che emergono quando gli sviluppatori devono `github revert to previous commit`.

### Cosa Succede se Reverte un Commit di Revert?

Revertire un commit di revert riapplica di fatto le modifiche originali. Un’operazione `git revert` crea un nuovo commit che è l’inverso del commit di destinazione. Revertire questo “revert commit” crea semplicemente un altro inverso, che riporta il codice allo stato precedente al primo revert.

È un modo pulito e completamente tracciabile per reintrodurre una feature o una correzione che era stata rimossa in precedenza. La storia del progetto mostrerà in modo trasparente il commit originale, il revert e la successiva riapplicazione delle modifiche.

### Posso Revertire un Commit che non è l’Ultimo?

Sì. `git revert` può colpire qualsiasi commit nella storia del progetto, tramite il suo hash univoco. Git è progettato per calcolare le modifiche introdotte in quel commit specifico e applicare una patch inversa alla HEAD del branch corrente.

Si tratta di un’operazione chirurgica. Non tocca i commit creati dopo quello che stai revertendo. Annulla solo le modifiche specifiche del commit di destinazione, lasciando intatto tutto il resto.

### È Meglio Revertire o Creare una Nuova PR con una Fix?

La scelta dipende dall’urgenza e dall’impatto del problema.

*   **Revertire subito:** se un commit mergiato di recente provoca un guasto critico – per esempio blocca la build principale, causa un’interruzione del servizio o introduce una grave vulnerabilità di sicurezza – revertire il merge commit è quasi sempre la strada più rapida e sicura per ripristinare la stabilità.

*   **Creare una PR di fix:** per bug non critici, regressioni minori o problemi puramente cosmetici, spesso è più pulito aprire una nuova pull request con una correzione mirata. In questo modo il team può rivedere la soluzione specifica senza il rumore contestuale di un revert completo.

> **Come regola generale, la comunicazione è fondamentale.** Confrontati con il team per stabilire la strada migliore. La priorità immediata deve sempre essere riportare il branch condiviso in uno stato stabile e funzionante.

### Qual è la Differenza tra Git Revert e Git Reset Hard?

Capire questa distinzione è fondamentale per qualsiasi sviluppatore che lavori in un ambiente collaborativo.

*   `git revert` è un’operazione **sicura e non distruttiva**. Crea un *nuovo* commit per annullare le modifiche, preservando la storia del progetto per tutti i collaboratori. È lo standard per correggere errori su branch condivisi.

*   `git reset --hard` è un’operazione **distruttiva**. Elimina i commit dalla storia e sposta il puntatore del branch, riscrivendo di fatto il passato. Non dovresti **mai** usare `git reset --hard` su un branch condiviso che altri hanno già pullato. Farlo crea storie divergenti e può generare problemi significativi, difficili da risolvere, per i tuoi colleghi.

---
At **Devisia**, costruiamo prodotti digitali affidabili con un’attenzione costante alla manutenibilità e a scelte architetturali chiare. Se ti serve un partner per trasformare la tua visione di business in software robusto e scalabile, scopri come possiamo aiutarti. [Scopri di più sui nostri servizi di sviluppo software su misura](https://www.devisia.pro).
