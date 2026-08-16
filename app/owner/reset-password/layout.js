// ponytail: metadata wrapper for the owner password-recovery route.
// The underlying page.js is a client component (cannot export metadata),
// so we attach the noindex + canonical metadata here at the layout level
// (every nested page inherits it).
export const metadata = {
  title: 'Owner password recovery \u2014 IronWake',
  description: 'Set a new owner password for the IronWake owner dashboard.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://ironwake.dev/owner/reset-password' },
  openGraph: {
    title: 'Owner password recovery \u2014 IronWake',
    description: 'Reset the owner password for the IronWake dashboard.',
    url: 'https://ironwake.dev/owner/reset-password',
    type: 'website',
  },
};

export default function ResetPasswordLayout({ children }) {
  return children;
}