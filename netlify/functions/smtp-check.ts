import type { Handler } from '@netlify/functions';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const MAILTRAP_SEND_URL = 'https://send.api.mailtrap.io/api/send';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  // Optional protection: if SMTP_CHECK_TOKEN is set, require ?token=...
  const requiredToken = process.env.SMTP_CHECK_TOKEN;
  if (requiredToken) {
    const token = event.queryStringParameters?.token;
    if (!token || token !== requiredToken) {
      return json(401, { ok: false, error: 'Unauthorized' });
    }
  }

  try {
    const token = getEnv('SMTP_PASS'); // using SMTP_PASS as Mailtrap API token
    const fromEmail = getEnv('FROM_EMAIL');
    const toEmail = getEnv('SITE_MANAGER_EMAIL');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(MAILTRAP_SEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: { email: fromEmail, name: 'Devisia' },
          to: [{ email: toEmail }],
          subject: 'Mailtrap API connectivity check',
          text: 'This is an automated connectivity check from Netlify.',
          html: '<p>This is an automated connectivity check from Netlify.</p>',
        }),
        signal: controller.signal,
      });

      const body = await res.text().catch(() => '');
      if (!res.ok) {
        return json(500, {
          ok: false,
          status: res.status,
          body,
        });
      }

      return json(200, { ok: true, status: res.status, body });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err: any) {
    console.error('Mailtrap API check failed:', err);
    return json(500, {
      ok: false,
      message: err?.message ?? String(err),
      code: err?.code,
      response: err?.response,
      command: err?.command,
    });
  }
};

