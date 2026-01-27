import type { Handler } from '@netlify/functions';
import { getEnv, sendViaMailtrapApi } from './lib/mailtrap';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

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
    const fromEmail = getEnv('FROM_EMAIL');
    const toEmail = getEnv('SITE_MANAGER_EMAIL');
    const subject = 'Mailtrap API connectivity check';

    const res = await sendViaMailtrapApi({
      to: toEmail,
      subject,
      text: `This is an automated connectivity check from Netlify.\n\nFrom: ${fromEmail}`,
      html: `<p>This is an automated connectivity check from Netlify.</p><p>From: ${String(fromEmail).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`,
      timeoutMs: 8000,
    });

    return json(200, res);
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

