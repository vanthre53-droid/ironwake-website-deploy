// ponytail: Cloudflare Worker entry wrapper.
//
// OpenNext 1.20.2 emits `.open-next/worker.js` with only a `fetch` export.
// Cloudflare Cron Triggers require a `scheduled` handler on the same
// Worker module. The standard pattern is a thin wrapper that re-exports
// `fetch` from the OpenNext bundle and adds `scheduled`.
//
// The `scheduled` handler self-fetches the authenticated cron endpoint
// (see app/api/cron/notifications/route.js). Authentication uses the
// shared secret `CRON_SECRET` (Worker secret) presented as a bearer
// token. Self-fetch goes through the same routing/middleware stack the
// public site uses, so canonical-host redirects, noindex routes, and
// Supabase cookie refresh all still apply.
//
// Goal §7: this wrapper replaces the Netlify `[[functions."notification-worker"]]`
// schedule in netlify.toml (now removed). The notification business logic
// stays provider-neutral in lib/notifications/{worker,cron-handler}.mjs.

import openNextWorker from './.open-next/worker.js';
import { selfFetchCronEndpoint } from './lib/notifications/cron-handler.mjs';

async function runScheduledTick(env, ctx) {
  const outcome = await selfFetchCronEndpoint({ env });
  if (!outcome.ok) {
    console.warn(`cron_tick_outcome=${outcome.reason || `http_${outcome.status}`}`);
  }
  if (ctx?.waitUntil) {
    ctx.waitUntil(Promise.resolve());
  }
}

export default {
  async fetch(request, env, ctx) {
    return openNextWorker.fetch(request, env, ctx);
  },

  async scheduled(event, env, ctx) {
    await runScheduledTick(env, ctx);
  },
};
