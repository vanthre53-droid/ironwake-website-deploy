import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAuditPayload } from './audit-validation.mjs';

const valid = {
  business: 'Acme',
  email: 'qa@example.com',
  leak: 'inquiry often loses ownership at booking',
  consent: true,
  website: ''
};

test('accepts website_audit source explicitly', () => {
  const r = parseAuditPayload({ ...valid, source: 'website_audit' });
  assert.equal(r.success, true);
  assert.equal(r.data.source, 'website_audit');
});

test('accepts website_booking source and routes through unchanged', () => {
  const r = parseAuditPayload({ ...valid, source: 'website_booking' });
  assert.equal(r.success, true);
  assert.equal(r.data.source, 'website_booking');
});

test('accepts chatbot_handoff source', () => {
  const r = parseAuditPayload({ ...valid, source: 'chatbot_handoff' });
  assert.equal(r.success, true);
  assert.equal(r.data.source, 'chatbot_handoff');
});

test('defaults source to website_audit when omitted', () => {
  const r = parseAuditPayload(valid);
  assert.equal(r.success, true);
  assert.equal(r.data.source, 'website_audit');
});

test('rejects unknown source and falls back to website_audit (failsafe)', () => {
  const r = parseAuditPayload({ ...valid, source: 'not_real' });
  assert.equal(r.success, true);
  assert.equal(r.data.source, 'website_audit');
});
