export default function CTA() {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-box">
          <div>
            <h2>
              Audit your model. <span className="grad">Before someone else does.</span>
            </h2>
            <p className="lead">
              Plug in a decision log. Get a fairness report in under a minute. No
              vendor lock-in, no data leaving your VPC.
            </p>
          </div>
          <a href="#detector" className="btn btn-primary btn-lg">
            Try the live detector
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
