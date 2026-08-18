'use client';

import { SiteHeader } from './SiteHeader';
import { MotionReveal } from './MotionReveal';

// ponytail: shared story-driven case-study shell for portfolio demonstrations.
// Story arc: context -> problem -> approach -> what was built -> what it refuses to do -> honest status.
// Heading hierarchy is strict: one h1 (the story headline), h2 per section, h3 inside cards.
// Deliberately renders NO external links: the /work index owns the live-demo URLs so a
// case study can never imply a deployed client system. Enforced by co-located tests.

export function CaseStudyStory({
  slug,
  name,
  breadcrumb,
  headline,
  standfirst,
  context,
  problem,
  approach,
  steps,
  features,
  refuses,
  unproven,
  artLabel,
}) {
  return (
    <main className={`shell case-study ${slug}-case`}>
      <SiteHeader />

      <section className="hero compact">
        <span className="eyebrow">{breadcrumb}</span>
        <span className="status-pill">PORTFOLIO DEMONSTRATION</span>
        <h1>{headline}</h1>
        <p>{standfirst}</p>
        <p className="micro">
          Capability proof, not a client engagement. No measured business outcome is claimed anywhere on this page.
        </p>
      </section>

      <MotionReveal>
        <section className="section intro">
          <article className="case-large">
            <div className="case-art" aria-label={artLabel} role="img" />
            <div className="case-copy">
              <span className="micro">The setting</span>
              <h2>{name}</h2>
              <p>{context}</p>
            </div>
          </article>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">The problem</span>
          <h2>{problem.heading}</h2>
          <p>{problem.text}</p>
          <ul className="story-list">
            {problem.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">The approach</span>
          <h2>{approach.heading}</h2>
          <p>{approach.text}</p>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">What was built</span>
          <h2>Four steps from first contact to owned follow-up.</h2>
          <div className="journey-grid">
            {steps.map((s) => (
              <article key={s.num}>
                <span className="micro">{s.num} /</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">Key capabilities</span>
          <h2>What this demonstration actually does.</h2>
          <div className="system-grid">
            {features.map(([title, text]) => (
              <article className="system-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="section">
          <span className="eyebrow">Deliberate limits</span>
          <h2>What it refuses to do.</h2>
          <p>
            A demonstration that pretends to be more than it is misleads the buyer. These limits are designed in, not
            missing features.
          </p>
          <div className="system-grid">
            {refuses.map(([title, text]) => (
              <article className="system-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <section className="section disclosure">
        <div>
          <span className="eyebrow">Proof status</span>
          <h2>What remains unproven.</h2>
          <p>{unproven}</p>
          <p>No testimonial, metric, benchmark, or provider callback is attached to this work.</p>
        </div>
        <div className="disclosure-box">
          <span className="status-pill">Demonstration only</span> This project does not represent a client relationship or
          a measured business result. It does not connect to a live booking calendar, payment system, or inventory
          platform.
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">Next step</span>
        <h2>See more demonstrations or request a review.</h2>
        <div className="hero-actions">
          <a className="button" href="/work">
            Back to work
          </a>
          <a className="button secondary" href="/audit">
            Request a Business Leak Audit
          </a>
        </div>
      </section>

    </main>
  );
}
