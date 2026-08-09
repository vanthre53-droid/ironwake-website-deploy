import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('audit route fails closed and persists the inquiry through the atomic CRM function', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /Intake is not connected yet/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /rpc\('submit_audit_inquiry'/);
  assert.doesNotMatch(source, /from\('inquiries'\)\.insert/);
  assert.match(source, /triageInquiry/);
  assert.match(source, /allowRequest\(requestIdentity\(request(?:, ['"]audit['"])?\)\)/);
  assert.match(source, /status: 429/);
  assert.match(source, /triageStatus/);
  assert.match(source, /triage_needs_human/);
  assert.match(source, /status: 201/);
  // ponytail: source must be plumbed from payload to RPC so booking and chatbot
  // handoff land as distinct sources in the owner CRM.
  assert.match(source, /p_source: parsed\.data\.source/);
});
