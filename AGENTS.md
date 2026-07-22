# AGENTS.md

## Cursor Cloud specific instructions

This is a single product: the **Devisia** corporate marketing site — an Astro SSR app
(`output: 'server'`, `@astrojs/netlify` adapter) deployed to Netlify, with a bilingual
(IT/EN) marketing site + blog, contact/lead forms, and a Toolhouse-powered AI chat widget.
Package manager is **npm**. Standard commands live in `package.json` and `README.md`.

### Services / how to run

- Dev server: `npm run dev` → http://localhost:4321 (Astro + local Netlify feature emulation).
  Serves all marketing pages and the blog with no external services.
- Lint / test / build: `npm run lint`, `npm run test:run` (Vitest), `npm run build`.
- Production preview: `npm run build` then `npm run preview` (serves `dist/` on :4322).
- `/admin` (Decap CMS) needs Netlify Identity + Git Gateway and only works in production;
  it does not function under plain `npm run dev`.

### Non-obvious gotchas

- Node: `package.json` `engines` requires `>=22.12.0` and Netlify uses Node 22. The pinned
  `.nvmrc` (24.11.1) and the README ("Node 20") are inconsistent; the system Node 22.x
  satisfies `engines` and is what this environment runs on.
- `npm ci` fails — `package-lock.json` was out of sync (missing the `@electric-sql/pglite`
  transitive dep of `@netlify/database`). Use `npm install` (the update script does this).
- Local database: the Netlify adapter emulates an **embedded Postgres** during `npm run dev`.
  Its connection string is written to `.netlify/state.json` (`dbConnectionString`, random port).
  This DB is **ephemeral** — recreated on every `npm run dev` startup, so schema must be
  re-applied each session.
- DB tables are **not** auto-created. The lead form (`/api/submit-lead`) and chat consent
  (`/api/chat-consent`) need tables from `netlify/database/migrations/*.sql`. Without them the
  lead insert returns HTTP 503. Apply them to the running dev DB, e.g.:
  ```bash
  node -e "import('./node_modules/pg/lib/index.js').then(async m=>{const fs=require('fs'),p=require('path');const s=JSON.parse(fs.readFileSync('.netlify/state.json','utf8'));const c=new m.default.Client({connectionString:s.dbConnectionString});await c.connect();for(const f of fs.readdirSync('netlify/database/migrations').filter(x=>x.endsWith('.sql')).sort()){try{await c.query(fs.readFileSync('netlify/database/migrations/'+f,'utf8'));console.log('ok',f)}catch(e){console.log('skip',f,e.message.split('\n')[0])}}await c.end()})"
  ```
  Note: the `ensure_lead_submissions` migration's `CREATE EXTENSION pgcrypto` fails in the
  embedded PG (extension unavailable), but that is harmless — `gen_random_uuid()` is built
  into core Postgres and the tables are created by the earlier migrations.
- Email (Mailtrap) and the AI chat (Toolhouse) need secrets — see `.env.example` / `ENV_VARS.md`.
  Without them the lead insert still succeeds and `confirmation_email_status` is marked
  `failed` gracefully; only the chat widget is fully blocked.
- Lead anti-spam: submissions faster than 3s after page load are rejected (`form_loaded_at`),
  and a `bot-field` honeypot is checked. Fill forms at human speed when testing.
- Tests: 5 pre-existing failures are unrelated to environment setup — `src/lib/scriptLoader.test.ts`
  needs a jsdom environment that `vitest.config.ts` does not configure, and `src/lib/i18n.test.ts`
  has a locale-key assertion mismatch. The other 28 tests pass.
