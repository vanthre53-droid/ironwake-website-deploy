// ponytail: shell into scripts/csp-audit.mjs and assert exit 0.
// The audit asserts every required third-party origin (Retell Web SDK,
// Supabase, blob: audio) is allow-listed in the next.config.mjs CSP.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('csp-audit reports zero hard issues', () => {
  const r = spawnSync('node', ['scripts/csp-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\nSTDOUT:\n${r.stdout}\nSTDERR:\n${r.stderr}`);
  const json = JSON.parse(r.stdout);
  assert.equal(json.issueCount, 0, `expected 0 hard issues, got ${json.issueCount}\n${JSON.stringify(json.issues, null, 2)}`);
});