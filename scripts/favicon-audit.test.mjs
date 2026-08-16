// ponytail: shell into scripts/favicon-audit.mjs and assert exit 0.
// The audit verifies /icon.svg exists and is valid SVG, app/layout.js
// declares icons { icon, apple }, and JSON-LD Organization schema is present.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('favicon audit reports zero errors', () => {
  const r = spawnSync('node', ['scripts/favicon-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 errors, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});
