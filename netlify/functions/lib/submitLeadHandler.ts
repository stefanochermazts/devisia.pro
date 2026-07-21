import { sendViaMailtrapApi } from './mailtrap';
import {
  renderContactConfirmationEmail,
  renderLandingConfirmationEmail,
  renderManagerNotificationEmail,
} from './leadEmailRender';
import { insertLeadSubmission, updateConfirmationEmailStatus } from './leadRepository';
import { rateLimit } from './rateLimit';
import { parseLeadBody, validateLeadPayload, type ParsedLeadPayload } from './leadValidation';

export type SubmitLeadHttpResult = {
  status: number;
  body: Record<string, unknown>;
};

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

export async function handleSubmitLeadRequest(params: {
  method: string;
  contentType: string | null;
  rawBody: string;
  clientKey: string;
  parsedJson?: unknown;
}): Promise<SubmitLeadHttpResult> {
  if (params.method !== 'POST') {
    return { status: 405, body: { ok: false, error: 'Method not allowed' } };
  }

  const contentType = (params.contentType || '').toLowerCase();
  const isJson = contentType.includes('application/json');
  const isForm =
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data');

  if (!isJson && !isForm) {
    return { status: 415, body: { ok: false, error: 'Unsupported content type' } };
  }

  const limited = rateLimit({
    key: `submit-lead:${params.clientKey}`,
    limit: 12,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return { status: 429, body: { ok: false, error: 'Too many requests' } };
  }

  let rawBody: unknown = params.rawBody || '';
  if (isJson) {
    if (params.parsedJson !== undefined) {
      rawBody = params.parsedJson;
    } else {
      try {
        rawBody = JSON.parse(params.rawBody || '{}');
      } catch {
        return { status: 400, body: { ok: false, error: 'Invalid JSON body' } };
      }
    }
  }

  const body = parseLeadBody(rawBody);
  const validation = validateLeadPayload(body);

  if (!validation.ok) {
    if (validation.spam) {
      return { status: 200, body: { ok: true, message: 'Thanks!' } };
    }
    return {
      status: validation.status,
      body: {
        ok: false,
        error: validation.error,
        fieldErrors: validation.fieldErrors ?? {},
      },
    };
  }

  const data = validation.data;
  const insert = await insertLeadSubmission(data);

  if (insert.kind === 'error') {
    return {
      status: 503,
      body: {
        ok: false,
        error: userErrorMessage(data.lang),
        fieldErrors: { form: userErrorMessage(data.lang) },
      },
    };
  }

  if (insert.kind === 'duplicate') {
    return {
      status: 200,
      body: {
        ok: true,
        duplicate: true,
        message: successMessage(data.lang),
        submissionId: data.submissionId,
      },
    };
  }

  await sendManagerNotification(data);
  const emailStatus = await sendConfirmationEmail(data);
  await updateConfirmationEmailStatus({
    submissionId: data.submissionId,
    status: emailStatus,
    errorCode: emailStatus === 'failed' ? 'email_send_failed' : null,
  });

  return {
    status: 200,
    body: {
      ok: true,
      message: successMessage(data.lang),
      submissionId: data.submissionId,
    },
  };
}
