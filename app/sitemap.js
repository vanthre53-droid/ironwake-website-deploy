// ponytail: canonical site URL drives sitemap, robots, and JSON-LD. PRODUCTION_CANONICAL_ORIGIN
// is the one source of truth. NEXT_PUBLIC_SITE_URL is an opt-in override for preview/local
// environments; in production it must be unset or equal to PRODUCTION_CANONICAL_ORIGIN.
const PRODUCTION_CANONICAL_ORIGIN = 'https://ironwake.dev';
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;

const INSIGHT_SLUGS = [
  'missed-lead-recovery-service-businesses',
  'booking-confirmation-vs-booking-request',
  'follow-up-ownership-service-businesses',
  'ai-receptionist-honest-assessment',
];

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_CANONICAL_ORIGIN;
  const pages = ['', '/systems', '/work', '/audit', '/book', '/pricing', '/scope', '/process', '/about', '/industries', '/privacy', '/terms', '/insights',
    '/systems/missed-lead-recovery', '/systems/booking-control', '/systems/trust-lead-capture', '/systems/ai-receptionist',
    '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/work/harbour-estates', '/work/aura-archives', '/work/luxe-studio', '/work/bramble-cafe', '/work/voltix', '/work/retech',
    '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas'];
  const insightPages = INSIGHT_SLUGS.map(s => `/insights/${s}`);
  return [...pages, ...insightPages].map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1.0 : 0.7 }));
}
