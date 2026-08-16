// ponytail: robots sitemap URL must match the canonical site URL (see app/sitemap.js).
const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${FALLBACK_SITE_URL}/sitemap.xml`,
  };
}
