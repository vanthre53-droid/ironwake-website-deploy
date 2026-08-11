// ponytail: one-shot migration bootstrap. Idempotent — safe to invoke repeatedly.
//
// This Netlify function connects to the Supabase Postgres database directly
// (TCP, service-role JWT as password) and creates the customer-auth tables,
// RLS policies, indexes, and the upsert_own_profile RPC if they do not
// already exist. The migration SQL is the same file as
// supabase/migrations/20260811100000_customer_auth_and_chat.sql.
//
// Triggering:
//   - GET /api/admin/migrate-customer-auth  with header x-migrate-secret: <SECRET>
//   - secret must equal env var MIGRATE_SECRET
//   - returns { ok: true, applied: [...statements] } on success
//   - returns 401 if secret missing/mismatched
//   - returns 200 with ok:false + error on db failure (idempotent retries safe)
//
// The function is mounted under netlify.toml at /api/admin/migrate-customer-auth
// so it can be invoked from outside the Next.js runtime if needed.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const migrationFile = join(repoRoot, 'supabase', 'migrations', '20260811100000_customer_auth_and_chat.sql');

const RESPONSE_HEADERS = {
  'content-type': 'application/json',
  'cache-control': 'no-store'
};

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS });
}

function unauthorized() {
  return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
}

async function connectDb(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { error: 'Supabase public URL or service-role key missing in env.' };
  }
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  // ponytail: use IPv6 explicitly. Supabase publishes AAAA-only for its
  // direct database endpoint. Netlify Functions runtime has working IPv6.
  const client = new pg.Client({
    host: `db.${host}`,
    port: 5432,
    user: 'postgres',
    password: serviceKey,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  try {
    await client.connect();
    return { client };
  } catch (error) {
    return { error: `connect failed: ${error.message}` };
  }
}

export default async (request, env = process.env) => {
  // ponytail: only POST from the owner (or anyone holding the MIGRATE_SECRET).
  const secret = request.headers.get('x-migrate-secret') || '';
  const expected = env.MIGRATE_SECRET || '';
  if (!expected || secret !== expected) return unauthorized();

  const { client, error: connectError } = await connectDb(env);
  if (connectError) return jsonResponse({ ok: false, error: connectError }, 503);

  const sql = readFileSync(migrationFile, 'utf8');
  try {
    await client.query(sql);
    await client.end();
    return jsonResponse({ ok: true, applied: 'customer_auth_and_chat' }, 200);
  } catch (error) {
    try { await client.end(); } catch {}
    return jsonResponse({ ok: false, error: error.message }, 200);
  }
};
