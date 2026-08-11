// ponytail: canonical site URL drives sitemap, robots, and JSON-LD. Production MUST set NEXT_PUBLIC_SITE_URL; empty fallback prevents stale hardcoded host from leaking into metadata.
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  const pages = ['', '/systems', '/work', '/audit', '/book', '/pricing', '/scope', '/process', '/about', '/industries', '/privacy', '/terms', '/insights',
    '/systems/missed-lead-recovery', '/systems/booking-control', '/systems/trust-lead-capture', '/systems/ai-receptionist',
    '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/work/harbour-estates', '/work/aura-archives', '/work/luxe-studio', '/work/bramble-cafe', '/work/voltix', '/work/retech',
    '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas'];
  return pages.map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1.0 : 0.8 }));
}
