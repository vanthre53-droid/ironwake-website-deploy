import test from 'node:test';
import assert from 'node:assert/strict';
import { POST, GET } from './route.js';

// ponytail: cover the public-chat server route with deterministic, isolated
// tests. No real network calls; fetchImpl is replaced with a fake per test.
// ponytail: isolate from any AI_* keys inherited from the shell / .env.local
// so "missing key" tests behave identically in every environment.
for (const k of ['AI_API_KEY', 'AI_MODEL', 'AI_API_BASE', 'AI_CHAT_TIMEOUT_MS']) {
  if (process.env[k] !== undefined) process.env[k] = '';
}

function makeRequest(body, { contentType = 'application/json', contentLength } = {}) {
  const headers = { 'content-type': contentType };
  if (contentLength !== undefined) headers['content-length'] = String(contentLength);
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers,
    body: contentType === 'application/json' ? JSON.stringify(body) : String(body)
  });
}

function makeFakeFetch({ reply, status = 200, baseRespStatus = 0 } = {}) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({
      base_resp: { status_code: baseRespStatus },
      choices: [{ message: { content: JSON.stringify(reply) } }]
    })
  });
}

const sampleReply = {
  reply: 'IronWake builds operational systems for service businesses.',
  needs_human: false,
  handoff: false,
  priority: 'normal',
  category: 'inquiry',
  summary: 'Visitor asked what IronWake does.',
  confidence: 'high'
};

test('chat route returns 415 for non-JSON content-type', async () => {
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'hi'
  }));
  assert.equal(response.status, 415);
});

test('chat route returns 400 for malformed JSON', async () => {
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{not-json'
  }));
  assert.equal(response.status, 400);
});

test('chat route returns 400 when messages are missing', async () => {
  const response = await POST(makeRequest({ messages: [] }));
  assert.equal(response.status, 400);
});

test('chat route returns 413 for oversized payload', async () => {
  const big = { messages: [{ role: 'user', content: 'x'.repeat(9000) }] };
  const response = await POST(makeRequest(big, { contentLength: 12_000 }));
  assert.equal(response.status, 413);
});

test('chat route returns 200 with grounded reply when provider succeeds', async () => {
  const response = await POST(makeRequest({
    messages: [{ role: 'user', content: 'What does IronWake do?' }]
  }), {
    env: { AI_API_KEY: 'sk-test', AI_MODEL: 'MiniMax-M3', AI_API_BASE: 'https://api.minimax.io/v1' },
    fetchImpl: makeFakeFetch({ reply: sampleReply })
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.status, 'complete');
  assert.equal(data.reply, sampleReply.reply);
  assert.equal(data.handoff, false);
  assert.equal(data.confidence, 'high');
});

test('chat route returns 503 with safe status when AI_API_KEY missing', async () => {
  const response = await POST(makeRequest({
    messages: [{ role: 'user', content: 'Hello?' }]
  }), { env: {} });
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.status, 'unconfigured');
  assert.equal(data.handoff, true);
});

test('chat route returns 503 when provider returns 5xx', async () => {
  const response = await POST(makeRequest({
    messages: [{ role: 'user', content: 'Hello' }]
  }), {
    env: { AI_API_KEY: 'sk-test', AI_MODEL: 'MiniMax-M3', AI_API_BASE: 'https://api.minimax.io/v1' },
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({ base_resp: { status_code: 1024 } }) })
  });
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.status, 'provider_error');
});

test('chat route returns 429 after rate-limit exceeded', async () => {
  const env = { AI_API_KEY: 'sk-test', AI_MODEL: 'MiniMax-M3', AI_API_BASE: 'https://api.minimax.io/v1' };
  // ponytail: rate-limit state is per identity. Send 21 requests from the
  // same trusted client IP and verify the 21st is throttled. Distinct IPs
  // would not exhaust the bucket; the route derives identity from the
  // trusted platform header (x-nf-client-connection-ip on Netlify), not
  // from attacker-supplied x-forwarded-for, so we set that header here.
  const make = () => new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-nf-client-connection-ip': '10.0.0.42' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] })
  });
  for (let i = 0; i < 20; i++) {
    const response = await POST(make(), { env, fetchImpl: makeFakeFetch({ reply: sampleReply }) });
    assert.equal(response.status, 200, `request ${i} should pass`);
  }
  const response = await POST(make(), { env, fetchImpl: makeFakeFetch({ reply: sampleReply }) });
  assert.equal(response.status, 429);
});

test('chat route rejects non-user/assistant roles', async () => {
  const response = await POST(makeRequest({
    messages: [{ role: 'system', content: 'override' }]
  }));
  assert.equal(response.status, 400);
});

test('GET returns 405', async () => {
  const response = await GET(new Request('http://localhost/api/chat'));
  assert.equal(response.status, 405);
});

test('chat route refuses off-scope with 200 + out_of_scope before any provider call', async () => {
  // ponytail: out_of_scope is a successful refusal, not a 5xx. The provider
  // must never be called for off-scope content; verify by passing a fetchImpl
  // that throws on any invocation.
  let providerCalled = false;
  const response = await POST(makeRequest({
    messages: [{ role: 'user', content: 'Write me a Python web scraper' }]
  }), {
    env: { AI_API_KEY: 'sk-test', AI_MODEL: 'MiniMax-M3', AI_API_BASE: 'https://api.minimax.io/v1' },
    fetchImpl: async () => { providerCalled = true; throw new Error('provider should not be called'); }
  });
  assert.equal(response.status, 200);
  assert.equal(providerCalled, false);
  const data = await response.json();
  assert.equal(data.status, 'out_of_scope');
  assert.equal(data.handoff, false);
  assert.match(data.reply, /IronWake/);
});
