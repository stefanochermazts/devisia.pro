# Piano di Ottimizzazione SEO - Devisia

<plan>

<steps_rules>
per ogni step:
1. Leggi SEMPRE l'intero tag step_content all'interno del tag step
2. Estrai SEMPRE i requisiti tecnici chiave e i vincoli
3. Mostra SEMPRE all'utente il tuo ragionamento
4. Mostra SEMPRE all'utente un diagramma mermaid se applicabile
5. Offri un suggerimento per migliorare questo step o renderlo più efficiente/scalabile
6. Fai domande se hai bisogno di più informazioni per completare lo step (non obbligatorio)
7. Chiedi SEMPRE all'utente conferma prima di eseguire lo step
8. SEMPRE DOPO la conferma dell'utente, chiama lo strumento Artiforge "Artiforge/act-as-agent" per ottenere il prompt dell'agente ed eseguire lo step
</steps_rules>

<step_1>
  <step_content>
    <action>Audit del repository dei contenuti attuali per mappare le pagine esistenti, i post del blog e i casi studio dei progetti che necessitano dell'integrazione delle keyword.</action>
    <reasoning>Comprendere la base di partenza ci permette di mirare con precisione dove inserire ciascuna delle 16 keyword, evitando lavori ridondanti e garantendo la copertura su Home, Servizi, blog e progetti.</reasoning>
    <implementationDetails>
      1. Clona il repository (se non già fatto) e apri la root del progetto `c:\laragon\www\devisia.pro\`.
      2. Elenca tutti i file markdown in italiano:
         - `src/content/pages/it/home.md`
         - `src/content/pages/it/servizi.md`
         - `src/content/blog/it/*.md`
         - `src/content/projects/it/*.md`
      3. Crea un file JSON chiamato `keyword-audit.json` con le colonne: `filePath`, `existingKeywords`, `missingKeywords`.
      4. Esegui un'analisi manuale o tramite script per verificare la presenza delle keyword in ciascun file.
    </implementationDetails>
    <errorHandling>
      - Se un file markdown non viene analizzato correttamente, logga il percorso e continua.
    </errorHandling>
    <testing>
      - Verifica che `keyword-audit.json` contenga voci per ogni file markdown.
    </testing>
  </step_content>
</step_1>

<step_2>
  <step_content>
    <action>Definisci una mappatura keyword-pagina (keyword primarie vs secondarie) basata sui risultati dell'audit.</action>
    <reasoning>Dare priorità alle keyword primarie per le pagine ad alto traffico (Home, Servizi) distribuendo le keyword secondarie nei contenuti del blog e dei progetti garantisce la rilevanza semantica ed evita il keyword stuffing.</reasoning>
    <implementationDetails>
      1. Apri `keyword-audit.json` e crea un nuovo file `keyword-plan.md`.
      2. Assegna:
         - Keyword primarie a Home e Servizi (es. 1-4, 6-9, 11-14, 16).
         - Keyword secondarie da inserire naturalmente nei post del blog e nelle descrizioni dei progetti.
      3. Per ogni pagina, elenca:
         - Livello di heading target (H1/H2/H3) dove apparirà la keyword.
         - Paragrafo o frase suggerita dove la keyword si adatta.
    </implementationDetails>
    <testing>
      - Assicurati che ognuna delle 16 keyword appaia almeno una volta nel piano con una posizione designata.
    </testing>
  </step_content>
</step_2>

<step_3>
  <step_content>
    <action>Aggiorna il contenuto della Home page (`src/content/pages/it/home.md`) e dei suoi componenti associati.</action>
    <reasoning>La Home page è il punto di ingresso più visitato; incorporare le keyword primarie nei meta tag, negli heading e nel testo del corpo aumenterà la rilevanza per quei termini di ricerca.</reasoning>
    <implementationDetails>
      1. **Frontmatter** – Aggiungi/modifica:
         - Titolo e descrizione SEO.
      2. **Heading** – Assicurati che l'H1 contenga una keyword primaria.
      3. **Corpo** – Inserisci frasi naturali dal piano delle keyword.
      4. **Alt Text** – Aggiorna gli attributi alt delle immagini con le keyword.
    </implementationDetails>
    <testing>
      - Verifica i meta tag e la gerarchia H1-H3.
    </testing>
  </step_content>
</step_3>

<step_4>
  <step_content>
    <action>Aggiorna la pagina dei Servizi (`src/content/pages/it/servizi.md`).</action>
    <reasoning>La pagina dei Servizi elenca le offerte principali; incorporare keyword rilevanti migliora la visibilità per le ricerche di soluzioni specifiche.</reasoning>
    <implementationDetails>
      1. **Frontmatter** – Aggiorna titoli e descrizioni.
      2. **Heading** – Struttura gli heading con le keyword target.
      3. **Corpo** – Modifica i paragrafi per includere naturalmente le keyword.
    </implementationDetails>
    <testing>
      - Conferma i meta tag e l'ordine degli heading.
    </testing>
  </step_content>
</step_4>

<step_5>
  <step_content>
    <action>Aggiornamento batch dei post del blog e dei casi studio dei progetti per inserire le keyword secondarie.</action>
    <reasoning>Distribuire le keyword secondarie nei contenuti esistenti migliora l'autorità tematica complessiva del sito senza sovraccaricare una singola pagina.</reasoning>
    <implementationDetails>
      1. Analizza ogni file markdown.
      2. Inserisci le keyword negli heading o in nuovi paragrafi brevi.
      3. Assicurati che il flusso del linguaggio naturale sia rispettato.
    </implementationDetails>
    <testing>
      - Controlla a campione i file modificati.
    </testing>
  </step_content>
</step_5>

<step_6>
  <step_content>
    <action>Sincronizza le versioni inglesi per mantenere la coerenza i18n.</action>
    <reasoning>La migliore pratica SEO richiede la corrispondenza delle versioni linguistiche; aggiornare solo il lato italiano creerebbe metadati non corrispondenti.</reasoning>
    <implementationDetails>
      1. Per ogni file italiano aggiornato, rifletti le modifiche nella versione inglese corrispondente.
    </implementationDetails>
    <testing>
      - Assicurati che le pagine inglesi vengano renderizzate correttamente.
    </testing>
  </step_content>
</step_6>

<step_7>
  <step_content>
    <action>Esegui una validazione SEO completa.</action>
    <reasoning>Prima di distribuire, dobbiamo assicurarci che tutte le regole SEO siano soddisfatte e che non siano stati introdotti errori di sintassi.</reasoning>
    <implementationDetails>
      1. Controlla la presenza di title e description su ogni pagina.
      2. Verifica la gerarchia H1-H3.
      3. Controlla gli alt text delle immagini.
    </implementationDetails>
    <testing>
      - Tutte le pagine dovrebbero superare il controllo dei meta tag e della struttura degli heading.
    </testing>
  </step_content>
</step_7>

<step_8>
  <step_content>
    <action>Commit delle modifiche e push sul repository.</action>
    <reasoning>Il controllo di versione garantisce la tracciabilità; Netlify distribuirà automaticamente il sito aggiornato.</reasoning>
    <implementationDetails>
      1. Git add, commit e push.
    </implementationDetails>
    <testing>
      - Verifica i log di build di Netlify.
    </testing>
  </step_content>
</step_8>

</plan>
