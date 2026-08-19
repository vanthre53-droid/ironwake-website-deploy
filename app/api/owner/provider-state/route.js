// IronWake owner-only provider-state probe.
//
// GET /api/owner/provider-state
//   Returns the live integration state of every external provider the
//   IronWake stack depends on:
//     - Retell (voice web-call agent)
//     - Meta WhatsApp Cloud API (inbound + outbound messaging)
//     - Supabase (auth + database + storage)
//     - Cloudflare (Workers / KV / R2)
//
//   Verdict vocabulary (per the V13 owner requirement — "no fake placeholders"):
//     VERIFIED         — env is configured AND a live read-only call succeeded
//     NOT_CONFIGURED   — required env vars are missing
//     UNREACHABLE      — env is configured but the live call failed
//
// Owner auth: same shape as /api/owner/whoami — Bearer token + AAL2 +
// allowed email. This route never accepts the service_role key and never
// signs its own tokens.
//
// Caching: in-process 5-minute cache. We deliberately do NOT cache the
// negative results inside the response — the owner should be able to force
// a fresh probe via the `?fresh=1` query param.
//
// Source citations: see lib/provider-state.mjs for the per-provider
// read-only endpoints.

import { NextResponse } from 'next/server.js';
import {
  probeAll,
  summarizeProvider
} from '../../../../lib/provider-state.mjs';
import { parseBearerToken, getAalFromJwt } from '../../../../lib/owner-auth.mjs';
import { createServerSupabase } from '../../../../lib/supabase/clients.mjs';

export const runtime = 'nodejs';

const CACHE_TTL_MS = 5 * 60 * 1000;
const OWNER_EMAIL = 'ironwakee@gmail.com';

// Per-process cache. Process-local: it survives within a warm instance
// lifetime and is invalidated on 5-minute TTL or `?fresh=1`.
const cache = {
  at: 0,
  payload: null
};

const PRIVATE_HEADERS = {
  'cache-control': 'private, no-store, max-age=0',
  vary: 'authorization'
};

const CACHED_HEADERS = {
  'cache-control': 'private, max-age=300, stale-while-revalidate=60',
  vary: 'authorization'
};

function reject(status, body) {
  return NextResponse.json({ authorized: false, ...body }, { status, headers: PRIVATE_HEADERS });
}

async function authorizeOwner(request) {
  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) {
    return { ok: false, status: 401, reason: 'missing_bearer' };
  }
  const aal = getAalFromJwt(token);
  if (aal !== 'aal2') {
    return { ok: false, status: 401, reason: 'aal_required' };
  }
  const supabase = createSupabaseAnonClient(request);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, reason: 'invalid_session' };
  }
  const email = String(data.user.email || '').toLowerCase();
  if (email !== OWNER_EMAIL) {
    return { ok: false, status: 403, reason: 'not_owner' };
  }
  return { ok: true, user: data.user };
}

async function buildPayload({ env, fetchImpl }) {
  const startedAt = new Date().toISOString();
  const result = await probeAll({ env, fetchImpl });
  const lastProbed = result.lastProbed;
  const providers = [
    summarizeProvider('retell', result.retell, lastProbed),
    summarizeProvider('meta', result.meta, lastProbed),
    summarizeProvider('supabase', result.supabase, lastProbed),
    summarizeProvider('cloudflare', result.cloudflare, lastProbed)
  ];
  return {
    ownerStatus: 'authorized',
    lastProbed,
    requestedAt: startedAt,
    providers
  };
}

/**
 * GET handler — owner-only.
 *
 * Honors `?fresh=1` to bypass the 5-minute cache (always probes live).
 * Returns a stable envelope shape so the owner dashboard can render it
 * without bespoke normalization.
 */
export async function GET(request, { env = process.env, fetchImpl } = {}) {
  const auth = await authorizeOwner(request);
  if (!auth.ok) {
    return reject(auth.status, { reason: auth.reason });
  }

  const url = new URL(request.url);
  const forceFresh = url.searchParams.get('fresh') === '1';

  const now = Date.now();
  if (!forceFresh && cache.payload && now - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.payload, { status: 200, headers: CACHED_HEADERS });
  }

  const payload = await buildPayload({ env, fetchImpl });
  cache.at = Date.now();
  cache.payload = payload;

  return NextResponse.json(payload, { status: 200, headers: CACHED_HEADERS });
}

function unsupported(method) {
  return NextResponse.json(
    { authorized: false, reason: 'Method not allowed.' },
    { status: 405, headers: { allow: 'GET', ...PRIVATE_HEADERS } }
  );
}

export const POST = unsupported;
export const PUT = unsupported;
export const PATCH = unsupported;
export const DELETE = unsupported;
export const OPTIONS = unsupported;
export const HEAD = unsupported;
