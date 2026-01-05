# Environment Variables

This document describes the environment variables required for the contact form email functionality.

## Required Variables

### SMTP Configuration (Mailtrap)
These values are obtained from your Mailtrap account: https://mailtrap.io/

- `SMTP_HOST`: SMTP server hostname (e.g., `sandbox.smtp.mailtrap.io`)
- `SMTP_PORT`: SMTP server port (typically `2525` for Mailtrap sandbox, `465` for SSL, `587` for TLS)
- `SMTP_USER`: SMTP username from Mailtrap
- `SMTP_PASS`: SMTP password from Mailtrap

### Site Configuration
- `SITE_MANAGER_EMAIL`: Email address that receives contact form notifications (e.g., `stefano.chermaz@gmail.com`)
- `FROM_EMAIL`: Email address used as sender in the "From" field (e.g., `info@devisia.pro`)

### Optional (Recommended) Security
- `SMTP_CHECK_TOKEN`: If set, the SMTP healthcheck endpoint requires `?token=...` to avoid exposing a public SMTP connectivity probe.

## Local Development

Create a `.env` file in the project root with these variables:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SITE_MANAGER_EMAIL=stefano.chermaz@gmail.com
FROM_EMAIL=info@devisia.pro
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
