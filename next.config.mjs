// ponytail: minimal config; Next.js defaults are fine. Only add what's measurably needed.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // ponytail: restrictive CSP. The site is fully static + server-rendered; no third-party scripts.
  // 'unsafe-inline' is permitted for the JSON-LD <script> block and Next.js boot styles.
  // Supabase + MiniMax are server-only; their origins never appear in the browser bundle.
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; media-src 'self' https://*.retell.ai https://*.retellai.com blob:; connect-src 'self' https://*.supabase.co https://api.retellai.com wss://*.retellai.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
