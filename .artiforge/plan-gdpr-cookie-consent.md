# Plan: GDPR Cookie Consent + Cookie Blocker (Astro + Netlify)

## Goal
Implementare cookie banner + gestione consenso GDPR con blocco preventivo di cookie/script non essenziali fino a consenso. Supporto i18n IT/EN e link persistente per riaprire le preferenze.

## Stack
- Astro 5.16.6 (SSR) + TypeScript
- Netlify adapter (@astrojs/netlify)
- Design System tokens `--ds-*`
- Vanilla JS per interattività lato client (Astro island)

## Step 1 — Cookie utility
**Action**: creare un modulo TypeScript leggero per gestire cookie (get/set/delete) con `SameSite=Lax`, `Secure` su HTTPS e supporto serializzazione JSON.

**File**: `src/lib/cookie.ts`

## Step 2 — Consent store + event
**Action**: definire types e store in memoria per consenso, helper load/save cookie e dispatch event `gdpr-consent-updated`.

**File**: `src/lib/consent.ts`

## Step 3 — i18n strings
**Action**: file traduzioni IT/EN e helper `t(key, locale)` + detection locale.

**Files**:
- `src/locales/it.json`
- `src/locales/en.json`
- `src/lib/i18n.ts`

## Step 4 — CookieConsent UI (Astro island)
**Action**: componente `src/components/CookieConsent.astro` con banner + modal preferenze, accessibile, e integrato con store consenso.

## Step 5 — Integrazione globale + link preferenze
**Action**: integrare `CookieConsent` nel `src/layouts/Layout.astro` e aggiungere link/footer button per riaprire preferenze via event `open-gdpr-preferences`.

## Step 6 — Script loader condizionale
**Action**: loader per script terzi (analytics/marketing) che ascolta `gdpr-consent-updated` e inietta script solo a consenso true.

**File**: `src/lib/scriptLoader.ts`

## Step 7 — Documentazione
**Action**: aggiornare `README.md` con guida al sistema, estensione categorie, traduzioni e variabili env (es. `PUBLIC_GA_ID`).

