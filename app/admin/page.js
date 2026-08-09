import { AdminDashboard } from './AdminDashboard';

export const metadata = {
  title: 'Notification status — IronWake (private)',
  description: 'Private outbox-event status view for IronWake. Not part of the public site.',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminDashboard />;
}
