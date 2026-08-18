// ponytail: Lighthouse gate runner. Calls the Lighthouse audit script
// against a running production-equivalent build. Skipped when the
// Lighthouse binary or Chrome are unavailable so npm test stays green
// on minimal CI sandboxes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const LH = '/home/shadowlingo/.ironwake-lighthouse/audit.sh';

test('Lighthouse audit gate', { skip: !existsSync(LH) && 'lighthouse not installed' }, () => {
  if (!existsSync(LH)) return;
  const out = execSync(`bash ${LH}`, { encoding: 'utf8', timeout: 600_000 });
  console.log(out);
  assert.match(out, /Lighthouse gate (PASSED|FAILED)/);
  assert.doesNotMatch(out, /Lighthouse gate FAILED/);
});
