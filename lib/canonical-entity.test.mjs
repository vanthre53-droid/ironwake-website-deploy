// lib/canonical-entity.test.mjs
//
// ponytail: V15 §122 quality gates for canonical entity + OFFERED_NOW matrix.
// Runs without external deps via node:test (matches existing repo test style).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  CANONICAL_BRAND_NAME,
  CANONICAL_CATEGORY_STATEMENT,
  CANONICAL_ENTITY_SUMMARY,
  OFFERED_NOW_MATRIX,
  IDENTITY_CLASSIFICATION,
  SAFE_RESTATEMENTS,
  PROOF_CLASSES,
  listOfferedNow,
  capabilitiesByServiceId,
  getSafeRestatement,
  canonicalEntityPayload,
} from './canonical-entity.mjs';

// V15 §86 — no accidental rename.
test('canonical brand is "IronWake", not "IronWake Systems" or other variants', () => {
  assert.equal(CANONICAL_BRAND_NAME, 'IronWake');
  assert.doesNotMatch(CANONICAL_BRAND_NAME, /Systems/i);
  assert.doesNotMatch(CANONICAL_CATEGORY_STATEMENT, /IronWake Systems/i);
  assert.doesNotMatch(CANONICAL_ENTITY_SUMMARY, /IronWake Systems/i);
});

// V15 §86 — category statement must pair "systems" with explicit buyer-language.
test('category statement pairs "systems" with explicit buyer-language verbs', () => {
  assert.match(CANONICAL_CATEGORY_STATEMENT, /designs and builds/i);
  assert.match(CANONICAL_CATEGORY_STATEMENT, /websites/i);
  assert.match(CANONICAL_CATEGORY_STATEMENT, /AI receptionists/i);
  assert.match(CANONICAL_CATEGORY_STATEMENT, /CRM/i);
  assert.match(CANONICAL_CATEGORY_STATEMENT, /bookings?|booking systems/i);
  assert.match(CANONICAL_CATEGORY_STATEMENT, /integrations/i);
});

// V15 §88 — OFFERED_NOW matrix must cover all high-value buyer-language capabilities.
test('OFFERED_NOW matrix contains the canonical buyer-language capabilities', () => {
  const caps = OFFERED_NOW_MATRIX.map((c) => c.capability.toLowerCase());
  for (const required of [
    'custom website',
    'frontend',
    'backend',
    'deployment',
    'ai receptionist',
    'missed-lead',
    'whatsapp',
    'crm',
    'booking',
    'audit',
    'seo',
    'monitoring',
    'workflow automation',
    'integrations',
    'quote',
    'google business',
    'maintenance',
  ]) {
    assert.ok(
      caps.some((c) => c.includes(required)),
      `OFFERED_NOW matrix missing capability containing: ${required}`
    );
  }
});

// V15 §88 — every OFFERED_NOW capability must have a delivery model.
test('every OFFERED_NOW capability has a delivery model', () => {
  const allowed = [
    'PRODUCTIZED_READY_NOW',
    'CUSTOM_SCOPED_READY_NOW',
    'INTEGRATION_READY_NOW',
    'REQUIRES_THIRD_PARTY_PROVIDER',
    'REQUIRES_DISCOVERY',
    'OWNER_APPROVAL_REQUIRED',
  ];
  for (const c of OFFERED_NOW_MATRIX) {
    assert.ok(
      allowed.includes(c.deliveryModel),
      `${c.capability}: deliveryModel "${c.deliveryModel}" not allowed`
    );
    assert.ok(c.buyerLanguage.length > 20, `${c.capability}: buyerLanguage too short`);
  }
});

// V15 §88 — every OFFERED_NOW capability must have a valid proof class.
test('every OFFERED_NOW capability has a valid proof class', () => {
  for (const c of OFFERED_NOW_MATRIX) {
    assert.ok(
      PROOF_CLASSES.includes(c.proofClass),
      `${c.capability}: proofClass "${c.proofClass}" invalid`
    );
  }
});

// V15 §59 — never upgrade proof class without evidence; DEMONSTRATION-only items
// must not claim CLIENT_DEPLOYMENT / CLIENT_VERIFIED_RESULT / QUANTIFIED_VERIFIED_RESULT.
test('no capability falsely claims CLIENT_DEPLOYMENT or QUANTIFIED_VERIFIED_RESULT', () => {
  for (const c of OFFERED_NOW_MATRIX) {
    assert.notEqual(c.proofClass, 'CLIENT_DEPLOYMENT', `${c.capability}: cannot claim CLIENT_DEPLOYMENT without owner evidence`);
    assert.notEqual(c.proofClass, 'CLIENT_VERIFIED_RESULT', `${c.capability}: cannot claim CLIENT_VERIFIED_RESULT without owner evidence`);
    assert.notEqual(c.proofClass, 'QUANTIFIED_VERIFIED_RESULT', `${c.capability}: cannot claim QUANTIFIED_VERIFIED_RESULT without owner evidence`);
  }
});

// V15 §119 — safe restatements exist for every diagnostic-phase phrase.
test('safe restatements cover every known diagnostic-phase phrase', () => {
  for (const key of [
    'written_boundary',
    'reviewed_request',
    'separately_scoped_provider',
    'smallest_useful_system',
    'evidence_before_interface',
    'no_fixed_timeline_price',
    'maps_operational_systems',
  ]) {
    const r = getSafeRestatement(key);
    assert.ok(r, `missing safe restatement for ${key}`);
    assert.ok(r.safeRestatement.length > 40, `${key}: safeRestatement too short`);
    assert.match(r.safeRestatement, /IronWake/, `${key}: restatement must still name IronWake`);
  }
});

// V15 §82 — no restatement should describe all IronWake work as diagnostic-only.
test('no restatement reduces IronWake to diagnostic-only or consultancy-only', () => {
  for (const r of Object.values(SAFE_RESTATEMENTS)) {
    assert.doesNotMatch(r.safeRestatement, /IronWake only maps/i);
    assert.doesNotMatch(r.safeRestatement, /IronWake does not (design|code|build)/i);
    assert.doesNotMatch(r.safeRestatement, /IronWake does not exist/i);
    assert.doesNotMatch(r.safeRestatement, /unavailable/i);
  }
});

// V15 §87 — identity classification must include the four categories.
test('identity classification contains A/B/C/D classes', () => {
  const classes = new Set(Object.values(IDENTITY_CLASSIFICATION).map((v) => v.classification));
  for (const required of ['A', 'B', 'C', 'D']) {
    assert.ok(classes.has(required), `identity classification missing class ${required}`);
  }
});

// helpers
test('listOfferedNow returns only OFFERED_NOW entries', () => {
  const items = listOfferedNow();
  assert.ok(items.length >= 10, 'expected at least 10 OFFERED_NOW capabilities');
  for (const c of items) assert.equal(c.status, 'OFFERED_NOW');
});

test('capabilitiesByServiceId filters correctly', () => {
  const aiRecep = capabilitiesByServiceId('ai-receptionist-voice');
  assert.ok(aiRecep.length >= 1);
  assert.ok(
    aiRecep.some((c) => c.capability.toLowerCase().includes('ai receptionist')),
    'ai-receptionist-voice service should have an AI receptionist capability'
  );
});

test('canonicalEntityPayload exposes the canonical brand + counts', () => {
  const p = canonicalEntityPayload();
  assert.equal(p.brand, 'IronWake');
  assert.ok(p.offeredNowCount >= 10);
  assert.ok(Array.isArray(p.proofClasses));
  assert.match(p.summary, /India/i);
  assert.match(p.summary, /International/i);
});

// V15 §122 — semantic regression: the canonical category statement must NOT
// teach the false universal "systems only / maps only" model.
test('canonical entity explicitly teaches build capability, not just mapping', () => {
  for (const text of [CANONICAL_CATEGORY_STATEMENT, CANONICAL_ENTITY_SUMMARY]) {
    assert.match(text, /designs and builds/i);
    assert.match(text, /websites/i);
    assert.doesNotMatch(text, /only maps/i);
    assert.doesNotMatch(text, /consultancy only/i);
  }
});
