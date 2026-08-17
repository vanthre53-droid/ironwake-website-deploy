// ponytail: structural contract test for scripts/a11y-audit.mjs output.
// Runs the script and asserts the 5 evidence fields are present and
// axe_core_findings reports the same numbers as reports/axe-report.json.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO  = resolve(__dirname, '..');
const SCRIPT = resolve(REPO, 'scripts/a11y-audit.mjs');
const AXE_REPORT = resolve(REPO, 'reports/axe-report.json');

function runAudit() {
  const stdout = execFileSync('node', [SCRIPT], { cwd: REPO, encoding: 'utf8' });
  return JSON.parse(stdout);
}

test('a11y-audit.mjs emits the 5 required evidence fields', () => {
  const a = runAudit();
  assert.equal(a.issueCount, 0, 'static issueCount must be 0');
  for (const key of [
    'keyboard_navigation_matrix',
    'focus_visible_audit',
    'reduced_motion_compliance',
    'color_contrast_audit',
    'axe_core_findings',
  ]) {
    assert.ok(a[key], `missing evidence field: ${key}`);
  }
});

test('keyboard_navigation_matrix covers every page file', () => {
  const a = runAudit();
  const knm = a.keyboard_navigation_matrix;
  assert.ok(Array.isArray(knm.pages));
  assert.ok(knm.pages.length >= 5, `expected >=5 pages, got ${knm.pages.length}`);
  for (const p of knm.pages) {
    assert.ok(p.page);
    assert.ok(p.buttons);
    assert.ok(p.anchors);
    assert.ok(p.images);
    assert.ok(p.inputs);
  }
});

test('focus_visible_audit checks globals.css', () => {
  const a = runAudit();
  const fv = a.focus_visible_audit;
  assert.ok(fv.cssFilesChecked.includes('app/globals.css'));
  assert.equal(fv.cssHasFocusVisible, true);
});

test('reduced_motion_compliance has ratio >= 1', () => {
  const a = runAudit();
  const rm = a.reduced_motion_compliance;
  assert.ok(rm.motionFiles >= rm.motionFilesWithReduce);
  if (rm.motionFiles > 0) {
    assert.ok(rm.ratio >= 0.99, `expected all motion files to honor prefers-reduced-motion, got ${rm.ratio}`);
  }
});

test('color_contrast_audit is sourced from reports/contrast-audit.json', () => {
  const a = runAudit();
  const cc = a.color_contrast_audit;
  assert.equal(cc.source, 'reports/contrast-audit.json');
  assert.ok(cc.pairs >= 1);
  assert.equal(cc.failingPairs, 0, 'no WCAG AA pair may fail');
});

test('axe_core_findings match reports/axe-report.json when present', () => {
  if (!existsSync(AXE_REPORT)) {
    const a = runAudit();
    assert.equal(a.axe_core_findings.ran, false, 'ran must be false when report missing');
    return;
  }
  const a = runAudit();
  const ax = a.axe_core_findings;
  const report = JSON.parse(readFileSync(AXE_REPORT, 'utf8'));
  assert.equal(ax.ran, true);
  assert.equal(ax.totalViolations, report.totalViolations);
  assert.equal(ax.routesSucceeded, report.routesSucceeded);
  assert.equal(ax.routesFailed, report.routesFailed);
  assert.equal(ax.toolVersion, report.toolVersion);
  assert.deepEqual(ax.routesAudited, report.routesAudited);
  assert.ok(Array.isArray(ax.routes));
  assert.equal(ax.routes.length, report.results.length);
  for (let i = 0; i < ax.routes.length; i += 1) {
    assert.equal(ax.routes[i].url, report.results[i].url);
  }
});

test('axe_core_findings exposes incompleteRules and passCountAvg', () => {
  if (!existsSync(AXE_REPORT)) return;
  const a = runAudit();
  const ax = a.axe_core_findings;
  assert.ok(Array.isArray(ax.incompleteRules));
  assert.equal(typeof ax.passCountAvg, 'number');
  assert.ok(ax.passCountAvg > 0, 'must observe at least some passing axe rules');
});
