import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

test('release verifier does not print environment values', () => {
  const source = fs.readFileSync(new URL('./verify-release-config.mjs', import.meta.url), 'utf8');
  assert.match(source, /missing: result\.missing/);
  assert.match(source, /invalid: result\.invalid/);
  assert.doesNotMatch(source, /console\.(?:log|error)\(process\.env/);
});
