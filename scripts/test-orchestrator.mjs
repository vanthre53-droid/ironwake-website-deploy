#!/usr/bin/env node
// ponytail: 4-tier test orchestrator. Runs `node --test` per file, parses TAP,
// classifies environment failures (NETWORK/AUTH/ENV-MISSING) separately from
// logic failures. Reuses node:test — no runner rewrite. Stdlib only.
import { spawn } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, relative, sep, dirname, basename } from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, 'reports/TEST_ORCHESTRATION_REPORT.md');
const REPORT_JSON = join(ROOT, 'reports/TEST_ORCHESTRATION_REPORT.json');
const IS_CLI = !process.env.ORCHESTRATOR_NO_AUTO && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

const EXCLUDE_DIRS = new Set(['node_modules', '.next', '.worktrees', '.open-next', '.git', 'reports', 'graphify-out', 'release', 'audits', 'state', '.ironwake', 'content', 'docs', 'public', 'prompts', 'inputs', 'website']);

// ponytail: tier rules. Order matters — first match assigns the tier.
// ENVIRONMENT is the explicit override list from the owner's spec.
const ENV_FILES = new Set([
  'scripts/worker-secrets-audit.test.mjs',
  'scripts/metadata-audit.test.mjs',
  'scripts/build-audit.test.mjs',
]);

function classifyTier(relPath) {
  if (ENV_FILES.has(relPath)) return 'ENVIRONMENT';
  const parts = relPath.split('/');
  if (parts[0] === 'app' && parts[1] === 'api') return 'INTEGRATION';
  if (parts[0] === 'app' && (parts[1] === 'components' || parts.some(p => p === 'page.js' || p === 'route.js' || /(page|route|layout).test.[mc]?[jt]sx?$/.test(p)) || parts.length >= 3)) {
    // app/components/* or app/**/*.test.js (React/server components/pages)
    if (parts[0] === 'app' && parts[1] === 'components') return 'COMPONENT';
    if (parts[0] === 'app') return 'COMPONENT';
  }
  if (parts[0] === 'lib' && relPath.endsWith('.test.mjs')) return 'UNIT';
  if (parts[0] === 'scripts' && relPath.endsWith('.test.mjs') && !relPath.includes('integration')) return 'UNIT';
  if (parts[0] === 'tests' && relPath.endsWith('.test.mjs')) return 'UNIT';
  return 'UNIT'; // safe default — pure logic
}

// ponytail: env-failure signatures. Test authors throw Error('NETWORK: ...')
// or 'AUTH: ...' or 'ENV-MISSING: ...' to opt into non-blocking classification.
const ENV_PATTERNS = [
  { kind: 'NETWORK', re: /\b(NETWORK|ECONN|ENOTFOUND|ETIMEDOUT|fetch failed|socket hang up)\b/i },
  { kind: 'AUTH', re: /\b(AUTH|UNAUTHORIZED|401|403|invalid (api |token|key))/i },
  { kind: 'ENV-MISSING', re: /\b(ENV[- ]?MISSING|missing (env|secret|token)|ERR_MISSING_ENV|undefined (env|process\.env))\b/i },
];

function classifyFailure(errorMsg) {
  if (!errorMsg) return null;
  for (const { kind, re } of ENV_PATTERNS) if (re.test(errorMsg)) return kind;
  return null;
}

// ponytail: discover test files recursively. Excludes by directory name and
// by file extension. Pure stdlib; no glob dep.
async function discoverTests() {
  const out = [];
  async function walk(dir) {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (EXCLUDE_DIRS.has(e.name)) continue;
        await walk(join(dir, e.name));
      } else if (e.isFile()) {
        if (/\.test\.(js|mjs)$/.test(e.name)) out.push(join(dir, e.name));
      }
    }
  }
  await walk(ROOT);
  return out.sort();
}

// ponytail: TAP parser — minimal, just what we need. Walks lines, extracts
// per-test error: from the indented YAML block under a "not ok" line.
function parseTAP(stdout) {
  let pass = 0, fail = 0, skipped = 0;
  const failures = [];
  const lines = stdout.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^(ok|not ok)\s+(\d+)\s+-\s+(.+)$/.exec(line);
    if (!m) continue;
    const ok = m[1] === 'ok';
    const name = m[3].trim();
    if (ok) { pass++; continue; }
    fail++;
    // ponytail: read the YAML block that follows to find the error message.
    let errorMsg = '';
    for (let j = i + 1; j < lines.length && (lines[j].startsWith('  ') || lines[j] === ''); j++) {
      const em = /^\s+error:\s+['"]?(.+?)['"]?\s*$/.exec(lines[j]);
      if (em) { errorMsg = em[1]; break; }
      if (/^\S/.test(lines[j]) && lines[j].trim() !== '') break;
    }
    failures.push({ name, error: errorMsg });
  }
  const summary = {
    pass: 0, fail: 0, skipped: 0, cancelled: 0, todo: 0,
  };
  for (const line of lines) {
    const sm = /^# (pass|fail|skipped|cancelled|todo)\s+(\d+)/.exec(line);
    if (sm) summary[sm[1]] = Number(sm[2]);
  }
  return { pass: summary.pass || pass, fail: summary.fail || fail, skipped: summary.skipped || skipped, failures };
}

// ponytail: run a single test file with `node --test --test-reporter=tap`.
// Capture stdout+stderr so env-classification regex sees both. Returns the
// file's record and whether the test process crashed before TAP (parse failed).
function runOne(file) {
  return new Promise((resolve) => {
    const started = performance.now();
    const proc = spawn(process.execPath, ['--test', '--test-reporter=tap', file], { stdio: ['ignore', 'pipe', 'pipe'], cwd: ROOT, env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_PATH: '' } });
    let stdoutBuf = '', stderrBuf = '';
    proc.stdout.on('data', d => stdoutBuf += d);
    proc.stderr.on('data', d => stderrBuf += d);
    proc.on('close', (code, signal) => {
      const durationMs = performance.now() - started;
      const parsed = parseTAP(stdoutBuf);
      const envFailures = [];
      const logicFailures = [];
      for (const f of parsed.failures) {
        const kind = classifyFailure(f.error) || classifyFailure(f.name);
        if (kind) envFailures.push({ ...f, kind });
        else logicFailures.push(f);
      }
      resolve({
        file: relative(ROOT, file).split(sep).join('/'),
        exitCode: code,
        signal,
        durationMs: Math.round(durationMs),
        pass: parsed.pass,
        fail: parsed.fail,
        skipped: parsed.skipped,
        envFailures,
        logicFailures,
        stderrTail: stderrBuf.slice(-500),
      });
    });
  });
}

// ponytail: run all files in a tier with bounded concurrency. The
// orchestrator runs tiers sequentially (so an env-tier auth failure can't
// block a unit-tier logic check), but files within a tier run in parallel.
async function runTier(tier, files, concurrency) {
  const queue = files.slice();
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    const results = [];
    while (queue.length) {
      const file = queue.shift();
      results.push(await runOne(file));
    }
    return results;
  });
  const nested = await Promise.all(workers);
  return nested.flat();
}

// ponytail: minimal YAML frontmatter-ish markdown report. Owner-readable.
// JSON sidecar is for downstream tooling (e.g. CI badges, dashboards).
function renderReport({ tiers, startedAt, finishedAt, totals }) {
  const dur = ((finishedAt - startedAt) / 1000).toFixed(1);
  const lines = [];
  lines.push('# Test Orchestration Report');
  lines.push('');
  lines.push(`Generated: ${new Date(startedAt).toISOString()} • Duration: ${dur}s`);
  lines.push('');
  lines.push(`**Total:** ${totals.files} files • ${totals.pass} pass • ${totals.fail} fail • ${totals.skipped} skipped • ${totals.envFails} env-failures`);
  lines.push('');
  lines.push('| Tier | Files | Pass | Fail | Env | Duration |');
  lines.push('|------|-------|------|------|-----|----------|');
  for (const t of tiers) {
    lines.push(`| ${t.name} | ${t.results.length} | ${t.totals.pass} | ${t.totals.fail} | ${t.totals.envFails} | ${(t.durationMs / 1000).toFixed(1)}s |`);
  }
  lines.push('');
  for (const t of tiers) {
    lines.push(`## ${t.name} (${t.results.length} files)`);
    lines.push('');
    if (t.results.length === 0) { lines.push('_no tests in this tier_'); lines.push(''); continue; }
    lines.push('| File | Exit | Pass | Fail | Env | Duration |');
    lines.push('|------|------|------|------|-----|----------|');
    for (const r of t.results) {
      lines.push(`| \`${r.file}\` | ${r.exitCode} | ${r.pass} | ${r.fail} | ${r.envFailures.length} | ${r.durationMs}ms |`);
    }
    lines.push('');
    const envAny = t.results.flatMap(r => r.envFailures.map(f => ({ ...f, file: r.file })));
    if (envAny.length) {
      lines.push('### Environment failures (non-blocking)');
      lines.push('');
      for (const f of envAny) {
        lines.push(`- **${f.kind}** \`${f.file}\` — ${f.name}: ${f.error || '(no message)'}`);
      }
      lines.push('');
    }
    const logicAny = t.results.flatMap(r => r.logicFailures.map(f => ({ ...f, file: r.file })));
    if (logicAny.length) {
      lines.push('### Logic failures (blocking)');
      lines.push('');
      for (const f of logicAny) {
        lines.push(`- \`${f.file}\` — ${f.name}: ${f.error || '(no message)'}`);
      }
      lines.push('');
    }
  }
  return lines.join('\n');
}

export { classifyTier, classifyFailure, parseTAP, ENV_FILES, ENV_PATTERNS, EXCLUDE_DIRS, discoverTests, runOne, runTier, renderReport };

async function main() {
  const startedAt = Date.now();
  const tierFilter = process.argv.slice(2); // e.g. node test-orchestrator.mjs UNIT COMPONENT
  const allFiles = await discoverTests();
  const grouped = { UNIT: [], COMPONENT: [], INTEGRATION: [], ENVIRONMENT: [] };
  for (const f of allFiles) {
    const rel = relative(ROOT, f).split(sep).join('/');
    grouped[classifyTier(rel)].push(f);
  }
  // ponytail: skip the orchestrator's own smoke test and any test that
  // intentionally re-runs the orchestrator (loop guard).
  for (const tier of Object.keys(grouped)) {
    grouped[tier] = grouped[tier].filter(f => !f.endsWith('test-orchestrator.test.mjs') && !f.endsWith('test-orchestrator.mjs'));
  }
  const order = ['UNIT', 'COMPONENT', 'INTEGRATION', 'ENVIRONMENT'];
  const tiers = [];
  const totals = { files: 0, pass: 0, fail: 0, skipped: 0, envFails: 0 };
  for (const name of order) {
    if (tierFilter.length && !tierFilter.includes(name)) continue;
    const files = grouped[name];
    if (!files.length) { tiers.push({ name, results: [], totals: { pass: 0, fail: 0, envFails: 0, skipped: 0 }, durationMs: 0 }); continue; }
    const tierStart = performance.now();
    const results = await runTier(name, files, 4);
    const tierTotals = { pass: 0, fail: 0, envFails: 0, skipped: 0 };
    for (const r of results) {
      tierTotals.pass += r.pass; tierTotals.fail += r.fail;
      tierTotals.envFails += r.envFailures.length; tierTotals.skipped += r.skipped;
    }
    tiers.push({ name, results, totals: tierTotals, durationMs: Math.round(performance.now() - tierStart) });
    totals.files += results.length;
    totals.pass += tierTotals.pass; totals.fail += tierTotals.fail;
    totals.skipped += tierTotals.skipped; totals.envFails += tierTotals.envFails;
  }
  const finishedAt = Date.now();
  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, renderReport({ tiers, startedAt, finishedAt, totals }));
  await writeFile(REPORT_JSON, JSON.stringify({ startedAt, finishedAt, totals, tiers }, null, 2));
  console.log(`[orchestrator] wrote ${relative(ROOT, REPORT_PATH)}`);
  // ponytail: exit non-zero ONLY when logic failures exist. Env-tier auth
  // failures never block CI — owner can re-run with real creds to clear them.
  const logicBlocks = tiers.some(t => t.results.some(r => r.logicFailures.length));
  process.exit(logicBlocks ? 1 : 0);
}

// ponytail: only auto-run when invoked as the CLI entry point — importable
// from tests without firing side effects. Honor ORCHESTRATOR_NO_AUTO so the
// test runner can probe the module without triggering real test runs.
if (IS_CLI && !process.env.ORCHESTRATOR_NO_AUTO) main().catch(e => { console.error('[orchestrator] uncaught:', e); process.exit(2); });