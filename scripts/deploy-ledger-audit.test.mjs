// ponytail: shell into scripts/deploy-ledger-audit.mjs and assert exit 0.
// Verifies the CLOUDFLARE_DEPLOY_LEDGER.json is valid, latest deploy is
// DEPLOYED_LIVE, rollback tag exists, and forbidden architectures are listed.

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('deploy ledger audit passes', () => {
  const r = spawnSync('node', ['scripts/deploy-ledger-audit.mjs'], {
    encoding: 'utf8',
    cwd: new URL('..', import.meta.url),
  });
  if (r.status !== 0) {
    assert.fail(`audit exit=${r.status}\nstdout=${r.stdout}\nstderr=${r.stderr}`);
  }
  const report = JSON.parse(r.stdout);
  assert.equal(report.issues.length, 0, 'audit reported issues');
});
