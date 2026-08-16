// ponytail: provider-neutral handler for the notification worker's
// scheduled invocation. The Cloudflare Worker `scheduled` export (see
// worker-entry.js) and the Next.js cron endpoint (see
// app/api/cron/notifications/route.js) both call this. They differ only
// in how they obtain `env` and how they log; the business rules are
// identical.
//
// Authentication: a shared secret CRON_SECRET presented as a bearer
// token. The Cloudflare Worker stores CRON_SECRET as a Worker secret;
// the cron endpoint reads it from the same env key. No fallback.
//
// Returned summary shape matches the previous Netlify response so any
// external operator dashboard keeps working.

import { randomUUID } from 'node:crypto';
import { runNotificationWorkerBestEffort } from './worker.mjs';
import { createSupabaseNotificationStore } from './supabase-store.mjs';
import { createClient } from '@supabase/supabase-js';

export const CRON_SECRET_ENV = 'CRON_SECRET';

export function unauthorizedResult() {
  return { status: 'unauthorized', httpStatus: 401 };
}

export function missingSecretResult() {
  return { status: 'unconfigured', safeErrorCode: 'cron_secret_unconfigured', httpStatus: 503 };
}

export function missingDbResult() {
  return { status: 'unconfigured', safeErrorCode: 'notification_database_unconfigured', claimed: 0, httpStatus: 503 };
}

export async function runCronInvocation({
  env = process.env,
  secret = env[CRON_SECRET_ENV],
  presentedToken = '',
  workerId = `ironwake-notification-${randomUUID()}`,
  fetchImpl = globalThis.fetch
} = {}) {
  if (!secret) return missingSecretResult();
  if (presentedToken !== secret) return unauthorizedResult();

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return missingDbResult();

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const result = await runNotificationWorkerBestEffort({
    env,
    store: createSupabaseNotificationStore(supabase),
    workerId,
    limit: 2
  });

  return {
    status: result.status,
    claimed: result.claimed || 0,
    accepted: result.accepted || 0,
    retryScheduled: result.retryScheduled || 0,
    deadLettered: result.deadLettered || 0,
    safeErrorCode: result.safeErrorCode,
    httpStatus: result.status === 'worker_error' ? 500 : 200
  };
}

export async function selfFetchCronEndpoint({
  env = process.env,
  fetchImpl = globalThis.fetch,
  baseUrl,
  path = '/api/cron/notifications'
} = {}) {
  const secret = env[CRON_SECRET_ENV];
  if (!secret) return { ok: false, reason: 'missing_cron_secret' };

  const target = `${baseUrl || (env.WORKER_SELF_REFERENCE ? 'https://ironwake.dev' : 'http://localhost:8787')}${path}`;
  const response = await fetchImpl(target, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${secret}`,
      'user-agent': 'ironwake-cloudflare-cron/1.0'
    }
  });
  return { ok: response.ok, status: response.status };
}
