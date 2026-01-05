import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const createTransporter = () => {
  const host = getEnv('SMTP_HOST');
  const port = Number(getEnv('SMTP_PORT'));
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    // Conservative timeouts to surface connectivity issues quickly
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });
};

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
    const transporter = createTransporter();

    // verify() checks connection + auth with the SMTP server
    await transporter.verify();

    return json(200, {
      ok: true,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
    });
  } catch (err: any) {
    console.error('SMTP verify failed:', err);
    return json(500, {
      ok: false,
      message: err?.message ?? String(err),
      code: err?.code,
      response: err?.response,
      command: err?.command,
    });
  }
};

