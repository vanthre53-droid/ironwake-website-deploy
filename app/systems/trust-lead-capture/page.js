import { Metadata } from 'next';
import { TrustLeadCaptureSystem } from './TrustLeadCaptureSystem';
import { organizationLd, breadcrumbLd } from '../../lib/seo.mjs';

export const metadata = {
  title: 'Trust and Lead Capture — IronWake Systems',
  description:
    'Trust and Lead Capture system — form integrity, consent log, and audit trail. Hidden trap fields keep bots out without ever blocking real customers.',
  alternates: { canonical: '/systems/trust-lead-capture' },
  openGraph: {
    title: 'Trust and Lead Capture — IronWake',
    description:
      'A lead-capture system that proves what came in, what was consented to, and what left the door.',
    url: '/systems/trust-lead-capture',
  },
};

export default function TrustLeadCapturePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Systems', url: '/systems' }, { name: 'Trust and Lead Capture', url: '/systems/trust-lead-capture' }])) }} />
      <TrustLeadCaptureSystem />
    </>
  );
}