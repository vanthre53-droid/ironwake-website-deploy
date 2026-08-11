import { OwnerDashboard } from '../owner/OwnerDashboard';

export const metadata = {
  title: 'Owner Login',
  description: 'Owner access only. Public sign-up is not available. Authentication uses Supabase Auth with TOTP MFA enforcement.',
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  return <OwnerDashboard />;
}