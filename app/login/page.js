// v17.13(color-migration): the visible "Sign in" submit button on this page
// is styled by the .auth-submit rule in app/globals.css, which now resolves
// to deep petrol (#1F5D67) on the Pearl canvas. The header pill ("Sign in")
// is the .nav-login selector. Color is CSS-only; this page wrapper owns no
// styling.
import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../lib/supabase/clients.mjs';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Sign in — IronWake',
  description: 'Sign in to your IronWake customer account to view your conversations, audit history, and profile.',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const supabase = await createServerSupabase();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/account');
  }
  return <LoginForm />;
}
