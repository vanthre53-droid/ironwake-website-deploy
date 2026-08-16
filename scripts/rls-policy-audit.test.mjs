import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// ponytail: shell into scripts/rls-policy-audit.mjs and assert it exits 0.
// The audit script is the next-best evidence we can produce without a live
// Supabase database (we don't have a DB connection string; pg-mem would be a
// 12 MB dep that doesn't validate RLS the way real Postgres does).
//
// What this guards:
//   - every RLS policy uses auth.uid() / is_owner() / has_role_aal2()
//     or a deliberate deny (`using (false)`)
//   - no customer table policy grants to PUBLIC or anon
//   - every WITH CHECK mirrors the USING clause for write paths
test('RLS policy audit: no customer policy grants to anon, no USING lacks auth-uid', () => {
  const r = spawnSync('node', ['scripts/rls-policy-audit.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, `rls-policy-audit exited ${r.status}\nstdout: ${r.stdout}\nstderr: ${r.stderr}`);
  const report = JSON.parse(r.stdout);
  assert.equal(report.issues, 0, `RLS policy audit found ${report.issues} issues: ${JSON.stringify(report.details, null, 2)}`);
  assert.ok(report.policiesAudited > 0, 'audit should have inspected at least one policy');
});