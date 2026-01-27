import type { Handler } from '@netlify/functions';
import { parse } from 'querystring';

// Email templates embedded directly in the function
// This avoids file system path issues in Netlify Functions
const EMAIL_TEMPLATES = {
  it: `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grazie per averci contattato</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f9fb; color: #1f2937;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0b1f2a;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Devisia</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 20px; font-weight: 600;">Ciao {{name}},</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Grazie per averci contattato{{subject}}.
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto. Di solito rispondiamo entro 24-48 ore lavorative.
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Nel frattempo, se hai domande urgenti, puoi contattarci direttamente all'indirizzo <a href="mailto:info@devisia.pro" style="color: #1fa2a6; text-decoration: none;">info@devisia.pro</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Cordiali saluti,<br>
                <strong style="color: #1f2937;">Il team Devisia</strong>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://devisia.pro" style="color: #1fa2a6; text-decoration: none;">devisia.pro</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  en: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting us</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f9fb; color: #1f2937;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0b1f2a;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Devisia</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 20px; font-weight: 600;">Hello {{name}},</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for contacting us{{subject}}.
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We have received your message and will get back to you as soon as possible. We typically respond within 24-48 business hours.
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                In the meantime, if you have urgent questions, you can contact us directly at <a href="mailto:info@devisia.pro" style="color: #1fa2a6; text-decoration: none;">info@devisia.pro</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #1f2937;">The Devisia Team</strong>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://devisia.pro" style="color: #1fa2a6; text-decoration: none;">devisia.pro</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
};

import { getEnv, sendViaMailtrapApi } from './lib/mailtrap';

// Load email template
const loadTemplate = (lang: 'it' | 'en'): string => {
  return EMAIL_TEMPLATES[lang] || EMAIL_TEMPLATES.it;
};

// Replace placeholders in template
const replacePlaceholders = (template: string, data: Record<string, string>): string => {
  let result = template;
  
  // Replace {{name}}
  result = result.replace(/\{\{name\}\}/g, data.name || '');
  
  // Replace {{subject}} with conditional logic
  const subjectText = data.subject && data.subject.trim()
    ? ` riguardo "${data.subject.trim()}"`
    : '';
  result = result.replace(/\{\{subject\}\}/g, subjectText);
  
  return result;
};

export const handler: Handler = async (event, _context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse form data (url-encoded)
    const body = parse(event.body || '');
    const { name, email, subject, message, lang, privacy_consent, 'bot-field': botField } = body;

    // Honeypot check - if bot-field is filled, it's spam
    if (botField) {
      console.log('Spam detected: bot-field filled');
      // Return success to avoid revealing the honeypot
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Thanks!' }),
      };
    }

    // Validate required fields
    if (!email || !name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: name, email, and message are required' }),
      };
    }

    // Enforce privacy consent (required by the form UI)
    const consentValue = String(privacy_consent || '').toLowerCase();
    const hasConsent = consentValue === 'true' || consentValue === 'on' || consentValue === '1' || consentValue === 'yes';
    if (!hasConsent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Privacy consent is required' }),
      };
    }

    // Determine language (default to Italian)
    const emailLang = (lang === 'en' ? 'en' : 'it') as 'it' | 'en';

    // Load and prepare thank-you email template
    const userTemplate = loadTemplate(emailLang);
    const userHtml = replacePlaceholders(userTemplate, {
      name: name as string,
      subject: (subject as string) || '',
    });

    // Send thank-you email to user via Mailtrap API (non-blocking)
    const thankYouSubject =
      emailLang === 'en' ? 'Thank you for contacting Devisia' : 'Grazie per averci contattato';
    const thankYouText =
      emailLang === 'en'
        ? `Hello ${(name as string) || ''},\n\nThank you for contacting us${subject ? ` regarding "${String(subject).trim()}"` : ''}.\nWe have received your message and will get back to you as soon as possible.\n\nDevisia`
        : `Ciao ${(name as string) || ''},\n\nGrazie per averci contattato${subject ? ` riguardo "${String(subject).trim()}"` : ''}.\nAbbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.\n\nDevisia`;

    // Prepare notification email for site manager
    const managerSubject = `New contact form submission${emailLang === 'en' ? ' (EN)' : ' (IT)'}`;
    const managerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0b1f2a;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${(name as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p><strong>Email:</strong> ${(email as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p><strong>Privacy consent:</strong> yes</p>
        ${subject ? `<p><strong>Subject:</strong> ${(subject as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${(message as string).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
          Language: ${emailLang === 'en' ? 'English' : 'Italian'}<br>
          Submitted: ${new Date().toLocaleString()}
        </p>
      </div>
    `;
    const managerText = `New contact form submission\n\nName: ${String(name)}\nEmail: ${String(email)}\nPrivacy consent: yes\n${subject ? `Subject: ${String(subject)}\n` : ''}\nMessage:\n${String(message)}\n\nLanguage: ${emailLang}`;

    // Fire both sends in parallel; never block the redirect
    const siteManagerEmail = getEnv('SITE_MANAGER_EMAIL');
    const [thankYouResult, managerResult] = await Promise.allSettled([
      sendViaMailtrapApi({
        to: email as string,
        subject: thankYouSubject,
        html: userHtml,
        text: thankYouText,
        timeoutMs: 8000,
      }),
      sendViaMailtrapApi({
        to: siteManagerEmail,
        subject: managerSubject,
        html: managerHtml,
        text: managerText,
        timeoutMs: 8000,
      }),
    ]);

    if (thankYouResult.status === 'rejected') {
      console.error('Thank-you email failed (Mailtrap API):', thankYouResult.reason);
    } else {
      console.log(`Thank-you email API status: ${thankYouResult.value.status}`);
    }

    if (managerResult.status === 'rejected') {
      console.error('Manager email failed (Mailtrap API):', managerResult.reason);
    } else {
      console.log(`Manager email API status: ${managerResult.value.status}`);
    }

    // Return redirect response
    const redirectUrl = emailLang === 'en' ? '/en/contact?success=true' : '/contact?success=true';
    
    return {
      statusCode: 303,
      headers: {
        Location: redirectUrl,
      },
      body: '',
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
