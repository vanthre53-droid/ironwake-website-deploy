// ponytail: shell into scripts/metadata-audit.mjs and assert exit 0.
// The audit asserts every indexed page has unique title, description,
// and resolves noindex pages via layout-level metadata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('metadata audit reports zero errors', () => {
  const r = spawnSync('node', ['scripts/metadata-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});