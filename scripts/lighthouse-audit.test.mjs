// ponytail: Lighthouse gate runner. Calls the Lighthouse audit script
// against a running production-equivalent build. This is an explicit live
// gate: npm test skips it unless RUN_LIVE_LIGHTHOUSE=1 and the local wrapper
// exists, so ordinary CI does not unexpectedly spend ten minutes on a live
// network audit.
//
// LH_BASE overrides the default base URL. Default is the live
// production site (https://ironwake.dev) so the gate reflects what
// real visitors see. Set LH_BASE=http://localhost:3030 in a local
// dev server context to audit a fresh `npm start` build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LH = '/home/shadowlingo/.ironwake-lighthouse/audit.sh';
const BASE = process.env.LH_BASE ?? 'https://ironwake.dev/';

const LIVE_ENABLED = process.env.RUN_LIVE_LIGHTHOUSE === '1';
const SKIP_REASON = !LIVE_ENABLED
  ? 'set RUN_LIVE_LIGHTHOUSE=1 to opt into the live Lighthouse gate'
  : !existsSync(LH)
    ? `Lighthouse wrapper prerequisite missing: ${LH}`
    : false;

test('Lighthouse audit gate', { skip: SKIP_REASON }, () => {
  if (!existsSync(LH)) return;
  const out = execSync(`bash ${LH} ${BASE}`, { encoding: 'utf8', timeout: 600_000 });
  console.log(out);
  assert.match(out, /Lighthouse gate (PASSED|FAILED)/);
  assert.doesNotMatch(out, /Lighthouse gate FAILED/);
});
