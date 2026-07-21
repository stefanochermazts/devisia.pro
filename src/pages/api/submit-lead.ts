import type { APIRoute } from 'astro';
import { handleSubmitLeadRequest } from '../../../netlify/functions/lib/submitLeadHandler';

export const prerender = false;

const clientKey = (request: Request): string => {
  const directIp = request.headers.get('x-nf-client-connection-ip') || request.headers.get('cf-connecting-ip');
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return directIp || forwardedIp || 'unknown';
};

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type');
  const rawBody = await request.text();

  let parsedJson: unknown;
  if ((contentType || '').toLowerCase().includes('application/json')) {
    try {
      parsedJson = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }
  }

  const result = await handleSubmitLeadRequest({
    method: request.method,
    contentType,
    rawBody,
    clientKey: clientKey(request),
    parsedJson,
  });

  return Response.json(result.body, {
    status: result.status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
};
