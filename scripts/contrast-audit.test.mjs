// ponytail: shell into scripts/contrast-audit.mjs and assert exit 0.
// Computes WCAG 2.1 contrast ratios for every CSS variable pair used
// in globals.css and asserts each body-text pair meets 4.5:1.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('contrast audit reports zero failures', () => {
  const r = spawnSync('node', ['scripts/contrast-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 failures, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});
