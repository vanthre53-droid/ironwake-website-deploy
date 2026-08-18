// IronWake security disclosure route. RFC 9116:
// https://www.rfc-editor.org/rfc/rfc9116
// Returns text/plain so the well-known URI agent can parse it directly.
export const dynamic = 'force-static';
export const revalidate = false;

const BODY = [
  'Contact: mailto:security@ironwake.dev',
  'Contact: https://ironwake.dev/contact',
  'Preferred-Languages: en',
  'Canonical: https://ironwake.dev/.well-known/security.txt',
  `Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}`,
].join('\n');

export async function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
