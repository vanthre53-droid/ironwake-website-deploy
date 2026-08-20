// v17.13(color-migration): the visible "Create account" submit button on this
// page is styled by the .auth-submit rule in app/globals.css, which now
// resolves to deep petrol (#1F5D67) on the Pearl canvas. The header pill
// ("Create account") is the .nav-signup selector. Color is CSS-only; this
// page wrapper owns no styling.
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
