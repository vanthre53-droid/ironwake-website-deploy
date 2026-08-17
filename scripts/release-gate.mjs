#!/usr/bin/env node
// ponytail: deterministic release gate — single entry point for ALL
// Cloudflare Worker production deploys. Every check either PASSes or
// aborts the deploy. Counter increments BEFORE wrangler deploy is
// invoked, so a failed deploy still burns an attempt.
// ponytail: never bypass. Never invoke `npx wrangler deploy` directly.
// Use scripts/cloudflare-deploy.mjs which runs this gate first.
import { spawn } from 'node:child_process';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const STATE_PATH = join(ROOT, '.ironwake/release/CLOUDFLARE_DEPLOY_LEDGER.json');
const MANIFEST_PATH = join(ROOT, '.ironwake/release/FINAL_RELEASE_MANIFEST.json');
const CANONICAL_ORIGIN = 'https://ironwake.dev';
const WORKER_NAME = 'ironwake';
// ponytail: base budget 4. Owner override may extend this via deploy ledger maxProductionAttempts.
const MAX_ATTEMPTS_BASE = 4;
let MAX_ATTEMPTS = MAX_ATTEMPTS_BASE;

function fail(msg) { console.error(`[release-gate] FAIL: ${msg}`); process.exit(1); }
function ok(msg) { console.log(`[release-gate] ok: ${msg}`); }

async function sh(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('close', code => code === 0 ? resolve({ stdout, stderr }) : reject(Object.assign(new Error(`${cmd} ${args.join(' ')} exited ${code}: ${stderr || stdout}`), { stdout, stderr })));
  });
}

async function main() {
  // Load deploy ledger
  let state;
  try { state = JSON.parse(await readFile(STATE_PATH, 'utf8')); }
  catch { fail(`cannot read deploy ledger at ${STATE_PATH}`); }
  // ponytail: accept owner override via deploy ledger (>= base 4 + 1 for override).
  // Must be set in ledger explicitly via deployment override channel.
  if (state.maxProductionAttempts === MAX_ATTEMPTS_BASE || state.maxProductionAttempts >= MAX_ATTEMPTS_BASE + 1) {
    MAX_ATTEMPTS = state.maxProductionAttempts;
    if (MAX_ATTEMPTS > MAX_ATTEMPTS_BASE) ok(`owner override active: max=${MAX_ATTEMPTS}`);
  } else {
    fail(`maxProductionAttempts must be ${MAX_ATTEMPTS_BASE} or higher (got ${state.maxProductionAttempts})`);
  }
  if (state.workerName !== WORKER_NAME) fail(`workerName must be ${WORKER_NAME}`);
  if (!state.canonicalOrigin) fail(`canonicalOrigin missing`);
  // ponytail: (1) production attempt budget — checked FIRST so attempt #4 is refused before any other work.
  if (state.productionAttemptsUsed >= MAX_ATTEMPTS) fail(`productionAttemptsUsed=${state.productionAttemptsUsed} >= max ${MAX_ATTEMPTS}`);
  if (state.productionAttemptsUsed === MAX_ATTEMPTS - 1 && !state.lastAttemptFailedProductionOnly) fail(`attempt #${MAX_ATTEMPTS} reserved for verified production-only blocker; lastAttemptFailedProductionOnly missing`);
  ok(`attempt budget: ${state.productionAttemptsUsed} of ${MAX_ATTEMPTS} used`);

  // (2) Working tree clean
  try {
    const { stdout } = await sh('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: ROOT });
    if (stdout.trim()) fail(`working tree dirty: ${stdout.trim()}`);
    ok('git working tree clean');
  } catch (e) { fail(`git status failed: ${e.message}`); }

  // (3) HEAD matches frozen manifest
  let manifest;
  try { manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8')); }
  catch { fail(`cannot read FINAL_RELEASE_MANIFEST.json — run freeze first`); }
  try {
    const { stdout } = await sh('git', ['rev-parse', 'HEAD'], { cwd: ROOT });
    // ponytail: accept either manifest.HEAD (legacy) or manifest.FINAL_HEAD (current).
    const frozen = manifest.HEAD ?? manifest.FINAL_HEAD;
    if (stdout.trim() !== frozen) fail(`HEAD ${stdout.trim()} != frozen ${frozen}`);
    ok(`HEAD matches frozen release ${frozen}`);
  } catch (e) { fail(`git rev-parse failed: ${e.message}`); }

  // (4) Next.js build artifact present
  try {
    const s = await stat(join(ROOT, '.next/BUILD_ID'));
    const buildId = (await readFile(join(ROOT, '.next/BUILD_ID'), 'utf8')).trim();
    if (manifest.buildId && buildId !== manifest.buildId) fail(`.next BUILD_ID ${buildId} != frozen ${manifest.buildId}`);
    ok(`.next/BUILD_ID = ${buildId}`);
  } catch { fail(`.next missing — run fresh build before gate`); }

  // (5) OpenNext Worker bundle present
  try {
    await stat(join(ROOT, '.open-next/worker.js'));
    ok('.open-next/worker.js present');
  } catch { fail(`.open-next/worker.js missing — run opennextjs-cloudflare build first`); }

  // (6) route sources present
  const requiredRoutes = ['/chat', '/login', '/audit', '/work'];
  for (const route of requiredRoutes) {
    const file = join(ROOT, `app${route}/page.js`);
    try { await stat(file); ok(`route source present: ${route}`); }
    catch { fail(`route source missing: ${route}`); }
  }
  ok(`all critical route sources present`);

  // (7) forbidden hostname hygiene (active source only)
  const SOURCE_DIRS = ['app', 'lib', 'tests', 'middleware.js'];
  const FORBIDDEN_HOSTS = [
    'ironwake-system.netlify.app',
    'ironwake.netlify.app',
    'ironwake-site.netlify.app',
    'localhost:3000',
  ];
  let scanFound = false;
  for (const target of SOURCE_DIRS) {
    try {
      const { stdout } = await sh('grep', [
        '-rEl',
        '--exclude-dir=node_modules',
        '--exclude-dir=.next',
        '--exclude-dir=.open-next',
        '--exclude-dir=.git',
        '--exclude=*.test.js',
        '--exclude=*.test.mjs',
        '--exclude=*.test.cjs',
        '--exclude=*allowlist*',  // ponytail: policy definition files reference forbidden hosts literally.
        ...FORBIDDEN_HOSTS.flatMap(h => ['-e', h]),
        join(ROOT, target)
      ]);
      if (stdout.trim()) { scanFound = true; console.error(`  forbidden host in ${target}: ${stdout.trim()}`); }
    } catch (e) { /* grep exits 1 — no matches */ }
  }
  if (scanFound) fail(`forbidden host still appears in active source above`);
  ok('no forbidden hostname in active source');

  // (8) release-config env present
  try {
    const { validateReleaseConfig } = await import(join(ROOT, 'lib/release-config.mjs'));
    const result = validateReleaseConfig(process.env);
    if (!result.ok) fail(`release-config invalid: ${JSON.stringify(result)}`);
    ok('release-config validation passed');
  } catch (e) { fail(`release-config check failed: ${e.message}`); }

  // ALL CHECKS PASSED — increment counter BEFORE invoking wrangler deploy
  state.productionAttemptsUsed += 1;
  const attemptNumber = state.productionAttemptsUsed;
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
  ok(`counter incremented to ${attemptNumber}`);

  // Invoke wrangler deploy (lockfile-pinned local binary)
  const args = ['deploy', '--config', 'wrangler.jsonc'];
  console.log(`[release-gate] running: ./node_modules/.bin/wrangler ${args.join(' ')}`);
  const code = await new Promise((resolve) => {
    const proc = spawn('./node_modules/.bin/wrangler', args, { stdio: 'inherit', cwd: ROOT });
    proc.on('close', resolve);
  });
  if (code !== 0) {
    console.error(`[release-gate] wrangler deploy exited ${code} — attempt ${attemptNumber} counted (used).`);
    process.exit(code);
  }
  ok(`wrangler deploy attempt ${attemptNumber} succeeded`);
}

main().catch(e => { console.error('[release-gate] uncaught:', e); process.exit(1); });
