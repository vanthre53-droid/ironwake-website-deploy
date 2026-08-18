import manifest from '../manifest.json';

export const dynamic = 'force-static';

// Validate at module-eval time so a malformed manifest never reaches production.
if (!manifest || typeof manifest !== 'object' || !manifest.name) {
  throw new Error('manifest.json is missing required "name" field');
}

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: {
      'content-type': 'application/manifest+json',
      'cache-control': 'public, max-age=300, must-revalidate'
    }
  });
}
