export default function robots() {
  // ponytail: no verified public domain exists; block crawlers until release approval.
  return { rules: { userAgent: '*', disallow: '/' } };
}
