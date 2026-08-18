#!/usr/bin/env node
// ponytail: real axe-core + real chromium audit on the live IronWake site.
// Launches chromium via chrome-launcher, drives it over raw Chrome DevTools
// Protocol using ws from the cached node_modules, injects axe-core from the
// just-installed ironwake node_modules, and writes results.
//
// Usage:
//   node scripts/axe-cdp-run.mjs                 # default 5 routes
//   ROUTES=https://x,https://y node scripts/axe-cdp-run.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
// Use the cached ws (chrome-launcher cache) via require so ESM doesn't try to
// resolve it from this script's package scope.
const requireCache = createRequire('/home/shadowlingo/.cache/ironwake-a11y/package.json');
const WebSocket = requireCache('ws');

function findRepoRoot(start) {
  let cur = start;
  for (let i = 0; i < 8; i++) {
    if (
      existsSync(resolve(cur, 'package.json')) ||
      existsSync(resolve(cur, 'wrangler.toml')) ||
      existsSync(resolve(cur, 'scripts/a11y-audit.mjs'))
    ) return cur;
    const parent = resolve(cur, '..');
    if (parent === cur) break;
    cur = parent;
  }
  return start;
}

const ROOT       = process.env.IRONWAKE_ROOT
  || (existsSync(resolve(__dirname, '../wrangler.toml')) ? resolve(__dirname, '..') : findRepoRoot(process.cwd()));
const REPORT_DIR = resolve(ROOT, 'reports');
const REPORT_PATH = resolve(REPORT_DIR, 'axe-cdp-report.json');

const DEFAULT_ROUTES = [
  'https://ironwake.netlify.app/',
  'https://ironwake.netlify.app/pricing',
  'https://ironwake.netlify.app/systems/ai-receptionist',
  'https://ironwake.netlify.app/work',
  'https://ironwake.netlify.app/login',
];
const ROUTES = (process.env.ROUTES || DEFAULT_ROUTES.join(',')).split(',').map(s => s.trim()).filter(Boolean);

function findChromiumBinary() {
  const candidates = [
    '/home/shadowlingo/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
    '/home/shadowlingo/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  return null;
}

const SEARCH_DIRS = [
  '/home/shadowlingo/.cache/ironwake-a11y',
  resolve(ROOT, 'node_modules'),
  resolve(ROOT, '.ironwake-a11y', 'node_modules'),
];

function findInSearchDirs(subpath) {
  for (const base of SEARCH_DIRS) {
    const cand = resolve(base, subpath);
    if (existsSync(cand)) return cand;
  }
  return null;
}

const chromeLauncherPath = findInSearchDirs('node_modules/chrome-launcher');
const wsPath = findInSearchDirs('node_modules/ws');

if (!chromeLauncherPath || !wsPath) {
  console.error(JSON.stringify({
    status: 'error',
    reason: 'chrome-launcher or ws not found in cache',
    searched: { chromeLauncherPath, wsPath, dirs: SEARCH_DIRS },
  }, null, 2));
  process.exit(1);
}

const requireFromCache = createRequire(join(wsPath, '..', '..', 'package.json'));
const chromeLauncher = requireFromCache('chrome-launcher');
// ws already imported above via `import WebSocket from 'ws'` but we want the
// same instance the cache uses; both work.

const AXE_SOURCE = readFileSync(resolve(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');
const AXE_VERSION = JSON.parse(readFileSync(resolve(ROOT, 'node_modules/axe-core/package.json'), 'utf8')).version;

mkdirSync(REPORT_DIR, { recursive: true });

const chromiumBinary = findChromiumBinary();
if (!chromiumBinary) {
  console.error(JSON.stringify({
    status: 'error',
    reason: 'No chromium binary found',
    searched: [
      '/home/shadowlingo/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome',
    ],
  }, null, 2));
  process.exit(1);
}

console.error(`[axe-cdp-run] chromium: ${chromiumBinary}`);
console.error(`[axe-cdp-run] axe-core: ${AXE_VERSION} (${AXE_SOURCE.length} bytes)`);

const chrome = await chromeLauncher.launch({
  chromePath: chromiumBinary,
  chromeFlags: [
    '--headless=new',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
});

// --- Minimal CDP client over WebSocket ---
class CDPClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  waitEvent(method, timeoutMs = 60000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        const idx = this.events.findIndex(e => e.method === method);
        if (idx >= 0) { const [ev] = this.events.splice(idx, 1); resolve(ev); return; }
        if (Date.now() - start > timeoutMs) return reject(new Error(`timeout waiting for ${method}`));
        setTimeout(tick, 50);
      };
      tick();
    });
  }
}

async function auditRoute(url) {
  // Open a fresh about:blank tab and grab its debugger websocket url.
  // Modern Chrome requires PUT (not GET) for /json/new and /json/close.
  const newTab = await fetch(`http://127.0.0.1:${chrome.port}/json/new`, { method: 'PUT' }).then(r => r.json());
  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.once('open', res); ws.once('error', rej); });
  const cdp = new CDPClient(ws);

  try {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');
    await cdp.send('Page.setBypassCSP', { enabled: true });

    // Inject axe-core as an early script on every new document. This way axe
    // is on window by the time the page finishes loading, regardless of CSP
    // or other page-script behavior.
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: AXE_SOURCE,
      runImmediately: true,
    });

    const navStart = Date.now();
    const navP = cdp.waitEvent('Page.loadEventFired', 45000).catch(() => null);
    await cdp.send('Page.navigate', { url });
    await navP;
    // Let React + motion reveals finish mounting.
    await new Promise(r => setTimeout(r, 2500));
    const navMs = Date.now() - navStart;

    // Sanity check that axe is available before running.
    const sanity = await cdp.send('Runtime.evaluate', {
      expression: `JSON.stringify({ hasRun: typeof window.axe !== 'undefined' && typeof window.axe.run === 'function' })`,
      returnByValue: true,
    });
    if (sanity.result.value !== '{"hasRun":true}') {
      throw new Error('axe did not load into window: ' + sanity.result.value);
    }

    // Run axe on the live document.
    const runP = cdp.send('Runtime.evaluate', {
      expression: `window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] }, resultTypes: ['violations','incomplete','passes'] }).then(r => JSON.stringify(r)).catch(e => JSON.stringify({ axeError: true, message: String(e && e.message || e), stack: String(e && e.stack || '') }))`,
      awaitPromise: true,
      returnByValue: true,
    });
    const axeRun = await Promise.race([
      runP,
      new Promise((_, rej) => setTimeout(() => rej(new Error('axe.run timeout')), 60000)),
    ]);
    let parsed;
    try { parsed = JSON.parse(axeRun.result.value); }
    catch (e) {
      throw new Error('axe returned non-JSON: ' + String(axeRun.result.value).slice(0, 400));
    }
    if (parsed && parsed.axeError) {
      throw new Error('axe.run internal: ' + parsed.message + ' :: ' + parsed.stack);
    }
    const axeResults = parsed;

    const violations = axeResults.violations || [];
    const incomplete = axeResults.incomplete || [];
    const passes     = axeResults.passes     || [];

    const summary = {
      url,
      testedAt: new Date().toISOString(),
      navMs,
      violationCount: violations.length,
      incompleteCount: incomplete.length,
      passCount: passes.length,
      impactCounts: {
        critical: violations.filter(v => v.impact === 'critical').length,
        serious:  violations.filter(v => v.impact === 'serious').length,
        moderate: violations.filter(v => v.impact === 'moderate').length,
        minor:    violations.filter(v => v.impact === 'minor').length,
      },
      incomplete: incomplete.slice(0, 10).map(i => ({
        id: i.id, impact: i.impact, description: i.description, nodes: i.nodes.length,
      })),
      violations: violations.map(v => ({
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
    return summary;
  } finally {
    try { ws.close(); } catch {}
    // Close the tab to keep the browser lean between audits.
    try {
      await fetch(`http://127.0.0.1:${chrome.port}/json/close/${newTab.id}`, { method: 'PUT' }).catch(() => {});
    } catch {}
  }
}

const results = [];
const startedAt = new Date().toISOString();
let totalViolations = 0;
const totalImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };

try {
  for (const url of ROUTES) {
    process.stderr.write(`[axe-cdp-run] auditing ${url}\n`);
    try {
      const r = await auditRoute(url);
      results.push(r);
      totalViolations += r.violationCount;
      for (const k of Object.keys(totalImpact)) totalImpact[k] += r.impactCounts[k];
      process.stderr.write(`  violations=${r.violationCount} incomplete=${r.incompleteCount} pass=${r.passCount} nav=${r.navMs}ms\n`);
    } catch (e) {
      results.push({ url, error: String(e.message || e) });
      process.stderr.write(`  ERROR: ${e.message || e}\n`);
    }
  }
} finally {
  await chrome.kill();
}

const report = {
  tool: 'axe-core',
  toolVersion: AXE_VERSION,
  runner: 'scripts/axe-cdp-run.mjs (chromium + raw CDP via ws)',
  chromiumBinary,
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
  toolVersion: AXE_VERSION,
  routesAudited: ROUTES.length,
  routesSucceeded: report.routesSucceeded,
  routesFailed: report.routesFailed,
  totalViolations,
  impactCounts: totalImpact,
}, null, 2));
process.exit(0);
