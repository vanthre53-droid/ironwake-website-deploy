import assert from 'node:assert/strict';
import test from 'node:test';
import { triageInquiry } from './ai-triage.mjs';

test('AI triage fails closed when no provider is configured', async () => {
  const result = await triageInquiry(
    { business: 'Acme', email: 'owner@example.com', leak: 'New inquiries are not followed up.' },
    { apiKey: undefined }
  );

  assert.deepEqual(result, {
    status: 'unconfigured',
    needs_human: true,
    priority: 'normal',
    category: 'other',
    summary: 'AI triage is not configured.',
    suggested_reply: ''
  });
});

test('AI triage accepts the provider structured response', async () => {
  const fetchImpl = async (url, options) => {
    assert.match(url, /\/chat\/completions$/);
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'MiniMax-M3');
    assert.equal(body.response_format, undefined);
    assert.equal(body.reasoning_split, true);
    assert.equal(body.max_completion_tokens, 500);
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            needs_human: false,
            priority: 'high',
            category: 'follow_up',
            summary: 'Follow-up is inconsistent.',
            suggested_reply: 'Thanks — we can help map the follow-up gap.'
          })
        }
      }]
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const result = await triageInquiry(
    { business: 'Acme', email: 'owner@example.com', leak: 'New inquiries are not followed up.' },
    { apiKey: 'test-key', fetchImpl, model: 'MiniMax-M3', baseUrl: 'https://api.minimax.io/v1/' }
  );

  assert.deepEqual(result, {
    status: 'complete',
    provider: 'minimax',
    model: 'MiniMax-M3',
    safe_error_code: null,
    needs_human: false,
    priority: 'high',
    category: 'follow_up',
    summary: 'Follow-up is inconsistent.',
    suggested_reply: 'Thanks — we can help map the follow-up gap.'
  });
});

test('AI triage extracts a valid object wrapped in provider reasoning', async () => {
  const result = await triageInquiry(
    { business: 'Acme', leak: 'Follow-up is inconsistent.' },
    {
      apiKey: 'test-key',
      fetchImpl: async () => new Response(JSON.stringify({
        choices: [{ message: { content: 'Reasoning complete.```json\n{"needs_human":true,"priority":"normal","category":"follow_up","summary":"Follow-up needs review.","suggested_reply":"We will review this."}\n```' } }]
      }), { status: 200 }),
      model: 'MiniMax-M3',
      baseUrl: 'https://api.minimax.io/v1'
    }
  );
  assert.equal(result.status, 'complete');
  assert.equal(result.needs_human, true);
  assert.equal(result.category, 'follow_up');
});

test('AI triage classifies MiniMax timeout, provider error, and invalid output without network access', async () => {
  const input = { business: 'Acme', leak: 'New inquiries are not followed up.' };
  const timeout = await triageInquiry(input, {
    apiKey: 'test-key',
    fetchImpl: async () => { const error = new Error('aborted'); error.name = 'AbortError'; throw error; }
  });
  const unavailable = await triageInquiry(input, {
    apiKey: 'test-key',
    fetchImpl: async () => new Response(JSON.stringify({ base_resp: { status_code: 1024 } }), { status: 500 })
  });
  const invalid = await triageInquiry(input, {
    apiKey: 'test-key',
    fetchImpl: async () => new Response(JSON.stringify({ choices: [{ message: { content: 'not-json' } }] }), { status: 200 })
  });

  assert.equal(timeout.safe_error_code, 'provider_timeout');
  assert.equal(unavailable.safe_error_code, 'provider_unavailable');
  assert.equal(invalid.safe_error_code, 'invalid_output');
  for (const result of [timeout, unavailable, invalid]) {
    assert.equal(result.status, 'provider_error');
    assert.equal(result.provider, 'minimax');
    assert.equal(result.needs_human, true);
  }
});
