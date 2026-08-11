import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../lib/supabase/clients.mjs';
import { SignupForm } from './SignupForm';

export const metadata = {
  title: 'Create your IronWake account',
  description: 'Save your IronWake conversations, track audit and request history, and pick up where you left off.',
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/account');
  }
  return <SignupForm />;
}
