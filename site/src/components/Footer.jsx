import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo gradId="g2-footer" />
          <span>
            Unbiased<span className="logo-dot">.</span>AI
          </span>
        </div>
        <p className="footer-tag">
          Fairness as a first-class feature of every automated decision.
        </p>
        <p className="footer-meta">
          Hackathon prototype · Built for "Unbiased AI Decision — Ensuring Fairness
          and Detecting Bias in Automated Decisions"
        </p>
      </div>
    </footer>
  );
}
