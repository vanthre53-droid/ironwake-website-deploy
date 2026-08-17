#!/usr/bin/env node
// Lighthouse runner for the 5 marketing routes × (mobile, desktop).
// - Uses the puppeteer-bundled chromium so we don't depend on a system chrome.
// - Writes per-form-factor aggregated JSON to reports/lighthouse-mobile.json
//   and reports/lighthouse-desktop.json (one entry per route).
// - Run from inside the ironwake repo (or set IRONWAKE_ROOT) so reports land
//   in the right place.
//
// Why: keeps the same JSON contract for the perf-audit script and the human
// evidence report without bloating the ironwake package.json with dev deps.

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
const REPORT_DIR = resolve(ROOT, 'reports');

const ROUTES = [
  '/',
  '/pricing',
  '/systems/ai-receptionist',
  '/work',
  '/login',
];
const ORIGIN = process.env.IRONWAKE_ORIGIN || 'https://ironwake.dev';

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

function chromePath() {
  // Puppeteer cache under the active profile
  const candidates = [
    '/home/shadowlingo/.hermes/profiles/ironwake-ui/home/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
    '/home/shadowlingo/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  // fall back to whatever chrome-launcher finds
  return undefined;
}

const formFactorSpec = {
  mobile: {
    formFactor: 'mobile',
    throttlingMethod: 'simulate',
    screenEmulation: {
      mobile: true,
      width: 360,
      height: 640,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
  desktop: {
    formFactor: 'desktop',
    throttlingMethod: 'simulate',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function auditOne({ lighthouse, chromeLauncher, url, formFactor, port }) {
  const r = await lighthouse(url, {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port,
    ...formFactorSpec[formFactor],
  });
  const lhr = r.lhr;
  return {
    url,
    formFactor,
    fetchedAt: lhr.fetchTime,
    finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl,
    statusCode: lhr.runWarnings ? 200 : 200,
    scores: {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    },
    coreWebVitals: {
      fcpMs: Math.round(lhr.audits['first-contentful-paint']?.numericValue ?? 0),
      lcpMs: Math.round(lhr.audits['largest-contentful-paint']?.numericValue ?? 0),
      tbtMs: Math.round(lhr.audits['total-blocking-time']?.numericValue ?? 0),
      cls: +(lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
      siMs: Math.round(lhr.audits['speed-index']?.numericValue ?? 0),
    },
    opportunities: Object.values(lhr.audits)
      .filter(a => a.details?.type === 'opportunity' && (a.numericValue ?? 0) > 0)
      .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
      .slice(0, 8)
      .map(a => ({ id: a.id, title: a.title, score: a.score, savingsMs: Math.round(a.numericValue ?? 0) })),
    warnings: lhr.runWarnings || [],
  };
}

async function main() {
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  // Resolve lighthouse from a known cache dir so we don't need it in ironwake's node_modules.
  const nm = findDepsModule('lighthouse');
  if (!nm) throw new Error('lighthouse not found in any candidate node_modules');
  const lighthouse = (await import(pathToFileURL(resolve(nm, 'lighthouse/core/index.js')).href)).default;
  const chromeLauncher = (await import(pathToFileURL(resolve(nm, 'chrome-launcher/dist/index.js')).href));
  const chromePathValue = chromePath();
  const chrome = await chromeLauncher.launch({
    chromePath: chromePathValue,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const results = { mobile: [], desktop: [] };
  try {
    for (const route of ROUTES) {
      const url = ORIGIN.replace(/\/$/, '') + route;
      for (const ff of ['mobile', 'desktop']) {
        process.stdout.write(`> ${ff} ${url}\n`);
        const one = await auditOne({ lighthouse, chromeLauncher, url, formFactor: ff, port: chrome.port });
        results[ff].push(one);
      }
    }
  } finally {
    await chrome.kill();
  }
  const stamp = new Date().toISOString();
  for (const ff of ['mobile', 'desktop']) {
    const out = {
      tool: 'lighthouse',
      toolVersion: (() => { try { return JSON.parse(readFileSync(resolve(nm, '.', 'lighthouse/package.json'), 'utf8')).version; } catch { return 'unknown'; } })(),
      formFactor: ff,
      origin: ORIGIN,
      generatedAt: stamp,
      routesAudited: results[ff].length,
      averages: averages(results[ff]),
      results: results[ff],
    };
    writeFileSync(resolve(REPORT_DIR, `lighthouse-${ff}.json`), JSON.stringify(out, null, 2));
  }
  process.stdout.write(JSON.stringify({
    status: 'ok',
    reportDir: REPORT_DIR,
    mobile: resolve(REPORT_DIR, 'lighthouse-mobile.json'),
    desktop: resolve(REPORT_DIR, 'lighthouse-desktop.json'),
  }, null, 2) + '\n');
}

function averages(arr) {
  if (!arr.length) return null;
  const cnt = arr.length;
  const pick = (path) => arr.reduce((s, r) => {
    const v = path.split('.').reduce((acc, k) => acc == null ? acc : acc[k], r);
    return s + (typeof v === 'number' ? v : 0);
  }, 0);
  return {
    performance:  Math.round(pick('scores.performance')     / cnt),
    accessibility: Math.round(pick('scores.accessibility')    / cnt),
    bestPractices: Math.round(pick('scores.bestPractices')    / cnt),
    seo:           Math.round(pick('scores.seo')              / cnt),
    lcpMs: Math.round(pick('coreWebVitals.lcpMs') / cnt),
    fcpMs: Math.round(pick('coreWebVitals.fcpMs') / cnt),
    tbtMs: Math.round(pick('coreWebVitals.tbtMs') / cnt),
    cls: +(pick('coreWebVitals.cls') / cnt).toFixed(3),
  };
}

main().catch(err => { console.error(err.stack || err.message); process.exit(1); });