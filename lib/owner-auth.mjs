const MAX_BEARER_TOKEN_LENGTH = 8_192;

export function parseBearerToken(header) {
  if (typeof header !== 'string' || header.length > MAX_BEARER_TOKEN_LENGTH + 16) return null;
  const match = header.match(/^Bearer\s+([^\s]+)$/i);
  const token = match?.[1];
  if (!token || token.length > MAX_BEARER_TOKEN_LENGTH || /[\u0000-\u001f\u007f]/u.test(token)) return null;
  return token;
}
