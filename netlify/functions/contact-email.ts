import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parse } from 'querystring';

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SMTP transporter
const createTransporter = () => {
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL', 'SITE_MANAGER_EMAIL'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Load email template
const loadTemplate = (lang: 'it' | 'en'): string => {
  try {
    // Path relative to the function file
    const templatePath = join(__dirname, '../../src/email-templates', `thank-you.${lang}.html`);
    return readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading template for lang ${lang}:`, error);
    // Fallback to plain text template
    return lang === 'en'
      ? '<p>Hello {{name}},</p><p>Thank you for contacting us{{subject}}.</p><p>We have received your message and will get back to you soon.</p>'
      : '<p>Ciao {{name}},</p><p>Grazie per averci contattato{{subject}}.</p><p>Abbiamo ricevuto il tuo messaggio e ti risponderemo presto.</p>';
  }
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

export const handler: Handler = async (event, context) => {
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
    const { name, email, subject, message, lang, 'bot-field': botField } = body;

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

    // Determine language (default to Italian)
    const emailLang = (lang === 'en' ? 'en' : 'it') as 'it' | 'en';

    // Create transporter
    let transporter;
    try {
      transporter = createTransporter();
    } catch (error) {
      console.error('Error creating transporter:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service configuration error' }),
      };
    }

    // Load and prepare thank-you email template
    const userTemplate = loadTemplate(emailLang);
    const userHtml = replacePlaceholders(userTemplate, {
      name: name as string,
      subject: (subject as string) || '',
    });

    // Send thank-you email to user
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email as string,
        subject: emailLang === 'en'
          ? 'Thank you for contacting Devisia'
          : 'Grazie per averci contattato',
        html: userHtml,
      });
      console.log(`Thank-you email sent to ${email}`);
    } catch (error) {
      console.error('Error sending thank-you email:', error);
      // Continue to notification email even if thank-you fails
    }

    // Prepare notification email for site manager
    const managerSubject = `New contact form submission${emailLang === 'en' ? ' (EN)' : ' (IT)'}`;
    const managerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0b1f2a;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${(name as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p><strong>Email:</strong> ${(email as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        ${subject ? `<p><strong>Subject:</strong> ${(subject as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${(message as string).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
          Language: ${emailLang === 'en' ? 'English' : 'Italian'}<br>
          Submitted: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    // Send notification email to site manager
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: process.env.SITE_MANAGER_EMAIL,
        subject: managerSubject,
        html: managerHtml,
      });
      console.log(`Notification email sent to ${process.env.SITE_MANAGER_EMAIL}`);
    } catch (error) {
      console.error('Error sending notification email:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error sending notification email' }),
      };
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
