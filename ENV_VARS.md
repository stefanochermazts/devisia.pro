# Environment Variables

This document describes the environment variables required for contact/lead form email functionality and related server-side features.

## Lead submissions

Contact forms and LinkedIn landing forms POST to `/api/submit-lead` (Astro API route on the Netlify SSR function). A compatibility Netlify Function remains at `/.netlify/functions/submit-lead`.

- Submissions are stored in the Netlify Database table `lead_submissions` (see `netlify/database/migrations/`).
- Confirmation and manager notification emails reuse the Mailtrap variables below.
- The chat consent table (`chat_consent_events`) is separate and must not be used for leads.
- No database credentials are exposed to the browser; `@netlify/database` runs only server-side.

## Required Variables

### SMTP Configuration (Mailtrap)
These values are obtained from your Mailtrap account: https://mailtrap.io/

- `SMTP_HOST`: SMTP server hostname (e.g., `sandbox.smtp.mailtrap.io`)
- `SMTP_PORT`: SMTP server port (typically `2525` for Mailtrap sandbox, `465` for SSL, `587` for TLS)
- `SMTP_USER`: SMTP username from Mailtrap
- `SMTP_PASS`: SMTP password from Mailtrap

**Note:** This project currently uses **Mailtrap Email API (Bearer token)** for sending emails from Netlify Functions.
For backward compatibility, the Bearer token is read from `SMTP_PASS`.

### Site Configuration
- `SITE_MANAGER_EMAIL`: Email address that receives contact form notifications (e.g., `stefano.chermaz@gmail.com`)
- `FROM_EMAIL`: Email address used as sender in the "From" field (e.g., `info@devisia.pro`)
- `DEVISIA_INBOX`: Inbox that receives AI artifacts submitted from `/ai-structure` (e.g., `info@devisia.pro`)
- `REPLY_TO_EMAIL`: (Optional) Reply-to address for user-facing emails (default in code: `info@devisia.it`)

### Optional (Recommended) Security
- `SMTP_CHECK_TOKEN`: If set, the SMTP healthcheck endpoint requires `?token=...` to avoid exposing a public SMTP connectivity probe.

### Outrank / Artiforge Integration
These values are required for the automated blog post publication via webhook:

- `GITHUB_TOKEN`: A Personal Access Token with `repo` permissions to commit files to the repository.
- `OUTRANK_SECRET`: A secret token that Outrank will send in the `Authorization: Bearer <token>` header to authenticate the request.
- `GITHUB_REPO_OWNER`: (Optional) The owner of the repository (default: `stefanochermazts`).
- `GITHUB_REPO_NAME`: (Optional) The name of the repository (default: `devisia.pro`).
- `OPENAI_API_KEY`: (Optional) If set, the webhook will automatically translate English articles to Italian using GPT-4o-mini.

## Local Development

Create a `.env` file in the project root with these variables:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SITE_MANAGER_EMAIL=stefano.chermaz@gmail.com
FROM_EMAIL=info@devisia.pro
DEVISIA_INBOX=info@devisia.pro
REPLY_TO_EMAIL=info@devisia.it
SMTP_CHECK_TOKEN=choose_a_long_random_token
```

**Note:** The `.env` file is already in `.gitignore` and will not be committed to the repository.

## Netlify Configuration

In production, these variables must be configured in the Netlify dashboard:

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Add each variable under **Environment variables**
3. Set them for the appropriate deploy contexts (Production, Deploy Preview, Branch Deploy)

## Testing

For local testing, you can use Mailtrap's sandbox environment which captures all emails without actually sending them. This is perfect for development and testing.

### Lead form / landing checklist

```powershell
cd C:\laragon\www\devisia.pro
npm run test:run
npm run build
netlify dev
```

Then open:

- `http://localhost:8888/landing/sistemi-spiegabili`
- `http://localhost:8888/landing/governance-ai`
- `http://localhost:8888/landing/processi-prima-automazione`
- `http://localhost:8888/landing/evidenze-audit`

Submit a form with UTM query params (example: `?utm_source=linkedin&utm_campaign=test`) and verify:

1. inline success message appears
2. a row is created in `lead_submissions`
3. confirmation email arrives in Mailtrap
4. manager notification arrives when `SITE_MANAGER_EMAIL` is set
5. a second identical `submission_id` does not create a second row
