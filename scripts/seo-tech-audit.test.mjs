// ponytail: SEO tech audit gate. Spawns scripts/seo-tech-audit.mjs
// against the source tree and fails the test if there are failures.
// Keeps the same source-of-truth as lighthouse + routes acceptance.
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import test from 'node:test';
test('seo tech audit gate', () => {
  const r = spawnSync(process.execPath, ['scripts/seo-tech-audit.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, `seo-tech-audit exited ${r.status}: ${r.stderr || r.stdout}`);
  const j = JSON.parse(r.stdout);
  assert.equal(j.failures.length, 0, `seo-tech-audit reported ${j.failures.length} failures`);
  assert.ok(j.passes.length >= 100, `expected >=100 passes, got ${j.passes.length}`);
});
