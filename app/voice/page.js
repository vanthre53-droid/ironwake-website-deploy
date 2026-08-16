import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import VoiceSessionLauncher from '../components/VoiceSessionLauncher';

export const dynamic = 'force-static';
export const revalidate = 3600;

export function generateMetadata() {
  return {
    title: 'Live voice assistant — IronWake',
    description:
      'A disclosed, consent-first browser voice session against the published IronWake assistant. No microphone activation until you tap start.',
    robots: { index: false, follow: true }
  };
}

// ponytail: standalone voice page. The page is noindex so it never
// ranks, but it is reachable by the public footer / nav. The Retell
// widget loads only on user click. If the agent is unconfigured in the
// current deployment, the launcher shows a truthful "currently
// unavailable" state — never a fake waveform (Goal §16).
export default function VoicePage() {
  return (
    <main className="shell">
      <SiteHeader />
      <section className="section voice-page">
        <span className="eyebrow">Live voice assistant</span>
        <h1>Talk to the published IronWake assistant in your browser.</h1>
        <p className="lede">
          This is the same voice assistant IronWake offers to customers. Microphone stays off until
          you tap start. Audio streams to Retell for the duration of the call and is not stored on
          IronWake. Use headphones where possible; close other tabs that might use the microphone.
        </p>
        <VoiceSessionLauncher consentLabel="By tapping start you consent to this browser sending audio to Retell for the duration of the call. IronWake does not record the audio." />
        <p className="voice-footnote">
          Prefer not to talk? <a href="/audit">Book a diagnostic</a> or{' '}
          <a href="mailto:ironwake.dev@gmail.com">email ironwake.dev@gmail.com</a>.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
