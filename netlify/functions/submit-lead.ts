import type { Handler, HandlerEvent } from '@netlify/functions';
import { handleSubmitLeadRequest } from './lib/submitLeadHandler';

const clientKey = (event: HandlerEvent): string => {
  const headers = event.headers || {};
  const direct =
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'];
  return direct || 'unknown';
};

export const handler: Handler = async (event) => {
  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || null;
  const result = await handleSubmitLeadRequest({
    method: event.httpMethod,
    contentType,
    rawBody: event.body || '',
    clientKey: clientKey(event),
  });

  return {
    statusCode: result.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(result.body),
  };
};
