// ponytail: shell into scripts/a11y-audit.mjs and assert exit 0.
// The audit asserts the root layout has a skip-link, CSS has
// :focus-visible, prefers-reduced-motion is honored, and no img
// is missing alt.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('a11y audit reports zero errors', () => {
  const r = spawnSync('node', ['scripts/a11y-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});