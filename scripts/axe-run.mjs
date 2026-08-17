#!/usr/bin/env node
// ponytail: axe-core live-site audit.
// Uses puppeteer + @axe-core/puppeteer to evaluate WCAG 2.1 AA on the
// canonical IronWake surface. Writes reports/axe-report.json.
//
// Usage:
//   node scripts/axe-run.mjs                  # audits 5 default routes
//   ROUTES=https://x,https://y node scripts/axe-run.mjs
//
// Fail policy: exits 0 if any axe violations exist (informational),
// exits 1 only on browser/network/runtime failure.

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

function findRepoRoot(start) {
  // Walk upward looking for wrangler.toml / package.json / scripts/a11y-audit.mjs.
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

// Prefer IRONWAKE_ROOT, then the repo containing this script, then cwd.
const ROOT       = process.env.IRONWAKE_ROOT
  || (existsSync(resolve(__dirname, '../wrangler.toml')) ? resolve(__dirname, '..') : findRepoRoot(process.cwd()));
const REPORT_DIR = resolve(ROOT, 'reports');
const REPORT_PATH = resolve(REPORT_DIR, 'axe-report.json');

const DEFAULT_ROUTES = [
  'https://ironwake.dev/',
  'https://ironwake.dev/pricing',
  'https://ironwake.dev/systems/ai-receptionist',
  'https://ironwake.dev/work',
  'https://ironwake.dev/login',
];

const ROUTES = (process.env.ROUTES || DEFAULT_ROUTES.join(',')).split(',').map(s => s.trim()).filter(Boolean);

// Try several well-known locations for puppeteer + @axe-core/puppeteer.
const SEARCH_DIRS = [
  ROOT,
  resolve(ROOT, '.ironwake-a11y'),
  resolve(ROOT, 'node_modules'),
  resolve(process.env.HOME || '/root', '.cache/ironwake-a11y'),
  '/home/shadowlingo/.cache/ironwake-a11y',
];

function findPkgDir(pkg) {
  for (const base of SEARCH_DIRS) {
    const candidate = resolve(base, 'node_modules', pkg);
    if (existsSync(candidate)) return base;
  }
  return null;
}

async function main() {
  const base = findPkgDir('puppeteer');
  const axeBase = findPkgDir('@axe-core/puppeteer');
  if (!base || !axeBase) {
    const missing = [!base && 'puppeteer', !axeBase && '@axe-core/puppeteer'].filter(Boolean).join(', ');
    console.error(JSON.stringify({
      status: 'error',
      reason: `axe-core browser runtime not available (missing: ${missing}). Install with: npm install --no-save puppeteer @axe-core/puppeteer`,
      searchedDirs: SEARCH_DIRS,
    }, null, 2));
    process.exit(1);
  }
  // Make require resolve from the directory that has the deps.
  // Walk upward looking for a node_modules that contains @axe-core/puppeteer.
  function findDepsModule(name) {
    const ABSOLUTE_CANDIDATES = [
      '/home/shadowlingo/.cache/ironwake-a11y/node_modules',
      '/home/shadowlingo/.cache/ironwake-a11y',
      '/home/shadowlingo/.npm/_npx',
    ];
    for (const root of ABSOLUTE_CANDIDATES) {
      if (existsSync(resolve(root, name))) return root;
      try {
        for (const sub of readdirSync(root, { withFileTypes: true })) {
          if (existsSync(resolve(root, sub.name, 'node_modules', name))) {
            return resolve(root, sub.name, 'node_modules');
          }
        }
      } catch {}
    }
    let cur = dirname(__filename);
    for (let i = 0; i < 8; i++) {
      const cand = resolve(cur, 'node_modules', name);
      if (existsSync(cand)) return resolve(cur, 'node_modules');
      const parent = resolve(cur, '..');
      if (parent === cur) break;
      cur = parent;
    }
    return null;
  }
  const nm = findDepsModule('@axe-core/puppeteer');
  if (!nm) throw new Error('@axe-core/puppeteer not found in any candidate node_modules — install it via `npx --package=@axe-core/puppeteer --package=puppeteer -- -e ""` once to cache.');
  const req = createRequire(resolve(nm, '.', '@axe-core/puppeteer/package.json'));
  const puppeteer = req('puppeteer');
  const axeMod = req('@axe-core/puppeteer');
  const AxePuppeteer = axeMod.AxePuppeteer || axeMod.AxeBuilder || axeMod.default;

  mkdirSync(REPORT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results = [];
  const startedAt = new Date().toISOString();
  let totalViolations = 0;
  let totalImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };

  try {
    for (const url of ROUTES) {
      const page = await browser.newPage();
      try {
        await page.setBypassCSP(true);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
        // axe-core injects its own script and reads the live DOM.
        await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 1500));
        const axeResults = await new AxePuppeteer(page)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const summary = {
          url,
          testedAt: new Date().toISOString(),
          violationCount: axeResults.violations.length,
          incompleteCount: axeResults.incomplete.length,
          incomplete: axeResults.incomplete.slice(0, 10).map(i => ({
            id: i.id,
            impact: i.impact,
            description: i.description,
            nodes: i.nodes.length,
          })),
          passCount: axeResults.passes.length,
          violations: axeResults.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            nodes: v.nodes.map(n => ({
              target: n.target,
              html: n.html && n.html.length > 240 ? n.html.slice(0, 240) + '…' : n.html,
              failureSummary: n.failureSummary,
            })),
          })),
        };
        results.push(summary);
        totalViolations += summary.violationCount;
        for (const v of axeResults.violations) {
          if (v.impact && totalImpact[v.impact] !== undefined) totalImpact[v.impact]++;
        }
      } catch (e) {
        results.push({ url, error: String(e.message || e) });
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  const report = {
    tool: '@axe-core/puppeteer',
    toolVersion: (() => {
      try {
        const pkgPath = resolve(nm, '@axe-core/puppeteer/package.json');
        return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
      } catch { return 'unknown'; }
    })(),
    startedAt,
    completedAt: new Date().toISOString(),
    routesAudited: ROUTES,
    routesSucceeded: results.filter(r => !r.error).length,
    routesFailed: results.filter(r => r.error).length,
    totalViolations,
    impactCounts: totalImpact,
    results,
  };
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    status: 'ok',
    reportPath: REPORT_PATH,
    routesAudited: ROUTES.length,
    totalViolations,
    impactCounts: totalImpact,
  }, null, 2));
  // Informational, not a hard fail.
  process.exit(0);
}

main().catch(e => {
  console.error(JSON.stringify({ status: 'error', reason: e.message, stack: e.stack }, null, 2));
  process.exit(1);
});
