import { createWebCall } from '../../../../lib/retell-server.mjs';
import { allowRequest, requestIdentity } from '../../../../lib/request-rate-limit.mjs';
import { getServerOrigin } from '../../../../lib/site-origin.mjs';

export const dynamic = 'force-dynamic';

// ponytail: Retell web-call session bootstrap.
//
// Browser POSTs here with an empty body. The server:
//  1. derives a client identity (Cloudflare cf-connecting-ip),
//  2. applies a small per-IP budget so the expensive Retell create-call
//     call cannot be exhausted by an attacker,
//  3. calls Retell server-to-server with RETELL_API_KEY (never sent to
//     the browser),
//  4. returns only the short-lived web-call access token plus a safe
//     call identifier.
//
// The browser starts the call with the @retell/client-sdk; the access
// token is single-use and Retell invalidates an unused token after
// ~30 seconds. Microphone permission is requested by the SDK on call
// start; we never activate the mic in this route.
//
// Goal §16: server-only keys, real states (this route returns 503 when
// the provider is unconfigured; the UI shows a truthful unavailable
// state, never a fake waveform).
export async function POST(request) {
  const identity = requestIdentity(request);
  const budget = allowRequest(`voice-session:${identity}`, { limit: 5, windowMs: 60_000 });
  if (!budget) {
    return Response.json(
      { ok: false, safeErrorCode: 'rate_limited' },
      { status: 429, headers: { 'retry-after': String(Math.ceil((budget.resetMs || 60_000) / 1000)) } }
    );
  }

  const result = await createWebCall({
    metadata: { source: 'demo' },
    customerSupabaseUserId: null
  });

  if (!result.ok) {
    return Response.json(
      { ok: false, safeErrorCode: result.safeErrorCode },
      { status: result.httpStatus || 503 }
    );
  }

  return Response.json({
    ok: true,
    accessToken: result.accessToken,
    callId: result.callId,
    expiresInSeconds: result.expiresInSeconds || 30,
    origin: getServerOrigin()
  });
}

export async function GET() {
  return Response.json({ ok: false, safeErrorCode: 'method_not_allowed' }, { status: 405 });
}
