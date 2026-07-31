import assert from 'node:assert/strict';
import test from 'node:test';
import { parseAuditPayload } from '../lib/audit-validation.mjs';

test('accepts a valid audit request', () => {
  const result = parseAuditPayload({ business: 'Acme Services', email: 'owner@example.com', leak: 'Leads arrive after hours and no one owns the follow-up.', consent: true, website: '' });
  assert.equal(result.success, true);
});

test('rejects invalid, unconsented, and honeypot submissions', () => {
  for (const payload of [
    { business: 'A', email: 'bad', leak: 'short', consent: false, website: '' },
    { business: 'Acme Services', email: 'owner@example.com', leak: 'This is enough detail to pass length validation.', consent: true, website: 'bot' }
  ]) assert.equal(parseAuditPayload(payload).success, false);
});
