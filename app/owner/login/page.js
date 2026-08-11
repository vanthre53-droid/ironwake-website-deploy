import { OwnerDashboard } from '../OwnerDashboard';

export const metadata = {
  title: 'Owner Login — IronWake',
  description: 'Owner access only. Public sign-up is not available. Authentication uses Supabase Auth with TOTP MFA enforcement.',
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return <OwnerDashboard />;
}
