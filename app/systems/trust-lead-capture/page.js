import { Metadata } from 'next';
import { TrustLeadCaptureSystem } from './TrustLeadCaptureSystem';

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
  return <TrustLeadCaptureSystem />;
}