import { WakeSVG } from './WakeSVG';
import { RevealSection } from './RevealSection';

// ponytail: FlagshipHero — three narrative beats with a sticky centerpiece.
// Each beat = left/right copy + a sticky glass frame holding <WakeSVG/>.
// The centerpiece stays roughly centered while the user scrolls; CSS handles
// the parallax scrub. RevealSection watches each beat → toggles
// root.dataset.flagshipStage → CSS re-stages text + visual.
export function FlagshipHero({ auditLitePrice }) {
  return (
    <section className="flagship-hero" aria-label="IronWake operating story">
      <RevealSection stage={0} className="flagship-intro">
        <div className="flagship-intro-copy">
          <span className="eyebrow">IronWake // operational systems practice</span>
          {/* v16: hero-heading-width (18ch) controls the H1 word wrap so the
              two-line statement stays balanced on 1366px instead of pulling
              wide and losing rhythm.                                              */}
          <h1 className="flagship-headline hero-heading-width">
            The enquiry arrived. <span className="flagship-headline-accent">Where did it go?</span>
          </h1>
          <p className="flagship-lede card-content-width">
            IronWake maps the handoff between enquiry, booking, and follow-up —
            smallest system that makes the next action visible. Published,
            reviewed, verifiable.
          </p>
          <div className="flagship-actions">
            <a className="button" href="/audit">Map my leak</a>
            <a className="button secondary" href="/pricing">See pricing</a>
          </div>
          <ul className="outcome-strip" aria-label="What IronWake delivers">
            <li>
              <span className="outcome-strip-tag">Outcome</span>
              <strong>Captured</strong>
              <span className="outcome-strip-note">Inquiry before reply</span>
            </li>
            <li>
              <span className="outcome-strip-tag">Outcome</span>
              <strong>Reviewed</strong>
              <span className="outcome-strip-note">Task before promise</span>
            </li>
            <li>
              <span className="outcome-strip-tag">Outcome</span>
              <strong>Visible</strong>
              <span className="outcome-strip-note">Next action, owned</span>
            </li>
            <li>
              <span className="outcome-strip-tag">Outcome</span>
              <strong>Verified</strong>
              <span className="outcome-strip-note">Claimed only with proof</span>
            </li>
          </ul>
          <p className="flagship-meta">
            Starts at {auditLitePrice}. No provider status claimed without proof.
          </p>
        </div>
      </RevealSection>

      <div className="flagship-centerpiece" aria-hidden="false">
        <div className="flagship-frame glass--cool">
          <div className="flagship-frame-tag">
            <span className="micro">The operating wake</span>
            <span className="flagship-frame-meta">9 stages · review-first</span>
          </div>
          <div className="flagship-frame-visual">
            <WakeSVG />
          </div>
        </div>
      </div>

      <RevealSection stage={1} className="flagship-beat flagship-beat--capture">
        <article className="flagship-card glass--strong">
          <span className="micro">01 / Capture</span>
          <h2 className="flagship-card-title">Every enquiry, recorded.</h2>
          <p>
            Inquiry, call, walk-in, or form — one reviewable intake before it
            can be forgotten or mis-routed.
          </p>
          <ul className="flagship-card-list">
            <li><strong>Persistent</strong> first, notification second.</li>
            <li><strong>Reviewed</strong> before it is replied to.</li>
            <li><strong>Owned</strong> by a named person, not a queue.</li>
          </ul>
        </article>
      </RevealSection>

      <RevealSection stage={2} className="flagship-beat flagship-beat--review">
        <article className="flagship-card glass--strong">
          <span className="micro">02 / Review</span>
          <h2 className="flagship-card-title">The next action is visible.</h2>
          <p>
            A review task opens the moment the enquiry arrives. The next step
            has an owner, a due state, and a documented outcome — not a promise.
          </p>
          <ul className="flagship-card-list">
            <li><strong>Due state</strong> instead of vague follow-up.</li>
            <li><strong>Visible</strong> to the operator, not buried in DMs.</li>
            <li><strong>Reversible</strong> — every state change is logged.</li>
          </ul>
          <dl className="flagship-card-dl">
            <div><dt>Enquiry</dt><dd>Recorded</dd></div>
            <div><dt>Review task</dt><dd>Due date</dd></div>
            <div><dt>Next step</dt><dd>Visible</dd></div>
          </dl>
        </article>
      </RevealSection>

      <RevealSection stage={3} className="flagship-beat flagship-beat--control">
        <article className="flagship-card glass--strong flagship-card--close">
          <span className="micro">03 / Control</span>
          <h2 className="flagship-card-title">Verified before it is claimed.</h2>
          <p>
            IronWake labels work a demonstration until independent evidence
            supports a stronger claim. Provider status, booking state, and
            outcomes are never asserted without proof.
          </p>
          <div className="flagship-actions">
            <a className="button" href="/audit">Map my leak</a>
            <a className="button secondary" href="/process">See process</a>
          </div>
        </article>
      </RevealSection>
    </section>
  );
}

