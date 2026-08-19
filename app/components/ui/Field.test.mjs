// Tests for the shared Field primitive (app/components/ui/Field.jsx) and
// the .iw-field* CSS contract in globals.css. These validate the design
// system is visible and correctly wired without requiring a running browser.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const read = (rel) => readFileSync(resolve(ROOT, rel), 'utf8');

const fieldSource = read('app/components/ui/Field.jsx');
const css = read('app/globals.css');

test('Field.jsx renders iw-field wrapper + iw-field__control', () => {
  // source-level assertion: the JSX uses the shared class name contract
  assert.match(fieldSource, /wrapperClass\s*=\s*/);
  assert.match(fieldSource, /controlClass\s*=\s*/);
  assert.match(fieldSource, /'iw-field__control',?\n/);
  assert.match(fieldSource, /'iw-field',?\n/);
});

test('Field.jsx wires aria-invalid + aria-describedby when error is set', () => {
  assert.match(fieldSource, /aria-invalid/);
  assert.match(fieldSource, /aria-describedby/);
  assert.match(fieldSource, /role="alert"/);
});

test('Field.jsx supports textarea via multiline prop', () => {
  assert.match(fieldSource, /multiline/);
  assert.match(fieldSource, /<textarea/);
});

test('Field.jsx forwards leadingIcon + trailingIcon', () => {
  assert.match(fieldSource, /leadingIcon/);
  assert.match(fieldSource, /trailingIcon/);
  assert.match(fieldSource, /iw-field__icon/);
});

test('Field.jsx uses useId() for stable SSR-safe id fallback', () => {
  assert.match(fieldSource, /import \{ useId \} from 'react';/);
  assert.match(fieldSource, /useId\(\)/);
});

test('globals.css defines the .iw-field shared primitive', () => {
  assert.match(css, /\.iw-field\s*\{/);
  assert.match(css, /\.iw-field__label\s*\{/);
  assert.match(css, /\.iw-field__control\s*\{/);
  assert.match(css, /\.iw-field__control:focus-visible\s*\{/);
  assert.match(css, /\.iw-field__control\[aria-invalid="true"\]\s*\{/);
  assert.match(css, /\.iw-field__error\s*\{/);
  assert.match(css, /\.iw-field__help\s*\{/);
});

test('globals.css size + block rules for Button.jsx present', () => {
  assert.match(css, /\.iw-button--sm\s*\{/);
  assert.match(css, /\.iw-button--lg\s*\{/);
  assert.match(css, /\.iw-button--block\s*\{/);
  assert.match(css, /\.iw-button__spinner\s*\{/);
  assert.match(css, /@keyframes iw-button-spin/);
});

test('globals.css mobile bump for .iw-field__control (prevents iOS zoom)', () => {
  assert.match(css, /@media \(max-width: 640px\)/);
  // mobile bump to font-size: 16px prevents iOS auto-zoom-on-focus
  assert.match(css, /\.iw-field__control \{ font-size: 16px/);
});

test('prefers-reduced-motion disables spinner', () => {
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{ \.iw-button__spinner \{ animation: none;/
  );
});
