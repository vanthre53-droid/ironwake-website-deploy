// lib/whatsapp/templates.test.js

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTemplateBody,
  buildTextBody,
  KNOWN_TEMPLATES
} from './templates.js';

test('buildTemplateBody accepts an en_US template with body parameter', () => {
  const result = buildTemplateBody({
    to: '+15551234567',
    templateName: 'ironwake_welcome',
    languageCode: 'en_US',
    components: [
      { type: 'body', parameters: [{ text: 'Sam' }] }
    ]
  });
  assert.equal(result.ok, true);
  assert.equal(result.body.template.name, 'ironwake_welcome');
  assert.equal(result.body.template.language.code, 'en_US');
  assert.equal(result.body.template.components[0].parameters[0].text, 'Sam');
});

test('buildTemplateBody flags an unsupported language', () => {
  const result = buildTemplateBody({
    to: '+15551234567',
    templateName: 'ironwake_welcome',
    languageCode: 'foo_bar'
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'wa_language_code_unsupported');
});

test('buildTemplateBody flags an invalid template name', () => {
  const result = buildTemplateBody({
    to: '+15551234567',
    templateName: 'has spaces',
    languageCode: 'en_US'
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'wa_template_name_invalid');
});

test('buildTemplateBody rejects missing recipient', () => {
  const result = buildTemplateBody({
    to: '',
    templateName: 'ironwake_welcome',
    languageCode: 'en_US'
  });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'wa_to_missing');
});

test('buildTemplateBody normalizes a header image component', () => {
  const result = buildTemplateBody({
    to: '+15551234567',
    templateName: 'ironwake_welcome',
    languageCode: 'en_US',
    components: [
      { type: 'header', format: 'image', parameters: [{ link: 'https://example.com/img.png' }] }
    ]
  });
  assert.equal(result.ok, true);
  assert.equal(result.body.template.components[0].format, 'image');
  assert.equal(result.body.template.components[0].parameters[0].type, 'image');
  assert.equal(result.body.template.components[0].parameters[0].link, 'https://example.com/img.png');
});

test('buildTemplateBody normalizes a button payload component', () => {
  const result = buildTemplateBody({
    to: '+15551234567',
    templateName: 'ironwake_welcome',
    languageCode: 'en_US',
    components: [
      { type: 'button', sub_type: 'quick_reply', index: 1, parameters: [{ type: 'payload', text: 'Yes', payload: 'yes-1' }] }
    ]
  });
  assert.equal(result.ok, true);
  assert.equal(result.body.template.components[0].sub_type, 'quick_reply');
  assert.equal(result.body.template.components[0].parameters[0].payload, 'yes-1');
});

test('buildTextBody refuses a missing body', () => {
  const result = buildTextBody({ to: '+15551234567', body: '' });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'wa_body_missing');
});

test('buildTextBody refuses too long text', () => {
  const huge = 'x'.repeat(4097);
  const result = buildTextBody({ to: '+15551234567', body: huge });
  assert.equal(result.ok, false);
  assert.equal(result.safeErrorCode, 'wa_body_too_long');
});

test('buildTextBody sets preview_url correctly', () => {
  const result = buildTextBody({ to: '+15551234567', body: 'hi', previewUrl: true });
  assert.equal(result.ok, true);
  assert.equal(result.body.text.preview_url, true);
});

test('KNOWN_TEMPLATES is read-only and pending (never registered)', () => {
  assert.ok(Object.isFrozen(KNOWN_TEMPLATES));
  assert.ok(KNOWN_TEMPLATES.length >= 3);
  for (const tmpl of KNOWN_TEMPLATES) {
    assert.equal(tmpl.status, 'pending');
  }
});
