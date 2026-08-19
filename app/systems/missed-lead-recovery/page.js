import { Metadata } from 'next';
import { MissedLeadRecoverySystem } from './MissedLeadRecoverySystem';

export const metadata = {
  title: 'Missed Lead Recovery — IronWake Systems',
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
  return <MissedLeadRecoverySystem />;
}