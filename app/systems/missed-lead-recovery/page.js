import { Metadata } from 'next';
import { MissedLeadRecoverySystem } from './MissedLeadRecoverySystem';
import { organizationLd, breadcrumbLd } from '../../../lib/seo.mjs';

export const metadata = {
  title: 'Missed Lead Recovery — IronWake',
  description:
    'Missed Lead Recovery system — captures after-hours enquiry signals so a real owner-email reply is sent.',
  alternates: { canonical: '/systems/missed-lead-recovery' },
  openGraph: {
    title: 'Missed Lead Recovery — IronWake',
    description:
      'A lead recovery system with a configured Resend worker for owner-email delivery; named assignee routing is not yet implemented.',
    url: '/systems/missed-lead-recovery',
  },
};

export default function MissedLeadRecoveryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd([{ name: 'Home', url: '/' }, { name: 'Systems', url: '/systems' }, { name: 'Missed Lead Recovery', url: '/systems/missed-lead-recovery' }])) }} />
      <MissedLeadRecoverySystem />
    </>
  );
}