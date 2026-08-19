import { WakeSVG } from './WakeSVG';
import { RevealSection } from './RevealSection';

// ponytail: FlagshipHero — H1 + lede + dual CTA, then an outcome strip that
// names the implemented review-task workflow, then a centerpiece (the Wake
// SVG) flanked by three scroll-tracked narrative beats.
//
// Rhythm (explicit, not implicit):
//   TOP_SPACE       = clamp(72px, 8vw, 128px)  (hero-top token)
//   H1_TO_LEDE      = clamp(28px, 3vw, 44px)
//   LEDE_TO_CTA     = clamp(36px, 4vw, 56px)
//   CTA_TO_OUTCOME  = clamp(56px, 6vw, 88px)
//   OUTCOME_TO_WAKE = clamp(72px, 8vw, 112px)
//   BEAT_TO_BEAT    = clamp(40px, 5vw, 72px)
//   BOTTOM_SPACE    = clamp(72px, 8vw, 128px)
//
// Apple-quality rule applied: no forced micro-text (no "LAST REVIEWED",
// "9 stages · review-first", or other performative audit tags). The outcome
// strip exists because the page-test contract requires it; it is rendered
// at full body weight, not as tiny caps metadata.
export function FlagshipHero() {
  return (
    <section className="flagship-hero" aria-label="IronWake operating story">
      <div className="flagship-hero__stage">

        <header className="flagship-hero__intro">
          <p className="flagship-hero__eyebrow">IronWake // operational systems practice</p>
          <h1 className="flagship-hero__title">The enquiry arrived. Where did it go?</h1>
          <p className="flagship-hero__lede">
            IronWake maps the handoff between enquiry, booking, and follow-up — smallest system that makes the next action visible. Published, reviewed, verifiable.
          </p>
          <div className="flagship-hero__actions">
            <a className="btn btn--primary" href="#contact">Map my leak</a>
            <a className="btn btn--ghost" href="/pricing">See pricing</a>
          </div>
        </header>

        <ul className="outcome-strip" aria-label="What IronWake delivers">
          <li className="outcome-strip-item">
            <span className="outcome-strip-tag">Outcome</span>
            <strong>Captured</strong>
            <span className="outcome-strip-note">Every enquiry, recorded before reply.</span>
          </li>
          <li className="outcome-strip-item">
            <span className="outcome-strip-tag">Outcome</span>
            <strong>Reviewed</strong>
            <span className="outcome-strip-note">Task before promise. Due date is real.</span>
          </li>
          <li className="outcome-strip-item">
            <span className="outcome-strip-tag">Outcome</span>
            <strong>Visible</strong>
            <span className="outcome-strip-note">Next action is owned, named, dated.</span>
          </li>
          <li className="outcome-strip-item">
            <span className="outcome-strip-tag">Outcome</span>
            <strong>Verified</strong>
            <span className="outcome-strip-note">Claimed only with independent proof.</span>
          </li>
        </ul>

        <figure className="flagship-hero__wake">
          <figcaption className="flagship-hero__wake-label">The operating wake</figcaption>
          <WakeSVG />
          <figcaption className="flagship-hero__wake-caption">
            The Wake — the IronWake operating model from first attention to measurable follow-up.
          </figcaption>
        </figure>

        <ol className="flagship-hero__beats">
          <li className="flagship-hero__beat">
            <span className="flagship-hero__beat-no">01 / Capture</span>
            <h2 className="flagship-hero__beat-h">Every enquiry, recorded.</h2>
            <p className="flagship-hero__beat-p">
              Inquiry, call, walk-in, or form — one reviewable intake before it can be forgotten or mis-routed.
            </p>
            <dl className="flagship-hero__beat-dl">
              <dt>ENQUIRY</dt><dd>Captured</dd>
              <dt>REVIEW TASK</dt><dd>Opened</dd>
              <dt>NEXT STEP</dt><dd>Named</dd>
            </dl>
          </li>
          <li className="flagship-hero__beat">
            <span className="flagship-hero__beat-no">02 / Review</span>
            <h2 className="flagship-hero__beat-h">The next action is visible.</h2>
            <p className="flagship-hero__beat-p">
              A review task opens the moment the enquiry arrives. The next step has an owner, a due state, and a documented outcome — not a promise.
            </p>
            <dl className="flagship-hero__beat-dl">
              <dt>OWNER</dt><dd>Reviewed</dd>
              <dt>DUE DATE</dt><dd>Recorded</dd>
              <dt>OUTCOME</dt><dd>Documented</dd>
            </dl>
          </li>
          <li className="flagship-hero__beat">
            <span className="flagship-hero__beat-no">03 / Control</span>
            <h2 className="flagship-hero__beat-h">Verified before it is claimed.</h2>
            <p className="flagship-hero__beat-p">
              IronWake labels work a demonstration until independent evidence supports a stronger claim. Provider status, booking state, and outcomes are never asserted without proof.
            </p>
            <div className="flagship-hero__beat-actions">
              <a className="btn btn--primary" href="#contact">Map my leak</a>
              <a className="btn btn--ghost" href="/process">See process</a>
            </div>
          </li>
        </ol>

      </div>
    </section>
  );
}
