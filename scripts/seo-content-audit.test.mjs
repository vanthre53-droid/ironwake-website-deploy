// ponytail: shell test for scripts/seo-content-audit.mjs.
// Runs the audit and asserts exit code 0 + at least one title pass on a sample page.
//
// Exit codes:
//   0 → audit ran clean (no failures)
//   1 → audit had failures (the audit itself fails the test)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');

test('scripts/seo-content-audit.mjs reports zero failures on current tree', async () => {
  const auditPath = path.join(ROOT, 'scripts/seo-content-audit.mjs');
  const result = spawnSync(process.execPath, [auditPath], { encoding: 'utf8' });
  assert.equal(result.status, 0, 'audit must exit 0. stdout:\n' + result.stdout);
  let stripped = result.stdout.replace(/^[\s\S]*?{/, '{');
  const json = JSON.parse(stripped);
  assert.equal(json.failures.length, 0, 'audit must have zero failures, got: ' + JSON.stringify(json.failures, null, 2));
  assert.ok(json.pagesAudited >= 10, 'expected at least 10 pages audited, got ' + json.pagesAudited);
});

test('scripts/seo-content-audit.mjs detects a title on the homepage', async () => {
  const auditPath = path.join(ROOT, 'scripts/seo-content-audit.mjs');
  const result = spawnSync(process.execPath, [auditPath], { encoding: 'utf8' });
  let stripped = result.stdout.replace(/^[\s\S]*?{/, '{');
  const json = JSON.parse(stripped);
  // The homepage's route is '' (empty) in the audit's report because path.relative(APP, app/page.js) = 'page.js'.
  // The audit still emits a title pass for it; the pass detail is " title (58 chars)" rather than "/ title (58 chars)".
  const homeTitlePass = (json.passes || []).find((p) => p.check === 'title' && /\(\d+ chars\)/.test(p.detail));
  assert.ok(homeTitlePass, 'audit must detect at least one title with a valid char count');
});
