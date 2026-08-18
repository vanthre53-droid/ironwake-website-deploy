// lib/whatsapp/parse.test.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  messageKey,
  routingMeta,
  parseInboundMessages,
  parseStatusUpdates,
  detectOptOut
} from './parse.js';

test('messageKey returns wamid for inbound messages', () => {
  const payload = {
    entry: [{ changes: [{ value: { messages: [{ id: 'wamid-xyz' }] } }] }]
  };
  assert.equal(messageKey(payload), 'wamid:wamid-xyz');
});

test('messageKey returns status-prefixed key for status updates', () => {
  const payload = {
    entry: [{ changes: [{ value: { statuses: [{ id: 'wamid-abc' }] } }] }]
  };
  assert.equal(messageKey(payload), 'status:wamid-abc');
});

test('messageKey returns null on a malformed payload', () => {
  assert.equal(messageKey(null), null);
  assert.equal(messageKey({}), null);
});

test('routingMeta reads waba id + display number + field', () => {
  const payload = {
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          metadata: { phone_number_id: '12345', display_phone_number: '+15551234567' }
        }
      }]
    }]
  };
  const r = routingMeta(payload);
  assert.equal(r.wabaId, '12345');
  assert.equal(r.displayPhoneNumber, '+15551234567');
  assert.equal(r.field, 'messages');
});

test('parseInboundMessages extracts text body and profile name', () => {
  const payload = {
    entry: [{
      changes: [{
        value: {
          messages: [{
            id: 'wamid-1',
            from: '+15551234567',
            timestamp: '1700000000',
            type: 'text',
            text: { body: 'hello' }
          }],
          contacts: [{
            wa_id: '+15551234567',
            profile: { name: 'Sam' }
          }]
        }
      }]
    }]
  };
  const out = parseInboundMessages(payload);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 'wamid-1');
  assert.equal(out[0].from, '+15551234567');
  assert.equal(out[0].body, 'hello');
  assert.equal(out[0].profileName, 'Sam');
});

test('parseInboundMessages returns image summary for image type', () => {
  const payload = {
    entry: [{
      changes: [{
        value: {
          messages: [{
            id: 'wamid-2',
            from: '+15551234567',
            timestamp: '1700000000',
            type: 'image',
            image: { id: 'media-id', mime_type: 'image/png', sha256: 'abc' }
          }]
        }
      }]
    }]
  };
  const out = parseInboundMessages(payload);
  assert.equal(out[0].type, 'image');
  assert.equal(out[0].body.kind, 'image');
  assert.equal(out[0].body.mediaId, 'media-id');
});

test('parseStatusUpdates extracts status + errors', () => {
  const payload = {
    entry: [{
      changes: [{
        value: {
          statuses: [{
            id: 'wamid-z',
            recipient_id: '+15559999999',
            status: 'delivered',
            timestamp: '1700000000',
            errors: [
              { code: 131051, title: 'Template unregistered', message: '...' }
            ]
          }]
        }
      }]
    }]
  };
  const out = parseStatusUpdates(payload);
  assert.equal(out.length, 1);
  assert.equal(out[0].name, 'delivered');
  assert.equal(out[0].errors[0].code, 131051);
});

test('detectOptOut stops on STOP keywords', () => {
  const payload = {
    entry: [{ changes: [{ value: { messages: [{
      id: 'wamid-stop',
      from: '+15551234567',
      timestamp: '1700000000',
      type: 'text',
      text: { body: 'STOP' }
    }] } }] }]
  };
  const o = detectOptOut(payload);
  assert.equal(o?.keyword, 'stop');
  assert.equal(o?.wamid, 'wamid-stop');
});

test('detectOptOut ignores normal text', () => {
  const payload = {
    entry: [{ changes: [{ value: { messages: [{
      id: 'wamid-x',
      from: '+15551234567',
      timestamp: '1700000000',
      type: 'text',
      text: { body: 'please send invoice' }
    }] } }] }]
  };
  assert.equal(detectOptOut(payload), null);
});

test('empty / malformed payloads do not throw', () => {
  assert.deepEqual(parseInboundMessages(null), []);
  assert.deepEqual(parseStatusUpdates({}), []);
  assert.equal(detectOptOut({}), null);
});
