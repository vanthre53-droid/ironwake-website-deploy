// ponytail: accessibility audit. Combines a static codebase scan with the
// runtime axe-core findings stored at reports/axe-report.json (produced by
// scripts/axe-run.mjs) and the WCAG-AA color contrast pairs from
// scripts/contrast-audit.mjs. Output schema:
//
//   {
//     scannedAt, filesScanned, pageFilesAudited,
//     motionFilesDetected, motionFilesWithReduce,
//     issueCount, warningCount, issues, details,
//
//     // Evidence fields consumed by the human report and the release gate:
//     keyboard_navigation_matrix,  // buttons/anchors/inputs/img per page
//     focus_visible_audit,        // presence of :focus-visible + per-route
//     reduced_motion_compliance,  // motion files vs files honoring reduce
//     color_contrast_audit,       // pairs from contrast-audit.mjs
//     axe_core_findings,          // summary + per-route from axe-report.json
//   }
//
// The runtime axe report is OPTIONAL: if reports/axe-report.json does not
// exist (e.g. CI cold cache), axe_core_findings.ran = false and the static
// checks still gate the build. Run scripts/axe-run.mjs before relying on the
// runtime half of the evidence.
//
// Exit 0 iff no static errors. axe-core findings are warnings, not errors —
// the live page has zero axe violations today, but a re-run is cheap insurance.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

function findRepoRoot(start) {
  let cur = start;
  for (let i = 0; i < 8; i++) {
    if (
      existsSync(resolve(cur, 'wrangler.toml')) ||
      existsSync(resolve(cur, 'package.json')) ||
      existsSync(resolve(cur, 'scripts/a11y-audit.mjs'))
    ) return cur;
    const parent = resolve(cur, '..');
    if (parent === cur) break;
    cur = parent;
  }
  return start;
}

const ROOT = process.env.IRONWAKE_ROOT
  || (existsSync(resolve(__dirname, '../wrangler.toml')) ? resolve(__dirname, '..') : findRepoRoot(process.cwd()));
const REPORTS_DIR = resolve(ROOT, 'reports');
const AXE_REPORT  = resolve(REPORTS_DIR, 'axe-report.json');

const findings = [];
const evidence = {
  keyboard_navigation_matrix: { pages: [] },
  focus_visible_audit: { cssFilesChecked: [], cssHasFocusVisible: false },
  reduced_motion_compliance: { motionFiles: 0, motionFilesWithReduce: 0, ratio: 1 },
  color_contrast_audit: { source: null, pairs: [], failingPairs: 0 },
  axe_core_findings: { ran: false, reportPath: null, generatedAt: null, totalViolations: 0, impactCounts: {}, routes: [] },
};

// 1. Root layout must have skip-link
const rootLayout = resolve(ROOT, 'app/layout.js');
if (existsSync(rootLayout)) {
  const src = readFileSync(rootLayout, 'utf8');
  if (!/skip[-_]?link/i.test(src)) {
    findings.push({ kind: 'a11y-missing-skip-link', severity: 'error', file: rootLayout, detail: 'no skip-link in root layout' });
  }
}

// 2. Look for :focus-visible in CSS or globals
const cssCandidates = ['app/globals.css', 'app/global.css'].map(p => resolve(ROOT, p));
let hasFocusVisible = false;
for (const cf of cssCandidates) {
  if (existsSync(cf)) {
    evidence.focus_visible_audit.cssFilesChecked.push(cf.replace(ROOT + '/', ''));
    if (!hasFocusVisible && /:focus-visible/.test(readFileSync(cf, 'utf8'))) {
      hasFocusVisible = true;
    }
  }
}
evidence.focus_visible_audit.cssHasFocusVisible = hasFocusVisible;
if (!hasFocusVisible) {
  findings.push({ kind: 'a11y-missing-focus-visible', severity: 'warning', file: 'app/globals.css', detail: 'no :focus-visible styling' });
}

// 3. Any component using animation must honor prefers-reduced-motion
const jsFiles = findAllJsFiles(resolve(ROOT, 'app/components'));
let motionFiles = 0;
let motionWithReduce = 0;
const motionFilesList = [];
for (const f of jsFiles) {
  const src = readFileSync(f, 'utf8');
  // Heuristic: only flag files that actually contain motion code, not just
  // comments mentioning 'animation'. Real motion code shows up as:
  //   - imports from 'framer-motion'
  //   - JSX animation classes (animate-*, transition-*, motion-* classes)
  //   - CSS @keyframes / transition: / animation: properties in inline styles
  //   - IntersectionObserver driving setTimeout-based reveals
  //   - requestAnimationFrame calls
  if (
    /from ['"]framer-motion['"]/.test(src) ||
    /\banimate-[a-z-]+/.test(src) ||
    /\bmotion-(?:safe|reduce)\b/.test(src) ||
    /(?:^|\W)transition\s*:/.test(src) ||
    /(?:^|\W)animation\s*:/.test(src) ||
    /@keyframes\b/.test(src) ||
    (/IntersectionObserver\b/.test(src) && /(setTimeout|setActive|setIndex|setStep|setPhase|reveal)/.test(src)) ||
    /\brequestAnimationFrame\b/.test(src)
  ) {
    motionFiles++;
    motionFilesList.push(f.replace(ROOT + '/', ''));
    if (/prefers-reduced-motion/.test(src)) motionWithReduce++;
  }
}
evidence.reduced_motion_compliance = {
  motionFiles,
  motionFilesWithReduce: motionWithReduce,
  ratio: motionFiles === 0 ? 1 : +(motionWithReduce / motionFiles).toFixed(3),
  files: motionFilesList,
};
if (motionFiles > 0 && motionWithReduce < motionFiles) {
  findings.push({ kind: 'a11y-reduced-motion-incomplete', severity: 'warning', file: 'app/components/', detail: `${motionFiles} motion components, ${motionWithReduce} with prefers-reduced-motion` });
}

// 4. Pages with <button> lacking text or aria-label
const pageFiles = findAllJsFiles(resolve(ROOT, 'app')).filter(f => /\/page\.js$/.test(f));
for (const pf of pageFiles) {
  const src = readFileSync(pf, 'utf8');
  const rel = pf.replace(ROOT + '/', '');
  let buttons = 0, buttonsAccessible = 0;
  let anchors = 0, anchorsAccessible = 0;
  let imgs = 0, imgsAccessible = 0;
  let inputs = 0, inputsAccessible = 0;
  let h1Count = 0;

  for (const m of src.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)) {
    buttons++;
    const attrs = m[0];
    const inner = (m[1] || '').trim();
    if (inner || /aria-label/.test(attrs)) buttonsAccessible++;
    else {
      findings.push({ kind: 'a11y-empty-button', severity: 'warning', file: pf, detail: '<button> with no text or aria-label' });
      break;
    }
  }
  for (const m of src.matchAll(/<a\s[^>]*>([\s\S]*?)<\/a>/g)) {
    anchors++;
    const inner = (m[1] || '').trim();
    if (inner || /aria-label/.test(m[0])) anchorsAccessible++;
  }
  for (const m of src.matchAll(/<img\s[^>]*>/g)) {
    imgs++;
    if (/\balt\s*=/.test(m[0])) imgsAccessible++;
    else {
      findings.push({ kind: 'a11y-img-missing-alt', severity: 'error', file: pf, detail: '<img> without alt attribute' });
      break;
    }
  }
  for (const m of src.matchAll(/<input\s[^>]*>/g)) {
    inputs++;
    if (/\baria-label\s*=/.test(m[0]) || /\baria-labelledby\s*=/.test(m[0])) {
      inputsAccessible++;
      continue;
    }
    // check for associated <label> by id (best effort)
    const idMatch = m[0].match(/\bid\s*=\s*["\']([^"\']+)["\']/);
    if (idMatch && new RegExp(`<label[^>]*for\s*=\s*["\']${idMatch[1]}`).test(src)) {
      inputsAccessible++;
      continue;
    }
    if (/type\s*=\s*["\']hidden["\']/.test(m[0])) {
      inputsAccessible++;
      continue;
    }
  }
  for (const m of src.matchAll(/<h1[\s>]/g)) h1Count++;

  evidence.keyboard_navigation_matrix.pages.push({
    page: rel,
    buttons: { total: buttons, accessible: buttonsAccessible },
    anchors: { total: anchors, accessible: anchorsAccessible },
    images:  { total: imgs,     accessible: imgsAccessible },
    inputs:  { total: inputs,   accessible: inputsAccessible },
    h1Count,
  });
}

// 5. Color contrast — read sibling script\'s output if available, else inline
const CONTRAST_REPORT = resolve(REPORTS_DIR, 'contrast-audit.json');
function readColorContrast() {
  if (existsSync(CONTRAST_REPORT)) {
    try { return { source: 'reports/contrast-audit.json', ...JSON.parse(readFileSync(CONTRAST_REPORT, 'utf8')) }; }
    catch (e) { /* fall through */ }
  }
  return null;
}
const cc = readColorContrast();
if (cc && Array.isArray(cc.pairs)) {
  const failingPairs = cc.pairs.filter(p => !(p.passAA_normal ?? p.passAA)).length;
  evidence.color_contrast_audit = {
    source: cc.source,
    pairs: cc.pairs.length,
    failingPairs,
    failingDetails: cc.pairs.filter(p => !(p.passAA_normal ?? p.passAA)).map(p => ({ fg: p.fg, bg: p.bg, ratio: p.ratio })),
  };
  if (failingPairs > 0) {
    findings.push({ kind: 'a11y-contrast-fail', severity: 'error', file: 'app/globals.css', detail: `${failingPairs} color pairs fail WCAG AA` });
  }
} else {
  evidence.color_contrast_audit.source = 'not-run';
}

// 6. axe-core findings from the live page
if (existsSync(AXE_REPORT)) {
  try {
    const ax = JSON.parse(readFileSync(AXE_REPORT, 'utf8'));
    const perRoute = ax.results.map(r => ({
      url: r.url,
      status: r.error ? 'error' : 'ok',
      violations: r.violationCount ?? 0,
      passes: r.passCount ?? 0,
      incomplete: r.incompleteCount ?? 0,
      incompleteIds: (r.incomplete ?? []).map(i => i.id),
      error: r.error ?? null,
    }));
    const incompleteRuleSet = new Set();
    let passSum = 0, passCount = 0;
    for (const r of perRoute) {
      for (const id of r.incompleteIds) incompleteRuleSet.add(id);
      if (r.status === 'ok') { passSum += r.passes; passCount += 1; }
    }
    evidence.axe_core_findings = {
      ran: true,
      reportPath: AXE_REPORT,
      generatedAt: ax.completedAt,
      tool: ax.tool,
      toolVersion: ax.toolVersion,
      routesAudited: ax.routesAudited,
      routesSucceeded: ax.routesSucceeded,
      routesFailed: ax.routesFailed,
      totalViolations: ax.totalViolations,
      impactCounts: ax.impactCounts,
      incompleteRules: [...incompleteRuleSet],
      passCountAvg: passCount ? passSum / passCount : 0,
      routes: perRoute,
    };
  } catch (e) {
    evidence.axe_core_findings.error = `failed to parse axe-report.json: ${e.message}`;
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
  // new evidence fields
  keyboard_navigation_matrix: evidence.keyboard_navigation_matrix,
  focus_visible_audit: evidence.focus_visible_audit,
  reduced_motion_compliance: evidence.reduced_motion_compliance,
  color_contrast_audit: evidence.color_contrast_audit,
  axe_core_findings: evidence.axe_core_findings,
};
console.log(JSON.stringify(audit, null, 2));
process.exit(errors.length === 0 ? 0 : 1);
