import './globals.css';
import { SiteAssistant } from './components/SiteAssistant';
import { ScrollToTop } from './components/ScrollToTop';

export const metadata = {
  title: 'IronWake — Systems that answer',
  description: 'IronWake helps service businesses find leaks across inquiry, booking, follow-up, and reception workflows.',
  // ponytail: indexing enabled for netlify.app; update canonical when ironwake.dev is live.
  robots: { index: true, follow: true },
  openGraph: { title: 'IronWake — Systems that answer', description: 'IronWake builds operational systems that capture enquiries, assign ownership, control follow-up and show business owners exactly what happens next.', type: 'website', siteName: 'IronWake' },
  twitter: { card: 'summary_large_image', title: 'IronWake — Systems that answer', description: 'IronWake builds operational systems that capture enquiries, assign ownership, control follow-up and show business owners exactly what happens next.' }
};

export const viewport = {
  themeColor: '#f5f3ee'
};

// ponytail: Next.js requires error boundaries as dedicated files, not logic inside a
// Server Component layout — see app/error.js (segment) and app/global-error.js (root).
// Both stay inert until SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN are configured.
export default function RootLayout({ children }) {
  const jsonLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', name: 'IronWake', url: 'https://ironwake.netlify.app', description: 'IronWake builds operational systems that capture enquiries, assign ownership, control follow-up and show business owners exactly what happens next.', founder: { '@type': 'Person', name: 'Revanth Nunna' }, areaServed: 'IN', sameAs: ['https://www.instagram.com/ironwake.dev/'] },
    { '@type': 'WebSite', name: 'IronWake', url: 'https://ironwake.netlify.app' },
    { '@type': 'Service', name: 'Business Leak Audit', url: 'https://ironwake.netlify.app/audit', description: 'A review identifying where your enquiry, booking, or follow-up process loses momentum.' },
    { '@type': 'Service', name: 'Missed Lead Recovery', url: 'https://ironwake.netlify.app/systems/missed-lead-recovery', description: 'Capture every enquiry to a durable record before any notification runs.' },
    { '@type': 'Service', name: 'Booking Certainty', url: 'https://ironwake.netlify.app/systems/booking-control', description: 'Separate booking requests from confirmed appointments.' },
    { '@type': 'Service', name: 'AI Receptionist', url: 'https://ironwake.netlify.app/systems/ai-receptionist', description: 'Explore the disclosed, human-supervised reception concept.' },
    { '@type': 'ItemList', name: 'IronWake Systems', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Missed Lead Recovery', url: 'https://ironwake.netlify.app/systems/missed-lead-recovery' },
      { '@type': 'ListItem', position: 2, name: 'Booking Certainty', url: 'https://ironwake.netlify.app/systems/booking-control' },
      { '@type': 'ListItem', position: 3, name: 'Trust and Lead Capture', url: 'https://ironwake.netlify.app/systems/trust-lead-capture' },
      { '@type': 'ListItem', position: 4, name: 'AI Receptionist', url: 'https://ironwake.netlify.app/systems/ai-receptionist' }
    ]}
  ]};
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}<SiteAssistant /><ScrollToTop /></body></html>;
}
