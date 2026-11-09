import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Ico } from './icons.jsx';
import { PLOTS, PARCEL, SHADES, VB, PARCEL_TOP_RIGHT } from './parcelGeometry.js';
import { PARCEL as META } from './data/sample.js';
import { useReducedMotion } from '../lib/hooks.js';

// Panel position in map coordinates, so the connector and the HTML panel share one frame of reference.
const PANEL = { x: 404, y: 38, w: 208 };
const ANCHOR = PARCEL_TOP_RIGHT;
const CONNECTOR = `M${ANCHOR[0]} ${ANCHOR[1]}L${ANCHOR[0] + 46} ${PANEL.y + 44}L${PANEL.x} ${PANEL.y + 44}`;

function ParcelMap() {
  return (
    <svg className="hm-svg" viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-label={`Illustrative cadastral map. Plot ${META.gata} in ${META.village} village is outlined. Sample data, not taken from a survey.`}>
      <defs>
        <pattern id="hm-survey" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#E6E9E4" strokeWidth=".6" /></pattern>
        <pattern id="hm-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0V7" stroke="#B66A45" strokeWidth=".8" opacity=".35" /></pattern>
      </defs>
      <rect width={VB.w} height={VB.h} fill="#fff" />
      <rect width={VB.w} height={VB.h} fill="url(#hm-survey)" />
      {/* edge ticks: grid references, not coordinates */}
      {['A', 'B', 'C', 'D', 'E', 'F'].map((l, i) => <text key={l} x={24 + i * 118.4} y="14" className="hm-tick" textAnchor="middle">{l}</text>)}
      {[1, 2, 3, 4, 5].map((n, i) => <text key={n} x="8" y={30 + i * 128} className="hm-tick" textAnchor="middle">{n}</text>)}
      {/* water course and lane: illustrative */}
      <path d="M0 448C120 420 210 470 330 438S540 410 640 430" fill="none" stroke="#C9CEC6" strokeWidth="5" strokeLinecap="round" opacity=".55" className="a-fade" style={{ '--d': '700ms' }} />
      <path d="M0 448C120 420 210 470 330 438S540 410 640 430" fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 6" className="a-fade" style={{ '--d': '700ms' }} />
      {PLOTS.map((p, i) => (
        <g key={p.no} className="hm-plot a-fade" style={{ '--d': `${500 + i * 38}ms` }}>
          <path d={p.d} fill={SHADES[p.shade]} stroke="#BFC5BC" strokeWidth="1" strokeLinejoin="round" />
          {!p.sel && <text x={p.c[0]} y={p.c[1] + 4} textAnchor="middle" className="hm-no tnum">{p.no}</text>}
        </g>
      ))}
      {/* selected parcel */}
      <path d={PARCEL.d} fill="#B66A45" fillOpacity=".14" className="a-fade" style={{ '--d': '1500ms' }} />
      <path d={PARCEL.d} fill="url(#hm-hatch)" className="a-fade" style={{ '--d': '1900ms' }} />
      <path d={PARCEL.d} fill="none" stroke="#B66A45" strokeWidth="3" strokeLinejoin="round" pathLength="1" className="a-draw" style={{ '--d': '1300ms', '--t': '1500ms' }} />
      {PARCEL.pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="4" fill="#fff" stroke="#B66A45" strokeWidth="2" className="a-pop" style={{ '--d': `${2200 + i * 90}ms` }} />)}
      <text x={PARCEL.c[0]} y={PARCEL.c[1] + 6} textAnchor="middle" className="hm-sel tnum a-fade" style={{ '--d': '2000ms' }}>{META.gata}</text>
      {/* connector to the information panel */}
      <path d={CONNECTOR} fill="none" stroke="#B66A45" strokeWidth="1.3" pathLength="1" className="a-draw hm-conn" style={{ '--d': '2900ms', '--t': '700ms' }} />
      <circle cx={ANCHOR[0]} cy={ANCHOR[1]} r="2.6" fill="#B66A45" className="a-pop hm-conn" style={{ '--d': '2800ms' }} />
      {/* north arrow + scale */}
      <g transform="translate(34 512)" className="a-fade" style={{ '--d': '1200ms' }}>
        <path d="M0 -14L5 0H-5Z" fill="#292F36" /><text y="14" textAnchor="middle" className="hm-tick">N</text>
      </g>
      <g transform="translate(500 528)" className="a-fade" style={{ '--d': '1200ms' }}>
        <path d="M0 0H100M0 -4V4M50 -3V3M100 -4V4" stroke="#292F36" strokeWidth="1" fill="none" />
        <text x="50" y="-9" textAnchor="middle" className="hm-tick">Illustrative scale</text>
      </g>
    </svg>
  );
}

function InfoPanel() {
  return (
    <aside className="hm-panel a-rise" style={{ '--d': '2700ms', left: `${(PANEL.x / VB.w) * 100}%`, top: `${(PANEL.y / VB.h) * 100}%`, width: `${(PANEL.w / VB.w) * 100}%` }} aria-label="Sample parcel information">
      <span className="tag-sample">Illustrative sample data</span>
      <h2 className="hm-ptitle tnum">Gata No. {META.gata}</h2>
      <dl>
        <div><dt>Village</dt><dd>{META.village}</dd></div>
        <div><dt>Tehsil</dt><dd>{META.tehsil}</dd></div>
        <div><dt>District</dt><dd>{META.district}</dd></div>
        <div><dt>Area</dt><dd className="tnum">{META.areaText}</dd></div>
      </dl>
    </aside>
  );
}

function DocLayer() {
  return (
    <div className="hm-doc a-doc" style={{ '--d': '3200ms' }} aria-label="Sample Khatauni extract, illustrative">
      <div className="hm-doc-h"><span lang="hi">खतौनी</span><small>Extract · sample</small></div>
      <div className="hm-doc-row"><span lang="hi">गाटा संख्या</span><b className="tnum">{META.gata}</b></div>
      <div className="hm-doc-row hl"><span lang="hi">क्षेत्रफल</span><b className="tnum">0.608 ha</b></div>
      <i /><i className="s" />
      <small className="hm-doc-f">Not a government record</small>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  // Scroll progress through the first screen drives a small hand-off to the next section.
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const calc = () => { raf = 0; const el = root.current; if (!el) return; const p = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.75))); el.style.setProperty('--hs', p.toFixed(3)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc(); window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
  }, [reduced]);

  return (
    <section className="hero" ref={root} aria-labelledby="h1">
      <div className="mk-wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker a-rise" style={{ '--d': '120ms' }}><span className="kdot" aria-hidden="true" />Land intelligence for Uttar Pradesh <span className="ksep">·</span> <span lang="hi">भूमि सत्यापन</span></p>
          <h1 id="h1" className="hero-h">
            <span className="ln"><span style={{ '--d': '260ms' }}>Know the Land.</span></span>
            <span className="ln"><span style={{ '--d': '400ms' }}>Make <em>informed</em></span></span>
            <span className="ln"><span style={{ '--d': '540ms' }}><em>decisions.</em><svg className="underline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8C60 2 140 2 298 6" fill="none" stroke="#B66A45" strokeWidth="2.4" strokeLinecap="round" pathLength="1" /></svg></span></span>
          </h1>
          <p className="hero-lead a-rise" style={{ '--d': '760ms' }}>Bring ownership records, land maps and legal checks together to understand a property&rsquo;s history, status and potential risks.</p>
          <div className="hero-cta a-rise" style={{ '--d': '900ms' }}>
            <Link to="/verify" className="btn lg cta">Verify Your Land <Ico n="arrow" size={18} sw={1.8} className="cta-arrow" /></Link>
            <a href="#how" className="btn secondary lg">See How It Works</a>
          </div>
          <p className="hero-fine a-rise" style={{ '--d': '1050ms' }}>The parcel shown is a made-up example. LandVerify does not yet pull records from any government system.</p>
        </div>
        <div className="hero-visual">
          <div className="hm a-map">
            <ParcelMap />
            <InfoPanel />
            <DocLayer />
          </div>
        </div>
      </div>
      <a href="#records" className="scroll-cue a-fade" style={{ '--d': '3400ms' }} aria-label="Scroll to the next section"><span>Scroll</span><i aria-hidden="true" /></a>
    </section>
  );
}
