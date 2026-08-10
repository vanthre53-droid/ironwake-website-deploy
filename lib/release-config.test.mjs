import assert from 'node:assert/strict';
import test from 'node:test';
import { validateReleaseConfig } from './release-config.mjs';

const valid = {
  NEXT_PUBLIC_SITE_URL: 'https://candidate.netlify.app',
  NEXT_PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'publishable-test-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-test-key',
  AI_API_BASE: 'https://api.minimax.io/v1',
  AI_API_KEY: 'minimax-test-key',
  AI_MODEL: 'MiniMax-M3',
  EMAIL_PROVIDER: 'resend',
  EMAIL_FROM: 'IronWake <onboarding@resend.dev>',
  EMAIL_NOTIFICATION_RECIPIENT: 'delivered@example.com',
  RESEND_API_KEY: 'resend-test-key',
  RESEND_WEBHOOK_SECRET: 'whsec_test'
};

test('release configuration accepts the complete intended provider contract', () => {
  assert.deepEqual(validateReleaseConfig(valid), { ok: true, missing: [], invalid: [] });
});

test('release configuration reports names only for missing configuration', () => {
  const result = validateReleaseConfig({ ...valid, AI_API_KEY: '', RESEND_WEBHOOK_SECRET: '' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, ['AI_API_KEY', 'RESEND_WEBHOOK_SECRET']);
  assert.deepEqual(result.invalid, []);
});

test('release configuration rejects wrong host and provider values', () => {
  const result = validateReleaseConfig({
    ...valid,
    NEXT_PUBLIC_SITE_URL: 'http://candidate.netlify.app/path',
    AI_API_BASE: 'https://wrong.example/v1',
    AI_MODEL: 'other-model',
    EMAIL_PROVIDER: 'other',
    EMAIL_NOTIFICATION_RECIPIENT: 'bad\nrecipient@example.com'
  });
  assert.equal(result.ok, false);
  assert.deepEqual(result.invalid.sort(), ['AI_API_BASE', 'AI_MODEL', 'EMAIL_NOTIFICATION_RECIPIENT', 'EMAIL_PROVIDER', 'NEXT_PUBLIC_SITE_URL']);
});
