/**
 * Tests for the Google brand icon used by the Continue-with-Google
 * button on /login, /signup, and any future OAuth flows. Source-level
 * assertions: the four-colour "G" must be present, never reused as
 * a flat generic icon.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(
  new URL('./GoogleIcon.jsx', import.meta.url),
  'utf8'
);

test('GoogleIcon.jsx renders the four-colour G path data', () => {
  for (const colour of ['#4285F4', '#34A853', '#FBBC05', '#EA4335']) {
    assert.match(source, new RegExp(`fill="${colour}"`), `missing ${colour}`);
  }
});

test('GoogleIcon.jsx is aria-hidden and focusable', () => {
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /focusable="false"/);
});

test('GoogleIcon.jsx forwards size via the width/height props', () => {
  assert.match(source, /size\s*=\s*18/);
  assert.match(source, /width=\{size\}/);
  assert.match(source, /height=\{size\}/);
});
