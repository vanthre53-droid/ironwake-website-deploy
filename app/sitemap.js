export default function sitemap() {
  const base = 'https://ironwake.netlify.app';
  const pages = ['', '/systems', '/work', '/audit', '/book', '/scope', '/process', '/about', '/industries', '/privacy', '/terms',
    '/systems/missed-lead-recovery', '/systems/booking-control', '/systems/trust-lead-capture', '/systems/ai-receptionist',
    '/work/rapidpulse', '/work/dentacare-pro', '/work/atelier', '/work/harbour-estates', '/work/aura-archives', '/work/luxe-studio', '/work/bramble-cafe', '/work/voltix', '/work/retech',
    '/industries/home-services', '/industries/dental-clinics', '/industries/salons-spas'];
  return pages.map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1.0 : 0.8 }));
}
