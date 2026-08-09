import assert from 'node:assert/strict';
import test from 'node:test';
import { renderNotification } from './templates.mjs';

const config = {
  from: 'IronWake <notify@example.test>',
  replyTo: 'hello@example.test',
  ownerRecipient: 'owner@example.test'
};
const inquiry = {
  id: 'inquiry-123',
  businessName: '<script>alert("x")</script> & Co\r\nBcc: bad@example.test',
  email: 'customer@example.test',
  leakDescription: '<img src=x onerror=alert(1)>\nMissed calls',
  source: 'website_booking',
  createdAt: '2026-08-09T10:00:00.000Z',
  triagePriority: 'high',
  triageSummary: '<b>Review</b>',
  triageNeedsHuman: true
};

test('owner templates include operational fields and HTML-escape all untrusted values', () => {
  const message = renderNotification({ eventType: 'owner_new_booking_request', targetType: 'owner' }, inquiry, config);
  assert.equal(message.to, 'owner@example.test');
  assert.match(message.text, /Business:/);
  assert.match(message.text, /Contact email: customer@example\.test/);
  assert.match(message.text, /Request detail:/);
  assert.doesNotMatch(message.subject, /[\r\n]/);
  assert.doesNotMatch(message.html, /<script>|<img|<b>Review/);
  assert.match(message.html, /&lt;script&gt;/);
  assert.match(message.html, /&lt;img/);
});

test('customer booking acknowledgement uses exact request-received wording and denies confirmation', () => {
  const message = renderNotification({ eventType: 'customer_booking_request_received', targetType: 'customer' }, inquiry, config);
  assert.equal(message.to, 'customer@example.test');
  assert.match(message.subject, /^BOOKING REQUEST RECEIVED/);
  assert.match(message.text, /BOOKING REQUEST RECEIVED/);
  assert.match(message.text, /No appointment is confirmed/);
  assert.doesNotMatch(message.text, /appointment is confirmed\./i);
});

test('templates reject unknown event types, target mismatches, and unsafe recipients', () => {
  assert.throws(() => renderNotification({ eventType: 'unknown', targetType: 'customer' }, inquiry, config), /notification_event_invalid/);
  assert.throws(() => renderNotification({ eventType: 'owner_new_audit', targetType: 'customer' }, inquiry, config), /notification_event_invalid/);
  assert.throws(() => renderNotification(
    { eventType: 'customer_audit_received', targetType: 'customer' },
    { ...inquiry, email: 'safe@example.test\nBcc:other@example.test' },
    config
  ), /notification_recipient_invalid/);
});
