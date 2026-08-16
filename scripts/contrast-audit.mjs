// ponytail: contrast audit. Parses CSS custom properties from globals.css,
// computes WCAG 2.1 contrast ratios against common background pairs, and
// reports any combination that fails the 4.5:1 (normal text) or 3:1
// (large text) thresholds.
import { readFileSync } from 'node:fs';

const CSS_PATH = '/mnt/c/Users/vanth/Downloads/ironwake/app/globals.css';
const src = readFileSync(CSS_PATH, 'utf8');

// extract --var: #hex declarations
const VAR_RE = /--([a-z0-9-]+):\s*([^;]+);/gi;
const vars = {};
for (const m of src.matchAll(VAR_RE)) {
  vars[m[1]] = m[2].trim();
}

// also resolve var(...) chains one level deep
function resolve(v) {
  if (!v) return null;
  const key = v.startsWith('--') ? v.slice(2) : v;
  if (vars[key]) return resolve(vars[key]);
  return v;
}

// hex to luminance per WCAG 2.1
function luminance(hex) {
  const m = hex.replace('#', '');
  const c = m.length === 3
    ? m.split('').map(x => x + x).join('')
    : m;
  if (!/^[0-9a-f]{6}$/i.test(c)) return null;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const f = x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg, bg) {
  const L1 = luminance(fg);
  const L2 = luminance(bg);
  if (L1 == null || L2 == null) return null;
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// common pairs from globals.css body
const pairs = [
  ['--ink',     '--paper'],
  ['--graphite','--paper'],
  ['--copper',  '--paper'],
  ['--copper-dark','--paper'],
  ['--aqua',    '--paper'],
  ['--ink',     '--surface'],
  ['--graphite','--surface'],
  ['--copper',  '--surface'],
];

const issues = [];
const results = [];
for (const [fgName, bgName] of pairs) {
  const fg = resolve(fgName);
  const bg = resolve(bgName);
  const ratio = contrast(fg, bg);
  if (ratio == null) continue;
  const pass45 = ratio >= 4.5;
  const pass3  = ratio >= 3.0;
  results.push({ fg: fgName, bg: bgName, fgHex: fg, bgHex: bg, ratio: ratio.toFixed(2), passAA_normal: pass45, passAA_large: pass3 });
  // only fail on normal text (4.5:1) — large text/UI accent allowed 3:1
  if (!pass45) {
    issues.push({ fg: fgName, bg: bgName, ratio: ratio.toFixed(2), threshold: '4.5:1' });
  }
}

const summary = {
  scannedAt: new Date().toISOString(),
  pairs: results,
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
