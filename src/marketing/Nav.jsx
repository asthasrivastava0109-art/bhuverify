import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ico } from './icons.jsx';
import { useScrolled } from '../lib/hooks.js';

export function Wordmark({ compact }) {
  return (
    <Link to="/" className="mk-wordmark" aria-label="LandVerify home">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="7" fill="#292F36" />
        <path d="M8.5 21.5 L12.5 9.5 L24 12.5 L22 23 Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12.5 9.5 L24 12.5 L22 23 L8.5 21.5Z" fill="#B66A45" fillOpacity=".95" />
      </svg>
      <span className="mk-wm-text"><b>LandVerify</b>{!compact && <small>LAND DUE DILIGENCE · UTTAR PRADESH</small>}</span>
    </Link>
  );
}

const LINKS = [
  { label: 'How it works', to: { pathname: '/', hash: '#how' } },
  { label: 'Reports', to: '/sample-report' },
  { label: 'Sources', to: { pathname: '/', hash: '#sources' } },
  { label: 'About', to: { pathname: '/', hash: '#about' } },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(8);
  const loc = useLocation();
  const btn = useRef(null);
  useEffect(() => { setOpen(false); }, [loc.pathname, loc.hash]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`mk-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="mk-nav-in">
        <Wordmark />
        <nav id="mk-menu" className={`mk-links ${open ? 'open' : ''}`} aria-label="Primary">
          {LINKS.map((l) => <Link key={l.label} to={l.to}>{l.label}</Link>)}
          <Link to="/login" className="mk-signin">Sign in</Link>
          <Link to="/verify" className="btn mk-nav-cta-m">Verify Land</Link>
        </nav>
        <Link to="/verify" className="btn sm mk-nav-cta">Verify Land</Link>
        <button ref={btn} className="mk-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mk-menu" onClick={() => setOpen(!open)}>
          <Ico n={open ? 'x' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  );
}
