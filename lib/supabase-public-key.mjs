// Public Supabase clients may use the modern publishable key or the legacy
// anon key during the transition. This helper never accepts service-role keys.
export function getSupabasePublicKey({ publishableKey, anonKey } = {}) {
  const modern = typeof publishableKey === 'string' ? publishableKey.trim() : '';
  const legacy = typeof anonKey === 'string' ? anonKey.trim() : '';
  return modern || legacy || '';
}
