// ponytail: performance audit. Combines static CWV anti-pattern scan with
// live Lighthouse and bundle gzip evidence so the release gate has a single
// JSON shape to consume.
//
// Emits the following evidence fields:
//   lighthouse_mobile, lighthouse_desktop, bundle_gzip_kb, bundle_gzip_within_budget,
//   bundle_gzip_limit_kb, third_party_inventory
// plus the existing filesScanned/issueCount/issues.
//
// Lighthouse reports must live at reports/lighthouse-mobile.json and
// reports/lighthouse-desktop.json. Bundle gzip is computed from the
// .open-next/ build artifact (handler.mjs). Third-party inventory is
// fetched from the live homepage and grep'd for known analytics/pixel/font origins.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

function findRepoRoot(start) {
  let cur = start;
  for (let i = 0; i < 8; i++) {
    if (existsSync(resolve(cur, 'wrangler.toml')) || existsSync(resolve(cur, 'package.json'))) return cur;
    const parent = resolve(cur, '..');
    if (parent === cur) break;
    cur = parent;
  }
  return start;
}

const ROOT = process.env.IRONWAKE_ROOT || findRepoRoot(resolve(__dirname, '..'));
const SEARCH_DIRS = ['app', 'components', 'lib'];
const EXTS = ['.js', '.jsx', '.tsx', '.ts'];
const BUNDLE_KIB_LIMIT = 3072;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.open-next') continue;
      walk(p, acc);
    } else if (EXTS.some(e => entry.name.endsWith(e))) {
      acc.push(p);
    }
  }
  return acc;
}

const files = SEARCH_DIRS.flatMap(d => walk(join(ROOT, d)));

const issues = [];
const warnings = [];

// 1. <img> missing width and height
const imgRegex = /<img\b[^>]*>/gi;
const widthRe = /\bwidth\s*=/i;
const heightRe = /\bheight\s*=/i;
const nextImageRe = /from\s+['"]next\/image['"]/;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const isClient = /^['"]use client['"]/m.test(src);
  const usesNextImage = nextImageRe.test(src);

  for (const match of src.matchAll(imgRegex)) {
    const tag = match[0];
    if (!usesNextImage && !widthRe.test(tag)) {
      issues.push({ file: relative(ROOT, file), tag: tag.slice(0, 80), issue: 'img-missing-width' });
    }
    if (!usesNextImage && !heightRe.test(tag)) {
      issues.push({ file: relative(ROOT, file), tag: tag.slice(0, 80), issue: 'img-missing-height' });
    }
  }

  // 2. external font CDN
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(src)) {
    issues.push({ file: relative(ROOT, file), issue: 'external-font-cdn' });
  }

  // 3. heavy client-side dep
  if (isClient) {
    if (/from\s+['"]lodash['"]|from\s+['"]lodash-es['"]|from\s+['"]moment['"]/.test(src)) {
      warnings.push({ file: relative(ROOT, file), issue: 'heavy-client-dep' });
    }
  }
}

// === Bundle gzip measurement ============================================
function measureBundle() {
  const handler = resolve(ROOT, '.open-next/server-functions/default/handler.mjs');
  const workerEntry = resolve(ROOT, '.open-next/worker.js');
  if (!existsSync(handler)) {
    return {
      measured: false,
      reason: 'handler.mjs not found — run `pnpm build` first',
      bundle_gzip_kb: null,
      bundle_gzip_within_budget: null,
      bundle_gzip_limit_kb: BUNDLE_KIB_LIMIT,
    };
  }
  const raw = readFileSync(handler);
  const gz = gzipSync(raw);
  const rawKb = +(raw.length / 1024).toFixed(2);
  const gzipKb = +(gz.length / 1024).toFixed(2);
  return {
    measured: true,
    handler: relative(ROOT, handler),
    raw_kb: rawKb,
    bundle_gzip_kb: gzipKb,
    bundle_gzip_within_budget: gzipKb < BUNDLE_KIB_LIMIT,
    bundle_gzip_limit_kb: BUNDLE_KIB_LIMIT,
    margin_kb: +(BUNDLE_KIB_LIMIT - gzipKb).toFixed(2),
    workerEntry: existsSync(workerEntry) ? relative(ROOT, workerEntry) : null,
  };
}

const bundle = measureBundle();

// === Third-party inventory ===============================================
const KNOWN_THIRD_PARTY = [
  { host: 'fonts.googleapis.com',     label: 'Google Fonts CSS',   category: 'font' },
  { host: 'fonts.gstatic.com',        label: 'Google Fonts files', category: 'font' },
  { host: 'googletagmanager.com',     label: 'Google Tag Manager', category: 'analytics' },
  { host: 'google-analytics.com',     label: 'Google Analytics',   category: 'analytics' },
  { host: 'plausible.io',             label: 'Plausible',          category: 'analytics' },
  { host: 'umami.is',                 label: 'Umami',              category: 'analytics' },
  { host: 'vercel-insights.com',      label: 'Vercel Insights',    category: 'analytics' },
  { host: 'cloudflareinsights.com',   label: 'CF Insights (Beacon)', category: 'analytics' },
  { host: 'resend.com',               label: 'Resend',             category: 'email' },
  { host: 'cdn.jsdelivr.net',         label: 'jsDelivr CDN',       category: 'cdn' },
  { host: 'unpkg.com',                label: 'unpkg',              category: 'cdn' },
  { host: 'youtube.com',              label: 'YouTube embed',      category: 'embed' },
  { host: 'ytimg.com',                label: 'YouTube img',        category: 'embed' },
  { host: 'intercom.io',              label: 'Intercom',           category: 'support' },
  { host: 'stripe.com',               label: 'Stripe',             category: 'payments' },
  { host: 'sentry.io',                label: 'Sentry',             category: 'observability' },
  { host: 'openai.com',               label: 'OpenAI',             category: 'ai' },
  { host: 'anthropic.com',            label: 'Anthropic',          category: 'ai' },
];

async function thirdPartyInventory() {
  const sources = ['https://ironwake.dev/'];
  const hits = {};
  for (const url of sources) {
    let html = '';
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'ironwake-perf-audit/1.0' },
        signal: AbortSignal.timeout(15000),
      });
      html = await res.text();
    } catch (e) {
      return {
        sampledAt: new Date().toISOString(),
        sourcesChecked: sources,
        hostsDetected: [],
        hostsChecked: KNOWN_THIRD_PARTY.length,
        error: `fetch failed: ${e.message}`,
      };
    }
    for (const k of KNOWN_THIRD_PARTY) {
      const re = new RegExp(k.host.replace(/\./g, '\\.'), 'g');
      const matches = html.match(re) || [];
      if (matches.length) {
        hits[k.host] = hits[k.host] || { count: 0, label: k.label, category: k.category };
        hits[k.host].count += matches.length;
      }
    }
  }
  return {
    sampledAt: new Date().toISOString(),
    sourcesChecked: sources,
    hostsDetected: Object.entries(hits).map(([host, v]) => ({ host, ...v })),
    hostsChecked: KNOWN_THIRD_PARTY.length,
  };
}

// === Lighthouse evidence =================================================
function loadLighthouseReport(formFactor) {
  const p = resolve(ROOT, `reports/lighthouse-${formFactor}.json`);
  if (!existsSync(p)) {
    return {
      ran: false,
      reportPath: relative(ROOT, p),
      reason: `lighthouse-${formFactor}.json not produced — run scripts/lighthouse-run.mjs first`,
      averages: null,
    };
  }
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    const routes = Array.isArray(raw.results) ? raw.results : [];
    return {
      ran: true,
      reportPath: relative(ROOT, p),
      generatedAt: raw.generatedAt || null,
      formFactor: raw.formFactor || formFactor,
      routesAudited: routes.length,
      routes: routes.map(r => ({
        url: r.url,
        performance: r.scores?.performance ?? null,
        accessibility: r.scores?.accessibility ?? null,
        bestPractices: r.scores?.bestPractices ?? null,
        seo: r.scores?.seo ?? null,
        lcpMs: r.coreWebVitals?.lcpMs ?? null,
        fcpMs: r.coreWebVitals?.fcpMs ?? null,
        tbtMs: r.coreWebVitals?.tbtMs ?? null,
        cls: r.coreWebVitals?.cls ?? null,
      })),
      averages: raw.averages || null,
    };
  } catch (e) {
    return { ran: false, reportPath: relative(ROOT, p), reason: `parse error: ${e.message}`, averages: null };
  }
}

(async () => {
  const lighthouse_mobile  = loadLighthouseReport('mobile');
  const lighthouse_desktop = loadLighthouseReport('desktop');
  const third_party_inventory = await thirdPartyInventory();

  const summary = {
    scannedAt: new Date().toISOString(),
    filesScanned: files.length,
    issueCount: issues.length,
    warningCount: warnings.length,
    issues,
    warnings,
    lighthouse_mobile,
    lighthouse_desktop,
    bundle_gzip_kb: bundle.bundle_gzip_kb,
    bundle_gzip_within_budget: bundle.bundle_gzip_within_budget,
    bundle_gzip_limit_kb: bundle.bundle_gzip_limit_kb,
    bundle_raw_kb: bundle.raw_kb ?? null,
    bundle_handler: bundle.handler ?? null,
    bundle_margin_kb: bundle.margin_kb ?? null,
    third_party_inventory,
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exit(issues.length === 0 ? 0 : 1);
})();
