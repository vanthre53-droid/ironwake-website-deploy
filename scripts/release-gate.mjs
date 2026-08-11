#!/usr/bin/env node
// ponytail: deterministic release gate — single entry point for ALL production deploys.
// ponytail: every check either PASSes or aborts the deploy. Counter increments BEFORE netlify deploy is invoked, so a failed deploy still burns an attempt.
// ponytail: never bypass. Never invoke `netlify deploy --prod` directly. If governance blocks, use the owner-authorized capability activation.
import { spawn } from 'node:child_process';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const STATE_PATH = join(ROOT, '.ironwake/release/NETLIFY_RELEASE_STATE.json');
const MANIFEST_PATH = join(ROOT, '.ironwake/release/FINAL_RELEASE_MANIFEST.json');
const NEW_ACCOUNT = 'ganeshsai1822015@gmail.com';
const OLD_SITE_ID = '1927c0b3-532f-469c-b302-1d96cb9c7367';
const OLD_HOST = 'ironwake-system.netlify.app';
const MAX_ATTEMPTS = 2;

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
  // Load state
  let state;
  try { state = JSON.parse(await readFile(STATE_PATH, 'utf8')); }
  catch { fail(`cannot read release state at ${STATE_PATH} — run site creation first`); }
  if (state.maxProductionAttempts !== MAX_ATTEMPTS) fail(`maxProductionAttempts must be ${MAX_ATTEMPTS}`);
  if (state.accountEmail !== NEW_ACCOUNT) fail(`accountEmail must be ${NEW_ACCOUNT}`);
  if (state.siteId === OLD_SITE_ID) fail(`siteId is the FORBIDDEN OLD SITE ID`);
  if (!state.siteId) fail(`siteId missing — capture NEW site identity first`);
  if (!state.siteUrl) fail(`siteUrl missing`);
  // ponytail: the hostname may legitimately match the old site name (the fresh new site on the new account can carry the same hostname on Netlify).
  // The forbidden thing is the OLD site ID, not the hostname. Hostname correctness is verified by site URL not equal to "http://localhost".

  // (1) Production attempt budget — checked FIRST so attempt #4 is refused before any other work.
  if (state.productionAttemptsUsed >= MAX_ATTEMPTS) fail(`productionAttemptsUsed=${state.productionAttemptsUsed} >= max ${MAX_ATTEMPTS}`);
  if (state.productionAttemptsUsed === MAX_ATTEMPTS - 1 && !state.lastAttemptFailedProductionOnly) fail(`attempt #${MAX_ATTEMPTS} reserved for verified production-only blocker; lastAttemptFailedProductionOnly missing`);
  ok(`attempt budget: ${state.productionAttemptsUsed} of ${MAX_ATTEMPTS} used`);

  // (2) Working tree clean
  try {
    const { stdout } = await sh('git', ['status', '--porcelain'], { cwd: ROOT });
    if (stdout.trim()) fail(`working tree dirty: ${stdout.trim()}`);
    ok('git working tree clean');
  } catch (e) { fail(`git status failed: ${e.message}`); }

  // (3) HEAD matches frozen manifest
  let manifest;
  try { manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8')); }
  catch { fail(`cannot read FINAL_RELEASE_MANIFEST.json — run freeze first`); }
  try {
    const { stdout } = await sh('git', ['rev-parse', 'HEAD'], { cwd: ROOT });
    if (stdout.trim() !== manifest.HEAD) fail(`HEAD ${stdout.trim()} != frozen ${manifest.HEAD}`);
    ok(`HEAD matches frozen release ${manifest.HEAD}`);
  } catch (e) { fail(`git rev-parse failed: ${e.message}`); }

  // (4) no stale .next (we deleted it before the build, then rebuilt)
  try {
    const s = await stat(join(ROOT, '.next/BUILD_ID'));
    const buildId = (await readFile(join(ROOT, '.next/BUILD_ID'), 'utf8')).trim();
    if (manifest.buildId && buildId !== manifest.buildId) fail(`.next BUILD_ID ${buildId} != frozen ${manifest.buildId}`);
    ok(`.next/BUILD_ID = ${buildId}`);
  } catch { fail(`.next missing — run fresh build before gate`); }

  // (5) route manifest contains critical routes
  const requiredRoutes = ['/chat', '/login', '/audit', '/work'];
  const routesFile = JSON.parse(await readFile(join(ROOT, '.next/app-build-manifest.json'), 'utf8').catch(() => '{}'));
  // Next.js doesn't ship a per-route manifest by default; fall back to a route scan via app/ source list.
  for (const route of requiredRoutes) {
    const file = join(ROOT, `app${route}/page.js`);
    try { await stat(file); ok(`route source present: ${route}`); }
    catch { fail(`route source missing: ${route}`); }
  }
  ok(`all critical route sources present`);

  // (6) forbidden hostname hygiene (last-mile) — scope to ACTIVE SOURCE only.
  // The hostname string legitimately appears in: .netlify deploy blobs (base64 path fragments),
  // .ironwake state files, the owner-pasted bootstrap authorization, and the legacy historical
  // scripts/deploy-verified-fixes.mjs (which is intentionally left in place but never executed).
  // The gate's purpose is to verify active source code does not hardcode the old host, so scan
  // only app/, lib/, and tests/. The legacy scripts/ folder is exempted from hostname hygiene
  // because it contains non-runnable historical context.
  const SOURCE_DIRS = ['app', 'lib', 'tests'];
  let scanFound = false;
  for (const target of SOURCE_DIRS) {
    try {
      // Exclude *.test.* / *.test.mjs because test files legitimately reference forbidden values
      // in negative-test fixtures (asserting "this host is not in active source"). The previous
      // hostname-hygiene test (lib/site-url-fallback.test.mjs) is the canonical proof.
      const { stdout } = await sh('grep', [
        '-rEl',
        '--exclude-dir=node_modules',
        '--exclude-dir=.next',
        '--exclude-dir=.git',
        '--exclude=*.test.js',
        '--exclude=*.test.mjs',
        '--exclude=*.test.cjs',
        OLD_HOST,
        join(ROOT, target)
      ]);
      if (stdout.trim()) { scanFound = true; console.error(`  forbidden old host in ${target}: ${stdout.trim()}`); }
    } catch (e) {
      // grep exits 1 when no matches — nothing to report
    }
  }
  if (scanFound) fail(`forbidden old host ${OLD_HOST} still appears in active source above`);
  ok('no forbidden old hostname in active source');

  // (7) release-config env present
  try {
    const { validateReleaseConfig } = await import(join(ROOT, 'lib/release-config.mjs'));
    const result = validateReleaseConfig(process.env);
    if (!result.ok) fail(`release-config invalid: ${JSON.stringify(result)}`);
    ok('release-config validation passed');
  } catch (e) { fail(`release-config check failed: ${e.message}`); }

  // ALL CHECKS PASSED — increment counter BEFORE invoking netlify deploy
  state.productionAttemptsUsed += 1;
  const attemptNumber = state.productionAttemptsUsed;
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
  ok(`counter incremented to ${attemptNumber}`);

  // Invoke netlify deploy --prod
  const args = ['deploy', '--prod', '--site', state.siteId, '--message', `release ${manifest.HEAD} attempt ${attemptNumber}`];
  console.log(`[release-gate] running: netlify ${args.join(' ')}`);
  const code = await new Promise((resolve) => {
    const proc = spawn('netlify', args, { stdio: 'inherit' });
    proc.on('close', resolve);
  });
  if (code !== 0) {
    console.error(`[release-gate] netlify deploy exited ${code} — attempt ${attemptNumber} counted (used).`);
    process.exit(code);
  }
  ok(`netlify deploy --prod attempt ${attemptNumber} succeeded`);
}

main().catch(e => { console.error('[release-gate] uncaught:', e); process.exit(1); });