import { getDatabase } from '@netlify/database';
import type { ParsedLeadPayload } from './leadValidation';

export type LeadInsertResult =
  | { kind: 'inserted'; id: string }
  | { kind: 'duplicate'; id: string | null }
  | { kind: 'error'; code: string };

export type ConfirmationEmailStatus = 'pending' | 'sent' | 'failed';

type LeadRow = {
  id: string;
};

const asLeadRows = (value: unknown): LeadRow[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((row): row is LeadRow => {
    return typeof row === 'object' && row !== null && typeof (row as LeadRow).id === 'string';
  });
};

export async function insertLeadSubmission(data: ParsedLeadPayload): Promise<LeadInsertResult> {
  try {
    const db = getDatabase();
    const privacyAcceptedAt = new Date().toISOString();
    const metadata = JSON.stringify({
      form_loaded_at: data.formLoadedAt,
      variant: data.sourceConfig.variant,
    });

    const inserted = await db.sql<LeadRow>`
      INSERT INTO lead_submissions (
        submission_id,
        source,
        form_id,
        page_path,
        full_name,
        email,
        company,
        role,
        phone,
        subject,
        message,
        privacy_accepted,
        privacy_accepted_at,
        marketing_accepted,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        referrer,
        status,
        metadata,
        confirmation_email_status
      )
      VALUES (
        ${data.submissionId}::uuid,
        ${data.sourceConfig.source},
        ${data.formId},
        ${data.pagePath},
        ${data.fullName},
        ${data.email},
        ${data.company},
        ${data.role},
        ${data.phone},
        ${data.subject},
        ${data.message},
        ${data.privacyAccepted},
        ${privacyAcceptedAt}::timestamptz,
        ${data.marketingAccepted},
        ${data.utmSource},
        ${data.utmMedium},
        ${data.utmCampaign},
        ${data.utmContent},
        ${data.utmTerm},
        ${data.referrer},
        'new',
        ${metadata}::jsonb,
        'pending'
      )
      ON CONFLICT (submission_id) DO NOTHING
      RETURNING id
    `;

    const rows = asLeadRows(inserted);
    if (rows[0]?.id) {
      return { kind: 'inserted', id: rows[0].id };
    }

    const existing = await db.sql<LeadRow>`
      SELECT id
      FROM lead_submissions
      WHERE submission_id = ${data.submissionId}::uuid
      LIMIT 1
    `;
    const existingRows = asLeadRows(existing);
    return { kind: 'duplicate', id: existingRows[0]?.id ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_db_error';
    console.error('lead_submissions insert failed', {
      code: 'db_insert_failed',
      detail: message.slice(0, 180),
    });
    return { kind: 'error', code: 'db_insert_failed' };
  }
}

export async function updateConfirmationEmailStatus(params: {
  submissionId: string;
  status: ConfirmationEmailStatus;
  errorCode?: string | null;
}): Promise<void> {
  try {
    const db = getDatabase();
    const sentAt = params.status === 'sent' ? new Date().toISOString() : null;
    const errorCode = params.status === 'failed' ? (params.errorCode ?? 'email_send_failed') : null;

    await db.sql`
      UPDATE lead_submissions
      SET
        confirmation_email_status = ${params.status},
        confirmation_email_sent_at = ${sentAt}::timestamptz,
        confirmation_email_error = ${errorCode}
      WHERE submission_id = ${params.submissionId}::uuid
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_db_error';
    console.error('lead_submissions email status update failed', {
      code: 'db_email_status_failed',
      detail: message.slice(0, 180),
    });
  }
}
