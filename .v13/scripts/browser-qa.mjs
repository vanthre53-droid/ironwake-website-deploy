#!/usr/bin/env node
// Stage 6 — Browser QA @9 viewports x 3 routes
// Read-only evidence capture: screenshots, console errors, overflow detection.
// Ponytail: minimal logic, no abstractions beyond what the task requires.

import { chromium } from 'playwright';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';

const BASE = process.env.IRONWAKE_QA_BASE || 'http://localhost:3000';
const OUT_BASELINES = '/home/shadowlingo/.local/share/ironwake-tools/design-skills/baselines/2026-08-18-v13-qa';
const OUT_RESULTS = '/mnt/c/Users/vanth/Downloads/ironwake/.v13/results';

const VIEWPORTS = [
  { w: 1920, h: 1080, label: '1920' },
  { w: 1440, h: 900,  label: '1440' },
  { w: 1366, h: 768,  label: '1366' },
  { w: 1280, h: 800,  label: '1280' },
  { w: 1024, h: 768,  label: '1024' },
  { w: 430,  h: 932,  label: '430'  },  // iPhone 14 Pro Max
  { w: 390,  h: 844,  label: '390'  },  // iPhone 14
  { w: 360,  h: 800,  label: '360'  },  // common Android
  { w: 320,  h: 568,  label: '320'  },  // iPhone SE 1st gen
];

const ROUTES = ['/', '/pricing', '/audit'];

const consoleRows = [];   // { route, viewport, type, text, location }
const overflowRows = [];  // { route, viewport, scrollW, clientW, overflow }
const screenshotLog = []; // { route, viewport, path, ok, err }

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(OUT_BASELINES);
  await ensureDir(OUT_RESULTS);

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
      });

      // Intercept any redirects to the apex (ironwake.dev) and rewrite the URL
      // back to the local dev origin. Playwright follows redirects by default;
      // this undoes what middleware.js did when it saw host !== apex.
      await ctx.route('**/*', async (route) => {
        const req = route.request();
        const u = new URL(req.url());
        if (u.hostname === 'ironwake.dev' || u.hostname.endsWith('.ironwake.dev')) {
          const local = new URL(req.url());
          local.protocol = 'http:';
          local.host = BASE.replace(/^https?:\/\//, '');
          await route.continue({ url: local.toString() });
        } else {
          await route.continue();
        }
      });

      for (const route of ROUTES) {
        const page = await ctx.newPage();
        const consoleEvents = [];
        const pageErrors = [];

        page.on('console', (msg) => {
          // Capture errors and warnings only — ignore routine logs.
          const type = msg.type();
          if (type !== 'error' && type !== 'warning') return;
          const text = msg.text();
          const loc = msg.location();
          consoleEvents.push({ type, text, url: loc?.url || '', line: loc?.lineNumber || 0 });
        });
        page.on('pageerror', (err) => {
          pageErrors.push({ name: err.name, message: err.message, stack: err.stack || '' });
        });

        const url = BASE + route;
        const outDir = join(OUT_BASELINES, vp.label);
        await ensureDir(outDir);
        const outPath = join(outDir, route === '/' ? 'home' : route.replace(/^\//, '') + '.png');

        let shotOk = false;
        let shotErr = null;
        try {
          const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
          // Give animations / fonts a beat to settle.
          await page.waitForTimeout(800);
          await page.screenshot({ path: outPath, fullPage: true });
          shotOk = true;
          if (!resp) {
            shotErr = 'no response';
          } else if (!resp.ok() && resp.status() !== 304) {
            // Non-2xx isn't a screenshot failure per se; record it but keep the shot.
            shotErr = `HTTP ${resp.status()}`;
          }
        } catch (e) {
          shotErr = String(e?.message || e);
        }

        screenshotLog.push({ route, viewport: vp.label, path: outPath, ok: shotOk, err: shotErr });

        // Overflow detection — body horizontal overflow.
        try {
          const overflow = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const docW = Math.max(docEl.scrollWidth, docEl.clientWidth, body?.scrollWidth || 0);
            const viewW = docEl.clientWidth;
            const overflow = docW > viewW + 1; // 1px tolerance for sub-pixel rounding
            // Find overflowing elements to help diagnosis.
            const offenders = [];
            if (overflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const r = el.getBoundingClientRect();
                if (r.right > viewW + 1 && r.width > 0 && r.height > 0) {
                  offenders.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id || null,
                    cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : null,
                    right: Math.round(r.right),
                    width: Math.round(r.width),
                  });
                  if (offenders.length >= 5) break;
                }
              }
            }
            return {
              docScrollW: docEl.scrollWidth,
              docClientW: docEl.clientWidth,
              bodyScrollW: body?.scrollWidth || 0,
              viewW,
              overflow,
              offenders,
            };
          });
          overflowRows.push({
            route,
            viewport: vp.label,
            scrollW: overflow.docScrollW,
            clientW: overflow.docClientW,
            viewW: overflow.viewW,
            overflow: overflow.overflow,
            offenders: overflow.offenders,
          });
        } catch (e) {
          overflowRows.push({ route, viewport: vp.label, error: String(e?.message || e) });
        }

        // Log console events.
        for (const ev of consoleEvents) {
          consoleRows.push({ route, viewport: vp.label, ...ev });
        }
        for (const err of pageErrors) {
          consoleRows.push({ route, viewport: vp.label, type: 'pageerror', text: err.message, name: err.name, stack: err.stack });
        }

        await page.close();
      }

      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  // ---- Write reports ----
  const consoleMd = renderConsoleMd(consoleRows);
  const overflowMd = renderOverflowMd(overflowRows);
  const summaryMd = renderSummaryMd(screenshotLog, consoleRows, overflowRows);

  await writeFile(join(OUT_RESULTS, 'qa-console.md'), consoleMd);
  await writeFile(join(OUT_RESULTS, 'qa-overflow.md'), overflowMd);
  await writeFile(join(OUT_RESULTS, 'qa-summary.md'), summaryMd);

  const okCount = screenshotLog.filter((s) => s.ok).length;
  console.log(`SCREENSHOTS: ${okCount}/${screenshotLog.length} captured`);
  console.log(`CONSOLE_EVENTS: ${consoleRows.length}`);
  console.log(`OVERFLOW_PAGES: ${overflowRows.filter((r) => r.overflow).length}/${overflowRows.length}`);
  console.log(`SUMMARY: ${join(OUT_RESULTS, 'qa-summary.md')}`);
  if (okCount < screenshotLog.length) {
    console.log('FAILED_SHOTS:');
    for (const s of screenshotLog.filter((x) => !x.ok)) {
      console.log(`  ${s.viewport} ${s.route} -> ${s.err}`);
    }
  }
}

function renderConsoleMd(rows) {
  const lines = [];
  lines.push('# Browser QA — Console Errors & Warnings');
  lines.push('');
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  lines.push(`**Base URL**: ${BASE}`);
  lines.push(`**Viewports tested**: ${VIEWPORTS.map((v) => v.label).join(', ')}`);
  lines.push(`**Routes tested**: ${ROUTES.join(', ')}`);
  lines.push(`**Total console events captured**: ${rows.length}`);
  lines.push('');
  if (rows.length === 0) {
    lines.push('No console errors or warnings detected.');
    lines.push('');
    return lines.join('\n');
  }
  lines.push('| Viewport | Route | Type | Text | Location |');
  lines.push('|---|---|---|---|---|');
  for (const r of rows) {
    const text = (r.text || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 300);
    const loc = r.url ? `${r.url.split('/').pop()}:${r.line || ''}` : '';
    lines.push(`| ${r.viewport} | ${r.route} | ${r.type} | ${text} | ${loc} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function renderOverflowMd(rows) {
  const lines = [];
  lines.push('# Browser QA — Viewport Overflow (Horizontal Scroll)');
  lines.push('');
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  lines.push(`**Base URL**: ${BASE}`);
  lines.push('');
  const bad = rows.filter((r) => r.overflow);
  lines.push(`**Summary**: ${bad.length} of ${rows.length} page loads had horizontal overflow (>1px).`);
  lines.push('');
  if (bad.length === 0) {
    lines.push('No horizontal overflow detected at any viewport.');
    lines.push('');
    lines.push('## Full grid');
    lines.push('');
    lines.push('| Viewport | Route | scrollWidth | clientWidth | overflow |');
    lines.push('|---|---|---|---|---|');
    for (const r of rows) {
      lines.push(`| ${r.viewport} | ${r.route} | ${r.scrollW ?? '-'} | ${r.clientW ?? '-'} | ${r.overflow ? 'YES' : 'no'} |`);
    }
    return lines.join('\n');
  }
  lines.push('## Overflowing pages');
  lines.push('');
  for (const r of bad) {
    lines.push(`### ${r.viewport} × ${r.route}`);
    lines.push(`- scrollWidth: ${r.scrollW}, clientWidth: ${r.clientW}, viewport: ${r.viewW}`);
    if (r.offenders && r.offenders.length) {
      lines.push('- Top overflowing elements:');
      for (const o of r.offenders) {
        lines.push(`  - \`<${o.tag}${o.id ? ` #${o.id}` : ''}${o.cls ? ` class="${o.cls}"` : ''}>\` — right=${o.right}px, width=${o.width}px`);
      }
    }
    lines.push('');
  }
  lines.push('## Full grid');
  lines.push('');
  lines.push('| Viewport | Route | scrollWidth | clientWidth | overflow |');
  lines.push('|---|---|---|---|---|');
  for (const r of rows) {
    lines.push(`| ${r.viewport} | ${r.route} | ${r.scrollW ?? '-'} | ${r.clientW ?? '-'} | ${r.overflow ? '**YES**' : 'no'} |`);
  }
  return lines.join('\n');
}

function renderSummaryMd(shots, consoleRows, overflowRows) {
  const okCount = shots.filter((s) => s.ok).length;
  const bad = shots.filter((s) => !s.ok);
  const errCount = consoleRows.filter((r) => r.type === 'error' || r.type === 'pageerror').length;
  const warnCount = consoleRows.filter((r) => r.type === 'warning').length;
  const overflowCount = overflowRows.filter((r) => r.overflow).length;
  const expected = VIEWPORTS.length * ROUTES.length;

  const lines = [];
  lines.push('# Stage 6 — Browser QA Summary');
  lines.push('');
  lines.push(`**Generated**: ${new Date().toISOString()}`);
  lines.push(`**Base URL**: ${BASE}`);
  lines.push('');
  lines.push('## Counts');
  lines.push('');
  lines.push(`- PNGs captured: **${okCount}** / ${expected} (${VIEWPORTS.length} viewports × ${ROUTES.length} routes)`);
  lines.push(`- Console errors (incl. page errors): **${errCount}**`);
  lines.push(`- Console warnings: **${warnCount}**`);
  lines.push(`- Pages with horizontal overflow: **${overflowCount}** / ${overflowRows.length}`);
  lines.push('');
  lines.push('## Viewports');
  lines.push('');
  lines.push('| Label | Width | Height |');
  lines.push('|---|---|---|');
  for (const vp of VIEWPORTS) lines.push(`| ${vp.label} | ${vp.w} | ${vp.h} |`);
  lines.push('');
  lines.push('## Per-page grid (ok/err/overflow)');
  lines.push('');
  lines.push('| Viewport | / | /pricing | /audit |');
  lines.push('|---|---|---|---|');
  const routeOrder = ['/', '/pricing', '/audit'];
  for (const vp of VIEWPORTS) {
    const cells = routeOrder.map((r) => {
      const s = shots.find((x) => x.viewport === vp.label && x.route === r);
      const o = overflowRows.find((x) => x.viewport === vp.label && x.route === r);
      if (!s) return '?';
      const status = s.ok ? '✓' : `✗(${s.err || 'fail'})`;
      const ov = o?.overflow ? ' ⚠ovf' : '';
      return `${status}${ov}`;
    });
    lines.push(`| ${vp.label} | ${cells[0]} | ${cells[1]} | ${cells[2]} |`);
  }
  lines.push('');
  if (bad.length) {
    lines.push('## Failed captures');
    lines.push('');
    for (const s of bad) {
      lines.push(`- ${s.viewport} × ${s.route} — ${s.err}`);
    }
    lines.push('');
  }
  lines.push('## Artifacts');
  lines.push('');
  lines.push(`- Screenshots: \`${OUT_BASELINES}/{viewport}/{route}.png\``);
  lines.push(`- Console: \`.v13/results/qa-console.md\``);
  lines.push(`- Overflow: \`.v13/results/qa-overflow.md\``);
  lines.push(`- Summary: \`.v13/results/qa-summary.md\``);
  return lines.join('\n');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
