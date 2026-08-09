// Static migration-content test. The live database is not touched here; the
// predicate is exercised end-to-end in the deployed Supabase project. This
// test guarantees the SQL ships and keeps the right shape.

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const migration = new URL(
  './006_restrict_owner_to_single_email.sql',
  import.meta.url
);

test('is_owner() now requires the designated owner email', async () => {
  const sql = await readFile(migration, 'utf8');
  // The function must still be SECURITY INVOKER so it evaluates against the
  // caller's JWT, never the function owner's.
  assert.match(
    sql,
    /create or replace function public\.is_owner\(\)[\s\S]*security invoker/s
  );
  // The function must still read the legacy role marker so we don't break
  // the existing RLS contract.
  assert.match(
    sql,
    /auth\.jwt\(\) -> 'app_metadata' ->> 'role'/
  );
  // The function must also require the designated owner email.
  assert.match(sql, /'ironwakee@gmail\.com'/);
  // The function must default-deny if the email is missing.
  assert.match(sql, /coalesce\([\s\S]*false\s*\)/);
});
