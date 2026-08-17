import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('google oauth button audit reports zero issues', () => {
  const r = spawnSync('node', ['scripts/google-oauth-button-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 issues, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});