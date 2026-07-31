import { MissedLeadRecoverySystem } from './MissedLeadRecoverySystem';

export const metadata = {
  title: 'Missed Lead Recovery — IronWake',
  description: 'How IronWake keeps a dropped inquiry from disappearing: a durable record before any notification, bounded retries with visible failures, and a named next action instead of a missed message.'
};

export default function MissedLeadRecoveryPage() {
  return <MissedLeadRecoverySystem />;
}
