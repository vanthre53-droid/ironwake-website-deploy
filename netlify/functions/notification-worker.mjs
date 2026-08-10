import { createClient } from '@supabase/supabase-js';
import { createSupabaseNotificationStore } from '../../lib/notifications/supabase-store.mjs';
import { runNotificationWorkerBestEffort } from '../../lib/notifications/worker.mjs';

export async function runScheduledNotificationWorker(env = process.env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { status: 'unconfigured', safeErrorCode: 'notification_database_unconfigured', claimed: 0 };
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return runNotificationWorkerBestEffort({
    env,
    store: createSupabaseNotificationStore(supabase),
    // Two bounded provider calls stay within the scheduled function budget;
    // queued events remain durable and are picked up on the next invocation.
    limit: 2
  });
}

export default async function handler() {
  const result = await runScheduledNotificationWorker();
  return new Response(JSON.stringify({
    status: result.status,
    claimed: result.claimed || 0,
    accepted: result.accepted || 0,
    retryScheduled: result.retryScheduled || 0,
    deadLettered: result.deadLettered || 0,
    safeErrorCode: result.safeErrorCode
  }), { status: result.status === 'worker_error' ? 500 : 200, headers: { 'content-type': 'application/json' } });
}
