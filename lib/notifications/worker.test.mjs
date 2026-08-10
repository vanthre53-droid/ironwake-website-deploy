import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { needsPriorityAlert, runNotificationWorker, runNotificationWorkerBestEffort } from './worker.mjs';

const env = {
  EMAIL_PROVIDER: 'resend',
  RESEND_API_KEY: 'test-only',
  EMAIL_FROM: 'IronWake <notify@example.test>',
  EMAIL_REPLY_TO: 'hello@example.test',
  EMAIL_NOTIFICATION_RECIPIENT: 'owner@example.test'
};

function event(overrides = {}) {
  return {
    eventId: 'event-1',
    inquiryId: 'inquiry-1',
    eventType: 'owner_new_audit',
    targetType: 'owner',
    idempotencyKey: 'owner_new_audit:inquiry-1',
    attemptId: 'attempt-1',
    retryCycle: 0,
    attemptNumber: 1,
    ...overrides
  };
}

function inquiry() {
  return {
    id: 'inquiry-1', businessName: 'Test Business', email: 'customer@example.test',
    leakDescription: 'Missed calls', source: 'website_audit', createdAt: '2026-08-09T10:00:00Z',
    triagePriority: 'normal', triageSummary: 'Review request', triageNeedsHuman: false
  };
}

test('unconfigured worker leaves queued work untouched and consumes no attempt', async () => {
  let claimed = false;
  const result = await runNotificationWorker({ env: {}, store: { claim: async () => { claimed = true; } } });
  assert.equal(result.status, 'unconfigured');
  assert.equal(result.claimed, 0);
  assert.equal(claimed, false);
});

test('worker caps batches at ten and records provider acceptance separately from delivery', async () => {
  const finishes = [];
  const store = {
    claim: async ({ limit }) => {
      assert.equal(limit, 10);
      return [event()];
    },
    getInquiries: async () => new Map([['inquiry-1', inquiry()]]),
    finish: async (value) => { finishes.push(value); return 'accepted_by_provider'; }
  };
  const adapter = { send: async () => ({ accepted: true, status: 'accepted', providerEventId: 'email-1', retryable: false }) };
  const result = await runNotificationWorker({ env, store, limit: 50, workerId: 'test-worker', eventId: 'event-1', adapterFactory: () => adapter });
  assert.equal(result.claimed, 1);
  assert.equal(result.accepted, 1);
  assert.equal(finishes[0].outcome, 'accepted_by_provider');
  assert.equal(finishes[0].providerEventId, 'email-1');
});

test('worker records retryable, permanent, and attempt-three dead-letter outcomes through the store', async () => {
  const events = [
    event({ eventId: 'retry', attemptId: 'attempt-retry', idempotencyKey: 'retry:key' }),
    event({ eventId: 'permanent', attemptId: 'attempt-permanent', idempotencyKey: 'permanent:key' }),
    event({ eventId: 'third', attemptId: 'attempt-third', idempotencyKey: 'third:key', attemptNumber: 3 })
  ];
  const byId = new Map(events.map((item) => [item.eventId, item]));
  const store = {
    claim: async () => events,
    getInquiries: async () => new Map([['inquiry-1', inquiry()]]),
    finish: async (value) => value.retryable && byId.get(value.eventId).attemptNumber < 3 ? 'retry_scheduled' : 'dead_letter'
  };
  const adapter = { send: async (_message, { idempotencyKey }) => ({
    accepted: false,
    status: 'failed',
    retryable: idempotencyKey !== 'permanent:key',
    safeErrorCode: idempotencyKey === 'permanent:key' ? 'permanent_failure' : 'temporary_failure'
  }) };
  const result = await runNotificationWorker({ env, store, adapterFactory: () => adapter });
  assert.equal(result.retryScheduled, 1);
  assert.equal(result.deadLettered, 2);
});

test('priority alert policy is limited to high, urgent, or needs-human triage', () => {
  assert.equal(needsPriorityAlert({ priority: 'normal', needs_human: false }), false);
  assert.equal(needsPriorityAlert({ priority: 'high', needs_human: false }), true);
  assert.equal(needsPriorityAlert({ priority: 'urgent', needs_human: false }), true);
  assert.equal(needsPriorityAlert({ priority: 'low', needs_human: true }), true);
});

test('best-effort worker reduces unexpected failures to a safe result', async () => {
  const result = await runNotificationWorkerBestEffort({
    env,
    store: { claim: async () => { throw Object.assign(new Error('private database detail'), { safeCode: 'claim_unavailable' }); } }
  });
  assert.deepEqual(result, {
    status: 'worker_error', safeErrorCode: 'claim_unavailable', claimed: 0,
    accepted: 0, retryScheduled: 0, deadLettered: 0
  });
});

test('Netlify schedule is declared every two minutes and calls the shared worker', async () => {
  const config = await readFile(new URL('../../netlify.toml', import.meta.url), 'utf8');
  const source = await readFile(new URL('../../netlify/functions/notification-worker.mjs', import.meta.url), 'utf8');
  assert.match(config, /\[functions\."notification-worker"\][\s\S]*schedule = "\*\/2 \* \* \* \*"/);
  assert.match(source, /runNotificationWorkerBestEffort/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(source, /limit: 2/);
  const scheduledModule = await import('../../netlify/functions/notification-worker.mjs');
  assert.deepEqual(await scheduledModule.runScheduledNotificationWorker({}), {
    status: 'unconfigured', safeErrorCode: 'notification_database_unconfigured', claimed: 0
  });
});
