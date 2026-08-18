// ponytail: site footer. "Ask IronWake" link is exposed to authenticated
// customers only via the floating round launcher; public/owner visitors see
// a single Sign in / Create account entry. Keep navigation restrained.
// ponytail v13: footer-grid layout (no global-css regressions); adds a
// clearly-labelled DEMONSTRATION chip on the operating language column.
export function SiteFooter() {
  return <footer className="footer">
    <div className="footer-grid">
      <div>
        <strong>IronWake</strong>
        <p>Operational systems for service businesses. Capture every enquiry, record a review task, and make the next action visible.</p>
        <span className="footer-mark">Founded 2024 · IronWake Systems Practice</span>
      </div>
      <div>
        <span className="micro">Explore</span>
        <a href="/work">Work</a>
        <a href="/systems">Services</a>
        <a href="/systems/ai-receptionist">AI Systems</a>
        <a href="/process">Process</a>
      </div>
      <div>
        <span className="micro">Start here</span>
        <a href="/pricing">Pricing</a>
        <a href="/audit">Map my leak</a>
        <a href="/insights">Insights</a>
        <a href="/about">About</a>
      </div>
      <div>
        <span className="micro">Account</span>
        <a href="/login">Sign in</a>
        <a href="/signup">Create account</a>
      </div>
      <div>
        <span className="micro">Operating language</span>
        <span className="footer-mark">DEMONSTRATION</span>
        <a href="/scope">Scope &amp; disclosures</a>
      </div>
      <div className="footer-note">Demonstrations and pending providers are clearly labelled. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></div>
    </div>
  </footer>;
}