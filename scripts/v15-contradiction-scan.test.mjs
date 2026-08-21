// Companion test for scripts/v15-contradiction-scan.mjs (V15 §122 CI gate).
// Asserts the scanner emits the expected output shape, that the
// evidenceRouteDrift check enforces V15 §88 / §122, and that the §80
// homepage source-leak pattern does not re-emerge in the canonical
// schema.org Offer block (see app/seo/homepage.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCANNER_ABS = join(ROOT, 'scripts', 'v15-contradiction-scan.mjs');
const TMP_DIR = join(ROOT, '.ironwake', 'tmp');

// Run scanner with the env-var sink option so we can capture pure JSON
// without fighting test-runner stdout interleaving.
function runScan(env = {}) {
  mkdirSync(TMP_DIR, { recursive: true });
  const outFile = join(TMP_DIR, `scan-${process.pid}-${Date.now()}.json`);
  const res = spawnSync('node', [SCANNER_ABS], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, V15_SCAN_OUT_FILE: outFile, ...env },
  });
  if (res.status !== 0) {
    rmSync(TMP_DIR, { recursive: true, force: true });
    throw new Error(`scanner exited ${res.status}: ${res.stderr.slice(-500)}`);
  }
  const json = JSON.parse(readFileSync(outFile, 'utf8'));
  rmSync(TMP_DIR, { recursive: true, force: true });
  return json;
}

test('V15 §122 CI gate: scanner emits expected output keys including evidenceRouteDrift', () => {
  const j = runScan();
  for (const k of ['scanned', 'exactPhraseHits', 'pricingStaleness', 'brandRenameRisks', 'hostnameLeaks', 'evidenceRouteDrift', 'date']) {
    assert.ok(k in j, `scanner JSON missing required key: ${k}`);
  }
  assert.ok(Array.isArray(j.evidenceRouteDrift), 'evidenceRouteDrift must be an array');
});

test('V15 §88 / §122: baseline evidenceRouteDrift is empty (all OFFERED_NOW evidenceRoutes resolve to real routes)', () => {
  const j = runScan();
  assert.equal(
    j.evidenceRouteDrift.length,
    0,
    `Expected 0 evidence-route drift; got ${j.evidenceRouteDrift.length}: ${JSON.stringify(j.evidenceRouteDrift)}`
  );
});

test('V15 §88 / §122: a missing evidence route is reported when canonical-entity cites a non-existent file', () => {
  // Monkey-patch OFFERED_NOW_MATRIX entry with a fake /work/__v15_test_drift
  // route, run the scanner against the patched module, then assert the
  // drift was captured. Restored by virtue of writing the original file
  // back before exiting.
  const target = join(ROOT, 'lib', 'canonical-entity.mjs');
  const original = readFileSync(target, 'utf8');
  // Safety: only proceed if the marker is NOT already in the file.
  assert.ok(!original.includes('V15_TEST_DRIFT_MARKER'), 'drift marker already present; re-run cancelled');
  const patched = original.replace(
    /OFFERED_NOW_MATRIX\s*=\s*[^[]*\[/,
    (m) => `${m}{capability: 'v15-test-drift', evidenceRoutes: ['/work/__v15_test_drift'], serviceId: '__v15_test', deliveryModel: 'TEST', proofClass: 'TEST', priority: 'TEST', antiMisread: 'test only', V15_TEST_DRIFT_MARKER: true},`
  );
  writeFileSync(target, patched);
  try {
    const j = runScan();
    assert.ok(
      j.evidenceRouteDrift.some((d) => d.capability === 'v15-test-drift' && d.route === '/work/__v15_test_drift'),
      `expected drift entry not reported: ${JSON.stringify(j.evidenceRouteDrift)}`
    );
  } finally {
    writeFileSync(target, original);
  }
});

// §89 pricing-staleness exemption: canonical-entity.mjs legitimately owns the
// business-leak-audit buyerLanguage with the price ladder. The §89 scan must
// exempt truth-record sources the same way it exempts pricing.mjs.
test('V15 §89: canonical-entity.mjs truth-record exemption is honored', () => {
  const src = readFileSync(SCANNER_ABS, 'utf8');
  assert.ok(
    src.includes('lib/pricing.mjs') && src.includes('lib/canonical-entity.mjs'),
    'scanner must exempt both truth-record sources from pricing-staleness scan'
  );
});

// §80 / §122 source-leak regression: the homepage JSON-LD stub
// (app/seo/homepage.js) is the canonical schema.org source that AI retrieval
// systems read. It MUST NOT re-emit a single Lite ₹799 / $29 signal as
// IronWake's offer — that pattern was the root of the §80 "consulting only /
// ₹799 is the whole company" failure mode observed in the supplied AI
// transcript.
test('V15 §80: homepage JSON-LD source no longer leaks ₹799 / $29 as canonical offer', () => {
  const f = join(ROOT, 'app', 'seo', 'homepage.js');
  const src = readFileSync(f, 'utf8');
  assert.ok(
    !/₹\s*799/.test(src) && !/price:\s*['"]?799/.test(src),
    'homepage JSON-LD source still contains a literal ₹799 signal'
  );
  assert.ok(
    !/price:\s*['"]?29\b/.test(src) && !/['"]\$29['"]/.test(src),
    'homepage JSON-LD source still contains a literal $29 signal'
  );
  // It MUST still declare the Organization entity (identity, not a price).
  assert.ok(
    src.includes('@type') && src.includes('Organization'),
    'homepage JSON-LD must declare an Organization entity'
  );
  // It MUST NOT collapse the offer catalog into a single ₹799 / $29 entry;
  // the public-signal contract is to list the implementation offers.
  assert.ok(
    src.includes('Service') || src.includes('OfferCatalog'),
    'homepage JSON-LD must list implementation offers, not a single diagnostic price'
  );
});
