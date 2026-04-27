import { useState } from 'react';
import Logo from './Logo.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`nav${open ? ' open' : ''}`}>
      <a href="#top" className="logo" onClick={close}>
        <Logo gradId="g1-nav" />
        <span>
          Unbiased<span className="logo-dot">.</span>AI
        </span>
      </a>
      <nav className="nav-links">
        <a href="#problem" onClick={close}>Problem</a>
        <a href="#detector" onClick={close}>Detector</a>
        <a href="#metrics" onClick={close}>Metrics</a>
        <a href="#how" onClick={close}>How it works</a>
        <a href="#cases" onClick={close}>Cases</a>
      </nav>
      <a href="#detector" className="btn btn-primary nav-cta" onClick={close}>
        Run Audit
      </a>
      <button
        className="menu-btn"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
