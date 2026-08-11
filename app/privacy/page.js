import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export const metadata = {
  title: 'Privacy — IronWake',
  description: 'What IronWake collects when you submit an audit request or chat with the assistant, where it is stored, and how to reach us about your data.'
};

export default function PrivacyPage() {
  return <main className="shell">
    <SiteHeader />
    <section className="hero compact">
      <span className="eyebrow">IronWake / Privacy</span>
      <h1>What we collect, what we store, and how to reach us.</h1>
      <p>Plain English. The current live website is a capability demo; the audit intake and the chatbot are real forms that store real rows. This page describes exactly what they store, where, and for how long.</p>
    </section>

    <section className="surface">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Audit request form</strong> — name, business name, email, phone (optional), country, business type, the answers you give to the audit questions, and any free-text you write.</li>
        <li><strong>Booking / request flow</strong> — name, email, optional phone, the type of inquiry, and any message you add.</li>
        <li><strong>Public chat assistant</strong> — the text you type into the chat. The chat is anonymous unless you choose to share your email at the end for a follow-up.</li>
        <li><strong>Server logs</strong> — request path, status code, IP, and user agent. Kept by Netlify for a short rolling window for security and abuse response.</li>
      </ul>
      <p>We do not run third-party advertising trackers. We do not sell or rent your data.</p>
    </section>

    <section className="surface">
      <h2>Where it is stored</h2>
      <ul>
        <li><strong>Audit, booking, and chat-handoff records</strong> are stored in our Supabase Postgres (Frankfurt region). Only IronWake operators can read them.</li>
        <li><strong>Chat conversation history</strong> is stored in the same Supabase database when you submit a follow-up handoff. Anonymous chat messages that are not handed off are not retained beyond the session.</li>
        <li><strong>Emails sent to ironwake.dev@gmail.com</strong> are stored in Google's Gmail on the ironwakee account.</li>
        <li><strong>Static site assets</strong> are served by Netlify from their global CDN. Netlify retains short-lived access logs for the deployed site.</li>
      </ul>
    </section>

    <section className="surface">
      <h2>What we do with it</h2>
      <ul>
        <li>Run an automated triage over audit and booking submissions so the operator can see priority and next action.</li>
        <li>Reply to you. The current reply path is the operator's email; transactional SMS or WhatsApp notifications are not currently wired up.</li>
        <li>Improve the chat assistant's quality. Failures and crash traces are logged without your personal data.</li>
      </ul>
    </section>

    <section className="surface">
      <h2>Retention</h2>
      <ul>
        <li>Audit and booking records are kept while the inquiry is active and for up to 24 months afterwards, then deleted.</li>
        <li>Anonymous chat sessions are not retained beyond the browser session.</li>
        <li>Server logs are kept by Netlify on their standard rolling window for the deployed site.</li>
      </ul>
    </section>

    <section className="surface">
      <h2>Your rights and how to reach us</h2>
      <p>You can ask for a copy of your record, ask for it to be corrected, or ask for it to be deleted. Write to <a href="mailto:ironwake.dev@gmail.com">ironwake.dev@gmail.com</a> and include the email you submitted so we can find the row.</p>
      <p>This page is operated by the same person who runs the demonstrations on this site. There is no separate legal entity registered behind it yet — that will be added before the first paying client is onboarded.</p>
    </section>

    <SiteFooter />
  </main>;
}
