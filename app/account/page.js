import { redirect } from 'next/navigation.js';
import { createServerSupabase } from '../../lib/supabase/clients.mjs';
import { AccountView } from './AccountView';

export const metadata = {
  title: 'My account — IronWake',
  description: 'Manage your IronWake account: conversations, audit history, profile, and security.',
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }) {
  const updated = searchParams?.updated === '1';
  const supabase = await createServerSupabase();
  if (!supabase) {
    return <AccountView user={null} profile={null} sessions={[]} inquiries={[]} updated={updated} signedOut={false} configError="Account is not connected." />;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');
  const [profileResult, sessionsResult, inquiriesResult] = await Promise.all([
    supabase.from('profiles').select('user_id,display_name,created_at,updated_at').eq('user_id', user.id).maybeSingle(),
    supabase.from('chat_sessions').select('id,title,created_at,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(20),
    supabase.from('inquiries').select('id,business_name,email,source,lead_stage,booking_status,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ]);
  return <AccountView
    user={{ id: user.id, email: user.email, created_at: user.created_at, last_sign_in_at: user.last_sign_in_at }}
    profile={profileResult.data || null}
    sessions={sessionsResult.data || []}
    inquiries={inquiriesResult.data || []}
    updated={updated}
    signedOut={false}
    configError={null}
  />;
}
