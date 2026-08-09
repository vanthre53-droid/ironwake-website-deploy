import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  isRetryableNotification,
  latestNotificationAttempt,
  notificationStatusDescription
} from './notification-operations.mjs';

test('admin operations fail closed through server whoami before private reads', async () => {
  const source = await readFile(new URL('./AdminDashboard.js', import.meta.url), 'utf8');
  assert.match(source, /getSession/);
  assert.match(source, /fetch\('\/api\/owner\/whoami'/);
  assert.match(source, /authorization:\s*`Bearer \$\{session\.access_token\}`/);
  assert.match(source, /!authorization\.allowed/);
  assert.match(source, /authorization\.allowed, refreshKey/);
  assert.match(source, /This account is not authorized to view notification operations/);
  assert.ok(source.indexOf("fetch('/api/owner/whoami'") < source.indexOf("from('outbox_events')"));
  assert.match(source, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('admin operations query the durable inquiry, event, and attempt fields', async () => {
  const source = await readFile(new URL('./AdminDashboard.js', import.meta.url), 'utf8');
  for (const field of [
    'business_name,source,created_at', 'notification_attempts', 'target_type',
    'retry_cycle', 'provider_message_id', 'accepted_at', 'delivered_at',
    'safe_error_code', 'available_at', 'Saved lead', 'Latest attempt',
    'Provider accepted', 'Delivered callback', 'Next available'
  ]) assert.match(source, new RegExp(field));
  assert.doesNotMatch(source, /leak_description/);
  assert.match(source, /notification-readiness/);
  assert.match(source, /Queued events have not been sent/);
});

test('owner retry uses only the authorized RPC and never browser table writes', async () => {
  const source = await readFile(new URL('./AdminDashboard.js', import.meta.url), 'utf8');
  assert.match(source, /rpc\('owner_retry_notification', \{ p_event_id: event\.id \}\)/);
  assert.match(source, /isRetryableNotification\(event\)/);
  assert.match(source, /does not mean it was sent or delivered/);
  assert.doesNotMatch(source, /\.(update|delete|insert)\(/);
});

test('retry eligibility denies legacy and active states and permits only terminal non-legacy events', () => {
  assert.equal(isRetryableNotification({ status: 'dead_letter', target_type: 'owner', event_type: 'owner_new_audit' }), true);
  assert.equal(isRetryableNotification({ status: 'cancelled', target_type: 'customer', event_type: 'customer_audit_received' }), true);
  assert.equal(isRetryableNotification({ status: 'cancelled', target_type: 'legacy', event_type: 'inquiry_received' }), false);
  assert.equal(isRetryableNotification({ status: 'queued', target_type: 'owner', event_type: 'owner_new_audit' }), false);
  assert.equal(isRetryableNotification({ status: 'delivered', target_type: 'owner', event_type: 'owner_new_audit' }), false);
});

test('attempt and status helpers distinguish provider acceptance from delivery', () => {
  const latest = latestNotificationAttempt([
    { retry_cycle: 0, attempt_number: 3, status: 'failed' },
    { retry_cycle: 1, attempt_number: 1, status: 'accepted_by_provider' }
  ]);
  assert.equal(latest.status, 'accepted_by_provider');
  assert.match(notificationStatusDescription('accepted_by_provider'), /Delivery is still pending/);
  assert.match(notificationStatusDescription('delivered'), /signature-verified provider callback/);
  assert.notEqual(notificationStatusDescription('accepted_by_provider'), notificationStatusDescription('delivered'));
});
