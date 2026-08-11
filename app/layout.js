import './globals.css';
import { SiteAssistant } from './components/SiteAssistant';
import AssistantWidget from './components/AssistantWidget';
import { ScrollToTop } from './components/ScrollToTop';

// ponytail: metadataBase lets Next.js auto-generate canonical + og:url + og:image absolute URLs from relative paths. Falls back to the live Netlify host when the env var is unset.
// ponytail: FALLBACK_SITE_URL drives metadataBase, sitemap, robots, JSON-LD canonical. Override via NEXT_PUBLIC_SITE_URL env var per deploy target.
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ironwake-system.netlify.app';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL),
  title: { default: 'IronWake — Systems that answer', template: '%s' },
  description: 'IronWake helps service businesses map and repair leaks across inquiry, booking, follow-up, and reception workflows.',
  // ponytail: indexing enabled for netlify.app; update canonical when ironwake.dev is live.
  robots: { index: true, follow: true },
  alternates: { canonical: './' }, // ponytail: './' lets Next.js auto-resolve canonical per route from metadataBase
  openGraph: {
    title: 'IronWake — Systems that answer',
    description: 'IronWake maps operational systems for clearer enquiry, booking, follow-up, and reception handoffs.',
    type: 'website',
    siteName: 'IronWake',
    images: [{ url: '/og-default.svg', width: 1200, height: 630, alt: 'IronWake — Systems that answer' }]
  },
  twitter: { card: 'summary_large_image', title: 'IronWake — Systems that answer', description: 'IronWake maps operational systems for clearer enquiry, booking, follow-up, and reception handoffs.', images: ['/og-default.svg'] }
};

export const viewport = {
  themeColor: '#f5f3ee'
};

// ponytail: Next.js requires error boundaries as dedicated files, not logic inside a
// Server Component layout — see app/error.js (segment) and app/global-error.js (root).
// Both stay inert until SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN are configured.
// ponytail: JSON-LD canonical URL uses the same FALLBACK_SITE_URL constant as metadataBase so structured data agrees with sitemap/robots.

export default function RootLayout({ children }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL;
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', name: 'IronWake', url: siteUrl, description: 'IronWake maps operational systems for clearer enquiry, booking, follow-up, and reception handoffs.', founder: { '@type': 'Person', name: 'Revanth Nunna' }, areaServed: 'IN', sameAs: ['https://www.instagram.com/ironwake.dev/'] },
    { '@type': 'WebSite', name: 'IronWake', url: siteUrl },
    { '@type': 'Service', name: 'Business Leak Audit', url: `${siteUrl}/audit`, description: 'A review identifying where your enquiry, booking, or follow-up process loses momentum.' },
    { '@type': 'Service', name: 'Missed Lead Recovery', url: `${siteUrl}/systems/missed-lead-recovery`, description: 'Capture every enquiry to a durable record before any notification runs.' },
    { '@type': 'Service', name: 'Booking Certainty', url: `${siteUrl}/systems/booking-control`, description: 'Separate booking requests from confirmed appointments.' },
    { '@type': 'Service', name: 'AI Receptionist Planning', url: `${siteUrl}/systems/ai-receptionist`, description: 'Planning requirements for a disclosed, human-supervised first-response build. No phone, chat, DM, or model provider is currently connected.' },
    { '@type': 'ItemList', name: 'IronWake Systems', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Missed Lead Recovery', url: `${siteUrl}/systems/missed-lead-recovery` },
      { '@type': 'ListItem', position: 2, name: 'Booking Certainty', url: `${siteUrl}/systems/booking-control` },
      { '@type': 'ListItem', position: 3, name: 'Trust and Lead Capture', url: `${siteUrl}/systems/trust-lead-capture` },
      { '@type': 'ListItem', position: 4, name: 'AI Receptionist', url: `${siteUrl}/systems/ai-receptionist` }
    ]}
  ]};
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}<AssistantWidget /><SiteAssistant /><ScrollToTop /></body></html>;
}
