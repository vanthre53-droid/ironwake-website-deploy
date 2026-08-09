function mailboxAddress(value) {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return null;
  const trimmed = value.trim();
  const displayMatch = trimmed.match(/^[^<>]*<([^<>]+)>$/);
  const address = (displayMatch?.[1] || trimmed).trim();
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address) ? address : null;
}

export function readNotificationConfig(env = process.env) {
  const provider = String(env.EMAIL_PROVIDER || '').trim().toLowerCase();
  if (!provider || provider === 'disabled') {
    return { configured: false, safeErrorCode: 'email_provider_unconfigured' };
  }
  if (provider !== 'resend') {
    return { configured: false, safeErrorCode: 'email_provider_unsupported' };
  }

  const apiKey = String(env.RESEND_API_KEY || '').trim();
  const from = String(env.EMAIL_FROM || '').trim();
  const ownerRecipient = String(env.EMAIL_NOTIFICATION_RECIPIENT || '').trim();
  const replyTo = String(env.EMAIL_REPLY_TO || '').trim();

  if (!apiKey) return { configured: false, safeErrorCode: 'email_api_key_missing' };
  if (!mailboxAddress(from)) return { configured: false, safeErrorCode: 'email_from_invalid' };
  if (!mailboxAddress(ownerRecipient)) return { configured: false, safeErrorCode: 'email_owner_recipient_invalid' };
  if (replyTo && !mailboxAddress(replyTo)) {
    return { configured: false, safeErrorCode: 'email_reply_to_invalid' };
  }

  return {
    configured: true,
    provider,
    apiKey,
    from,
    ownerRecipient,
    replyTo: replyTo || undefined
  };
}

export const notificationConfigInternals = { mailboxAddress };
