import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(here, '20260818090000_webhook_dedup_and_meta_deletion.sql');
const sql = readFileSync(sqlPath, 'utf8');
const route = readFileSync(join(here, '..', '..', 'app', 'api', 'webhooks', 'meta', 'whatsapp', 'route.js'), 'utf8');
const ddRoute = readFileSync(join(here, '..', '..', 'app', 'meta', 'data-deletion', 'route.js'), 'utf8');

test('migration declares webhook_dedup with a primary key for insert-or-conflict dedup', () => {
  assert.ok(existsSync(sqlPath), 'expected migration SQL to exist');
  assert.match(sql, /create table if not exists public\.webhook_dedup/i);
  assert.match(sql, /dedup_key\s+text primary key/i);
  assert.match(sql, /webhook_dedup_source_first_seen_idx/i);
});

test('migration declares meta_deletion_requests with the App Review status check', () => {
  assert.match(sql, /create table if not exists public\.meta_deletion_requests/i);
  assert.match(sql, /confirmation_code\s+text primary key/i);
  assert.match(sql, /check \(status in \('queued', 'reviewed', 'done'\)/i);
});

test('migration declares meta_opt_outs sink so STOP handling is durable', () => {
  assert.match(sql, /create table if not exists public\.meta_opt_outs/i);
  assert.match(sql, /meta_opt_outs_wa_from_idx/i);
});

test('migration revokes public grants on all three tables', () => {
  assert.match(sql, /revoke all on public\.webhook_dedup from public, anon, authenticated/i);
  assert.match(sql, /revoke all on public\.meta_deletion_requests from public, anon, authenticated/i);
  assert.match(sql, /revoke all on public\.meta_opt_outs from public, anon, authenticated/i);
});

test('WhatsApp webhook handler uses insert+conflict detection, not upsert', () => {
  // ponytail: the previous upsert-then-accept let Meta webhooks process
  // twice. The new code uses .insert and treats 23505 as the duplicate
  // signal.
  assert.doesNotMatch(route, /\.upsert\(\s*\{[\s\S]*?onConflict:\s*'dedup_key'/i);
  assert.match(route, /\.from\('webhook_dedup'\)\.insert\(/i);
  assert.match(route, /error\.code === '23505'/i);
});

test('WhatsApp webhook handler short-circuits on STOP keywords without echoing', () => {
  assert.match(route, /STOP_KEYWORDS = new Set\(\['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit'\]\)/i);
  assert.match(route, /function detectOptOut/i);
  assert.match(route, /\.from\('meta_opt_outs'\)\.insert\(/i);
});

test('Data Deletion callback persists into meta_deletion_requests', () => {
  assert.match(ddRoute, /\.from\('meta_deletion_requests'\)\.insert\(/i);
  assert.match(ddRoute, /status:\s*'queued'/i);
});