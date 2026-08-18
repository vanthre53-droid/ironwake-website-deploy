// ponytail: structural contract test for scripts/perf-audit.mjs output.
// Runs the script and asserts the 4 required evidence fields are present
// and bundle gzip stays under the Cloudflare Workers Free plan budget.
// Skip the bundle-gzip assertion when .open-next/ is missing — this is
// an infra-shape check, not a unit test, and requires a fresh post-build
// artifact. Reserve for CI after `npm run build:worker`.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO  = resolve(__dirname, '..');
const SCRIPT = resolve(REPO, 'scripts/perf-audit.mjs');
const LH_MOBILE = resolve(REPO, 'reports/lighthouse-mobile.json');
const LH_DESKTOP = resolve(REPO, 'reports/lighthouse-desktop.json');
const WORKER_HANDLER = resolve(REPO, '.open-next/server-functions/default/handler.mjs');
const hasBuild = existsSync(WORKER_HANDLER);

function runAudit() {
  const stdout = execFileSync('node', [SCRIPT], { cwd: REPO, encoding: 'utf8' });
  return JSON.parse(stdout);
}

test('perf-audit.mjs emits the 4 required evidence fields', () => {
  const p = runAudit();
  for (const key of [
    'lighthouse_mobile',
    'lighthouse_desktop',
    'bundle_gzip_kb',
    'third_party_inventory',
  ]) {
    assert.ok(p[key] !== undefined, `missing evidence field: ${key}`);
  }
});

test('bundle_gzip_kb stays under the 3072 KiB Cloudflare Free plan budget', {
  skip: !hasBuild && 'no .open-next/ build artifact — run `npm run build:worker` first',
}, () => {
  const p = runAudit();
  assert.equal(typeof p.bundle_gzip_kb, 'number');
  assert.equal(p.bundle_gzip_limit_kb, 3072);
  assert.ok(p.bundle_gzip_kb > 0, 'bundle must have nonzero size');
  assert.ok(p.bundle_gzip_kb <= p.bundle_gzip_limit_kb, `bundle ${p.bundle_gzip_kb} KiB exceeds budget ${p.bundle_gzip_limit_kb} KiB`);
  assert.equal(p.bundle_gzip_within_budget, true);
  assert.ok(p.bundle_margin_kb > 0);
});

test('lighthouse_mobile matches reports/lighthouse-mobile.json when present', () => {
  if (!existsSync(LH_MOBILE)) {
    const p = runAudit();
    assert.equal(p.lighthouse_mobile.ran, false);
    return;
  }
  const p = runAudit();
  const lh = p.lighthouse_mobile;
  const report = JSON.parse(readFileSync(LH_MOBILE, 'utf8'));
  assert.equal(lh.ran, true);
  assert.equal(lh.formFactor, 'mobile');
  assert.equal(lh.routesAudited, report.routesAudited);
  assert.ok(lh.averages);
  for (const cat of ['performance', 'accessibility', 'bestPractices', 'seo']) {
    assert.ok(typeof lh.averages[cat] === 'number', `mobile averages.${cat} missing`);
  }
});

test('lighthouse_desktop matches reports/lighthouse-desktop.json when present', () => {
  if (!existsSync(LH_DESKTOP)) {
    const p = runAudit();
    assert.equal(p.lighthouse_desktop.ran, false);
    return;
  }
  const p = runAudit();
  const lh = p.lighthouse_desktop;
  const report = JSON.parse(readFileSync(LH_DESKTOP, 'utf8'));
  assert.equal(lh.ran, true);
  assert.equal(lh.formFactor, 'desktop');
  assert.equal(lh.routesAudited, report.routesAudited);
  for (const cat of ['performance', 'accessibility', 'bestPractices', 'seo']) {
    assert.ok(typeof lh.averages[cat] === 'number', `desktop averages.${cat} missing`);
  }
});

test('third_party_inventory exposes sampledAt, sourcesChecked, hostsDetected', () => {
  const p = runAudit();
  const t = p.third_party_inventory;
  assert.ok(t.sampledAt);
  assert.ok(Array.isArray(t.sourcesChecked));
  assert.ok(Array.isArray(t.hostsDetected));
  assert.equal(typeof t.hostsChecked, 'number');
});

test('no CWV anti-patterns in app/, components/, lib/', () => {
  const p = runAudit();
  assert.equal(p.issueCount, 0);
  assert.equal(p.issueCount === 0, true);
});
