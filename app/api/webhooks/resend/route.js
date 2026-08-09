import { createClient } from '@supabase/supabase-js';
import { createSupabaseNotificationStore } from '../../../../lib/notifications/supabase-store.mjs';
import { normalizeResendWebhook, verifyResendWebhook, webhookHeaders } from '../../../../lib/notifications/resend-webhook.mjs';

export const runtime = 'nodejs';
const MAX_WEBHOOK_BYTES = 256 * 1024;

function response(body, status) {
  return Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
}

function methodNotAllowed() {
  return Response.json({ received: false, error: 'Method not allowed.' }, { status: 405, headers: { 'cache-control': 'no-store', allow: 'POST' } });
}

export async function handleResendWebhook(request, {
  env = process.env,
  verify = verifyResendWebhook,
  store: injectedStore
} = {}) {
  const webhookSecret = String(env.RESEND_WEBHOOK_SECRET || '').trim();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!webhookSecret || (!injectedStore && (!url || !serviceKey))) {
    return response({ received: false, error: 'Webhook is not configured.' }, 503);
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_WEBHOOK_BYTES) {
    return response({ received: false, error: 'Webhook payload is too large.' }, 400);
  }
  let rawBody;
  try {
    rawBody = await request.text();
  } catch {
    return response({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }
  if (!rawBody || Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BYTES) {
    return response({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }

  const signatureHeaders = webhookHeaders(request.headers);
  let event;
  try {
    event = verify(rawBody, request.headers, webhookSecret);
  } catch {
    return response({ received: false, error: 'Invalid webhook signature.' }, 401);
  }

  let normalized;
  try {
    normalized = normalizeResendWebhook(event, signatureHeaders.id);
  } catch {
    return response({ received: false, error: 'Webhook payload is invalid.' }, 400);
  }
  if (!normalized) return response({ received: true, ignored: true }, 200);

  const store = injectedStore || createSupabaseNotificationStore(createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  }));
  try {
    const inserted = await store.recordProviderEvent(normalized);
    return response({ received: true, duplicate: inserted === false }, 200);
  } catch {
    return response({ received: false, error: 'Webhook could not be stored.' }, 503);
  }
}

export async function POST(request) {
  return handleResendWebhook(request);
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
