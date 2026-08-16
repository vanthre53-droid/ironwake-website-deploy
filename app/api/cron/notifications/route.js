import { runCronInvocation } from '../../../../lib/notifications/cron-handler.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ponytail: Cloudflare Cron Trigger target. The Cloudflare Worker
// `scheduled` handler self-fetches this URL on the configured cron
// schedule (currently every 2 minutes — see wrangler.jsonc triggers.crons).
// The endpoint is also reachable by any other trusted operator (e.g.
// supabase pg_cron, ops dashboard) for manual drain. Authentication is a
// shared secret in `Authorization: Bearer ${CRON_SECRET}`. The same secret
// is stored as the Cloudflare Worker secret CRON_SECRET so the scheduled
// handler can present it.
//
// Goal §7: provider-neutral business logic. The Worker business logic
// lives in lib/notifications/{worker,cron-handler}.mjs; this route is
// just the HTTP surface. There is no Netlify-specific code here.
export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  const presented = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const result = await runCronInvocation({ presentedToken: presented });
  const { httpStatus, ...body } = result;
  return Response.json(body, { status: httpStatus || 200 });
}

export async function GET() {
  return Response.json({ status: 'method_not_allowed' }, { status: 405 });
}
