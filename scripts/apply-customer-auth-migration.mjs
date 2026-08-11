#!/usr/bin/env node
// ponytail: one-shot migration runner for the customer-auth migration.
// Connects to the Supabase Postgres database directly using the pg library
// and the service-role JWT as the password.
//
// This script is idempotent: it uses CREATE TABLE IF NOT EXISTS and
// policy-existence guards. Re-running it is safe.
//
// Usage:
//   source .env.local
//   node scripts/apply-customer-auth-migration.mjs
//
// The script auto-resolves the database hostname via IPv6 (Supabase projects
// publish AAAA records). If your sandbox has working IPv6 routing it will
// connect; otherwise you must run this script from a host that can dial
// the Supabase Postgres endpoint.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lookup } from 'node:dns/promises';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const migrationFile = process.argv[2] || join(here, '..', 'supabase', 'migrations', '20260811100000_customer_auth_and_chat.sql');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// ponytail: node 22 ships node-pg via require, but as an ES module we use
// createRequire to load it. If the package is not installed, fail loudly so
// the operator knows to `npm install pg`.
const require = createRequire(import.meta.url);
let pg;
try { pg = require('pg'); }
catch { console.error('pg package missing — run `npm install pg` first'); process.exit(1); }

const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const dbHost = `db.${host}`;
// ponytail: try IPv6 first because that is what Supabase publishes today.
// If only IPv4 is published the lookup will reject and the script exits 1.
let resolved = null;
try {
  const r = await lookup(dbHost, { family: 6 });
  resolved = r.address;
  console.log(`[migrate] resolved ${dbHost} -> ${resolved} (IPv6)`);
} catch (err) {
  console.error(`[migrate] failed to resolve ${dbHost}: ${err.message}`);
  process.exit(1);
}

const client = new pg.Client({
  host: resolved,
  port: 5432,
  user: 'postgres',
  password: serviceKey,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});
const sql = readFileSync(migrationFile, 'utf8');
try {
  await client.connect();
  console.log(`[migrate] connected to ${resolved}:5432`);
  await client.query(sql);
  console.log('[migrate] OK');
  process.exit(0);
} catch (error) {
  console.error('[migrate] FAIL:', error.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
