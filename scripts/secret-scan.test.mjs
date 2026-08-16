import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// ponytail: shell into scripts/secret-scan.mjs and assert it exits 0.
// The scanner walks source/, diff/, history/, client chunks/, and the
// Worker bundle for known secret shapes. Any hit means a credential
// leaked into a place where it should not live.
test('secret-scan reports zero issues', () => {
  const r = spawnSync('node', ['scripts/secret-scan.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0 (zero issues), got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 issues, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});