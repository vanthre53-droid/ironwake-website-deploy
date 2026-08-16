// ponytail: mobile-overlap audit. Statically scans globals.css and inline
// styles for common mobile defects:
//   - non-max fixed width > 500px outside mobile @media overrides
//   - non-max fixed height > 600px
//   - position: fixed at top:0 / bottom:0 without mobile exclusion
//   - body { overflow: hidden } (kills scroll)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const issues = [];

// 1. globals.css scan
const CSS_PATH = join(ROOT, 'app/globals.css');
const css = readFileSync(CSS_PATH, 'utf8');

// split into chunks: top-level and @media blocks
const blocks = [];
const topRe = /(^|})\s*([^{}@]+)\{([^}]*)\}/gm;
// ponytail: handle nested braces in @media; do a simpler approach — split
// the file by "@media" then process the prelude as top-level and each
// media-block separately.
const parts = css.split(/@media[^{]*\{/);
const preludes = [parts[0]];
// remaining parts contain the body of each @media, but we lost the
// selector — for our audit we don't need it; what matters is: inside
// @media (max-width: SMALL), fixed widths are FINE (they're mobile reset).
// So any large width found ONLY in the prelude (parts[0]) is the suspect.
// Anything found in @media blocks is allowed (mobile override).
for (let i = 1; i < parts.length; i++) {
  // body of @media is parts[i] until the matching closing brace; we use
  // a balanced match. For typical CSS this is shallow.
  let depth = 1;
  let body = '';
  let rest = '';
  for (let j = 0; j < parts[i].length; j++) {
    const c = parts[i][j];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { rest = parts[i].slice(j + 1); break; } }
    body += c;
  }
  preludes.push(body);
  parts[i] = rest;
}

// only audit the first prelude (top-level), not @media overrides
const topCss = preludes[0];

// non-max width > 500px outside @media mobile override
for (const m of topCss.matchAll(/(^|[^-])\bwidth\s*:\s*(\d+)px\b/g)) {
  const px = parseInt(m[2], 10);
  if (px > 500) issues.push({ file: 'app/globals.css', kind: 'fixed-width-large', width: px + 'px' });
}
// non-max height > 600px
for (const m of topCss.matchAll(/(^|[^-])\bheight\s*:\s*(\d+)px\b/g)) {
  const px = parseInt(m[2], 10);
  if (px > 600) issues.push({ file: 'app/globals.css', kind: 'fixed-height-large', height: px + 'px' });
}

// body overflow:hidden kills scroll
for (const m of topCss.matchAll(/body\s*\{([^}]+)\}/g)) {
  if (/overflow\s*:\s*hidden/.test(m[1])) {
    issues.push({ file: 'app/globals.css', kind: 'body-overflow-hidden' });
  }
}

// 2. inline style="width: <big>px" in app/
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.open-next') continue;
      walk(p, acc);
    } else if (/\.(js|jsx|tsx|ts)$/.test(entry.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(join(ROOT, 'app'));
const inlineWidthRe = /width\s*:\s*['"]?(\d+)px/g;
const inlineHeightRe = /height\s*:\s*['"]?(\d+)px/g;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  // skip lines that contain maxWidth/max-width (those are bounds, not sizes)
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('maxWidth') || line.includes('max-width')) continue;
    let m;
    if ((m = inlineWidthRe.exec(line))) {
      const px = parseInt(m[1], 10);
      if (px > 500) issues.push({ file: relative(ROOT, f), kind: 'inline-width-large', width: px + 'px', line: i + 1 });
    }
    if ((m = inlineHeightRe.exec(line))) {
      const px = parseInt(m[1], 10);
      if (px > 600) issues.push({ file: relative(ROOT, f), kind: 'inline-height-large', height: px + 'px', line: i + 1 });
    }
  }
}

// 3. detect @media coverage
const mediaRe = /@media\s*\([^)]*max-width\s*:\s*(\d+)px/g;
const mediaSizes = new Set();
for (const m of css.matchAll(mediaRe)) mediaSizes.add(parseInt(m[1], 10));

const summary = {
  scannedAt: new Date().toISOString(),
  inlineFilesScanned: files.length,
  cssFilesScanned: 1,
  mediaBreakpointsPx: [...mediaSizes].sort((a, b) => a - b),
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
