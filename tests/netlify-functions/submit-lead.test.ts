import type { HandlerEvent } from '@netlify/functions';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insertLeadSubmission, updateConfirmationEmailStatus, sendViaMailtrapApi } = vi.hoisted(() => ({
  insertLeadSubmission: vi.fn(),
  updateConfirmationEmailStatus: vi.fn(),
  sendViaMailtrapApi: vi.fn(),
}));

vi.mock('../../netlify/functions/lib/leadRepository', () => ({
  insertLeadSubmission,
  updateConfirmationEmailStatus,
}));

vi.mock('../../netlify/functions/lib/mailtrap', () => ({
  sendViaMailtrapApi,
}));

import { handler } from '../../netlify/functions/submit-lead';

const postEvent = (body: string): HandlerEvent =>
  ({
    httpMethod: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-forwarded-for': '127.0.0.1',
    },
    body,
  }) as HandlerEvent;

describe('submit-lead function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SITE_MANAGER_EMAIL = 'manager@example.com';
    process.env.SMTP_PASS = 'token';
    process.env.FROM_EMAIL = 'info@devisia.pro';
    process.env.REPLY_TO_EMAIL = 'info@devisia.it';
    sendViaMailtrapApi.mockResolvedValue({ ok: true, status: 200, body: 'ok' });
  });

  it('stores the lead and returns JSON success when insert succeeds', async () => {
    insertLeadSubmission.mockResolvedValue({ kind: 'inserted', id: 'row-1' });
    updateConfirmationEmailStatus.mockResolvedValue(undefined);

    const body = new URLSearchParams({
      submission_id: '33333333-3333-4333-8333-333333333333',
      form_id: 'landing-governance-ai',
      page_path: '/landing/governance-ai',
      lang: 'it',
      name: 'Luca Verdi',
      email: 'luca@example.com',
      company: 'Beta Srl',
      message: 'Stiamo valutando un assistente AI interno.',
      privacy_consent: 'true',
      form_loaded_at: String(Date.now() - 5000),
      utm_source: 'linkedin',
      utm_campaign: 'ai-gov',
    }).toString();

    const response = await handler(postEvent(body), {} as never, undefined as never);
    const payload = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(payload.ok).toBe(true);
    expect(insertLeadSubmission).toHaveBeenCalledTimes(1);
    expect(sendViaMailtrapApi).toHaveBeenCalled();
    expect(updateConfirmationEmailStatus).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'sent' })
    );
  });

  it('keeps success when confirmation email fails after insert', async () => {
    insertLeadSubmission.mockResolvedValue({ kind: 'inserted', id: 'row-2' });
    updateConfirmationEmailStatus.mockResolvedValue(undefined);
    sendViaMailtrapApi.mockRejectedValue(new Error('mailtrap down'));

    const body = new URLSearchParams({
      submission_id: '44444444-4444-4444-8444-444444444444',
      form_id: 'landing-evidenze-audit',
      page_path: '/landing/evidenze-audit',
      lang: 'it',
      name: 'Sara Neri',
      email: 'sara@example.com',
      company: 'Gamma SpA',
      message: 'Dobbiamo preparare evidenze per un audit ISO.',
      privacy_consent: 'true',
      form_loaded_at: String(Date.now() - 5000),
    }).toString();

    const response = await handler(postEvent(body), {} as never, undefined as never);
    const payload = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(payload.ok).toBe(true);
    expect(updateConfirmationEmailStatus).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed', errorCode: 'email_send_failed' })
    );
  });

  it('returns success without sending a second email for duplicate submission_id', async () => {
    insertLeadSubmission.mockResolvedValue({ kind: 'duplicate', id: 'row-3' });

    const body = new URLSearchParams({
      submission_id: '55555555-5555-4555-8555-555555555555',
      form_id: 'website-contact-it',
      page_path: '/contatti',
      lang: 'it',
      name: 'Paolo Blu',
      email: 'paolo@example.com',
      message: 'Vorrei un confronto.',
      privacy_consent: 'true',
      form_loaded_at: String(Date.now() - 5000),
    }).toString();

    const response = await handler(postEvent(body), {} as never, undefined as never);
    const payload = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.duplicate).toBe(true);
    expect(sendViaMailtrapApi).not.toHaveBeenCalled();
  });

  it('returns a generic error when database insert fails', async () => {
    insertLeadSubmission.mockResolvedValue({ kind: 'error', code: 'db_insert_failed' });

    const body = new URLSearchParams({
      submission_id: '66666666-6666-4666-8666-666666666666',
      form_id: 'landing-processi-prima-automazione',
      page_path: '/landing/processi-prima-automazione',
      lang: 'it',
      name: 'Elena Grigi',
      email: 'elena@example.com',
      company: 'Delta Srl',
      message: 'Vogliamo automatizzare un processo ancora confuso.',
      privacy_consent: 'true',
      form_loaded_at: String(Date.now() - 5000),
    }).toString();

    const response = await handler(postEvent(body), {} as never, undefined as never);
    const payload = JSON.parse(response.body || '{}');

    expect(response.statusCode).toBe(503);
    expect(payload.ok).toBe(false);
    expect(sendViaMailtrapApi).not.toHaveBeenCalled();
  });
});
