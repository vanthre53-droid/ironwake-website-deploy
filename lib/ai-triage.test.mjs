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
    assert.equal(body.model, 'test-model');
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
    { apiKey: 'test-key', fetchImpl, model: 'test-model' }
  );

  assert.deepEqual(result, {
    status: 'complete',
    needs_human: false,
    priority: 'high',
    category: 'follow_up',
    summary: 'Follow-up is inconsistent.',
    suggested_reply: 'Thanks — we can help map the follow-up gap.'
  });
});
