// ponytail: serves the apple-touch-icon (SVG) with the correct
// Content-Type. Next.js statically serves any file in /public at the
// root, but app/apple-icon.png is auto-routed as a metadata icon.
// Real app/apple-icon.svg route was missing — this reinstates it so
// live-acceptance and CMS previewers can reach it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextResponse } from 'next/server.js';

const SVG_PATH = join(process.cwd(), 'app/_assets/apple-icon.svg');

function loadSvg() {
  return readFileSync(SVG_PATH, 'utf8');
}

export const dynamic = 'force-static';

export async function GET() {
  return new NextResponse(loadSvg(), {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=86400, immutable',
    },
  });
}
