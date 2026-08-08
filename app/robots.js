// ponytail: sitemap URL must match the canonical site URL (see app/sitemap.js).
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwake-site.netlify.app';

export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
