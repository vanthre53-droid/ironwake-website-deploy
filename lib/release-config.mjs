const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AI_API_BASE',
  'AI_API_KEY',
  'AI_MODEL',
  'EMAIL_PROVIDER',
  'EMAIL_FROM',
  'EMAIL_NOTIFICATION_RECIPIENT',
  'RESEND_API_KEY',
  'RESEND_WEBHOOK_SECRET'
];

function value(env, key) {
  return String(env?.[key] || '').trim();
}

function validHttpsUrl(input) {
  try {
    const url = new URL(input);
    return url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function validMailbox(input) {
  return !/[\r\n]/.test(input) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(input);
}

export function validateReleaseConfig(env = process.env) {
  const missing = REQUIRED_KEYS.filter((key) => !value(env, key));
  const invalid = [];

  if (value(env, 'NEXT_PUBLIC_SITE_URL') && !validHttpsUrl(value(env, 'NEXT_PUBLIC_SITE_URL'))) invalid.push('NEXT_PUBLIC_SITE_URL');
  if (value(env, 'NEXT_PUBLIC_SUPABASE_URL') && !validHttpsUrl(value(env, 'NEXT_PUBLIC_SUPABASE_URL'))) invalid.push('NEXT_PUBLIC_SUPABASE_URL');
  if (value(env, 'AI_API_BASE') !== 'https://api.minimax.io/v1') invalid.push('AI_API_BASE');
  if (value(env, 'AI_MODEL') !== 'MiniMax-M3') invalid.push('AI_MODEL');
  if (value(env, 'EMAIL_PROVIDER').toLowerCase() !== 'resend') invalid.push('EMAIL_PROVIDER');
  if (value(env, 'EMAIL_FROM') && /[\r\n]/.test(value(env, 'EMAIL_FROM'))) invalid.push('EMAIL_FROM');
  if (value(env, 'EMAIL_NOTIFICATION_RECIPIENT') && !validMailbox(value(env, 'EMAIL_NOTIFICATION_RECIPIENT'))) invalid.push('EMAIL_NOTIFICATION_RECIPIENT');

  return { ok: missing.length === 0 && invalid.length === 0, missing, invalid };
}

export const releaseConfigInternals = { REQUIRED_KEYS, validHttpsUrl, validMailbox };
