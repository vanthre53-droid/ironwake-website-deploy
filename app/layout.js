import './globals.css';
import { SiteAssistant } from './components/SiteAssistant';
import { ScrollToTop } from './components/ScrollToTop';

export const metadata = {
  title: 'IronWake — Systems that answer',
  description: 'IronWake helps service businesses find leaks across inquiry, booking, follow-up, and reception workflows.',
  // ponytail: no verified public domain exists; prevent accidental indexing until release approval.
  robots: { index: false, follow: false }
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#111110' }
  ]
};

// ponytail: Next.js requires error boundaries as dedicated files, not logic inside a
// Server Component layout — see app/error.js (segment) and app/global-error.js (root).
// Both stay inert until SENTRY_DSN/NEXT_PUBLIC_SENTRY_DSN are configured.
export default function RootLayout({ children }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a>{children}<SiteAssistant /><ScrollToTop /></body></html>;
}
