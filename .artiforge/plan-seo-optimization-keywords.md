# Piano di Sviluppo: Ottimizzazione SEO Strategica

Questo piano descrive i passaggi per ottimizzare i contenuti del sito Devisia (IT/EN) in base alle keyword del report di tracking.

## <step_1>
  <step_content>
    <action>Gather and document the definitive list of target SEO keywords for both Italian and English. Separate them into primary keywords (to be used in H1 and meta title) and secondary keywords (to be used in H2, H3, and body text).</action>
    <reasoning>The optimization process must be deterministic. Having a clear, approved keyword list ensures consistency across all pages and prevents accidental keyword stuffing.</reasoning>
    <implementationDetails>
      • Create a file `src/content/seo/keywords.md` (or `keywords.yaml`) with the following structure:
        ```yaml
        it:
          primary:
            - "sviluppo software su misura"
            - "sviluppo SaaS"
            - "integrazione AI"
          secondary:
            - "governance AI"
            - "AI risk management"
            - "privacy checklist"
        en:
          primary:
            - "custom software development"
            - "SaaS development"
            - "AI integration"
          secondary:
            - "AI governance"
            - "AI risk management"
            - "privacy checklist"
        ```
      • Share this file with the team for review before proceeding.
      • Ensure the keywords reflect the brand tone (professional, legal‑expert) and are phrased naturally in each language.
    </implementationDetails>
    <errorHandling>
      • If a keyword is ambiguous or duplicates another, flag it for clarification.
      • Validate YAML syntax to avoid build failures.
    </errorHandling>
    <testing>
      • Open the file in VSCode or any editor and run a YAML linter (e.g., `npm i -g yaml-lint` then `yaml-lint keywords.yaml`) to confirm syntax correctness.
    </testing>
  </step_content>
</step_1>

## <step_2>
  <step_content>
    <action>Perform an audit of all existing Markdown content files (`src/content/pages/it/*.md` and `src/content/pages/en/*.md`) to capture current H1, H2, H3 headings, and front‑matter metadata (title, description).</action>
    <reasoning>This audit creates a baseline, identifies pages missing headings or metadata, and shows where keyword insertion is needed without overwriting existing SEO work.</reasoning>
    <implementationDetails>
      • Write a small Node script `scripts/seo-audit.ts` that:
        1. Recursively reads every `.md` file in the `content/pages` folders.
        2. Parses front‑matter using `gray-matter`.
        3. Extracts the first `# ` line as H1, `## ` as H2, `### ` as H3.
        4. Generates a JSON report `seo-audit-report.json` with entries:
          ```json
          {
            "path": "src/content/pages/it/home.md",
            "hasFrontMatter": true,
            "title": "Home – Devisia",
            "description": "...",
            "h1": "Soluzioni Software",
            "h2": ["Chi Siamo", "Servizi"],
            "h3": [...]
          }
          ```
      • Use TypeScript 5.x, no external dependencies besides `gray-matter` and `fs/promises`.
    </implementationDetails>
    <errorHandling>
      • If a file lacks front‑matter, log a warning and continue.
      • Catch filesystem errors and output a clear message (e.g., permission issues).
    </errorHandling>
    <testing>
      • Run `ts-node scripts/seo-audit.ts` locally.
      • Verify the generated JSON contains entries for every markdown file.
      • Spot‑check a few pages to ensure headings were captured correctly.
    </testing>
  </step_content>
</step_2>

## <step_3>
  <step_content>
    <action>Update front‑matter of each Markdown file to include SEO‑optimized `title` and `description` meta fields, embedding the primary keyword for that page.</action>
    <reasoning>Astro’s `Layout.astro` reads `title` and `description` from front‑matter to populate `<title>` and `<meta name=\"description\">`. Optimizing these fields directly boosts SERP relevance.</reasoning>
    <implementationDetails>
      • Using the keyword list from Step 1 and the audit report from Step 2, map each page to its most relevant primary keyword.
      • Edit the front‑matter manually **or** automate with a script `scripts/update-meta.ts` that:
        1. Loads `keywords.yaml`.
        2. Reads each markdown file.
        3. If `title` does not contain the primary keyword, prepend/append it while keeping the brand style (e.g., “Custom Software Development – Devisia”).
        4. Generate a concise `description` (150‑160 chars) that naturally includes the primary keyword and one secondary keyword.
        5. Write back the updated front‑matter using `gray-matter.stringify`.
      • Preserve existing markdown body content.
    </implementationDetails>
    <errorHandling>
      • Ensure the script does not duplicate existing keywords.
      • Validate that the resulting `title` length < 70 characters and `description` length < 160 characters.
      • Abort with a clear message if a page cannot be matched to a primary keyword (requires manual decision).
    </errorHandling>
    <testing>
      • After running the script, open several modified files to verify correct insertion.
      • Run `npm run build` (Astro) to ensure no compile errors.
      • Use a tool like `view-source:` in the local dev server to confirm `<title>` and `<meta name=\"description\">` contain the expected text.
    </testing>
  </step_content>
</step_3>

## <step_4>
  <step_content>
    <action>Rewrite or adjust the H1 heading of each page to embed its primary keyword, ensuring only **one** H1 per page.</action>
    <reasoning>SEO rule #1 mandates primary keywords in H1 tags. This step directly satisfies that rule while preserving semantic HTML (Markdown `#` becomes `<h1>`).</reasoning>
    <implementationDetails>
      • For each markdown file, locate the first line starting with `# `.
      • Replace the existing text with a natural phrase that includes the primary keyword, e.g.:
        - Italian: `# Sviluppo Software su Misura per la Tua Azienda`
        - English: `# Custom Software Development for Your Business`
      • Keep the tone professional and avoid forced phrasing.
      • If a page already has an H1 that naturally contains the keyword, leave it unchanged.
    </implementationDetails>
    <errorHandling>
      • Verify that after modification there is still exactly one `# ` line at the top of the file.
      • Guard against empty H1 (e.g., accidental removal of text).
    </errorHandling>
    <testing>
      • Run a regex check across all markdown files: `grep -c '^# '` should return the same count as total pages.
      • Start the Astro dev server (`npm run dev`) and inspect the rendered `<h1>` in the browser’s Elements panel for a few pages.
    </testing>
  </step_content>
</step_4>

## <step_5>
  <step_content>
    <action>Insert secondary keywords into H2 and H3 headings where contextually appropriate.</action>
    <reasoning>SEO rule #2 requires secondary keywords in H2/H3 tags. Doing this gradually maintains readability and avoids stuffing.</reasoning>
    <implementationDetails>
      • Review each page’s H2/H3 list from the audit report.
      • For headings that discuss relevant topics (e.g., “Governance AI”), replace or augment them:
        - Italian example: `## Governance AI e Gestione del Rischio` (adds secondary keyword “governance AI”).
        - English example: `## AI Governance and Risk Management`.
      • If a heading already contains a secondary keyword, no change needed.
      • Keep headings concise (< 60 characters) and meaningful.
    </implementationDetails>
    <errorHandling>
      • Ensure modifications do not create duplicate heading texts within the same page.
      • Maintain Markdown hierarchy (H2 under H1, H3 under appropriate H2).
    </errorHandling>
    <testing>
      • After changes, run `markdownlint` to catch heading level issues.
      • Verify in the rendered site that H2/H3 appear with expected text and remain styled correctly.
    </testing>
  </step_content>
</step_5>

## <step_6>
  <step_content>
    <action>Weave secondary keywords naturally into the body copy of each page (minimum 1‑2 occurrences per page).</action>
    <reasoning>Google also evaluates keyword presence in paragraph text. Controlled insertion improves relevance without harming readability.</reasoning>
    <implementationDetails>
      • Open each markdown file in an editor.
      • Locate sentences where a related concept is discussed and insert a secondary keyword phrase naturally, e.g.:
        - Original: “Offriamo soluzioni SaaS scalabili.”
        - Updated: “Offriamo soluzioni SaaS scalabili, integrando pratiche di **governance AI** per garantire conformità e sicurezza.”
      • Use the Italian/English keyword list to select appropriate matches.
      • Limit to 1‑2 insertions per page to avoid over‑optimization.
    </implementationDetails>
    <errorHandling>
      • Run a spell‑check (e.g., `cspell`) after edits to catch accidental typos.
      • Ensure the legal‑expert tone is preserved; avoid marketing‑fluff language.
    </errorHandling>
    <testing>
      • Search the updated files for each secondary keyword to confirm presence counts.
      • Review the rendered pages for readability; optionally ask a non‑technical colleague to read for natural flow.
    </testing>
  </step_content>
</step_6>

## <step_7>
  <step_content>
    <action>Validate that Astro’s `Layout.astro` correctly injects the updated meta tags and that no duplicate `<title>` elements exist.</action>
    <reasoning>Even with correct front‑matter, a broken layout could prevent SEO data from reaching the browser, nullifying the effort.</reasoning>
    <implementationDetails>
      • Open `src/layouts/Layout.astro`.
      • Ensure it uses `<Head>` to render:
        ```astro
        <title>{Astro.props.title || frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        ```
      • Confirm no hard‑coded titles elsewhere.
    </implementationDetails>
    <errorHandling>
      • If duplicate titles are found, comment out or remove the static ones.
      • Ensure `frontmatter.title` and `frontmatter.description` are defined for every page; otherwise fallback to site‑wide defaults.
    </errorHandling>
    <testing>
      • Run `npm run dev`, navigate to each route, and use the browser’s “View Page Source” to verify the `<title>` and `<meta name=\"description\">` reflect the new values.
      • Run an SEO checker (e.g., Lighthouse) and verify no “Missing meta description” warnings.
    </testing>
  </step_content>
</step_7>

## <step_8>
  <step_content>
    <action>Perform a full site build and run SEO performance audits.</action>
    <reasoning>Final verification ensures the changes compile, render correctly, and actually improve SEO signals.</reasoning>
    <implementationDetails>
      • Execute `npm run build` to generate the static site.
      • Deploy a preview to Netlify (or use Netlify CLI `netlify dev`) to obtain a live URL.
      • Run Lighthouse (Chrome DevTools) for each page:
        - Check “SEO” score (target > 90).
        - Confirm H1 contains primary keyword.
        - Verify meta title/description lengths.
      • Optionally use a third‑party tool like Ahrefs SEO Toolbar to see keyword presence.
    </implementationDetails>
    <errorHandling>
      • If build fails, review console logs for syntax errors in markdown or TypeScript.
      • If Lighthouse flags missing H1 or meta description, revisit the respective step.
    </errorHandling>
    <testing>
      • Document Lighthouse scores in a `seo-report.md` file.
      • Capture screenshots of meta tags for each language version.
    </testing>
  </step_content>
</step_8>

## <step_9>
  <step_content>
    <action>Commit all changes with a clear commit message and push to the main branch.</action>
    <reasoning>Version control provides traceability and allows the team to review the SEO updates before production deployment.</reasoning>
    <implementationDetails>
      • Stage changes: `git add src/content/pages/ src/content/seo/ keywords.yaml scripts/seo-audit.ts scripts/update-meta.ts` (if scripts are kept).
      • Commit message example:
        ```
        feat(seo): integrate primary & secondary keywords in IT & EN pages
        - Updated front‑matter title & description
        - Revised H1, H2, H3 headings
        - Added natural keyword occurrences in body copy
        - Added SEO audit script for future reference
        ```
      • Push: `git push origin feature/seo-optimization`.
      • Open a Pull Request with the above description, tag SEO/Content lead for review.
    </implementationDetails>
    <errorHandling>
      • If CI fails (e.g., linting), resolve errors before merging.
    </errorHandling>
    <testing>
      • Verify the PR diff includes only expected files.
      • Ensure CI pipeline passes (build, lint, tests).
    </testing>
  </step_content>
</step_9>

## <step_10>
  <step_content>
    <action>Update project documentation to reflect the new SEO workflow.</action>
    <reasoning>Future contributors need guidance on maintaining SEO compliance.</reasoning>
    <implementationDetails>
      • Add a section in `README.md` or create `SEO_GUIDE.md` covering:
        1. Keyword list maintenance.
        2. How to run `npm run seo:audit`.
        3. Guidelines for editing H1/H2/H3 and meta fields.
        4. Checklist before merging (primary in H1, meta title/description, readability).
      • Link the guide from the main contribution guidelines.
    </implementationDetails>
    <errorHandling>
      • Ensure the new doc follows the same brand tone and formatting as existing docs.
    </errorHandling>
    <testing>
      • Open the doc in the repo browser to verify correct rendering of markdown.
    </testing>
  </step_content>
</step_10>
