import { useStatCounter } from '../hooks/useStatCounter.js';

export default function Hero() {
  useStatCounter('.stat-num');

  return (
    <section id="top" className="hero">
      <div className="hero-grid"></div>
      <div className="container hero-inner">
        <div className="badge">
          <span className="pulse"></span>
          <span>Fairness layer for automated decisions</span>
        </div>
        <h1 className="hero-title">
          Decisions made by machines<br />
          <span className="grad">deserve human scrutiny.</span>
        </h1>
        <p className="hero-sub">
          Unbiased AI audits hiring, lending, and risk-scoring models in real time —
          surfacing demographic disparity, disparate impact, and equal-opportunity gaps
          before they reach a human life.
        </p>
        <div className="hero-cta">
          <a href="#detector" className="btn btn-primary">
            Launch Bias Detector
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#how" className="btn btn-ghost">See how it works</a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num" data-count="38">0</div>
            <div className="stat-label">% of ML models show measurable bias</div>
          </div>
          <div className="stat">
            <div className="stat-num" data-count="4">0</div>
            <div className="stat-label">fairness metrics tracked simultaneously</div>
          </div>
          <div className="stat">
            <div className="stat-num" data-count="100">0</div>
            <div className="stat-label">% explainable, no black box</div>
          </div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span></span>
      </div>
    </section>
  );
}
