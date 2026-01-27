import type { ArtifactRecordV1 } from './schema';
import { canonicalJson } from './hash';

const escapeHtml = (input: string) =>
  String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function renderArtifactEmail(record: ArtifactRecordV1): { subject: string; html: string; text: string } {
  const { ref_id } = record;
  const subject = `Devisia AI Artifact ${ref_id}`;

  const artifact = record.output_json;
  const fullPayload = {
    ref_id: record.ref_id,
    created_at: record.created_at,
    schema_version: record.schema_version,
    input_raw: record.input_raw,
    output_json: record.output_json,
    content_hash: record.content_hash,
    email: record.email,
    ...(record.name ? { name: record.name } : {}),
    ...(record.note ? { note: record.note } : {}),
    consent_timestamp: record.consent_timestamp,
    retention_days: record.retention_days,
    retention_policy_version: record.retention_policy_version,
  };

  const prettyJson = JSON.stringify(JSON.parse(canonicalJson(fullPayload)), null, 2);

  const html = `<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f9fb;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:760px;margin:0 auto;padding:24px;">
      <div style="background:#0b1f2a;border-radius:12px;padding:18px 20px;margin-bottom:16px;">
        <div style="color:#fff;font-weight:700;letter-spacing:0.06em;">DEVISIA</div>
        <div style="color:#d1d5db;font-size:13px;margin-top:6px;">AI-assisted system structuring artifact</div>
      </div>

      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;">
        <h2 style="margin:0 0 10px;font-size:18px;">Reference ID: ${escapeHtml(ref_id)}</h2>
        <p style="margin:0 0 10px;color:#374151;font-size:14px;">
          <strong>Retention:</strong> ${record.retention_days} giorni (policy ${escapeHtml(record.retention_policy_version)}).
          Per cancellazione, citare questo ID.
        </p>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:14px 0;" />

        <h3 style="margin:0 0 6px;font-size:15px;">Contact</h3>
        <p style="margin:0 0 12px;color:#374151;font-size:14px;">
          <strong>Email:</strong> ${escapeHtml(record.email)}<br/>
          <strong>Nome:</strong> ${escapeHtml(record.name || '')}<br/>
          <strong>Nota:</strong> ${escapeHtml(record.note || '')}
        </p>

        <h3 style="margin:0 0 6px;font-size:15px;">Raw input</h3>
        <pre style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin:0 0 14px;font-size:13px;color:#111827;">${escapeHtml(
          record.input_raw
        )}</pre>

        <h3 style="margin:0 0 6px;font-size:15px;">Output (rendered)</h3>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin:0 0 14px;">
          <h4 style="margin:0 0 6px;font-size:14px;">1) System Overview</h4>
          <p style="margin:0 0 10px;color:#111827;font-size:13.5px;line-height:1.5;">${escapeHtml(
            artifact.system_overview
          )}</p>

          <h4 style="margin:0 0 6px;font-size:14px;">2) Core Domain Model</h4>
          <ul style="margin:0 0 10px;padding-left:18px;color:#111827;font-size:13.5px;line-height:1.5;">
            ${artifact.core_domain_model
              .map((e) => `<li><strong>${escapeHtml(e.name)}:</strong> ${escapeHtml(e.description)}</li>`)
              .join('')}
          </ul>

          <h4 style="margin:0 0 6px;font-size:14px;">3) Key Flows</h4>
          <ol style="margin:0 0 10px;padding-left:18px;color:#111827;font-size:13.5px;line-height:1.5;">
            ${artifact.key_flows
              .map(
                (f) => `
              <li style="margin:0 0 8px;">
                <strong>${escapeHtml(f.title)}</strong>
                <ol style="margin:6px 0 0;padding-left:18px;">
                  ${f.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
                </ol>
              </li>`
              )
              .join('')}
          </ol>

          <h4 style="margin:0 0 6px;font-size:14px;">4) Critical Considerations</h4>
          <p style="margin:0 0 4px;font-size:13.5px;"><strong>Technical</strong></p>
          <ul style="margin:0 0 8px;padding-left:18px;color:#111827;font-size:13.5px;line-height:1.5;">
            ${artifact.critical_considerations.technical.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
          </ul>
          <p style="margin:0 0 4px;font-size:13.5px;"><strong>Privacy &amp; Data</strong></p>
          <ul style="margin:0 0 8px;padding-left:18px;color:#111827;font-size:13.5px;line-height:1.5;">
            ${artifact.critical_considerations.privacy_data.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
          </ul>
          <p style="margin:0 0 4px;font-size:13.5px;"><strong>Architectural</strong></p>
          <ul style="margin:0 0 0;padding-left:18px;color:#111827;font-size:13.5px;line-height:1.5;">
            ${artifact.critical_considerations.architectural.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
          </ul>
        </div>

        <h3 style="margin:0 0 6px;font-size:15px;">Full JSON payload</h3>
        <pre style="white-space:pre-wrap;background:#0b1f2a;color:#e5e7eb;border-radius:10px;padding:12px;margin:0;font-size:12px;line-height:1.45;">${escapeHtml(
          prettyJson
        )}</pre>
      </div>

      <p style="margin:14px 0 0;color:#6b7280;font-size:12px;text-align:center;">
        This email is the persistence layer for the MVP.
      </p>
    </div>
  </body>
</html>`;

  const text = [
    subject,
    '',
    `Reference ID: ${record.ref_id}`,
    `Retention: ${record.retention_days} days (policy ${record.retention_policy_version}). Deletion requires this ID.`,
    '',
    'Contact:',
    `- Email: ${record.email}`,
    `- Name: ${record.name || ''}`,
    `- Note: ${record.note || ''}`,
    '',
    'Raw input:',
    `"${record.input_raw}"`,
    '',
    'Output (JSON):',
    prettyJson,
  ].join('\n');

  return { subject, html, text };
}

