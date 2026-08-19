// Tests for the shared Button primitive (app/components/ui/Button.jsx).
// Source-level assertions — the same shape as Field.test.mjs.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const source = readFileSync(resolve(ROOT, 'app/components/ui/Button.jsx'), 'utf8');

test('Button.jsx exposes primary|secondary|ghost|destructive variants', () => {
  assert.match(source, /'primary', 'secondary', 'ghost', 'destructive'/);
  assert.match(source, /safeVariant = VARIANTS\.has\(variant\) \? variant : 'primary';/);
});

test('Button.jsx exposes sm|md|lg sizes', () => {
  assert.match(source, /'sm', 'md', 'lg'/);
  assert.match(source, /safeSize = SIZES\.has\(size\) \? size : 'md';/);
});

test('Button.jsx implements loading state with aria-busy + spinner', () => {
  assert.match(source, /'aria-busy': loading \? 'true' : undefined/);
  assert.match(source, /iw-button__spinner/);
});

test('Button.jsx guards against double-submit while busy', () => {
  assert.match(source, /if \(isInactive\)/);
  assert.match(source, /event\.preventDefault\(\)/);
});

test('Button.jsx renders <a> when as="a" or href provided', () => {
  assert.match(source, /if \(as === 'a' \|\| href\)/);
  assert.match(source, /<a\s/);
});

test('Button.jsx removes interactive affordance when disabled', () => {
  assert.match(source, /isInactive \? 'true' : undefined/);
  assert.match(source, /isInactive \? true : undefined/);
});

test('Button.jsx supports leadingIcon + trailingIcon slots', () => {
  assert.match(source, /leadingIcon/);
  assert.match(source, /trailingIcon/);
  assert.match(source, /iw-button__icon--leading/);
  assert.match(source, /iw-button__icon--trailing/);
});

test('Button.jsx default type="button" prevents accidental form submit', () => {
  assert.match(source, /type = 'button'/);
});
