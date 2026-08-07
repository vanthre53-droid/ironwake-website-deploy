export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://ironwake-app.netlify.app/sitemap.xml',
  };
}
