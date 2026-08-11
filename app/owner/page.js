import { OwnerDashboard } from './OwnerDashboard';

export const metadata = {
  title: 'IronWake',
  description: 'Private single-owner CRM dashboard for IronWake inquiries. Not part of the public site.',
  robots: { index: false, follow: false }
};

export default function OwnerPage() {
  return <OwnerDashboard />;
}
