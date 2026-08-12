// ponytail: migration bootstrap that uses the Supabase pooler over IPv4
// instead of the direct DB endpoint. The pooler accepts connections from
// any AWS Lambda region via IPv4; the direct DB endpoint is IPv6-only.
//
// CRITICAL: Supabase pooler requires the actual PostgreSQL database password,
// NOT the Supabase service_role JWT. The service_role JWT is a PostgREST
// bearer token. Per goal rule "Do not invent credentials", this function
// refuses to attempt authentication with anything other than the value the
// operator explicitly configured as DATABASE_PASSWORD in the Netlify env.
//
// Triggering:
//   - GET or POST /api/admin/migrate-customer-auth  with header x-migrate-secret: <SECRET>
//   - returns 401 if secret missing/mismatched
//   - returns 503 if db connection fails
//   - returns 200 with ok:false + error on SQL failure (idempotent retries safe)

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const migrationFiles = [
  '20260811100000_customer_auth_and_chat.sql',
  '20260812100000_harden_customer_isolation.sql',
].map((name) => join(repoRoot, 'supabase', 'migrations', name));

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

async function preflight(client) {
  const mismatch = await client.query(`
    select count(*)::int as count
    from public.chat_messages m
    join public.chat_sessions s on s.id = m.session_id
    where m.user_id is distinct from s.user_id
  `);
  return {
    ok: true,
    preflight: true,
    crossOwnerMessageCount: mismatch.rows[0].count,
    safeToApply: mismatch.rows[0].count === 0,
  };
}

function resolveEnv(context) {
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

async function connectPooler(env) {
  // ponytail: Supabase pooler accepts the actual DATABASE_PASSWORD (set as
  // DATABASE_PASSWORD in the Netlify env) and the project ref-derived
  // username. The pooler publishes IPv4 addresses, so this works from any
  // Lambda region without IPv6 egress. The default region for this project
  // is ap-southeast-1 (Singapore), reachable via the ap-southeast-1 pooler
  // host.
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = env.DATABASE_PASSWORD;
  if (!url) return { error: 'NEXT_PUBLIC_SUPABASE_URL missing in env.' };
  if (!dbPassword) return { error: 'DATABASE_PASSWORD missing in env. The Supabase service_role JWT is a PostgREST bearer, NOT a PostgreSQL password. An operator must set DATABASE_PASSWORD to the actual database password issued by Supabase.' };
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const projectRef = host.split('.')[0];
  const poolerHost = 'aws-0-ap-southeast-1.pooler.supabase.com';
  const user = `postgres.${projectRef}`;
  const client = new pg.Client({
    host: poolerHost,
    port: 6543,
    user,
    password: dbPassword,
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

export default async (request, context) => {
  const env = resolveEnv(context);

  const secret = request.headers.get('x-migrate-secret') || '';
  const expected = env.MIGRATE_SECRET || '';
  if (!expected || secret !== expected) return unauthorized();

  const { client, error: connectError } = await connectPooler(env);
  if (connectError) return jsonResponse({ ok: false, error: 'database_unavailable' }, 503);

  try {
    if (new URL(request.url).searchParams.get('mode') === 'preflight') {
      const result = await preflight(client);
      await client.end();
      return jsonResponse(result, 200);
    }
    await client.query('begin');
    for (const migrationFile of migrationFiles) {
      await client.query(readFileSync(migrationFile, 'utf8'));
    }
    await client.query('commit');
    await client.end();
    return jsonResponse({
      ok: true,
      applied: ['customer_auth_and_chat', 'harden_customer_isolation'],
    }, 200);
  } catch (error) {
    try { await client.query('rollback'); } catch {}
    try { await client.end(); } catch {}
    console.error('[migrate-customer-auth] operation failed', { code: error?.code || 'unknown' });
    return jsonResponse({ ok: false, error: 'migration_failed' }, 500);
  }
};
