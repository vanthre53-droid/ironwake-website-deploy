// ponytail: shell into scripts/worker-secrets-audit.mjs and assert exit 0.
// Verifies all 18 required production Worker secrets are present by name.
// Run after `wrangler secret put` for each required key. NEXT_PUBLIC_SITE_URL
// is a `var` not a secret, so it is verified separately (build audit).

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
  assert.equal(report.requiredCount, 18, 'should check 18 required secrets');
  assert.equal(report.presentCount, 18, 'all 18 required secrets present');
});
