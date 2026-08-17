// ponytail: test wrapper for scripts/ui-visual-audit.mjs.
// Pattern mirrors scripts/google-oauth-button-audit.test.mjs:
//   spawn the audit as a child process, parse JSON, assert exit 0 + zero issues.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('ui-visual-audit reports zero issues (button states, cookie banner, glass guards)', () => {
  const r = spawnSync('node', ['scripts/ui-visual-audit.mjs'], { encoding: 'utf8' });
  assert.equal(
    r.status,
    0,
    `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`
  );
  const json = JSON.parse(r.stdout);
  assert.equal(
    json.issueCount,
    0,
    `expected 0 issues, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`
  );
  // ponytail: structural assertions on the report shape so downstream tooling
  // (CI dashboard, release notes) can rely on the keys existing.
  assert.equal(json.scope, 'ui-visual-audit');
  assert.ok(typeof json.checks.buttonStates === 'boolean');
  assert.ok(typeof json.checks.buttonVariants === 'boolean');
  assert.ok(typeof json.checks.cookieBannerHygiene === 'boolean');
  assert.equal(json.checks.buttonStates, true);
  assert.equal(json.checks.buttonVariants, true);
  assert.equal(json.checks.cookieBannerHygiene, true);
});
