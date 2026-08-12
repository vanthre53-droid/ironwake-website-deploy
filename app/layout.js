import './globals.css';
import CustomerAssistantLauncher from './components/CustomerAssistantLauncher';
import { ScrollToTop } from './components/ScrollToTop';

// ponytail: metadataBase lets Next.js auto-generate canonical + og:url + og:image absolute URLs from relative paths. Production MUST set NEXT_PUBLIC_SITE_URL so JSON-LD, sitemap, robots, and canonical all match the live host.
// ponytail: FALLBACK_SITE_URL drives metadataBase, sitemap, robots, JSON-LD canonical. Empty string in CI; require NEXT_PUBLIC_SITE_URL at production.
const FALLBACK_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL || 'http://localhost:3000'),
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL || 'http://localhost:3000';
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', name: 'IronWake', url: siteUrl, description: 'IronWake maps operational systems for clearer enquiry, booking, follow-up, and reception handoffs.', founder: { '@type': 'Person', name: 'Revanth Nunna' }, areaServed: 'IN', sameAs: ['https://www.instagram.com/ironwake.dev/'] },
    { '@type': 'WebSite', name: 'IronWake', url: siteUrl },
    { '@type': 'Service', name: 'Business Leak Audit', url: `${siteUrl}/audit`, description: 'A review identifying where your enquiry, booking, or follow-up process loses momentum.' },
    { '@type': 'Service', name: 'Missed Lead Recovery', url: `${siteUrl}/systems/missed-lead-recovery`, description: 'Capture every enquiry to a durable record before any notification runs.' },
    { '@type': 'Service', name: 'Booking Certainty', url: `${siteUrl}/systems/booking-control`, description: 'Separate booking requests from confirmed appointments.' },
    { '@type': 'Service', name: 'AI Receptionist Planning', url: `${siteUrl}/systems/ai-receptionist`, description: 'Planning requirements for a disclosed, human-supervised first-response build. The IronWake site assistant is live and model-backed; a client receptionist deployment requires separately scoped provider integration.' },
    { '@type': 'ItemList', name: 'IronWake Systems', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Missed Lead Recovery', url: `${siteUrl}/systems/missed-lead-recovery` },
      { '@type': 'ListItem', position: 2, name: 'Booking Certainty', url: `${siteUrl}/systems/booking-control` },
      { '@type': 'ListItem', position: 3, name: 'Trust and Lead Capture', url: `${siteUrl}/systems/trust-lead-capture` },
      { '@type': 'ListItem', position: 4, name: 'AI Receptionist', url: `${siteUrl}/systems/ai-receptionist` }
    ]}
  ]};
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}<CustomerAssistantLauncher /><ScrollToTop /></body></html>;
}
