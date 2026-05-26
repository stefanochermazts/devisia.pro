---
title: Come tornare a un commit precedente su GitHub
description: >-
  Impara a ripristinare in sicurezza un commit precedente su GitHub con passaggi
  pratici per i team, per annullare le modifiche, evitare rischi e riportare
  stabilità al progetto.
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
translationSourceHash: e567b0095ef726d49ab32a95df646566bb812c1fd2b3e235760a29493b52fa33
---
Per eseguire il rollback di un commit problematico in un repository condiviso, il metodo standard e più sicuro è usare `git revert` seguito dall'hash del commit di destinazione. Questo comando non elimina né altera la cronologia esistente. Invece, crea un nuovo commit che inverte con precisione le modifiche del commit specificato, garantendo una cronologia di progetto trasparente e verificabile.

## Il problema: reversions di codice non gestite nei progetti collaborativi

In qualsiasi ciclo di vita dello sviluppo software, gli errori sono una realtà operativa. Una nuova funzionalità potrebbe introdurre un bug sottile, una modifica di configurazione potrebbe destabilizzare un ambiente di staging, oppure un commit potrebbe esporre involontariamente informazioni sensibili. La sfida principale non è evitare del tutto gli errori, ma stabilire un processo robusto per correggerli senza introdurre ulteriori rischi o caos.

È qui che la scelta del comando Git ha implicazioni architetturali significative. Per i sistemi B2B, dove stabilità, conformità e una chiara traccia di audit sono requisiti imprescindibili, il modo in cui le modifiche vengono annullate è tanto critico quanto il modo in cui vengono apportate. Usare comandi che riscrivono la cronologia come `git reset` sui branch condivisi è un anti-pattern ben noto. Oscura l'evoluzione del progetto, crea storie divergenti per i membri del team e può portare a una perdita irreversibile di codice se altri sviluppatori hanno già eseguito il pull del branch "riscritto". Questo approccio crea debito tecnico e rischio operativo. Per una prospettiva più ampia sulla resilienza dell'infrastruttura, la nostra analisi delle [strategie di disaster recovery per il cloud computing](https://devisia.pro/blog/cloud-computing-disaster-recovery) copre principi correlati.

### La soluzione: mantenere una cronologia immutabile e verificabile

La soluzione professionale e a basso rischio per correggere errori su branch condivisi è `git revert`.

A differenza dei comandi che cancellano il passato, `git revert` preserva l'integrità del registro dei commit. Funziona creando un nuovo commit che inverte programmaticamente le modifiche di uno precedente. Questa metodologia fornisce una cronologia trasparente e verificabile di ogni azione, comprese le misure correttive. Non è solo una buona pratica; per i settori regolamentati, è una necessità.

Questa capacità è particolarmente vitale in ambienti di engineering ad alta velocità. In Devisia, dove i nostri team costruiscono piattaforme SaaS scalabili e sistemi AI, padroneggiare tecniche di reversione sicure è fondamentale. Secondo l'analisi 2024 di GitClear su quasi **900.000** anni-sviluppatore, lo sviluppatore mediano esegue solo **1.200** commit all'anno, ma i più attivi (**90° percentile**) arrivano a **4.500**. A questi volumi, un singolo commit difettoso può propagarsi rapidamente in produzione, rendendo i rollback efficienti e sicuri una capacità operativa critica. `git revert` è progettato per questo, creando un commit "inverso" sicuro e lasciando intatta la cronologia originale. Puoi leggere di più su [produttività degli sviluppatori e pattern di commit su GitKraken](https://www.gitkraken.com/learn/git/problems/revert-git-commit).

> Considerando un revert come una modifica standard tracciata, mantieni una cronologia pulita e lineare che documenta l'evoluzione completa del progetto, inclusi errori e correzioni. Questa trasparenza è un pilastro dell'ingegneria software responsabile e della governance.

## Confronto tra le operazioni "annulla" di Git: Revert vs. Reset

In Git, non esiste un comando universale per "annullare". Lo strumento appropriato dipende interamente dal contesto, in particolare dal fatto che i commit in questione siano stati condivisi con altri sviluppatori. I comandi principali per riportare indietro le modifiche sono `git revert` e `git reset`, ciascuno progettato per un caso d'uso distinto con diversi compromessi.

Il fattore decisionale critico è l'ambito del commit: è locale oppure è stato inviato a un remoto condiviso? `git revert` è lo standard per qualsiasi modifica presente su un branch condiviso perché non è distruttivo per la cronologia esistente. `git reset` è uno strumento potente per ripulire la cronologia dei commit locale *prima* di condividerla.

L'albero decisionale seguente illustra questo principio fondamentale. Se un commit esiste su un branch condiviso, l'unica opzione sicura è eseguire il revert. Se è confinato al tuo repository locale, hai più flessibilità.

![Diagramma di flusso per la reversione del codice, che mostra i passaggi in base al rilevamento dell'errore e allo stato del push del codice.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/3e0fb175-9ce2-47d0-84cc-4ef0a5347d40/github-revert-to-previous-commit-code-reversion.jpg)

Questo diagramma di flusso rafforza la regola d'oro dei workflow Git collaborativi: non riscrivere la cronologia condivisa. `git revert` rispetta questa regola aggiungendo alla cronologia, non alterandola.

### Git Revert vs. Reset: un confronto tecnico

| Comando | Effetto sulla cronologia | Caso d'uso principale | Rischio sui branch condivisi |
| :--- | :--- | :--- | :--- |
| `git revert` | **Non distruttivo.** Crea un nuovo commit che inverte un commit precedente. | Annullare in modo sicuro modifiche su un branch pubblico o condiviso. | **Basso.** Preserva la cronologia e si integra pulitamente nei workflow del team. |
| `git reset` | **Distruttivo.** Sposta il puntatore del branch, cancellando di fatto i commit e riscrivendo la cronologia. | Ripulire i commit locali *prima* del push verso un branch condiviso. | **Alto.** Riscrive la cronologia pubblica, costringendo i collaboratori a procedure di recupero complesse e soggette a errori. |

Questa tabella chiarisce il compromesso fondamentale: `git revert` è per la cronologia pubblica e condivisa, mentre `git reset` è per la cronologia privata e locale.

### Git Revert: la soluzione sicura e verificabile

Considera `git revert` la procedura operativa standard per annullare modifiche in un ambiente collaborativo. Non elimina né nasconde i commit precedenti. Invece, esamina il commit di destinazione e genera un **nuovo commit** che applica l'insieme inverso di modifiche.

Ad esempio, se il commit `abc1234` ha aggiunto una funzione, `git revert abc1234` creerà un nuovo commit che rimuove quella stessa funzione. La cronologia avanza, ma lo stato della codebase torna indietro.

I principali vantaggi architetturali di questo approccio includono:
*   **Conservazione della cronologia:** il commit originale "errato" rimane nel log, insieme al successivo commit di revert. Questo crea una traccia completa e verificabile di ciò che è accaduto e del perché è stato annullato, preziosa per il debug, gli audit di sicurezza e le code review.
*   **Sicurezza per i branch condivisi:** poiché `git revert` aggiunge semplicemente un nuovo commit, la modifica risultante può essere inviata a un branch remoto senza interrompere il lavoro dei membri del team. Per loro, è solo un altro commit da eseguire pull.
*   **Comunicazione chiara:** il messaggio di commit predefinito generato da `revert` indica esplicitamente quale commit sta invertendo, rendendo l'intento trasparente all'intero team.

### Git Reset: il riscrittore della cronologia locale

`git reset` è uno strumento fondamentalmente diverso. È un **comando distruttivo** che modifica la cronologia di un branch riposizionando il puntatore HEAD su un commit precedente. A seconda della modalità usata (`--soft`, `--mixed`, `--hard`), può eliminare commit dalla cronologia, deselezionare modifiche dall'area di staging o cancellare lavoro dalla working directory.

*   `--soft`: sposta il puntatore del branch ma mantiene tutte le modifiche dei commit scartati nell'area di staging per un nuovo commit. Utile per fare squash di più commit locali.
*   `--mixed` (predefinito): sposta il puntatore e rimuove le modifiche dallo staging, lasciandole come modifiche nella working directory.
*   `--hard`: sposta il puntatore e **elimina in modo permanente** tutte le modifiche dei commit scartati sia dalla cronologia sia dalla working directory. Deve essere usato con estrema cautela.

> **Avviso:** non usare mai `git reset` su un branch che è stato pushato e poi pullato da altri. Un successivo force-push (`git push --force`) riscrive la cronologia pubblica, creando uno stato divergente che romperà i repository locali dei tuoi collaboratori e richiederà un processo di recupero manuale e soggetto a errori.

Il caso d'uso appropriato per `git reset` è mettere in ordine il tuo branch feature locale *prima* di creare una pull request. Una volta che i commit sono condivisi, `git revert` è lo strumento corretto.

## Come revertire un singolo commit: scenari pratici

Uno scenario comune è un singolo commit isolato che introduce un difetto. L'obiettivo è eseguire un rollback chirurgico di quella modifica specifica senza influire sui commit successivi nella cronologia del progetto.

Questo è esattamente il problema che `git revert` è progettato per risolvere. Offre un modo sicuro e non distruttivo per annullare una modifica che è già stata condivisa. A differenza di `git reset`, aggiunge alla cronologia invece di riscriverla, creando un *nuovo* commit che è il preciso inverso di quello problematico.

![Diagramma che mostra due metodi per revertire un commit Git: comando `git revert` e interfaccia web.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/dc5b4e53-c08c-474c-9f90-a0f52262f0d5/github-revert-to-previous-commit-git-revert.jpg)

Gli scenari seguenti ne dimostrano l'uso tramite la riga di comando e l'interfaccia web di [GitHub](https://github.com/).

### Scenario A: revert tramite riga di comando

**Problema:** uno sviluppatore pusha un commit che espone accidentalmente un endpoint API interno in un servizio rivolto al pubblico. La modifica deve essere invertita immediatamente per mitigare il rischio di sicurezza prima che si propaghi attraverso la pipeline CI/CD.

**Soluzione:**
1.  **Identifica l'hash del commit:** usa `git log` per trovare l'hash univoco del commit difettoso. Il flag `--oneline` fornisce una vista concisa.

    ```bash
    git log --oneline
    ```

    Dall'output, copia l'hash del commit di destinazione (ad esempio, `8a2b4e7`).

2.  **Esegui il revert:** esegui il comando `git revert` con l'hash del commit.

    ```bash
    git revert 8a2b4e7
    ```

    Git crea un nuovo commit che inverte le modifiche di `8a2b4e7` e apre il tuo editor di testo predefinito per confermare il messaggio di commit.

3.  **Aggiungi contesto al messaggio di commit:** il messaggio predefinito è tipicamente "Revert '[messaggio del commit originale]'". Questo non è sufficiente. La best practice è aggiungere una spiegazione chiara del *perché* il revert era necessario. Ad esempio: "Revert per rimuovere l'esposizione pubblica di un endpoint API interno. Questo risolve la vulnerabilità di sicurezza [Ticket-ID]." Questo contesto è fondamentale per futuri audit e per la comprensione del team.

4.  **Esegui il push del commit di revert:** esegui il push del commit di revert appena creato al repository remoto per condividere la correzione.

    ```bash
    git push origin main
    ```

Il codice pericoloso è ora rimosso dalla HEAD del branch e la cronologia fornisce un registro trasparente dell'incidente e della sua risoluzione.

### Scenario B: revert tramite l'interfaccia web di GitHub

**Problema:** una pull request viene unita, ma introduce un bug UI non critico: un pulsante è disallineato nelle viewport mobile. Il problema deve essere risolto, ma la modifica può passare attraverso il normale processo di revisione.

**Soluzione:**
Per revert semplici, l'interfaccia GitHub offre un workflow efficiente e controllato.

1.  **Individua il commit:** nel repository su GitHub, vai alla scheda "Commits" per visualizzare la cronologia del progetto.
2.  **Avvia il revert:** trova il commit che ha introdotto il bug. All'estrema destra dei dettagli del commit, GitHub fornisce un pulsante "Revert".
3.  **Apri una pull request:** fare clic su "Revert" non esegue il commit direttamente sul branch di destinazione. Invece, GitHub crea un **nuovo branch** contenente il commit di revert e apre automaticamente una pull request.

Questa è una funzione di sicurezza fondamentale. Impone che anche un revert debba passare attraverso il normale processo di revisione del team, inclusi i controlli CI automatizzati, l'analisi statica e l'approvazione dei pari. Il team può quindi esaminare, approvare e unire la PR di revert, garantendo che il controllo qualità venga mantenuto anche durante un rollback. Questo processo allinea l'azione `github revert to previous commit` con la governance ingegneristica consolidata.

## Revert di modifiche complesse: commit di merge e codice già pushato
Revertire un singolo commit è relativamente semplice. Tuttavia, gli scenari reali spesso coinvolgono cronologie più complesse, come il revert di un’intera pull request (un merge commit) o la correzione di un errore già inviato e distribuito. Queste situazioni richiedono un approccio più sfumato per evitare di introdurre ulteriori complicazioni.

![Diagramma che illustra il branching di Git, il merge e il revert di un merge commit senza force push.](https://cdnimg.co/66a41ce6-7698-4d58-8459-ed7623e4e974/55fa241d-5965-41e9-9353-201734900889/github-revert-to-previous-commit-git-revert.jpg)

Quando una pull request viene unita, Git in genere crea un merge commit con due parent: uno che punta allo stato del branch di destinazione (ad esempio, `main`) e l’altro alla testa del branch della feature. Un semplice `git revert <merge-commit-hash>` fallirà perché Git non sa quale discendenza del parent seguire.

### Revertire un Merge Commit

Per revertire correttamente un merge, devi specificare quale commit parent rappresenta la “mainline” che desideri preservare. Questo si fa con l’opzione `-m` o `--mainline`.

*   `git revert <merge-commit-hash> -m 1`: Questo è il comando standard per revertire una pull request. Dice a Git di revertire le modifiche introdotte dal secondo parent (il branch della feature) mantenendo la cronologia del primo parent (il branch di destinazione).
*   `git revert <merge-commit-hash> -m 2`: Questa è un’operazione rara e potenzialmente distruttiva. Annullerebbe tutte le modifiche del branch di destinazione da quando la feature è stata creata, cosa che quasi mai è il risultato desiderato.

Pertanto, se una PR unita rompe il branch `main`, la procedura corretta è trovare l’hash del merge commit ed eseguire `git revert <hash> -m 1`. Questo rimuove in sicurezza le modifiche della feature difettosa, ripristinando il branch `main` allo stato precedente al merge senza riscrivere la cronologia. Gestire correttamente i revert dei merge è essenziale per mantenere la stabilità, un principio fondamentale che integriamo nella nostra [architettura della pipeline CI/CD](https://devisia.pro/en/blog/pipeline-ci-cd) per proteggere l’integrità delle build.

### Il Rischio di Riscrivere la Cronologia Già Inviata

Questo ci porta alla regola più critica dell’ingegneria software collaborativa: **non riscrivere la cronologia di un branch condiviso.** Di conseguenza, l’uso di `git push --force` su branch condivisi come `main` o `develop` dovrebbe essere disabilitato tramite regole del repository. Un force push sovrascrive la cronologia remota, può cancellare silenziosamente i commit di altri sviluppatori e desincronizzare il repository locale di ogni membro del team, causando un notevole lavoro di recupero e confusione.

Immagina un team di sviluppo che sta distribuendo una nuova dashboard per un cliente. Uno sviluppatore invia un commit difettoso che corrompe le visualizzazioni dei dati in tempo reale. Nel panico, potrebbe essere tentato di usare `git reset` e `git push --force`. È la ricetta per il disastro. Secondo un’analisi, l’**11%** degli incidenti di supporto IT in alcune organizzazioni riguarda il recupero da force push che hanno sovrascritto la cronologia. Il rischio è amplificato in progetti complessi come le integrazioni enterprise di AI, dove il ritmo dei commit è elevato. Per ulteriori dettagli, consulta la ricerca sui [pattern di commit e l’attività degli sviluppatori su GitClear](https://www.gitclear.com/research_studies/git_commit_count_percentiles_annual_days_active_from_largest_data_set).

> Lo standard professionale per correggere un errore già inviato è il workflow “revert-and-push”. Crea localmente un nuovo commit di revert, quindi invia quel commit al remote. Questo preserva una registrazione completa e veritiera della cronologia del progetto.

Questo approccio tratta la cronologia della codebase come un registro immutabile, proteggendo la produttività del team e la stabilità del progetto. Sebbene i client Git visuali possano semplificare queste operazioni, una solida comprensione dei comandi sottostanti garantisce di poter gestire qualsiasi scenario di controllo versione con precisione.

## Best Practice per Revertire Commit in un Ambiente di Team

L’uso efficace di `git revert` non riguarda solo l’esecuzione tecnica; si tratta di integrare un processo affidabile nella cultura ingegneristica del tuo team. Per le organizzazioni che realizzano software business-critical, un protocollo coerente per il rollback delle modifiche è fondamentale per mantenere l’integrità della codebase e la fiducia degli sviluppatori.

Questo richiede di andare oltre correzioni ad hoc e reattive e di stabilire un workflow chiaro e ripetibile per tutti i rollback.

Il primo passo è sempre la comunicazione. Prima di eseguire `git revert` su un branch condiviso come `main` o `develop`, informa il team. Un’inversione improvvisa del codice, anche con buone intenzioni, può causare confusione o conflitti con lavori in corso. Un breve messaggio nel canale di comunicazione del team che spieghi *cosa* viene revertito e *perché* evita interruzioni.

### Stabilisci un Protocollo Formale di Revert

Una volta che il team è al corrente, il processo di revert dovrebbe seguire il tuo workflow di sviluppo standard. Un revert è una modifica al codice e dovrebbe essere soggetto agli stessi controlli di qualità di qualsiasi nuova funzionalità.

*   **Crea Pull Request per i Revert:** Evita di inviare i commit di revert direttamente a un branch protetto. Crea invece un nuovo branch, esegui `git revert`, invia quel branch e apri una pull request. Questo garantisce che la modifica passi attraverso la tua pipeline CI/CD e riceva una revisione tra pari adeguata.
*   **Scrivi Messaggi di Commit Descrittivi:** Il messaggio predefinito “Revert...” è solo un punto di partenza. Arricchiscilo con contesto critico. Spiega *perché* il revert era necessario. Era un bug critico, una falla di sicurezza o una funzionalità non allineata? Questa documentazione è preziosa per gli sviluppatori e gli auditor futuri.
*   **Usa `git reflog` come rete di sicurezza locale:** Sebbene `git revert` sia sicuro per la cronologia condivisa, gli errori locali accadono. `git reflog` agisce come un registro locale, tracciando ogni modifica ai puntatori del branch. Se esegui accidentalmente `git reset --hard` e perdi del lavoro locale, `reflog` è lo strumento che ti consente di recuperare quei commit persi.

### Mantenere la Robustezza su Scala

L’adesione a queste pratiche favorisce una cultura di governance e processo. Questo diventa ancora più critico per le organizzazioni che integrano AI, dove la velocità e la complessità delle modifiche al codice aumentano notevolmente. Per le aziende con cui collaboriamo per costruire sistemi AI governati, le statistiche Git rivelano che i revert sono un segno di controllo qualità, non di fallimento.

Uno studio GitClear del 2024 ha rilevato che gli sviluppatori con le migliori performance (99º percentile) eseguono oltre **10.000** commit all’anno e che il **35%** di quel lavoro comporta revert per mantenere la robustezza del sistema. Come [evidenzia un issue di GitHub](https://github.com/anuraghazra/github-readme-stats/issues/4098), anche gli strumenti di tracciamento dei commit possono avere bug, rendendo essenziale una cronologia pulita e intenzionale per metriche di progetto accurate.

> Un processo di revert strutturato è un segno distintivo di un’organizzazione ingegneristica matura. Segnala un impegno verso trasparenza, qualità e collaborazione—principi molto più incisivi della semplice velocità dei commit.

Standardizzando il modo in cui il tuo team gestisce un `github revert to previous commit`, rafforzi il principio che la qualità del codice è una responsabilità condivisa. Questo approccio è fondamentale per costruire software affidabile ed è una componente chiave del nostro [codice di condotta](https://devisia.pro/blog/codice-di-condotta) interno.

## Domande Frequenti sul Revert dei Commit

Navigare nella cronologia Git di un progetto richiede precisione, soprattutto in un contesto di team. Ecco risposte concise alle domande più comuni che sorgono quando gli sviluppatori devono `github revert to previous commit`.

### Cosa Succede Se Reverti un Commit di Revert?

Revertire un commit di revert riapplica effettivamente le modifiche originali. Un’operazione `git revert` crea un nuovo commit che è l’inverso del commit di destinazione. Revertire questo “revert commit” crea semplicemente un altro inverso, che ripristina il codice allo stato precedente al primo revert.

Questo fornisce un metodo pulito e completamente tracciabile per reintrodurre una funzionalità o una correzione che era stata precedentemente rimossa. La cronologia del progetto mostrerà in modo trasparente il commit originale, il revert e la successiva riapplicazione delle modifiche.

### Posso Revertire un Commit che Non è il Più Recente?

Sì. `git revert` può colpire qualsiasi commit nella cronologia del progetto tramite il suo hash univoco. Git è progettato per calcolare le modifiche introdotte in quello specifico commit e applicare una patch inversa alla HEAD attuale del tuo branch.

Questa è un’operazione chirurgica. Non influisce su alcun commit effettuato dopo quello che stai revertendo. Reverte solo le modifiche specifiche del commit di destinazione, lasciando intatto tutto il resto del lavoro.

### È Meglio Revertire o Creare una Nuova PR con una Correzione?

La decisione dipende dall’urgenza e dall’impatto del problema.

*   **Revertire Immediatamente:** Se un commit unito di recente causa un guasto critico—come rompere la build principale, causare un’interruzione del servizio o introdurre una grave vulnerabilità di sicurezza—revertire il merge commit è quasi sempre il percorso più rapido e sicuro per ripristinare la stabilità.

*   **Creare una PR di Correzione:** Per bug non critici, regressioni minori o problemi cosmetici, creare una nuova pull request con una correzione mirata è spesso un approccio più pulito. Questo consente al team di esaminare la soluzione specifica senza il rumore contestuale di un revert completo.

> **Come regola, la comunicazione è fondamentale.** Discuti la situazione con il tuo team per determinare la migliore linea d’azione. La priorità immediata dovrebbe sempre essere riportare il branch condiviso a uno stato stabile e funzionante.

### Qual è la Differenza tra Git Revert e Git Reset Hard?

Comprendere questa distinzione è fondamentale per qualsiasi sviluppatore che lavori in un ambiente collaborativo.

*   `git revert` è un’operazione **sicura e non distruttiva**. Crea un commit *nuovo* per annullare le modifiche, preservando la cronologia del progetto per tutti i collaboratori. È lo standard per correggere errori su branch condivisi.

*   `git reset --hard` è un’**operazione distruttiva**. Scarta i commit dalla cronologia e sposta il puntatore del branch, riscrivendo di fatto il passato. Non dovresti **mai** usare `git reset --hard` su un branch condiviso che altri hanno già scaricato. Farlo crea cronologie divergenti e può causare problemi significativi e difficili da risolvere per i tuoi compagni di team.

---
At **Devisia**, costruiamo prodotti digitali affidabili con un focus sulla manutenibilità e su scelte architetturali chiare. Se hai bisogno di un partner per trasformare la tua visione di business in software robusto e scalabile, scopri come possiamo aiutarti. [Scopri di più sui nostri servizi di sviluppo software personalizzato](https://www.devisia.pro).
