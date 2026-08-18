// lib/whatsapp/business-profile.test.js
//
// ponytail: tests for the WhatsApp Business profile payload shape used
// by Graph `POST /{phone-id}/whatsapp_business_profile`. The test file
// doubles as a contract: every failure mode Meta documents is also a
// documented test case, with the diagnostic field shape mirrored so
// calling code can render it directly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBusinessProfile,
  diffBusinessProfile,
  normalizeGraphProfile,
  EMPTY_PROFILE,
  VERTICALS,
  __internals
} from './business-profile.js';

test('EMPTY_PROFILE is a frozen, documented shape', () => {
  assert.equal(typeof EMPTY_PROFILE, 'object');
  assert.equal(EMPTY_PROFILE.about, '');
  assert.equal(EMPTY_PROFILE.address, '');
  assert.equal(EMPTY_PROFILE.email, '');
  assert.equal(EMPTY_PROFILE.description, '');
  assert.equal(EMPTY_PROFILE.vertical, '');
  assert.equal(EMPTY_PROFILE.profile_pic_url, '');
  assert.deepEqual(EMPTY_PROFILE.websites, []);
  assert.equal(Object.isFrozen(EMPTY_PROFILE), true);
  assert.equal(Object.isFrozen(EMPTY_PROFILE.websites), true);
});

test('VERTICALS includes the documented Meta catalog', () => {
  for (const v of ['OTHER', 'GROCERY', 'HEALTH', 'RESTAURANT', 'TRAVEL']) {
    assert.ok(VERTICALS.includes(v), `missing vertical: ${v}`);
  }
  // ponytail: Meta rejects unknown verticals with 131009. The catalog
  // is the contract; do NOT accept arbitrary uppercase strings.
  assert.equal(VERTICALS.includes('NOT_A_VERTICAL'), false);
  assert.equal(VERTICALS.includes('other'), false);
});

test('buildBusinessProfile returns EMPTY shape on non-object', () => {
  const { profile, diagnostics } = buildBusinessProfile(null);
  assert.deepEqual(profile.websites, []);
  assert.equal(profile.about, '');
  assert.equal(diagnostics.ok, false);
  assert.ok(diagnostics.invalidFields.includes('payload'));
});

test('buildBusinessProfile drops undocumented fields but keeps the ok flag true', () => {
  const { profile, diagnostics } = buildBusinessProfile({
    about: 'hi',
    foo: 'bar',
    secret: 'value'
  });
  assert.equal(diagnostics.droppedFields.includes('foo'), true);
  assert.equal(diagnostics.droppedFields.includes('secret'), true);
  assert.equal(profile.about, 'hi');
  assert.ok(diagnostics.warnings.some((w) => w.includes('undocumented')));
});

test('buildBusinessProfile truncates about above 139 chars (Meta hard cap)', () => {
  const long = 'x'.repeat(300);
  const { profile, diagnostics } = buildBusinessProfile({ about: long });
  assert.equal(profile.about.length, 139);
  assert.ok(diagnostics.truncatedFields.includes('about'));
});

test('buildBusinessProfile truncates address above 256 chars', () => {
  const long = 'y'.repeat(500);
  const { profile, diagnostics } = buildBusinessProfile({ address: long });
  assert.equal(profile.address.length, 256);
  assert.ok(diagnostics.truncatedFields.includes('address'));
});

test('buildBusinessProfile rejects invalid emails and marks the field', () => {
  const { profile, diagnostics } = buildBusinessProfile({
    email: 'not-an-email'
  });
  assert.equal(profile.email, '');
  assert.ok(diagnostics.invalidFields.includes('email'));
  assert.equal(diagnostics.ok, false);
});

test('buildBusinessProfile normalizes valid email to lower-case and trims', () => {
  const { profile } = buildBusinessProfile({ email: '  Hi@Example.COM ' });
  assert.equal(profile.email, 'hi@example.com');
});

test('buildBusinessProfile rejects emails that exceed length cap', () => {
  const local = 'a'.repeat(130) + '@example.com';
  const { profile, diagnostics } = buildBusinessProfile({ email: local });
  assert.equal(profile.email, '');
  assert.ok(diagnostics.invalidFields.includes('email'));
});

test('buildBusinessProfile rejects unknown verticals', () => {
  const { profile, diagnostics } = buildBusinessProfile({ vertical: 'NOT_REAL' });
  assert.equal(profile.vertical, '');
  assert.ok(diagnostics.invalidFields.includes('vertical'));
});

test('buildBusinessProfile accepts a documented vertical case-insensitively', () => {
  const { profile } = buildBusinessProfile({ vertical: 'health' });
  assert.equal(profile.vertical, 'HEALTH');
});

test('buildBusinessProfile accepts up to two https websites and rejects http', () => {
  const { profile, diagnostics } = buildBusinessProfile({
    websites: ['https://example.com', 'http://insecure.test', 'https://two.example']
  });
  assert.deepEqual(profile.websites, ['https://example.com/', 'https://two.example/']);
  assert.ok(diagnostics.invalidFields.includes('websites'));
  assert.ok(diagnostics.warnings.some((w) => w.includes('websites limited')));
});

test('buildBusinessProfile parses a single string of websites split by commas or newlines', () => {
  const { profile } = buildBusinessProfile({
    websites: 'https://a.example, https://b.example'
  });
  assert.deepEqual(profile.websites, [
    'https://a.example/',
    'https://b.example/'
  ]);
});

test('buildBusinessProfile dedupes websites while preserving order', () => {
  const { profile } = buildBusinessProfile({
    websites: ['https://a.example', 'https://a.example/', 'https://b.example']
  });
  assert.equal(profile.websites[0], 'https://a.example/');
  assert.equal(profile.websites.length, 2);
});

test('buildBusinessProfile strips HTML/XSS angle brackets before caps', () => {
  const { profile, diagnostics } = buildBusinessProfile({
    about: '<script>alert(1)</script>  hello'
  });
  assert.equal(profile.about.includes('<'), false);
  assert.equal(profile.about.includes('>'), false);
  assert.equal(profile.about.includes('hello'), true);
  // The sanitizer stripped characters; ok is still true.
  assert.equal(diagnostics.ok, true);
});

test('buildBusinessProfile strips ASCII control characters', () => {
  const { profile } = buildBusinessProfile({
    about: 'hi\u0000\u0007\u001f there'
  });
  assert.equal(profile.about.includes('\u0000'), false);
  assert.equal(profile.about.includes('\u001f'), false);
  assert.equal(profile.about.includes('hi'), true);
});

test('buildBusinessProfile rejects profile_pic_url that is not https', () => {
  const { profile, diagnostics } = buildBusinessProfile({
    profile_pic_url: 'http://example.com/avatar.png'
  });
  assert.equal(profile.profile_pic_url, '');
  assert.ok(diagnostics.invalidFields.includes('profile_pic_url'));
});

test('buildBusinessProfile keeps valid https profile_pic_url', () => {
  const { profile } = buildBusinessProfile({
    profile_pic_url: 'https://example.com/avatar.png'
  });
  assert.equal(profile.profile_pic_url, 'https://example.com/avatar.png');
});

test('buildBusinessProfile keeps an empty object as EMPTY_PROFILE', () => {
  const { profile, diagnostics } = buildBusinessProfile({});
  assert.equal(profile.about, '');
  assert.equal(profile.email, '');
  assert.deepEqual(profile.websites, []);
  assert.equal(diagnostics.ok, true);
  assert.equal(diagnostics.droppedFields.length, 0);
});

test('buildBusinessProfile flags structural rejection via diagnostics.ok=false', () => {
  // A single invalid email is enough to flip ok off even though every
  // other field is fine.
  const { diagnostics } = buildBusinessProfile({
    about: 'hello',
    email: 'not real',
    vertical: 'OTHER'
  });
  assert.equal(diagnostics.ok, false);
  assert.ok(diagnostics.invalidFields.includes('email'));
});

test('diffBusinessProfile returns only changed fields', () => {
  const desired = buildBusinessProfile({
    about: 'new about',
    email: 'hi@example.com',
    vertical: 'OTHER'
  }).profile;
  const diff = diffBusinessProfile(
    { about: '', email: '', vertical: 'OTHER' },
    desired
  );
  assert.equal(diff.about, 'new about');
  assert.equal(diff.email, 'hi@example.com');
  assert.equal(diff.vertical, undefined);
});

test('diffBusinessProfile compares website arrays element-wise', () => {
  const a = { websites: ['https://a/'], about: '' };
  const b = { websites: ['https://a/'], about: '' };
  assert.deepEqual(diffBusinessProfile(a, b), {});
  const c = { websites: ['https://b/'], about: '' };
  assert.deepEqual(diffBusinessProfile(a, c), { websites: ['https://b/'] });
});

test('normalizeGraphProfile handles empty / non-string input', () => {
  const r1 = normalizeGraphProfile('');
  assert.deepEqual(r1.profile.websites, []);
  const r2 = normalizeGraphProfile(null);
  assert.equal(r2.profile.about, '');
});

test('normalizeGraphProfile round-trips JSON cleanly', () => {
  const json = JSON.stringify({
    about: 'hi',
    websites: ['https://a.example'],
    vertical: 'OTHER'
  });
  const r = normalizeGraphProfile(json);
  assert.equal(r.profile.about, 'hi');
  assert.equal(r.profile.websites[0], 'https://a.example/');
  assert.equal(r.profile.vertical, 'OTHER');
});

test('normalizeGraphProfile promotes invalidFields to warnings (trusted input)', () => {
  const json = JSON.stringify({ vertical: 'NOT_REAL' });
  const r = normalizeGraphProfile(json);
  assert.equal(r.diagnostics.ok, true);
  assert.ok(r.diagnostics.warnings.some((w) => w.includes('graph-returned vertical')));
});

test('__internals exports the documented limits and helpers', () => {
  assert.ok(__internals.LENGTH_LIMITS);
  assert.equal(__internals.LENGTH_LIMITS.about, 139);
  assert.equal(__internals.LENGTH_LIMITS.sites, 2);
  assert.equal(typeof __internals.stripHtml, 'function');
  assert.equal(typeof __internals.stripControlChars, 'function');
  assert.equal(typeof __internals.arraysEqual, 'function');
  assert.equal(__internals.PROTOCOL_ALLOWED_HTTPS, 'https:');
  assert.ok(__internals.EMAIL_RE instanceof RegExp);
});
