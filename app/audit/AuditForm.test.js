import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('audit form delegates submit to submitAudit and resets consent on success', async () => {
  const source = await readFile(new URL('./AuditForm.js', import.meta.url), 'utf8');
  // ponytail: behavioural proof lives in submit-audit.test.mjs; this is the wiring check.
  assert.match(source, /from '\.\/submit-audit\.mjs'/);
  assert.match(source, /const form = event\.currentTarget/);
  assert.match(source, /setStatus\(ui\.status\)/);
  assert.match(source, /setMessage\(ui\.message\)/);
  assert.doesNotMatch(source, /event\.currentTarget\.reset\(\)/);
  // ponytail: consent reset now happens via form.reset() inside submitAudit;
  // AuditForm passes the form element in as the `form` arg.
  assert.match(source, /submitAudit\(\{[\s\S]*?\bform\b[\s\S]*?\}\s*\)/);
});

test('audit form marketing copy keeps the truthful persistence language', async () => {
  const source = await readFile(new URL('./AuditForm.js', import.meta.url), 'utf8');
  assert.match(source, /'use client'/);
  assert.match(source, /fetch\('\/api\/audit'|submitAudit/);
  // ponytail: JSX whitespace collapses across newlines; assert the substantive clause parts.
  assert.match(source, /This request does not/);
  assert.match(source, /create a/);
  assert.match(source, /\bquote\b/);
  assert.match(source, /schedule a meeting/);
  assert.match(source, /name="website"/);
});
