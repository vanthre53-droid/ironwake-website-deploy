import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { POST } from './route.js';

test('audit route fails closed and persists the inquiry through the atomic CRM function', async () => {
  const source = await readFile(new URL('./route.js', import.meta.url), 'utf8');
  assert.match(source, /Intake is not connected yet/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /rpc\('submit_audit_inquiry'/);
  assert.doesNotMatch(source, /from\('inquiries'\)\.insert/);
  assert.doesNotMatch(source, /error\.message|error\.details|error\.hint/);
  assert.match(source, /triageInquiry/);
  assert.match(source, /consume_request_rate_limit/);
  assert.match(source, /createHash\('sha256'\)/);
  assert.match(source, /p_window_seconds: 900/);
  assert.match(source, /content-type/);
  assert.match(source, /status: 415/);
  assert.match(source, /MAX_AUDIT_BODY_BYTES/);
  assert.match(source, /status: 413/);
  assert.match(source, /status: 429/);
  assert.match(source, /triageStatus/);
  assert.match(source, /triage_needs_human/);
  assert.match(source, /triage_provider/);
  assert.match(source, /triage_error_code/);
  assert.match(source, /triage_attempted_at/);
  assert.match(source, /triageStorageError/);
  assert.match(source, /triage persistence failed/);
  assert.match(source, /createSupabaseNotificationStore/);
  assert.match(source, /needsPriorityAlert\(triage\)/);
  assert.match(source, /queuePriority\(inquiryId\)/);
  assert.match(source, /runNotificationWorkerBestEffort/);
  assert.match(source, /inquiryId,[\s\S]*?limit: 10/);
  assert.match(source, /notificationResult\.status === 'worker_error'/);
  assert.ok(source.indexOf('runNotificationWorkerBestEffort') < source.lastIndexOf('status: 201'));
  assert.match(source, /status: 201/);
  // ponytail: source must be plumbed from payload to RPC so booking and chatbot
  // handoff land as distinct sources in the owner CRM.
  assert.match(source, /p_source: parsed\.data\.source/);
});

test('audit route rejects non-JSON before any backend dependency', async () => {
  const response = await POST(new Request('http://localhost/api/audit', { method: 'POST', body: 'name=test', headers: { 'content-type': 'application/x-www-form-urlencoded' } }));
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: 'Send a JSON request.' });
});

test('audit route rejects lookalike content types and malformed JSON before any backend dependency', async () => {
  const lookalike = await POST(new Request('http://localhost/api/audit', { method: 'POST', body: '{}', headers: { 'content-type': 'text/application/json' } }));
  assert.equal(lookalike.status, 415);
  assert.deepEqual(await lookalike.json(), { error: 'Send a JSON request.' });

  const malformed = await POST(new Request('http://localhost/api/audit', { method: 'POST', body: '{not-json', headers: { 'content-type': 'application/json; charset=utf-8' } }));
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: 'Send a valid JSON request.' });
});

test('audit route rejects an oversized JSON body before any backend dependency', async () => {
  const response = await POST(new Request('http://localhost/api/audit', { method: 'POST', body: JSON.stringify({ leak: 'x'.repeat(20_000) }), headers: { 'content-type': 'application/json' } }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: 'Request is too large.' });
});
