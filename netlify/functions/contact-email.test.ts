import type { HandlerEvent } from '@netlify/functions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handler } from './contact-email';

vi.mock('./lib/mailtrap', () => ({
  sendViaMailtrapApi: vi.fn(() => Promise.reject(new Error('Email disabled in test'))),
}));

const postEvent = (body: string): HandlerEvent =>
  ({
    httpMethod: 'POST',
    body,
  }) as HandlerEvent;

describe('contact-email function', () => {
  beforeEach(() => {
    delete process.env.SITE_MANAGER_EMAIL;
    delete process.env.SMTP_PASS;
    delete process.env.FROM_EMAIL;
  });

  it('redirects back to the landing page even when email env vars are missing', async () => {
    const body = new URLSearchParams({
      name: 'Mario Rossi',
      email: 'mario@example.com',
      message: 'Vorrei parlare di un progetto.',
      privacy_consent: 'true',
      lang: 'it',
      source: 'landing-devisia',
      return_to: '/landing/devisia',
    }).toString();

    const response = await handler(postEvent(body), {} as never, undefined as never);

    expect(response.statusCode).toBe(303);
    expect(response.headers?.Location).toBe('/landing/devisia?success=true#contatto');
  });
});
