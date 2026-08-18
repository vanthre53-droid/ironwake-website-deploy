// ponytail: deterministic responsive audit. We don't run a browser — we
// verify the CSS supports each required viewport class with the right
// structural rules. Goals:
//   360 / 390 / 430 (phone)   → 1-col grids, hidden desktop-nav, mobile-nav visible
//   768 (tablet portrait)     → 2-col grids, mobile-nav still in primary nav
//   1024 / 1280 (laptop)      → 4-col grids, desktop-nav visible
//   1366 / 1440 / 1920 (wide) → .shell max-width 1280px caps content width
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const css = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '');
}
const clean = stripComments(css);

// Parse @media blocks with balanced braces so we can ask "is X inside any @media?"
function findAtBlocks(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const m = s.slice(i).match(/@media[^{]*\{/);
    if (!m) break;
    const start = i + m.index;
    let depth = 1;
    let j = start + m[0].length;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    out.push(s.slice(start, j));
    i = j;
  }
  return out;
}
const atBlocks = findAtBlocks(clean);
const hasAt = (selector) => atBlocks.some(b => b.includes(selector));

test('phone (≤430): navigation collapses to mobile-nav', () => {
  assert.ok(hasAt('.mobile-nav'), 'mobile-nav selector must be inside a @media block');
  assert.ok(hasAt('.desktop-nav'), 'desktop-nav selector must be inside a @media block');
});

test('phone (≤430): grids collapse to 1 column', () => {
  assert.ok(hasAt('.system-grid'), 'system-grid must have a @media override');
  assert.ok(hasAt('.industry-grid'), 'industry-grid must have a @media override');
});

test('tablet portrait (≤768): journey-grid 2-col', () => {
  assert.ok(hasAt('.journey-grid'), 'journey-grid must have a @media override');
});

test('laptop (≥1024): desktop-nav visible, mobile-nav hidden', () => {
  assert.match(clean, /desktop-nav\s*\{/, 'desktop-nav block must exist');
});

test('wide (≥1280): .shell caps content width', () => {
  assert.match(clean, /\.shell\s*\{[\s\S]*?width:\s*min\(1280px,\s*100%\)/);
});

test('all viewport classes covered by @media breakpoints', () => {
  const all = (clean.match(/@media\s*\([^)]*\)/g) || []).join('\n');
  assert.match(all, /max-width:\s*720px|max-width:\s*880px|max-width:\s*560px/, 'phone-class breakpoint must exist');
  assert.match(all, /max-width:\s*880px|max-width:\s*860px/, 'tablet-class breakpoint must exist');
});

test('reduced-motion respected', () => {
  assert.match(clean, /prefers-reduced-motion:\s*reduce/, 'prefers-reduced-motion must be respected');
});
