// ponytail: shell into scripts/worker-secrets-audit.mjs and assert exit 0.
// Verifies all 19 required production Worker secrets are present by name.
// Run after `wrangler secret put` for each required key.

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('worker secrets audit passes', { timeout: 60_000 }, () => {
  const r = spawnSync('node', ['scripts/worker-secrets-audit.mjs'], {
    encoding: 'utf8',
    cwd: new URL('..', import.meta.url),
  });
  if (r.status !== 0) {
    assert.fail(`audit exit=${r.status}\nstdout=${r.stdout}\nstderr=${r.stderr}`);
  }
  const report = JSON.parse(r.stdout);
  assert.equal(report.issues.length, 0, 'audit reported issues');
  assert.equal(report.missingCount, 0, 'missing required secrets');
  assert.equal(report.requiredCount, 19, 'should check 19 required secrets');
  assert.equal(report.presentCount, 19, 'all 19 required secrets present');
});
