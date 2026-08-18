import manifest from '../manifest.json';

export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: {
      'content-type': 'application/manifest+json',
      'cache-control': 'public, max-age=300, must-revalidate'
    }
  });
}
