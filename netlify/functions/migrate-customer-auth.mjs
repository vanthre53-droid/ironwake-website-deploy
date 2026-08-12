// ponytail: one-shot migration bootstrap. Idempotent — safe to invoke repeatedly.
//
// This Netlify function connects to the Supabase Postgres database directly
// (TCP, service-role JWT as password) and creates the customer-auth tables,
// RLS policies, indexes, and the upsert_own_profile RPC if they do not
// already exist. The migration SQL is the same file as
// supabase/migrations/20260811100000_customer_auth_and_chat.sql.
//
// Triggering:
//   - GET or POST /api/admin/migrate-customer-auth  with header x-migrate-secret: <SECRET>
//   - secret must equal env var MIGRATE_SECRET
//   - returns { ok: true, applied: 'customer_auth_and_chat' } on success
//   - returns 401 if secret missing/mismatched
//   - returns 503 if db connection fails
//   - returns 200 with ok:false + error on SQL failure (idempotent retries safe)
//
// The function is mounted under netlify.toml at /api/admin/migrate-customer-auth.
//
// ponytail: env resolution. Netlify Functions v2 pass (request, context)
// where context.env holds site env vars, and globalThis.Netlify.env exposes
// the same data. Older v1 signatures passed env directly. We merge every
// plausible source so this works regardless of which runtime path the
// request took.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lookup } from 'node:dns/promises';
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

function resolveEnv(context) {
  // ponytail: try every plausible source for the deploy env.
  const merged = {};
  if (context && typeof context === 'object' && context.env && typeof context.env === 'object') {
    Object.assign(merged, context.env);
  }
  if (typeof globalThis !== 'undefined' && globalThis.Netlify && globalThis.Netlify.env) {
    try {
      const e = globalThis.Netlify.env;
      const obj = (typeof e.toObject === 'function') ? e.toObject() : e;
      if (obj && typeof obj === 'object') Object.assign(merged, obj);
    } catch { /* ignore */ }
  }
  if (typeof process !== 'undefined' && process.env) Object.assign(merged, process.env);
  return merged;
}

async function resolveDbHost(url) {
  // ponytail: Supabase publishes AAAA-only for direct DB endpoints.
  // The Lambda / Edge runtime's default DNS resolver sometimes refuses
  // AAAA lookups (returning ENOTFOUND); we look up AAAA ourselves and pass
  // the literal IPv6 address into pg.Client. If AAAA fails, return the
  // hostname and let pg try both families.
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const dbHost = `db.${host}`;
  try {
    const r = await lookup(dbHost, { family: 6 });
    return r.address;
  } catch {
    return dbHost;
  }
}

async function connectDb(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { error: 'Supabase public URL or service-role key missing in env.' };
  }
  const host = await resolveDbHost(url);
  const client = new pg.Client({
    host,
    port: 5432,
    user: 'postgres',
    password: serviceKey,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });
  try {
    await client.connect();
    return { client };
  } catch (error) {
    return { error: `connect failed: ${error.message}` };
  }
}

export default async (request, context) => {
  const env = resolveEnv(context);

  // ponytail: only POST/GET from anyone holding the MIGRATE_SECRET.
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