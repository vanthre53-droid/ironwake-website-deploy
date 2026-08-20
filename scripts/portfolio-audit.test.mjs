// ponytail: shell into scripts/portfolio-audit.mjs and assert exit 0.
// Asserts all 49 R053 projects exist, each is labeled as portfolio/capability
// proof, has a co-located page.test.js, and uses no real-client language.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('portfolio audit reports zero errors', () => {
  const r = spawnSync('node', ['scripts/portfolio-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.projectCount, 49, `expected 49 projects, got ${json.projectCount}`);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}`);
});
