// ponytail: shell into scripts/sitemap-audit.mjs and assert exit 0.
// The audit cross-checks:
//   - every page with robots: { index: false } is NOT in the sitemap
//   - every sitemap URL resolves to a real page.js or a dynamic [slug] route
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('sitemap audit reports zero issues', () => {
  const r = spawnSync('node', ['scripts/sitemap-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 issues, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});