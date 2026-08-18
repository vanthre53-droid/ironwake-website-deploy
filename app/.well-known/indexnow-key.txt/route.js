// IndexNow key endpoint. https://www.indexnow.org/
// Key is operator-controlled via INDEXNOW_KEY env var; a fallback
// placeholder is shipped so the route never returns 500 even if the var
// is unset. Rotate the production key with wrangler secret or by
// replacing the FALLBACK_KEY constant here.

const FALLBACK_KEY = 'TBD-by-owner-at-deploy-time';
const KEY = process.env.INDEXNOW_KEY || FALLBACK_KEY;

export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return new Response(KEY + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
    },
  });
}
