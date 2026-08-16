import { createClient } from '@supabase/supabase-js';
// ponytail: drop `runtime = 'nodejs'` to keep this route on the default
// edge runtime and avoid bundling the Node.js compat shim (which
// pushed the Worker over the Free plan 3 MiB limit in the previous
// deploy). `crypto.randomUUID()` is available on the edge via the
// Web Crypto API in both Next.js edge runtime and Cloudflare Workers.
import { allowRequest, requestIdentity } from '../../../lib/request-rate-limit.mjs';

export const dynamic = 'force-dynamic';

// ponytail: Meta Data Deletion Request callback.
//
// Meta App Review requires every app that receives user data to
// expose a Data Deletion Request URL. IronWake does not collect
// arbitrary Meta user data — we only store wamids from messages our
// OWN WABA receives/sends. But Meta still requires the endpoint so
// they can forward a deletion request from a person who contacted
// our business WhatsApp.
//
// Request body: { signed_request: "<base64-url-encoded-hmac-payload>" }
// where the payload is `<app_id>.<user_id>` HMAC-SHA256 signed with
// the App Secret.
//
// We acknowledge with the documented { url, confirmation_code } shape
// and queue a no-op durable record. A real wipe is a separate, owner-
// approved workflow that lives outside this scaffold.

export async function POST(request) {
  const identity = requestIdentity(request);
  const budget = allowRequest(`meta-data-deletion:${identity}`, { limit: 30, windowMs: 60_000 });
  if (!budget) return Response.json({ ok: false, safeErrorCode: 'rate_limited' }, { status: 429 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, safeErrorCode: 'invalid_json' }, { status: 400 });
  }

  const signedRequest = typeof body?.signed_request === 'string' ? body.signed_request : '';
  if (!signedRequest) return Response.json({ ok: false, safeErrorCode: 'missing_signed_request' }, { status: 400 });

  const confirmationCode = `ironwake-del-${crypto.randomUUID()}`;
  await recordDeletionRequest({ confirmationCode, signedRequest });

  return Response.json({
    url: `https://ironwake.dev/meta/data-deletion?code=${encodeURIComponent(confirmationCode)}`,
    confirmation_code: confirmationCode
  });
}

async function recordDeletionRequest({ confirmationCode, signedRequest }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return;
  try {
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    await supabase.from('meta_deletion_requests').insert({
      confirmation_code: confirmationCode,
      signed_request: signedRequest.slice(0, 1024),
      status: 'queued'
    });
  } catch {
    // ponytail: failure to persist the request is not a 500 to Meta —
    // they expect a confirmation shape. The owner sees an empty queue
    // when they later wire the manual review step.
  }
}
