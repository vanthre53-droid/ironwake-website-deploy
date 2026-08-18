// ponytail: smoke test for the orchestrator. Imports the module-level
// helpers via a re-export shim so we don't have to spin up the full CLI.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

// ponytail: we test classification + parse by re-running the orchestrator in a
// "classify-only" sub-mode that prints JSON. Cheap & no mocking.

test('orchestrator classifier places files in the right tier', async () => {
  // ponytail: write a tiny probe that imports the orchestrator's classifier
  // and prints a JSON table. Run it as a child process so the test stays
  // hermetic — no shared module state.
  const probe = `
    import { classifyTier, classifyFailure } from '${process.cwd()}/scripts/test-orchestrator.mjs';
    const cases = [
      ['lib/pricing.test.mjs', 'UNIT'],
      ['lib/notifications/templates.test.mjs', 'UNIT'],
      ['scripts/rls-policy-audit.test.mjs', 'UNIT'],
      ['scripts/seo-content-audit-integration.test.mjs', 'INTEGRATION'],
      ['app/page.test.js', 'COMPONENT'],
      ['app/components/SiteHeader.test.js', 'COMPONENT'],
      ['app/work/atelier/page.test.js', 'COMPONENT'],
      ['app/api/chat/route.test.js', 'INTEGRATION'],
      ['scripts/worker-secrets-audit.test.mjs', 'ENVIRONMENT'],
      ['scripts/metadata-audit.test.mjs', 'ENVIRONMENT'],
      ['scripts/build-audit.test.mjs', 'ENVIRONMENT'],
      ['tests/audit-validation.test.mjs', 'UNIT'],
    ];
    const out = cases.map(([path, want]) => ({ path, want, got: classifyTier(path) }));
    const envCases = [
      ['NETWORK: ECONNREFUSED 127.0.0.1', 'NETWORK'],
      ['AUTH: missing CF_API_TOKEN', 'AUTH'],
      ['ENV-MISSING: SUPABASE_URL not set', 'ENV-MISSING'],
      ['AssertionError: expected 1 to equal 2', null],
    ];
    for (const [msg, want] of envCases) out.push({ msg, want, got: classifyFailure(msg) });
    process.stdout.write(JSON.stringify(out));
  `;
  // ponytail: probe is injected as ESM via stdin to node --input-type=module.
  const probeFile = '/tmp/_orch_probe.mjs';
  await writeFile(probeFile, probe);
  const r = spawnSync(process.execPath, [probeFile], { encoding: 'utf8' });
  assert.equal(r.status, 0, `probe failed: ${r.stderr}`);
  const rows = JSON.parse(r.stdout);
  // ponytail: tier assertions
  const tiers = Object.fromEntries(rows.filter(r => r.want && ['UNIT','COMPONENT','INTEGRATION','ENVIRONMENT'].includes(r.want)).map(r => [`${r.path}->${r.want}`, r.got]));
  assert.equal(tiers['lib/pricing.test.mjs->UNIT'], 'UNIT');
  assert.equal(tiers['lib/notifications/templates.test.mjs->UNIT'], 'UNIT');
  assert.equal(tiers['scripts/rls-policy-audit.test.mjs->UNIT'], 'UNIT');
  assert.equal(tiers['app/page.test.js->COMPONENT'], 'COMPONENT');
  assert.equal(tiers['app/components/SiteHeader.test.js->COMPONENT'], 'COMPONENT');
  assert.equal(tiers['app/work/atelier/page.test.js->COMPONENT'], 'COMPONENT');
  assert.equal(tiers['app/api/chat/route.test.js->INTEGRATION'], 'INTEGRATION');
  assert.equal(tiers['scripts/worker-secrets-audit.test.mjs->ENVIRONMENT'], 'ENVIRONMENT');
  assert.equal(tiers['scripts/metadata-audit.test.mjs->ENVIRONMENT'], 'ENVIRONMENT');
  assert.equal(tiers['scripts/build-audit.test.mjs->ENVIRONMENT'], 'ENVIRONMENT');
  assert.equal(tiers['tests/audit-validation.test.mjs->UNIT'], 'UNIT');
  // ponytail: env-classifier assertions
  const envs = Object.fromEntries(rows.filter(r => 'msg' in r).map(r => [r.msg, r.got]));
  assert.equal(envs['NETWORK: ECONNREFUSED 127.0.0.1'], 'NETWORK');
  assert.equal(envs['AUTH: missing CF_API_TOKEN'], 'AUTH');
  assert.equal(envs['ENV-MISSING: SUPABASE_URL not set'], 'ENV-MISSING');
  assert.equal(envs['AssertionError: expected 1 to equal 2'], null);
});

test('orchestrator TAP parser correctly extracts pass/fail counts', async () => {
  const probe = `
    import { parseTAP } from '${process.cwd()}/scripts/test-orchestrator.mjs';
    const tap = [
      'TAP version 13',
      'ok 1 - a passing test',
      '  ---',
      '  duration_ms: 1.0',
      '  type: test',
      '  ...',
      'not ok 2 - a logic failure',
      '  ---',
      '  error: AssertionError: expected 1 to equal 2',
      '  ...',
      'not ok 3 - env missing',
      '  ---',
      '  error: AUTH: missing CF_API_TOKEN',
      '  ...',
      '1..3',
      '# tests 3',
      '# pass 1',
      '# fail 2',
      '# skipped 0',
    ].join('\\n');
    const r = parseTAP(tap);
    process.stdout.write(JSON.stringify(r));
  `;
  const probeFile = '/tmp/_orch_tap_probe.mjs';
  await writeFile(probeFile, probe);
  const r = spawnSync(process.execPath, [probeFile], { encoding: 'utf8' });
  assert.equal(r.status, 0, `probe failed: ${r.stderr}`);
  const parsed = JSON.parse(r.stdout);
  assert.equal(parsed.pass, 1);
  assert.equal(parsed.fail, 2);
  assert.equal(parsed.failures.length, 2);
  assert.equal(parsed.failures[0].name, 'a logic failure');
  assert.match(parsed.failures[0].error, /AssertionError/);
  assert.equal(parsed.failures[1].name, 'env missing');
  assert.match(parsed.failures[1].error, /AUTH/);
});

test('orchestrator end-to-end on a fake isolated fixture', async () => {
  // ponytail: build a temp repo with one file per tier, run orchestrator on
  // it via cwd override, assert the report exists and tiers look right.
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'orch-test-'));
  // minimal package.json so discovery still walks it
  await fs.writeFile(path.join(root, 'package.json'), '{"name":"orch-probe"}');
  // fixture tests
  await fs.mkdir(path.join(root, 'lib'), { recursive: true });
  await fs.writeFile(path.join(root, 'lib/foo.test.mjs'), `
    import test from 'node:test';
    import assert from 'node:assert/strict';
    test('unit ok', () => assert.equal(1,1));
  `);
  await fs.mkdir(path.join(root, 'app/components'), { recursive: true });
  await fs.writeFile(path.join(root, 'app/components/bar.test.js'), `
    const test = require('node:test');
    const assert = require('node:assert/strict');
    test('component ok', () => assert.equal(2,2));
  `);
  await fs.mkdir(path.join(root, 'app/api/chat'), { recursive: true });
  await fs.writeFile(path.join(root, 'app/api/chat/route.test.js'), `
    const test = require('node:test');
    test('integration ok', () => {});
  `);
  await fs.mkdir(path.join(root, 'scripts'), { recursive: true });
  await fs.writeFile(path.join(root, 'scripts/worker-secrets-audit.test.mjs'), `
    import test from 'node:test';
    import assert from 'node:assert/strict';
    test('env failure is classified', () => {
      throw new Error('AUTH: missing CF_API_TOKEN env var');
    });
  `);
  // ponytail: invoke orchestrator with the temp repo as cwd by spawning it.
  // The orchestrator reads cwd via process.cwd() — we set it via the spawn.
  const r = spawnSync(process.execPath, [`${process.cwd()}/scripts/test-orchestrator.mjs`], {
    encoding: 'utf8',
    cwd: root,
    env: { ...process.env, NODE_PATH: '' },
  });
  assert.equal(r.status, 0, `orchestrator should exit 0 (env-only failure), got ${r.status}: ${r.stderr}\n${r.stdout}`);
  const reportPath = path.join(root, 'reports/TEST_ORCHESTRATION_REPORT.md');
  const jsonPath = path.join(root, 'reports/TEST_ORCHESTRATION_REPORT.json');
  assert.ok(await fs.stat(reportPath).then(() => true).catch(() => false), 'report.md missing');
  assert.ok(await fs.stat(jsonPath).then(() => true).catch(() => false), 'report.json missing');
  const report = await fs.readFile(reportPath, 'utf8');
  assert.match(report, /# Test Orchestration Report/);
  assert.match(report, /UNIT/);
  assert.match(report, /COMPONENT/);
  assert.match(report, /INTEGRATION/);
  assert.match(report, /ENVIRONMENT/);
  assert.match(report, /AUTH/);
  const json = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const envTier = json.tiers.find(t => t.name === 'ENVIRONMENT');
  assert.ok(envTier, 'ENVIRONMENT tier missing from JSON');
  assert.equal(envTier.results.length, 1);
  assert.equal(envTier.results[0].envFailures.length, 1);
  assert.equal(envTier.results[0].envFailures[0].kind, 'AUTH');
  // cleanup
  await fs.rm(root, { recursive: true, force: true });
});