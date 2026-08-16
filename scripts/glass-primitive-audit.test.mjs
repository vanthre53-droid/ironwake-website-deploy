// ponytail: shell into scripts/glass-primitive-audit.mjs and assert exit 0.
// Asserts the .glass shared primitive + modifiers + reduced-motion fallback
// exist and at least one JSX usage applies it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('glass primitive audit reports zero errors', () => {
  const r = spawnSync('node', ['scripts/glass-primitive-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}`);
});
