import {
  LEAD_EMAIL_FOOTER_NOTE,
  contactThankYouTemplates,
  getLeadEmailTemplate,
  type LeadEmailTemplate,
} from './leadEmailTemplates';
import type { LeadSource } from './leadSources';

const SITE_URL = 'https://devisia.pro';
const CONTACT_URL = 'https://devisia.pro/contatti';
const PRIVACY_URL = 'https://devisia.pro/privacy';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const firstNameFromFullName = (fullName: string): string | null => {
  const first = fullName.trim().split(/\s+/)[0];
  return first || null;
};

const greetingFor = (fullName: string, lang: 'it' | 'en'): string => {
  const first = firstNameFromFullName(fullName);
  if (lang === 'en') {
    return first ? `Hello ${first},` : 'Hello,';
  }
  return first ? `Buongiorno ${first},` : 'Buongiorno,';
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const renderShellHtml = (params: {
  lang: 'it' | 'en';
  heading: string;
  greeting: string;
  paragraphs: string[];
  closingLines: string[];
}): string => {
  const paragraphsHtml = params.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">${escapeHtml(paragraph)}</p>`
    )
    .join('');

  const closingHtml = params.closingLines
    .map((line) => escapeHtml(line))
    .join('<br>');

  return `<!DOCTYPE html>
<html lang="${params.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(params.heading)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f9fb; color: #1f2937;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 40px 16px; background-color: #0b1f2a;">
              <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Devisia</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 22px; font-weight: 600; line-height: 1.3;">${escapeHtml(params.heading)}</h1>
              <p style="margin: 0 0 16px; color: #1f2937; font-size: 16px; line-height: 1.6;">${escapeHtml(params.greeting)}</p>
              ${paragraphsHtml}
              <p style="margin: 24px 0 0; color: #1f2937; font-size: 16px; line-height: 1.6;">${closingHtml}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5;">${escapeHtml(LEAD_EMAIL_FOOTER_NOTE)}</p>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                <a href="${SITE_URL}" style="color: #1fa2a6; text-decoration: none;">devisia.pro</a>
                ·
                <a href="${CONTACT_URL}" style="color: #1fa2a6; text-decoration: none;">Contatti</a>
                ·
                <a href="${PRIVACY_URL}" style="color: #1fa2a6; text-decoration: none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const renderShellText = (params: {
  greeting: string;
  heading: string;
  paragraphs: string[];
  closingLines: string[];
}): string =>
  [
    params.greeting,
    '',
    params.heading,
    '',
    ...params.paragraphs,
    '',
    ...params.closingLines,
    '',
    LEAD_EMAIL_FOOTER_NOTE,
    '',
    `Sito: ${SITE_URL}`,
    `Contatti: ${CONTACT_URL}`,
    `Privacy: ${PRIVACY_URL}`,
  ].join('\n');

export const renderLandingConfirmationEmail = (params: {
  source: LeadSource;
  fullName: string;
}): RenderedEmail | null => {
  const template = getLeadEmailTemplate(params.source);
  if (!template) return null;

  const greeting = greetingFor(params.fullName, 'it');
  const paragraphs = [...template.bodyParagraphs, template.nextStepText];
  const closingLines = [template.closingName, template.closingOrg];

  return {
    subject: template.subject,
    html: renderShellHtml({
      lang: 'it',
      heading: template.heading,
      greeting,
      paragraphs,
      closingLines,
    }),
    text: renderShellText({
      greeting,
      heading: template.heading,
      paragraphs,
      closingLines,
    }),
  };
};

export const renderContactConfirmationEmail = (params: {
  lang: 'it' | 'en';
  fullName: string;
  subject: string | null;
}): RenderedEmail => {
  const template = contactThankYouTemplates[params.lang];
  const greeting = template.greeting(firstNameFromFullName(params.fullName) || params.fullName);
  const paragraphs = template.body(params.subject);
  const closingLines = [template.closing, 'Devisia'];

  return {
    subject: template.subject,
    html: renderShellHtml({
      lang: params.lang,
      heading: template.subject,
      greeting,
      paragraphs,
      closingLines,
    }),
    text: renderShellText({
      greeting,
      heading: template.subject,
      paragraphs,
      closingLines,
    }),
  };
};

export const renderManagerNotificationEmail = (params: {
  fullName: string;
  email: string;
  source: string;
  lang: 'it' | 'en';
  company: string | null;
  role: string | null;
  subject: string | null;
  message: string;
  pagePath: string;
}): RenderedEmail => {
  const subject = `New lead submission (${params.source})`;
  const lines = [
    `Name: ${params.fullName}`,
    `Email: ${params.email}`,
    `Source: ${params.source}`,
    `Page: ${params.pagePath}`,
    `Language: ${params.lang}`,
    params.company ? `Company: ${params.company}` : null,
    params.role ? `Role: ${params.role}` : null,
    params.subject ? `Subject: ${params.subject}` : null,
    '',
    'Message:',
    params.message,
  ].filter((line): line is string => line != null);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0b1f2a;">New lead submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(params.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(params.email)}</p>
      <p><strong>Source:</strong> ${escapeHtml(params.source)}</p>
      <p><strong>Page:</strong> ${escapeHtml(params.pagePath)}</p>
      <p><strong>Privacy consent:</strong> yes</p>
      ${params.company ? `<p><strong>Company:</strong> ${escapeHtml(params.company)}</p>` : ''}
      ${params.role ? `<p><strong>Role:</strong> ${escapeHtml(params.role)}</p>` : ''}
      ${params.subject ? `<p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(params.message).replace(/\n/g, '<br>')}</div>
    </div>
  `;

  return {
    subject,
    html,
    text: lines.join('\n'),
  };
};

export type { LeadEmailTemplate };
