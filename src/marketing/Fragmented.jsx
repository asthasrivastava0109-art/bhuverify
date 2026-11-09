import { useScrollProgress, useMedia, useReducedMotion } from '../lib/hooks.js';
import { PLOTS, PARCEL as PP } from './parcelGeometry.js';

const clamp = (v) => Math.max(0, Math.min(1, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

const PANELS = [
  { k: 'rev', title: 'Revenue records', sub: 'Khatauni · खतौनी', rows: [['Gata', '142'], ['Area', '0.608 ha'], ['Holder', 'Sample Holder A']], from: [-1, 56, -7], to: [5, 7] },
  { k: 'reg', title: 'Registration documents', sub: 'Sale deed · बैनामा', rows: [['Gata', '142'], ['Area', '0.640 ha'], ['Buyer', 'Sample Holder A']], from: [62, 66, 6], to: [57, 7] },
  { k: 'map', title: 'Maps', sub: 'Cadastral sheet · नक्शा', map: true, from: [30, -6, 5], to: [5, 59] },
  { k: 'law', title: 'Legal records', sub: 'Court & dispute', rows: [['Search', 'Not done'], ['Source', 'None linked'], ['Status', 'Pending']], from: [64, 6, -5], to: [57, 59] },
];

function MiniMap() {
  return (
    <svg viewBox="0 0 160 80" className="fr-mini" aria-hidden="true">
      {PLOTS.filter((p) => [136, 137, 141, 142, 143, 146, 147].includes(p.no)).map((p) => {
        const s = 0.36;
        const pts = p.pts.map(([x, y]) => [(x - 100) * s + 30, (y - 120) * s - 6]);
        return <path key={p.no} d={'M' + pts.map((q) => q.join(' ')).join('L') + 'Z'} fill={p.sel ? '#B66A45' : '#fff'} fillOpacity={p.sel ? 0.2 : 1} stroke={p.sel ? '#B66A45' : '#BFC5BC'} strokeWidth={p.sel ? 1.6 : 0.8} />;
      })}
      <text x="78" y="72" className="fr-mini-t tnum">Plot {PP.no}</text>
    </svg>
  );
}

function Panel({ p, style }) {
  return (
    <div className={`fr-p fr-${p.k}`} style={style}>
      <header><b>{p.title}</b><small lang={p.sub.includes('·') && /[ऀ-ॿ]/.test(p.sub) ? undefined : 'en'}>{p.sub}</small></header>
      {p.map ? <MiniMap /> : (
        <dl>{p.rows.map(([k, v]) => <div key={k} className={k === 'Area' ? 'diff' : ''}><dt>{k}</dt><dd className="tnum">{v}</dd></div>)}</dl>
      )}
    </div>
  );
}

const LINKS = [
  // [x1, y1, x2, y2] in stage percent. Horizontal lines join corresponding rows; the area row is the one that disagrees.
  { a: [43, 20.1, 57, 20.1], tone: 'ok' },
  { a: [43, 25.5, 57, 25.5], tone: 'diff' },
  { a: [43, 30.6, 57, 30.6], tone: 'ok' },
  { a: [24, 41, 24, 59], tone: 'ok' },
  { a: [76, 41, 76, 59], tone: 'dim' },
  { a: [43, 72, 57, 72], tone: 'dim' },
];

export default function Fragmented() {
  const reduced = useReducedMotion();
  const stacked = useMedia('(max-width: 900px)');
  const animated = !reduced && !stacked;
  const [ref, p] = useScrollProgress(animated);
  const P = animated ? p : 1;
  const t = ease(clamp((P - 0.1) / 0.5));
  const lines = clamp((P - 0.6) / 0.22);
  const frame = clamp((P - 0.5) / 0.25);
  const beat = (a, b) => (animated ? Math.max(0, Math.min(1, Math.min((P - a) / 0.05, (b - P) / 0.05))) : 1);

  return (
    <section id="records" className="fr" aria-labelledby="fr-h">
      <div className="mk-wrap fr-head">
        <p className="eyebrow">The problem</p>
        <h2 id="fr-h" className="mk-h2">Land records are scattered.<br />Your understanding <em>shouldn&rsquo;t</em> be.</h2>
      </div>
      <div className={`fr-track ${animated ? 'on' : ''}`} ref={ref}>
        <div className="fr-sticky">
          <div className="mk-wrap fr-grid">
            <div className="fr-copy">
              <p style={animated ? { opacity: beat(-1, 0.3), transform: `translateY(${(1 - beat(-1, 0.3)) * 10}px)` } : undefined}>Revenue records sit in one portal. Registered deeds sit in another. Maps, court papers and permissions come from different offices, in different formats, using different spellings of the same plot.</p>
              <p style={animated ? { opacity: beat(0.34, 0.66) } : undefined}>Each record may be correct on its own and still disagree with the others. Those disagreements are where the risk hides.</p>
              <p className="strong" style={animated ? { opacity: beat(0.7, 2) } : undefined}>LandVerify organises the records into one parcel dossier, compares what they say, and marks what still needs investigation.</p>
            </div>
            {animated ? (
              <div className="fr-stage" role="img" aria-label="Four separate record panels, for revenue, registration, maps and legal records, join into one parcel dossier. Lines connect the Gata number across records and flag a difference in area. Sample data.">
                <div className="fr-frame" style={{ opacity: frame }}><span>Parcel dossier · Gata 142 · sample</span></div>
                {PANELS.map((pn) => {
                  const [fx, fy, fr] = pn.from; const [tx, ty] = pn.to;
                  return <Panel key={pn.k} p={pn} style={{ left: `${lerp(fx, tx, t)}%`, top: `${lerp(fy, ty, t)}%`, transform: `rotate(${lerp(fr, 0, t)}deg) scale(${lerp(0.94, 1, t)})`, zIndex: 2 }} />;
                })}
                {LINKS.map((l, i) => {
                  const h = l.a[1] === l.a[3];
                  const st = h ? { left: `${l.a[0]}%`, top: `${l.a[1]}%`, width: `${l.a[2] - l.a[0]}%`, transform: `scaleX(${lines})` } : { left: `${l.a[0]}%`, top: `${l.a[1]}%`, height: `${l.a[3] - l.a[1]}%`, transform: `scaleY(${lines})` };
                  return <i key={i} className={`fr-l ${h ? 'h' : 'v'} ${l.tone}`} style={st} aria-hidden="true" />;
                })}
                <span className="fr-badge" style={{ opacity: clamp((lines - 0.6) / 0.4) }}>Area differs: 0.608 vs 0.640 ha</span>
              </div>
            ) : (
              <div className="fr-static" role="group" aria-label="The four record types joined into one parcel dossier. Sample data.">
                <div className="fr-static-h">Parcel dossier · Gata 142 · sample</div>
                <div className="fr-static-grid">{PANELS.map((pn) => <Panel key={pn.k} p={pn} />)}</div>
                <ul className="fr-links">
                  <li>Gata 142 appears in all four record types.</li>
                  <li className="diff">Area differs: 0.608 ha in the Khatauni, 0.640 ha in the deed schedule.</li>
                  <li>No court or dispute search has been recorded yet.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
