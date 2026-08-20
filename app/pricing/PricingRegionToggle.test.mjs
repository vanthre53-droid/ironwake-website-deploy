// ponytail: PricingRegionToggle runtime contract test.
// applyRegion is the pure-ESM function that the React component delegates to.
// It must swap which [data-region] price nodes are visible when region changes.
// We stub a minimal global.document so the function has something to walk.
// This is the V14 §25 "India → ₹ / International → $" contract at the DOM level.
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRegion } from './apply-region.mjs';

function makeEl(tagName, attrs = {}) {
  return {
    tagName: tagName.toUpperCase(),
    hidden: false,
    attrs: { ...attrs },
    getAttribute(name) {
      if (name === 'data-region') return this.attrs['data-region'] ?? null;
      return this.attrs[name] ?? null;
    },
    setAttribute(name, value) {
      this.attrs[name] = value;
    }
  };
}

// Minimal CSS-attribute-selector matcher.
// Supports the exact selector strings applyRegion uses:
//   [data-region="india"]
//   [data-region="intl"]
//   .pricing-card-pricing[data-region]
//   button[data-pricing-region]
function selectorMatches(el, selector) {
  // OR-list: split on top-level commas
  const alts = splitTopLevelCommas(selector);
  return alts.some((s) => matchesOne(el, s.trim()));
}

function splitTopLevelCommas(s) {
  const out = [];
  let depth = 0;
  let buf = '';
  for (const ch of s) {
    if (ch === '[') depth++;
    if (ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

function matchesOne(el, sel) {
  // Tag.[attr=val] or [attr=val] or .cls[attr=val] or .cls
  let rest = sel;
  let tagRequired = null;
  const m = rest.match(/^([a-zA-Z]+)/);
  if (m) { tagRequired = m[1].toUpperCase(); rest = rest.slice(m[0].length); }
  if (tagRequired && el.tagName !== tagRequired) return false;

  const classParts = [];
  const attrParts = [];
  let i = 0;
  while (i < rest.length) {
    if (rest[i] === '.') {
      let j = i + 1;
      while (j < rest.length && /[a-zA-Z0-9_-]/.test(rest[j])) j++;
      classParts.push(rest.slice(i + 1, j));
      i = j;
    } else if (rest[i] === '[') {
      const close = rest.indexOf(']', i);
      if (close === -1) return false;
      const inner = rest.slice(i + 1, close);
      attrParts.push(inner);
      i = close + 1;
    } else {
      i++;
    }
  }

  for (const cls of classParts) {
    const clsList = String(el.attrs?.class ?? '');
    const tokens = clsList.split(/\s+/).filter(Boolean);
    if (!tokens.includes(cls)) return false;
  }
  for (const a of attrParts) {
    const eq = a.indexOf('=');
    if (eq === -1) {
      const name = a.trim();
      if (el.getAttribute(name) === null) return false;
    } else {
      const name = a.slice(0, eq).trim();
      const val = a.slice(eq + 1).replace(/^["']|["']$/g, '');
      if (el.getAttribute(name) !== val) return false;
    }
  }
  return true;
}

function makeDocStub(elements) {
  return {
    querySelectorAll(selector) {
      const matched = elements.filter((el) => selectorMatches(el, selector));
      return { forEach: (fn) => matched.forEach(fn), length: matched.length };
    }
  };
}

test('applyRegion("india") reveals India spans, hides International, sets aria-pressed correctly', () => {
  const indiaSpan = makeEl('span', { 'data-region': 'india' });
  const intlSpan = makeEl('span', { 'data-region': 'intl' });
  const indiaBtn = makeEl('button', { 'data-pricing-region': 'india', 'aria-pressed': 'false' });
  const intlBtn = makeEl('button', { 'data-pricing-region': 'intl', 'aria-pressed': 'true' });
  global.document = makeDocStub([indiaSpan, intlSpan, indiaBtn, intlBtn]);

  applyRegion('india');

  assert.equal(indiaSpan.hidden, false, 'India span should be visible');
  assert.equal(intlSpan.hidden, true, 'Intl span should be hidden');
  assert.equal(indiaBtn.attrs['aria-pressed'], 'true', 'India button should be aria-pressed=true');
  assert.equal(intlBtn.attrs['aria-pressed'], 'false', 'Intl button should be aria-pressed=false');

  delete global.document;
});

test('applyRegion("intl") reverses the previous state', () => {
  const indiaSpan = makeEl('span', { 'data-region': 'india' });
  const intlSpan = makeEl('span', { 'data-region': 'intl' });
  const indiaBtn = makeEl('button', { 'data-pricing-region': 'india', 'aria-pressed': 'true' });
  const intlBtn = makeEl('button', { 'data-pricing-region': 'intl', 'aria-pressed': 'false' });
  global.document = makeDocStub([indiaSpan, intlSpan, indiaBtn, intlBtn]);

  applyRegion('intl');

  assert.equal(indiaSpan.hidden, true, 'India span should be hidden after intl');
  assert.equal(intlSpan.hidden, false, 'Intl span should be visible after intl');
  assert.equal(indiaBtn.attrs['aria-pressed'], 'false', 'India button aria-pressed=false');
  assert.equal(intlBtn.attrs['aria-pressed'], 'true', 'Intl button aria-pressed=true');

  delete global.document;
});

test('applyRegion is no-op without a document', () => {
  delete global.document;
  // must not throw
  applyRegion('india');
  assert.ok(true, 'no document → no throw, no work');
});

test('applyRegion also toggles .pricing-card-pricing block containers by data-region', () => {
  const indiaBlock = makeEl('div', { 'data-region': 'india', class: 'pricing-card-pricing' });
  const intlBlock = makeEl('div', { 'data-region': 'intl', class: 'pricing-card-pricing' });
  global.document = makeDocStub([indiaBlock, intlBlock]);

  applyRegion('intl');
  assert.equal(indiaBlock.hidden, true);
  assert.equal(intlBlock.hidden, false);

  delete global.document;
});
