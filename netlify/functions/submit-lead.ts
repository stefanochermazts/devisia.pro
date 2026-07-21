import type { Handler, HandlerEvent } from '@netlify/functions';
import { sendViaMailtrapApi } from './lib/mailtrap';
import {
  renderContactConfirmationEmail,
  renderLandingConfirmationEmail,
  renderManagerNotificationEmail,
} from './lib/leadEmailRender';
import { insertLeadSubmission, updateConfirmationEmailStatus } from './lib/leadRepository';
import { rateLimit } from './lib/rateLimit';
import { parseLeadBody, validateLeadPayload, type ParsedLeadPayload } from './lib/leadValidation';

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

const clientKey = (event: HandlerEvent): string => {
  const headers = event.headers || {};
  const direct =
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'];
  return direct || 'unknown';
};

const isJsonContentType = (contentType: string | undefined): boolean =>
  Boolean(contentType && contentType.toLowerCase().includes('application/json'));

const isFormContentType = (contentType: string | undefined): boolean =>
  Boolean(
    contentType &&
      (contentType.toLowerCase().includes('application/x-www-form-urlencoded') ||
        contentType.toLowerCase().includes('multipart/form-data'))
  );

const userErrorMessage = (lang: 'it' | 'en'): string =>
  lang === 'en'
    ? 'We could not save your request. Please try again in a moment.'
    : 'Non siamo riusciti a salvare la richiesta. Riprova tra poco.';

const successMessage = (lang: 'it' | 'en'): string =>
  lang === 'en'
    ? 'Request received. We will contact you using the details you provided.'
    : 'Richiesta ricevuta. Ti contatteremo utilizzando i riferimenti indicati.';

async function sendConfirmationEmail(data: ParsedLeadPayload): Promise<'sent' | 'failed'> {
  const replyToEmail = process.env.REPLY_TO_EMAIL || 'info@devisia.it';
  const landingEmail = renderLandingConfirmationEmail({
    source: data.sourceConfig.source,
    fullName: data.fullName,
  });

  const confirmation =
    landingEmail ??
    renderContactConfirmationEmail({
      lang: data.lang,
      fullName: data.fullName,
      subject: data.subject,
    });

  try {
    await sendViaMailtrapApi({
      to: data.email,
      toName: data.fullName,
      replyToEmail,
      replyToName: 'Devisia',
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      timeoutMs: 8000,
    });
    return 'sent';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'email_send_failed';
    console.error('confirmation email failed', {
      submissionId: data.submissionId,
      code: 'email_send_failed',
      detail: message.slice(0, 120),
    });
    return 'failed';
  }
}

async function sendManagerNotification(data: ParsedLeadPayload): Promise<void> {
  const siteManagerEmail = process.env.SITE_MANAGER_EMAIL;
  if (!siteManagerEmail) {
    console.error('manager notification skipped', { code: 'missing_site_manager_email' });
    return;
  }

  const notification = renderManagerNotificationEmail({
    fullName: data.fullName,
    email: data.email,
    source: data.sourceConfig.source,
    lang: data.lang,
    company: data.company,
    role: data.role,
    subject: data.subject,
    message: data.message,
    pagePath: data.pagePath,
  });

  try {
    await sendViaMailtrapApi({
      to: siteManagerEmail,
      replyToEmail: data.email,
      replyToName: data.fullName,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
      timeoutMs: 8000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'manager_email_failed';
    console.error('manager notification failed', {
      submissionId: data.submissionId,
      code: 'manager_email_failed',
      detail: message.slice(0, 120),
    });
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'];
  if (!isJsonContentType(contentType) && !isFormContentType(contentType)) {
    return json(415, { ok: false, error: 'Unsupported content type' });
  }

  const limited = rateLimit({
    key: `submit-lead:${clientKey(event)}`,
    limit: 12,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return json(429, { ok: false, error: 'Too many requests' });
  }

  let rawBody: unknown = event.body || '';
  if (isJsonContentType(contentType)) {
    try {
      rawBody = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { ok: false, error: 'Invalid JSON body' });
    }
  }

  const body = parseLeadBody(rawBody);
  const validation = validateLeadPayload(body);

  if (!validation.ok) {
    if (validation.spam) {
      return json(200, { ok: true, message: 'Thanks!' });
    }
    return json(validation.status, {
      ok: false,
      error: validation.error,
      fieldErrors: validation.fieldErrors ?? {},
    });
  }

  const data = validation.data;
  const insert = await insertLeadSubmission(data);

  if (insert.kind === 'error') {
    return json(503, {
      ok: false,
      error: userErrorMessage(data.lang),
      fieldErrors: { form: userErrorMessage(data.lang) },
    });
  }

  if (insert.kind === 'duplicate') {
    return json(200, {
      ok: true,
      duplicate: true,
      message: successMessage(data.lang),
      submissionId: data.submissionId,
    });
  }

  await sendManagerNotification(data);
  const emailStatus = await sendConfirmationEmail(data);
  await updateConfirmationEmailStatus({
    submissionId: data.submissionId,
    status: emailStatus,
    errorCode: emailStatus === 'failed' ? 'email_send_failed' : null,
  });

  return json(200, {
    ok: true,
    message: successMessage(data.lang),
    submissionId: data.submissionId,
  });
};
