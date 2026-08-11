import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../lib/supabase/clients.mjs';
import { UpdatePasswordForm } from './UpdatePasswordForm';

export const metadata = {
  title: 'Set a new password — IronWake',
  description: 'Set a new password for your IronWake customer account after a recovery request.',
  robots: { index: false, follow: false },
};

export default async function UpdatePasswordPage() {
  // ponytail: Supabase Auth's recovery flow lands here after the user clicks
  // the email link. The session is established in the URL hash and converted
  // to cookies by the SSR client. If no session is present, bounce them to
  // /forgot-password rather than render a useless form.
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/forgot-password');
  } else {
    redirect('/forgot-password');
  }
  return <UpdatePasswordForm />;
}
