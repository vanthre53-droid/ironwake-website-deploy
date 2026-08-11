// ponytail: thin env wrappers for the IronWake Supabase clients.
// All values are read once per process. Server-only values (service role key)
// never cross into the browser bundle — the server client is created only in
// route handlers / server components, the browser client is created in client
// components.
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers.js';

function envUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function envPublishable() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || '';
}

function envServiceRole() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export function hasSupabasePublicConfig() {
  return Boolean(envUrl()) && Boolean(envPublishable());
}

export function hasSupabaseServerConfig() {
  return Boolean(envUrl()) && Boolean(envServiceRole());
}

export function createBrowserSupabase() {
  const url = envUrl();
  const key = envPublishable();
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

// ponytail: server client reads + writes auth cookies via next/headers cookies().
// Used inside Server Components and Route Handlers. Never import this from a
// Client Component — it pulls in next/headers which only works server-side.
export async function createServerSupabase() {
  const url = envUrl();
  const key = envPublishable();
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll can be called from a Server Component (read-only context).
          // The middleware refreshes the session on every request, so this is safe.
        }
      },
    },
  });
}

// ponytail: service-role client bypasses RLS. Reserved for trusted server-side
// flows: owner authorization check, audit submission, webhook handlers.
// NEVER expose this client or its key to the browser.
export function createServiceSupabase() {
  const url = envUrl();
  const key = envServiceRole();
  if (!url || !key) return null;
  // dynamic import to avoid bundling the service client into the browser chunk.
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
