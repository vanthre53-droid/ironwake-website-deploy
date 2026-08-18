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

test('rejects control characters while retaining ordinary Unicode input', () => {
  for (const payload of [
    { ...valid, business: 'Acme\u0000Services' },
    { ...valid, email: 'qa\n@example.com' },
    { ...valid, leak: 'A valid-looking leak\rwith a forbidden control character.' },
    { ...valid, source: 'website_audit\u007f' }
  ]) assert.equal(parseAuditPayload(payload).success, false);

  const unicode = parseAuditPayload({ ...valid, business: 'नमस्ते Services', leak: 'Enquiries are missed after hours in Hyderabad.' });
  assert.equal(unicode.success, true);
});

test('accepts a known pricing offer + tier and lower-cases the tier', () => {
  const r = parseAuditPayload({ ...valid, offer: 'recovery-retainer', tier: 'Standard' });
  assert.equal(r.success, true);
  assert.equal(r.data.offer, 'recovery-retainer');
  assert.equal(r.data.tier, 'standard');
});

test('drops unknown offer and tier values silently (server is the source of truth)', () => {
  const r = parseAuditPayload({ ...valid, offer: 'fake-offer', tier: 'platinum' });
  assert.equal(r.success, true);
  assert.equal(r.data.offer, null);
  assert.equal(r.data.tier, null);
});
