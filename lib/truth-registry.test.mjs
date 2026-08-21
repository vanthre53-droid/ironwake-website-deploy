// lib/truth-registry.test.mjs
//
// Tests the V14 §24 / §39 canonical truth registry. Pure unit checks —
// no network, no provider calls.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SERVICE_CATALOG,
  INDUSTRIES,
  PORTFOLIO,
  BRAND,
  DESIGN_LOCK,
  listServices,
  getServiceById,
  validateRegistry,
  designFingerprintMatches,
} from './truth-registry.mjs';
import { ROUTES } from './routes.mjs';

test('V14 sec24 mandates exactly 12 services in canonical order', () => {
  assert.equal(SERVICE_CATALOG.length, 12);
  const expectedOrder = [
    'ai-receptionist-voice','ai-agents-workflow-automation','missed-lead-recovery-followup',
    'whatsapp-business-automation','crm-lead-pipeline','booking-reservation-dispatch',
    'seo-search-visibility','google-business-profile-local','conversion-websites',
    'quote-support-repair-intake','integrations-api','monitoring-optimization-intelligence',
  ];
  assert.deepEqual(SERVICE_CATALOG.map((s) => s.id), expectedOrder);
});

test('every service id is unique', () => {
  const ids = SERVICE_CATALOG.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every service has non-empty name and string id', () => {
  for (const s of SERVICE_CATALOG) {
    assert.equal(typeof s.id, 'string');
    assert.ok(s.id.length > 0, 'id non-empty');
    assert.equal(typeof s.name, 'string');
    assert.ok(s.name.length > 0, 'name non-empty');
  }
});

test('no service invents a route that does not exist in lib/routes.mjs', () => {
  const real = new Set(ROUTES.map((r) => r.path));
  for (const s of SERVICE_CATALOG) {
    for (const p of s.routePaths) {
      assert.ok(real.has(p), `${s.id}: route ${p} must exist in ROUTES`);
    }
    if (s.primaryRoute !== null) {
      assert.ok(real.has(s.primaryRoute), `${s.id}: primaryRoute ${s.primaryRoute} must exist`);
    }
    for (const p of s.proofRoutes) {
      assert.ok(real.has(p), `${s.id}: proof route ${p} must exist`);
    }
    for (const p of s.industries) {
      assert.ok(real.has(p), `${s.id}: industry ${p} must exist`);
    }
  }
});

test('proofClass is one of the V14 sec59 allowed values', () => {
  const allowed = new Set([
    'DEMONSTRATION',
    'INTERNAL_VERIFIED_BUILD',
    'CLIENT_DEPLOYMENT',
    'CLIENT_VERIFIED_RESULT',
    'QUANTIFIED_VERIFIED_RESULT',
  ]);
  for (const s of SERVICE_CATALOG) {
    assert.ok(allowed.has(s.proofClass), `${s.id}: proofClass ${s.proofClass} not allowed`);
  }
});

test('validateRegistry returns zero errors against current ROUTES', () => {
  const errs = validateRegistry();
  assert.deepEqual(errs, [], `registry errors: ${errs.join('; ')}`);
});

test('brand identity matches V14 sec59', () => {
  assert.equal(BRAND.name, 'IronWake');
  assert.equal(BRAND.canonicalOrigin, 'https://ironwake.dev');
  assert.equal(BRAND.tagline, 'AI Receptionist & Lead Recovery Systems');
});

test('design fingerprint matches V14 sec3 immutable copper/ivory palette', () => {
  assert.equal(DESIGN_LOCK.paperCanvas, '#F5F3EE');
  assert.equal(DESIGN_LOCK.copperAction, '#B94D2F');
  assert.equal(DESIGN_LOCK.copperHover, '#A33D20');
  assert.equal(DESIGN_LOCK.copperPressed, '#842E18');
  assert.equal(DESIGN_LOCK.supportingAqua, '#1E7582');
  const fp = designFingerprintMatches();
  assert.ok(fp.includes('#F5F3EE'));
  assert.ok(fp.includes('#B94D2F'));
});

test('locked-files list contains the V14 sec4 anchor files', () => {
  const expected = [
    'app/globals.css',
    'app/layout.js',
    'app/page.js',
    'app/components/FlagshipHero.js',
    'app/components/DashboardDemo.js',
  ];
  for (const f of expected) {
    assert.ok(DESIGN_LOCK.lockedFiles.includes(f), `${f} must be listed as locked`);
  }
});

test('portfolio list references the 9 V14 sec59 portfolio entries', () => {
  const ids = PORTFOLIO.map((p) => p.id);
  const expected = ['rapidpulse','harbour-estates','dentacare-pro','aura-archives','luxe-studio','bramble-cafe','voltix','retech','atelier'];
  for (const e of expected) {
    assert.ok(ids.includes(e), `portfolio missing ${e}`);
  }
  // all are DEMONSTRATION class (V14 sec59 honest label)
  for (const p of PORTFOLIO) {
    assert.equal(p.proofClass, 'DEMONSTRATION');
  }
});

test('industries list has at least the four existing real routes', () => {
  const routes = INDUSTRIES.map((i) => i.route);
  for (const r of ['/industries/home-services','/industries/dental-clinics','/industries/salons-spas','/industries/dental']) {
    assert.ok(routes.includes(r), `missing industry route ${r}`);
  }
});

test('listServices returns a frozen copy', () => {
  const a = listServices();
  const b = listServices();
  assert.notEqual(a, b, 'listServices must return a new array each call (defensive)');
  assert.equal(a.length, b.length);
});

test('getServiceById returns the right service or null', () => {
  const svc = getServiceById('booking-reservation-dispatch');
  assert.ok(svc, 'must find booking service');
  assert.equal(svc.id, 'booking-reservation-dispatch');
  assert.equal(getServiceById('not-a-service'), null);
});

test('NO FABRICATION: registry has no fabricated statistics', () => {
  const fabricationPattern = /\b(\d{2,}\s*(years?|clients?|customers?|projects?|reviews?|rating)|\$\d+[KkMm]?|#[0-9]+\s*1|guaranteed|enterprise-grade|best-in-class|#1\s)/i;
  for (const s of SERVICE_CATALOG) {
    const blob = JSON.stringify(s);
    assert.equal(fabricationPattern.test(blob), false, `${s.id}: fabricated statistic detected: ${blob}`);
  }
});
