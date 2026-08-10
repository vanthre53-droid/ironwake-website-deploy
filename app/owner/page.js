import { OwnerDashboard } from './OwnerDashboard';

export const metadata = {
  title: 'IronWake',
  description: 'Private single-owner CRM dashboard for IronWake inquiries. Not part of the public site.'
};

export default function OwnerPage() {
  return <OwnerDashboard />;
}
