import assert from 'node:assert/strict';
import test from 'node:test';
import { submitAudit } from './submit-audit.mjs';

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  };
}

function captureFetch(impl) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return impl({ url, init });
  };
  return { fetchImpl, calls };
}

const validPayload = {
  business: 'Acme',
  email: 'qa@example.com',
  leak: 'inquiry often loses ownership at booking',
  consent: true,
  website: ''
};

test('201 + valid JSON -> success UI, single POST, form reset, no error overlay', async () => {
  const { fetchImpl, calls } = captureFetch(() =>
    jsonResponse(201, { received: true, message: 'We received your request.' })
  );
  let resetCalls = 0;
  const form = { reset: () => { resetCalls += 1; } };
  const ui = await submitAudit({ payload: validPayload, fetchImpl, form });
  assert.equal(ui.status, 'success');
  assert.equal(ui.message, 'We received your request.');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/audit');
  assert.equal(calls[0].init.method, 'POST');
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.consent, true);
  assert.equal(body.business, 'Acme');
  assert.equal(resetCalls, 1);
  assert.ok(!ui.message.toLowerCase().includes('could not be sent'));
});

test('400 + safe API error -> error UI shows server message, no success overlay', async () => {
  const { fetchImpl } = captureFetch(() =>
    jsonResponse(400, { error: 'Check the required fields and try again.' })
  );
  const form = { reset: () => { throw new Error('must not be called on error'); } };
  const ui = await submitAudit({ payload: validPayload, fetchImpl, form });
  assert.equal(ui.status, 'error');
  assert.equal(ui.message, 'Check the required fields and try again.');
});

test('429 -> rate-limit server message preserved', async () => {
  const { fetchImpl } = captureFetch(() =>
    jsonResponse(429, {
      error: 'You are sending requests too quickly. Please wait a moment and try again.'
    })
  );
  const ui = await submitAudit({ payload: validPayload, fetchImpl });
  assert.equal(ui.status, 'error');
  assert.match(ui.message, /too quickly/);
});

test('503 -> temporary server error preserved', async () => {
  const { fetchImpl } = captureFetch(() =>
    jsonResponse(503, { message: 'Service unavailable. Please try again shortly.' })
  );
  const ui = await submitAudit({ payload: validPayload, fetchImpl });
  assert.equal(ui.status, 'error');
  assert.match(ui.message, /unavailable|try again/i);
});

test('fetch rejection -> unambiguous network failure message', async () => {
  const fetchImpl = async () => {
    throw new TypeError('network down');
  };
  const ui = await submitAudit({ payload: validPayload, fetchImpl });
  assert.equal(ui.status, 'error');
  assert.match(ui.message, /could not reach the server/i);
});

test('201 confirmed but form.reset() throws -> success UI persists (no error overlay)', async () => {
  const { fetchImpl } = captureFetch(() =>
    jsonResponse(201, { received: true, message: 'We received your request.' })
  );
  let resetCalls = 0;
  const form = {
    reset: () => {
      resetCalls += 1;
      throw new Error('reset failure');
    }
  };
  // ponytail: this is the regression the user identified — a confirmed 201 must not
  // be silently overwritten with a fake network-failure message when post-success UI
  // bookkeeping throws.
  const ui = await submitAudit({ payload: validPayload, fetchImpl, form });
  assert.equal(resetCalls, 1);
  assert.equal(ui.status, 'success', 'success UI must remain even if reset throws');
  assert.equal(ui.message, 'We received your request.');
  assert.ok(!ui.message.toLowerCase().includes('could not be sent'));
});

test('malformed JSON body on 201 -> success message falls back to default', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 201,
    json: async () => {
      throw new SyntaxError('bad json');
    }
  });
  const ui = await submitAudit({ payload: validPayload, fetchImpl });
  assert.equal(ui.status, 'success');
  assert.match(ui.message, /received your request/i);
});

test('payload includes honeypot field empty by default (bot defence carried through)', async () => {
  const { fetchImpl, calls } = captureFetch(() =>
    jsonResponse(201, { received: true, message: 'We received your request.' })
  );
  await submitAudit({ payload: validPayload, fetchImpl });
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.website, '');
});
