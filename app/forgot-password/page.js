import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata = {
  title: 'Reset your password — IronWake',
  description: 'Request a password reset link for your IronWake customer account.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
