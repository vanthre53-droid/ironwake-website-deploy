import test from 'node:test';
import assert from 'node:assert/strict';
import { chatCompletion, buildChatSystemPrompt } from './ai-chat.mjs';
import { PRICING_OFFERS } from './pricing.mjs';

function okFetch(content, { status = 200, baseRespStatus = 0 } = {}) {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({
      base_resp: { status_code: baseRespStatus },
      choices: [{ message: { content: typeof content === 'string' ? content : JSON.stringify(content) } }]
    })
  });
}

const goodReply = {
  reply: 'IronWake starts with a Business Leak Audit (India ₹799, International $29).',
  needs_human: false,
  handoff: false,
  priority: 'normal',
  category: 'inquiry',
  summary: 'Visitor asked pricing.',
  confidence: 'high'
};

test('chatCompletion returns unconfigured when apiKey missing', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'hi' }],
    { apiKey: '', fetchImpl: okFetch(goodReply) }
  );
  assert.equal(result.status, 'unconfigured');
  assert.equal(result.handoff, true);
});

test('chatCompletion returns complete with parsed reply on success', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'What is IronWake?' }],
    { apiKey: 'sk-test', model: 'MiniMax-M3', baseUrl: 'https://api.minimax.io/v1', fetchImpl: okFetch(goodReply) }
  );
  assert.equal(result.status, 'complete');
  assert.equal(result.reply, goodReply.reply);
  assert.equal(result.provider, 'minimax');
});

test('chatCompletion returns invalid_output when provider emits non-JSON', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'hello' }],
    { apiKey: 'sk-test', model: 'MiniMax-M3', baseUrl: 'https://api.minimax.io/v1', fetchImpl: okFetch('not json at all') }
  );
  assert.equal(result.status, 'provider_error');
  assert.equal(result.safe_error_code, 'invalid_output');
});

test('chatCompletion returns provider_error on 5xx', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'hello' }],
    {
      apiKey: 'sk-test',
      model: 'MiniMax-M3',
      baseUrl: 'https://api.minimax.io/v1',
      fetchImpl: okFetch(goodReply, { status: 503, baseRespStatus: 1024 })
    }
  );
  assert.equal(result.status, 'provider_error');
  assert.equal(result.safe_error_code, 'provider_unavailable');
});

test('chatCompletion returns provider_error on 401', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'hello' }],
    {
      apiKey: 'sk-test',
      model: 'MiniMax-M3',
      baseUrl: 'https://api.minimax.io/v1',
      fetchImpl: okFetch(goodReply, { status: 401 })
    }
  );
  assert.equal(result.status, 'provider_error');
  assert.equal(result.safe_error_code, 'provider_auth_error');
});

test('chatCompletion returns invalid_input on empty messages', async () => {
  const result = await chatCompletion([], { apiKey: 'sk-test', fetchImpl: okFetch(goodReply) });
  assert.equal(result.status, 'invalid_input');
});

test('chatCompletion truncates message content to 1000 chars per message', async () => {
  let captured;
  const fakeFetch = async (url, opts) => {
    captured = JSON.parse(opts.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        base_resp: { status_code: 0 },
        choices: [{ message: { content: JSON.stringify(goodReply) } }]
      })
    };
  };
  const long = 'x'.repeat(5000);
  await chatCompletion(
    [{ role: 'user', content: long }],
    { apiKey: 'sk-test', model: 'MiniMax-M3', baseUrl: 'https://api.minimax.io/v1', fetchImpl: fakeFetch }
  );
  const userMsg = captured.messages.find((m) => m.role === 'user');
  assert.equal(userMsg.content.length, 1000);
});

test('buildChatSystemPrompt embeds every canonical offer', () => {
  const prompt = buildChatSystemPrompt();
  for (const offer of PRICING_OFFERS) {
    assert.match(prompt, new RegExp(offer.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.ok(prompt.includes(offer.india[0]), `missing ${offer.india[0]} for ${offer.name}`);
    assert.ok(prompt.includes(offer.intl[0]), `missing ${offer.intl[0]} for ${offer.name}`);
  }
});

test('chatCompletion returns complete and routes provider name for minimax baseUrl', async () => {
  const result = await chatCompletion(
    [{ role: 'user', content: 'How much is RapidPulse?' }],
    { apiKey: 'sk-test', model: 'MiniMax-M3', baseUrl: 'https://api.minimax.io/v1', fetchImpl: okFetch(goodReply) }
  );
  assert.equal(result.provider, 'minimax');
});
