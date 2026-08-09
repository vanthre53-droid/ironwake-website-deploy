import assert from 'node:assert/strict';
import test from 'node:test';
import { readNotificationConfig } from './config.mjs';

test('notification configuration fails closed until every server-only field is valid', () => {
  assert.deepEqual(readNotificationConfig({}), {
    configured: false,
    safeErrorCode: 'email_provider_unconfigured'
  });
  assert.equal(readNotificationConfig({ EMAIL_PROVIDER: 'resend' }).safeErrorCode, 'email_api_key_missing');
  assert.equal(readNotificationConfig({
    EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-only', EMAIL_FROM: 'bad\naddress', EMAIL_NOTIFICATION_RECIPIENT: 'owner@example.test'
  }).safeErrorCode, 'email_from_invalid');
});

test('notification configuration accepts a display-name sender without exposing a browser variable', () => {
  const result = readNotificationConfig({
    EMAIL_PROVIDER: 'resend',
    RESEND_API_KEY: 'test-only',
    EMAIL_FROM: 'IronWake <notify@example.test>',
    EMAIL_REPLY_TO: 'hello@example.test',
    EMAIL_NOTIFICATION_RECIPIENT: 'owner@example.test'
  });
  assert.equal(result.configured, true);
  assert.equal(result.provider, 'resend');
  assert.equal(result.ownerRecipient, 'owner@example.test');
});
