import { Resend } from 'resend';

const SUPPORTED_EVENTS = new Set([
  'email.sent',
  'email.delivered',
  'email.delivery_delayed',
  'email.failed',
  'email.bounced',
  'email.complained',
  'email.suppressed'
]);

function headerValue(headers, preferred, standard) {
  return headers.get(preferred) || headers.get(standard) || '';
}

export function webhookHeaders(headers) {
  return {
    id: headerValue(headers, 'svix-id', 'webhook-id'),
    timestamp: headerValue(headers, 'svix-timestamp', 'webhook-timestamp'),
    signature: headerValue(headers, 'svix-signature', 'webhook-signature')
  };
}

export function verifyResendWebhook(rawBody, headers, webhookSecret) {
  // Resend requires a constructor value even though webhook verification is
  // entirely local and authenticates with the separate webhook secret below.
  const resend = new Resend('webhook-verification-only');
  return resend.webhooks.verify({
    payload: rawBody,
    headers: webhookHeaders(headers),
    webhookSecret
  });
}

export function normalizeResendWebhook(event, providerEventId) {
  if (!SUPPORTED_EVENTS.has(event?.type)) return null;
  const providerMessageId = typeof event?.data?.email_id === 'string' ? event.data.email_id.trim() : '';
  const occurredAt = typeof event?.created_at === 'string' ? event.created_at : '';
  const eventId = String(providerEventId || '').trim();
  if (!eventId || eventId.length > 255 || !providerMessageId || providerMessageId.length > 255) {
    throw new Error('webhook_payload_invalid');
  }
  const timestamp = new Date(occurredAt);
  if (!occurredAt || Number.isNaN(timestamp.valueOf())) throw new Error('webhook_payload_invalid');
  return {
    provider: 'resend',
    providerEventId: eventId,
    eventType: event.type,
    providerMessageId,
    occurredAt: timestamp.toISOString()
  };
}

export const resendWebhookInternals = { SUPPORTED_EVENTS };
