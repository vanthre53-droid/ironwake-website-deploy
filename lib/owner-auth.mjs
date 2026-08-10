const MAX_BEARER_TOKEN_LENGTH = 8_192;

export function parseBearerToken(header) {
  if (typeof header !== 'string' || header.length > MAX_BEARER_TOKEN_LENGTH + 16) return null;
  const match = header.match(/^Bearer\s+([^\s]+)$/i);
  const token = match?.[1];
  if (!token || token.length > MAX_BEARER_TOKEN_LENGTH || /[\u0000-\u001f\u007f]/u.test(token)) return null;
  return token;
}

export function getAalFromJwt(token) {
  if (typeof token !== 'string') return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decoded = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
    return decoded?.aal === 'aal2' ? 'aal2' : decoded?.aal === 'aal1' ? 'aal1' : null;
  } catch {
    return null;
  }
}

export function classifyAuthError(error) {
  const code = String(error?.code || error?.name || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();
  if (code.includes('invalid_credentials') || message.includes('invalid login credentials')) return 'invalid_credentials';
  if (code.includes('invalid_api_key') || message.includes('invalid api key') || message.includes('invalid_api_key')) return 'configuration_error';
  if (code.includes('mfa_verification') || message.includes('mfa')) return 'mfa_invalid';
  if (code.includes('network') || code.includes('fetch') || message.includes('network')) return 'network_unavailable';
  if (code.includes('session') || message.includes('session')) return 'session_expired';
  return 'auth_error';
}
