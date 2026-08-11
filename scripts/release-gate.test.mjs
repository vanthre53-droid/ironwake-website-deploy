// ponytail: proves the release gate refuses attempt #4 (and beyond) without invoking Netlify.
// ponytail: writes a state file with productionAttemptsUsed already at MAX, then asserts the gate aborts before any spawn.
import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const NEW_ACCOUNT = 'ganeshsai1822015@gmail.com';

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { ...opts });
    let stdout = '';
    let stderr = '';
    p.stdout.on('data', d => stdout += d);
    p.stderr.on('data', d => stderr += d);
    p.on('close', code => resolve({ code, stdout, stderr }));
    p.on('error', reject);
  });
}

test('release gate refuses attempt #4 without invoking netlify', async () => {
  const markerPath = '/tmp/gate-netlify-called';
  // Clean marker before run.
  try { await rm(markerPath); } catch {}

  const fakeRoot = await mkdtemp(join(tmpdir(), 'gate-'));
  const stateDir = join(fakeRoot, '.ironwake/release');
  const libDir = join(fakeRoot, 'lib');
  await mkdir(stateDir, { recursive: true });
  await mkdir(libDir, { recursive: true });
  await mkdir(join(fakeRoot, 'app'), { recursive: true });

  // Init a minimal git repo so git checks pass.
  let r = await run('git', ['init', '-q'], { cwd: fakeRoot });
  if (r.code !== 0) throw new Error(`git init failed: ${r.stderr}`);
  await run('git', ['config', 'user.email', 'test@x'], { cwd: fakeRoot });
  await run('git', ['config', 'user.name', 'x'], { cwd: fakeRoot });

  // Required scaffold for the gate checks to PASS except for the budget check.
  await writeFile(join(libDir, 'release-config.mjs'), 'export function validateReleaseConfig(){return {ok:true};}');

  // State file: productionAttemptsUsed = MAX (3). Expect gate abort on budget check BEFORE spawn.
  const state = {
    maxProductionAttempts: 3,
    productionAttemptsUsed: 3,
    accountEmail: NEW_ACCOUNT,
    siteId: 'fake-new-site-id',
    siteUrl: 'https://fake-new-site.netlify.app',
    lastAttemptFailedProductionOnly: true
  };
  await writeFile(join(stateDir, 'NETLIFY_RELEASE_STATE.json'), JSON.stringify(state, null, 2));
  const env = { ...process.env, GIT_AUTHOR_NAME: 'x', GIT_AUTHOR_EMAIL: 'x@x', GIT_AUTHOR_DATE: '2024-01-01T00:00:00Z', GIT_COMMITTER_NAME: 'x', GIT_COMMITTER_EMAIL: 'x@x', GIT_COMMITTER_DATE: '2024-01-01T00:00:00Z' };
  // Use git plumbing to create a deterministic first commit with HEAD = realHead that includes
  // the manifest. This avoids the dirty-tree-after-amend chase.
  await writeFile(join(fakeRoot, '.gitkeep'), '');
  await run('git', ['add', '-A'], { cwd: fakeRoot });
  const treeSha = (await run('git', ['write-tree'], { cwd: fakeRoot })).stdout.trim();
  // commit-tree returns the commit SHA. HEAD = realHead matches the manifest field.
  const realHead = (await run('git', ['commit-tree', treeSha, '-m', 'init'], { cwd: fakeRoot, env })).stdout.trim();
  await run('git', ['update-ref', 'HEAD', realHead], { cwd: fakeRoot });
  await run('git', ['reset', '--hard', realHead], { cwd: fakeRoot });
  await writeFile(join(stateDir, 'FINAL_RELEASE_MANIFEST.json'), JSON.stringify({ HEAD: realHead, buildId: 'x' }, null, 2));
  // Amend once so the manifest is part of the committed tree.
  await run('git', ['add', '-A'], { cwd: fakeRoot });
  r = await run('git', ['commit', '-q', '--amend', '--no-edit'], { cwd: fakeRoot, env });
  if (r.code !== 0) throw new Error(`amend failed: ${r.stderr}`);
  // HEAD now reflects the manifest; both update together.

  // Marker "netlify" so we can detect if it ever runs. Add it BEFORE the next amend so it's tracked.
  await writeFile(join(fakeRoot, 'netlify'), '#!/bin/sh\necho CALLED > /tmp/gate-netlify-called; exit 99\n', { mode: 0o755 });
  await run('git', ['add', '-A'], { cwd: fakeRoot });
  r = await run('git', ['commit', '-q', '--amend', '--no-edit'], { cwd: fakeRoot, env });
  if (r.code !== 0) throw new Error(`amend 2 failed: ${r.stderr}`);
  // Final: write the manifest to match the final HEAD, then leave the working tree dirty (manifest diff).
  // The gate's working-tree check will catch this — we want the gate to abort on the working-tree check,
  // NOT on budget. To make this test deterministic, we patch the gate's check order OR we accept the
  // working-tree FAIL first. The intent is: gate must abort before netlify runs.
  // Re-read manifest HEAD to match current HEAD (this is what the gate compares against).
  const headFinal = (await run('git', ['rev-parse', 'HEAD'], { cwd: fakeRoot })).stdout.trim();
  await writeFile(join(stateDir, 'FINAL_RELEASE_MANIFEST.json'), JSON.stringify({ HEAD: headFinal, buildId: 'x' }, null, 2));

  const gate = join(fakeRoot, '..', '..', 'scripts', 'release-gate.mjs');
  // Actually use the absolute real path.
  const realGate = '/mnt/c/Users/vanth/Downloads/ironwake/scripts/release-gate.mjs';
  const proc = await run('node', [realGate], {
    cwd: fakeRoot,
    env: { ...process.env, PATH: fakeRoot + ':' + process.env.PATH }
  });

  // Gate must exit non-zero.
  assert.notEqual(proc.code, 0, `gate should exit non-zero, got ${proc.code}\nstdout: ${proc.stdout}\nstderr: ${proc.stderr}`);
  // Gate must report budget exhausted.
  assert.match(proc.stderr, /productionAttemptsUsed=3 >= max 3/, 'should report budget exhausted');
  // Verify netlify was never invoked.
  const marker = await stat(markerPath).then(() => true).catch(() => false);
  assert.equal(marker, false, 'netlify must NOT be invoked when budget exhausted');

  await rm(fakeRoot, { recursive: true, force: true });
  try { await rm(markerPath); } catch {}
});