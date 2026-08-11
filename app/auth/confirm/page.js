import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../../lib/supabase/clients.mjs';

// ponytail: Supabase Auth's email-redirect lands here when the user clicks
// the confirmation link. The SSR client exchanges the session cookie, then we
// route the user to /account (or /login if the link is invalid / expired).
export const metadata = {
  title: 'Confirming your IronWake account',
  robots: { index: false, follow: false },
};

export default async function AuthConfirmPage() {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/account');
  }
  redirect('/login?confirmed=missing');
}
