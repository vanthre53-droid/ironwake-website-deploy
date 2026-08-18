// ponytail: shell into scripts/build-audit.mjs and assert exit 0.
// Verifies .next/ + .open-next/ artifacts exist and reports bundle sizes.
// Run this AFTER `npm run build` and `npm run build:worker`.
// Skip gracefully if build artifacts are missing — this is an
// infra-shape check, not a unit test, and it fails on fresh checkouts
// when no build has run yet. Reserve for CI after `npm run build:worker`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const workerHandler = resolve('.open-next/server-functions/default/handler.mjs');
const hasBuild = existsSync(workerHandler);

test('build audit reports zero errors', { skip: !hasBuild && 'no .open-next/ build artifact — run `npm run build:worker` first' }, () => {
  const r = spawnSync('node', ['scripts/build-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}`);
  assert.ok(json.workerBytes > 0, 'expected worker.js to exist with size > 0');
  assert.ok(json.serverFunctionsBytes > 0, 'expected server-functions to exist with size > 0');
});
