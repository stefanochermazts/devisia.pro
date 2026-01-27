const MAILTRAP_SEND_URL = 'https://send.api.mailtrap.io/api/send';

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export async function sendViaMailtrapApi(params: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
  timeoutMs?: number;
}) {
  const token = getEnv('SMTP_PASS'); // Using SMTP_PASS as Mailtrap API token (per your setup)
  const fromEmail = getEnv('FROM_EMAIL');
  const fromName = 'Devisia';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs ?? 8000);

  try {
    const res = await fetch(MAILTRAP_SEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: fromEmail, name: fromName },
        to: [{ email: params.to, name: params.toName }],
        subject: params.subject,
        text: params.text,
        html: params.html,
      }),
      signal: controller.signal,
    });

    const responseText = await res.text().catch(() => '');
    if (!res.ok) {
      throw new Error(`Mailtrap API error (${res.status}): ${responseText || res.statusText}`);
    }

    return { ok: true as const, status: res.status, body: responseText };
  } finally {
    clearTimeout(timeout);
  }
}

