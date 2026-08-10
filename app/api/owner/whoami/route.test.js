// ponytail: validates the server-side owner authorization route contract.
// The route does not touch service_role, never signs its own tokens, and
// never returns private data to non-owners. These are static checks against
// the route source plus a smoke check that a missing Authorization header
// is rejected with 401.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const routePath = fileURLToPath(new URL('../whoami/route.js', import.meta.url));

test('whoami route never references service_role or signs its own tokens', async () => {
  const src = await readFile(routePath, 'utf8');
  // ponytail: hard rule — the route must not have the service-role key.
  assert.doesNotMatch(src, /SUPABASE_SERVICE_ROLE_KEY/);
  // The route must not issue its own tokens.
  assert.doesNotMatch(src, /admin\./);
  assert.doesNotMatch(src, /signInWithPassword/);
  // The route must require the bearer token and call getUser to validate it.
  assert.match(src, /authorization/i);
  assert.match(src, /parseBearerToken/);
  assert.match(src, /auth\.getUser\(token\)/);
  assert.match(src, /getAalFromJwt/);
  assert.match(src, /aal2/);
  assert.doesNotMatch(src, /global:\s*\{\s*headers/);
  // The route must compare against the designated owner email.
  assert.match(src, /ironwakee@gmail\.com/);
  // The route must return 401 for missing/invalid sessions and 403 for
  // authenticated non-owners, and never echo private data on rejection.
  assert.match(src, /status:\s*401/);
  assert.match(src, /status:\s*403/);
  for (const forbidden of ['inquiries', 'contacts', 'tasks', 'audit_logs', 'outbox_events', 'business_name']) {
    assert.doesNotMatch(src, new RegExp(forbidden), `route must not leak private column "${forbidden}"`);
  }
});

test('whoami route returns 401 when no Bearer token is supplied', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://stub.test';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
  const { POST } = await import('../whoami/route.js');
  const req = new Request('http://localhost/api/owner/whoami', { method: 'POST', headers: {} });
  const res = await POST(req);
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('cache-control'), 'private, no-store, max-age=0');
  assert.equal(res.headers.get('vary'), 'authorization');
  const body = await res.json();
  assert.equal(body.authorized, false);
});

test('whoami route rejects unsupported methods without exposing authorization data', async () => {
  const { GET } = await import('../whoami/route.js');
  const res = await GET(new Request('http://localhost/api/owner/whoami', { method: 'GET' }));
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'POST');
  assert.equal(res.headers.get('cache-control'), 'private, no-store, max-age=0');
  assert.deepEqual(await res.json(), { authorized: false, reason: 'Method not allowed.' });
});
