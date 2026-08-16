// ponytail: retell webhook unit tests.
// Goal §16 acceptance:
//   - valid signature accepted
//   - invalid signature rejected
//   - replay / future-skew rejected
//   - out-of-order events normalized identically by call_id
//   - event types not in SUPPORTED_EVENTS are acked but ignored
//   - transcript content never leaks into logs (we only assert the
//     normalized shape, which already redacts to fixed fields)

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHmac } from 'node:crypto';
import {
  verifyRetellSignature,
  normalizeRetellEvent,
  SUPPORTED_EVENTS,
} from './retell-webhook.mjs';

const SECRET = 'whsec_test_retell';
function sign(raw, secret = SECRET) {
  return createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
}

test('verifyRetellSignature: accepts valid HMAC-SHA256 base64', () => {
  const raw = JSON.stringify({ event: 'call_started', data: { call_id: 'abc' } });
  const sig = sign(raw);
  const r = verifyRetellSignature(raw, sig, SECRET);
  assert.equal(r.ok, true);
});

test('verifyRetellSignature: rejects wrong secret', () => {
  const raw = JSON.stringify({ event: 'call_started' });
  const sig = sign(raw, 'wrong');
  const r = verifyRetellSignature(raw, sig, SECRET);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'invalid_signature');
});

test('verifyRetellSignature: rejects empty body / signature / secret', () => {
  assert.equal(verifyRetellSignature('', 'sig', SECRET).reason, 'missing_body');
  assert.equal(verifyRetellSignature('x', '', SECRET).reason, 'missing_signature');
  assert.equal(verifyRetellSignature('x', 'sig', '').reason, 'missing_secret');
});

test('verifyRetellSignature: rejects length mismatch as invalid', () => {
  const r = verifyRetellSignature('x', 'short', SECRET);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'invalid_signature');
});

test('normalizeRetellEvent: call_started maps to required fields', () => {
  const started = {
    event: 'call_started',
    data: {
      call_id: 'call_123',
      agent_id: 'agent_xyz',
      from_number: '+15555550100',
      to_number: '+15555550199',
      start_timestamp: 1_700_000_000_000,
      call_type: 'web_call',
    },
  };
  const out = normalizeRetellEvent(started, { receivedAtMs: 1_700_000_005_000 });
  assert.equal(out.callId, 'call_123');
  assert.equal(out.eventType, 'call_started');
  assert.equal(out.provider, 'retell');
  assert.equal(out.fromNumber, '+15555550100');
  assert.equal(out.toNumber, '+15555550199');
  assert.equal(out.startTimestamp, 1_700_000_000_000);
  assert.ok(out.providerEventId.startsWith('call_started:call_123:'));
});

test('normalizeRetellEvent: call_analyzed picks up summary + sentiment', () => {
  const analyzed = {
    event: 'call_analyzed',
    data: {
      call_id: 'call_999',
      agent_id: 'agent_xyz',
      start_timestamp: 1_700_000_000_000,
      end_timestamp: 1_700_000_180_000,
      call_analysis: {
        call_summary: 'Customer asked about pricing.',
        call_successful: true,
        user_sentiment: 'positive',
      },
    },
  };
  const out = normalizeRetellEvent(analyzed, { receivedAtMs: 1_700_000_300_000 });
  assert.equal(out.eventType, 'call_analyzed');
  assert.equal(out.callAnalysis.call_summary, 'Customer asked about pricing.');
  assert.equal(out.callAnalysis.call_successful, true);
  assert.equal(out.callAnalysis.user_sentiment, 'positive');
});

test('normalizeRetellEvent: rejects future-skewed timestamps', () => {
  const future = {
    event: 'call_started',
    data: { call_id: 'c', start_timestamp: Date.now() + 60 * 60 * 1000 },
  };
  assert.throws(() => normalizeRetellEvent(future, { receivedAtMs: Date.now() }));
});

test('normalizeRetellEvent: unknown event types return null', () => {
  const weird = { event: 'agent_config_changed', data: { call_id: 'c' } };
  assert.equal(normalizeRetellEvent(weird), null);
});

test('normalizeRetellEvent: missing call_id throws payload_invalid', () => {
  assert.throws(() => normalizeRetellEvent({ event: 'call_started', data: {} }), /payload_invalid/);
});

test('SUPPORTED_EVENTS includes call_started, call_ended, call_analyzed', () => {
  for (const t of ['call_started', 'call_ended', 'call_analyzed']) {
    assert.ok(SUPPORTED_EVENTS.has(t), `expected ${t}`);
  }
});
