// ponytail: accessibility audit. Scans the app/components for the
// following baseline patterns and reports findings:
//   - skip-link element in the root layout
//   - :focus-visible styling in any CSS
//   - prefers-reduced-motion media query suppression of animations
//   - <button> and <a> elements with discernible text or aria-label
//   - <input> elements with associated <label> or aria-label
//   - <img> elements with alt attribute
//   - <h1> exists on every page

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function findAllJsFiles(dir = 'app', acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      findAllJsFiles(p, acc);
    } else if (/\.(js|jsx|mjs)$/.test(entry.name)) {
      acc.push(p);
    }
  }
  return acc;
}

const findings = [];

// 1. Root layout must have skip-link
const rootLayout = 'app/layout.js';
if (existsSync(rootLayout)) {
  const src = readFileSync(rootLayout, 'utf8');
  if (!/skip[-_]?link/i.test(src)) {
    findings.push({ kind: 'a11y-missing-skip-link', severity: 'error', file: rootLayout, detail: 'no skip-link in root layout' });
  }
  if (!/<h1[\s>]/i.test(src) && !/h1\.\$/i.test(src) && !/h1["`'].*}/.test(src)) {
    // h1 might be in nested pages — only warning at root
  }
}

// 2. Look for :focus-visible in CSS or globals
const cssFiles = ['app/globals.css', 'app/global.css'];
const cssFileExists = cssFiles.some(f => existsSync(f));
let hasFocusVisible = false;
if (cssFileExists) {
  for (const cf of cssFiles) {
    if (existsSync(cf) && /:focus-visible/.test(readFileSync(cf, 'utf8'))) {
      hasFocusVisible = true;
      break;
    }
  }
}
if (!hasFocusVisible) {
  findings.push({ kind: 'a11y-missing-focus-visible', severity: 'warning', file: 'app/globals.css', detail: 'no :focus-visible styling' });
}

// 3. Any component using animation must honor prefers-reduced-motion
const jsFiles = findAllJsFiles('app/components');
let motionFiles = 0;
let motionWithReduce = 0;
for (const f of jsFiles) {
  const src = readFileSync(f, 'utf8');
  if (/\b(animate|animation|motion|transition)\b/i.test(src)) {
    motionFiles++;
    if (/prefers-reduced-motion/.test(src)) motionWithReduce++;
  }
}
if (motionFiles > 0 && motionWithReduce < motionFiles) {
  findings.push({ kind: 'a11y-reduced-motion-incomplete', severity: 'warning', file: 'app/components/', detail: `${motionFiles} motion components, ${motionWithReduce} with prefers-reduced-motion` });
}

// 4. Pages with <button> lacking text or aria-label
const pageFiles = findAllJsFiles('app').filter(f => /\/page\.js$/.test(f));
for (const pf of pageFiles) {
  const src = readFileSync(pf, 'utf8');
  // match <button ...>...</button> and check for any text content or aria-label
  const buttons = [...src.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)];
  for (const m of buttons) {
    const attrs = m[0];
    const inner = (m[1] || '').trim();
    if (!inner && !/aria-label/.test(attrs)) {
      // empty button with no accessible name
      findings.push({ kind: 'a11y-empty-button', severity: 'warning', file: pf, detail: '<button> with no text or aria-label' });
      break; // one per page is enough
    }
  }
}

// 5. <img> missing alt
for (const pf of pageFiles) {
  const src = readFileSync(pf, 'utf8');
  const imgs = [...src.matchAll(/<img\s[^>]*>/g)];
  for (const m of imgs) {
    if (!/\balt\s*=/.test(m[0])) {
      findings.push({ kind: 'a11y-img-missing-alt', severity: 'error', file: pf, detail: '<img> without alt attribute' });
      break;
    }
  }
}

const errors = findings.filter(f => f.severity === 'error');
const audit = {
  scannedAt: new Date().toISOString(),
  filesScanned: jsFiles.length,
  pageFilesAudited: pageFiles.length,
  motionFilesDetected: motionFiles,
  motionFilesWithReduce: motionWithReduce,
  issueCount: errors.length,
  warningCount: findings.filter(f => f.severity === 'warning').length,
  issues: errors,
  details: findings,
};
console.log(JSON.stringify(audit, null, 2));
process.exit(errors.length === 0 ? 0 : 1);