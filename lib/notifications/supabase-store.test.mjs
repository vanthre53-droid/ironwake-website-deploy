import assert from 'node:assert/strict';
import test from 'node:test';
import { createSupabaseNotificationStore } from './supabase-store.mjs';

test('Supabase store maps claim, inquiry, finish, and priority RPC contracts exactly', async () => {
  const calls = [];
  const supabase = {
    rpc: async (name, params) => {
      calls.push([name, params]);
      if (name === 'claim_notification_events') return { data: [{
        event_id: 'event-1', inquiry_id: 'inquiry-1', event_type: 'owner_new_audit',
        target_type: 'owner', idempotency_key: 'owner_new_audit:inquiry-1',
        attempt_id: 'attempt-1', retry_cycle: 0, attempt_number: 1
      }], error: null };
      if (name === 'finish_notification_attempt') return { data: 'accepted_by_provider', error: null };
      if (name === 'queue_priority_lead_notification') return { data: 'priority-event-1', error: null };
      if (name === 'record_notification_provider_event') return { data: true, error: null };
      throw new Error('unexpected rpc');
    },
    from: (table) => {
      assert.equal(table, 'inquiries');
      return {
        select: (columns) => {
          assert.match(columns, /triage_needs_human/);
          return {
            in: async (column, values) => {
              assert.equal(column, 'id');
              assert.deepEqual(values, ['inquiry-1']);
              return { data: [{
                id: 'inquiry-1', business_name: 'Example', email: 'customer@example.test',
                leak_description: 'Missed calls', source: 'website_audit', created_at: '2026-08-09T10:00:00Z',
                triage_priority: 'normal', triage_summary: 'Review', triage_needs_human: false
              }], error: null };
            }
          };
        }
      };
    }
  };
  const store = createSupabaseNotificationStore(supabase);
  const claimed = await store.claim({ workerId: 'worker-1', provider: 'resend', limit: 99, inquiryId: 'inquiry-1', eventId: 'event-1' });
  assert.equal(claimed[0].attemptId, 'attempt-1');
  assert.deepEqual(calls[0], ['claim_notification_events', {
    p_worker_id: 'worker-1', p_provider: 'resend', p_limit: 10, p_inquiry_id: 'inquiry-1', p_event_id: 'event-1'
  }]);
  const inquiries = await store.getInquiries(['inquiry-1']);
  assert.equal(inquiries.get('inquiry-1').businessName, 'Example');
  assert.equal(await store.finish({
    eventId: 'event-1', attemptId: 'attempt-1', outcome: 'accepted_by_provider',
    providerEventId: 'email-1', retryable: false
  }), 'accepted_by_provider');
  assert.deepEqual(calls[1], ['finish_notification_attempt', {
    p_event_id: 'event-1', p_attempt_id: 'attempt-1', p_outcome: 'accepted_by_provider',
    p_provider_message_id: 'email-1', p_safe_error_code: null, p_retryable: false
  }]);
  assert.equal(await store.queuePriority('inquiry-1'), 'priority-event-1');
  assert.deepEqual(calls[2], ['queue_priority_lead_notification', { p_inquiry_id: 'inquiry-1' }]);
  assert.equal(await store.recordProviderEvent({
    provider: 'resend', providerEventId: 'webhook-1', eventType: 'email.delivered',
    providerMessageId: 'email-1', occurredAt: '2026-08-09T11:00:00Z'
  }), true);
  assert.deepEqual(calls[3], ['record_notification_provider_event', {
    p_provider: 'resend', p_provider_event_id: 'webhook-1', p_event_type: 'email.delivered',
    p_provider_message_id: 'email-1', p_occurred_at: '2026-08-09T11:00:00Z'
  }]);
});

test('Supabase store exposes only a safe database code on errors', async () => {
  const store = createSupabaseNotificationStore({
    rpc: async () => ({ data: null, error: { code: '42501', message: 'private detail' } }),
    from: () => ({})
  });
  await assert.rejects(
    store.claim({ workerId: 'worker', provider: 'resend', limit: 1 }),
    (error) => error.message === 'notification_claim_failed' && error.safeCode === '42501'
  );
});
