import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { SCENES } from './scenes/Scenes.jsx';
import { useActiveIndex, useInView, useMedia, useReducedMotion, useScrollProgress, useVisible } from '../lib/hooks.js';

const STEPS = [
  { n: '01', t: 'Find the parcel', b: 'Choose the district, tehsil and village, then enter the Gata number. The map moves to the parcel and its boundary is outlined so you are looking at the right plot.', note: 'Illustrative. Today the search prepares your details and opens the official portals. It does not fetch records automatically.', link: ['/verify', 'Try the search'] },
  { n: '02', t: 'Gather the records', b: 'Revenue records, registered deeds, mutation entries, encumbrance information and court records are arranged by category in one workspace.', note: 'A record is shown as on file only when the workspace actually holds it. Everything else is labelled requested, pending, unavailable or illustrative.' },
  { n: '03', t: 'Read and structure the evidence', b: 'Each document is read into fields: recorded holder, Gata number, area, date and source reference. Select a field and the matching text is highlighted in the document.', note: 'Reading can be wrong. Uncertain fields are marked for a person to confirm before they are used.' },
  { n: '04', t: 'Cross-check records', b: 'Corresponding fields from different records are compared side by side. Where they disagree, the difference is stated plainly, with the records that support it.', note: 'A mismatch is a prompt to investigate, not a conclusion about fraud or ownership.' },
  { n: '05', t: 'Check the parcel and restrictions', b: 'Plot boundaries, map information, land-use records and known restrictions are layered on the parcel, so you can see which checks have data behind them and which do not.', note: 'No precise geospatial verification is claimed. Layers without data stay empty.' },
  { n: '06', t: 'Generate the report', b: 'The evidence assembles into a structured report: summary, title chain, revenue checks, mutation, encumbrance, disputes, land use, discrepancies and source references with dates.', note: 'The report organises evidence. It does not guarantee clear title or replace review by a lawyer.', link: ['/sample-report', 'Open the sample report'] },
];

function StepText({ s, i, setRef, active }) {
  return (
    <article className={`wf-step ${active ? 'active' : ''}`} data-idx={i} ref={setRef} aria-labelledby={`wf-t${i}`}>
      <span className="wf-n tnum" aria-hidden="true">{s.n}</span>
      <h3 id={`wf-t${i}`}>{s.t}</h3>
      <p>{s.b}</p>
      <p className="wf-note">{s.note}</p>
      {s.link && <Link to={s.link[0]} className="wf-link">{s.link[1]} <span aria-hidden="true">→</span></Link>}
    </article>
  );
}

function MobileStep({ s, i }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const Scene = SCENES[i];
  return (
    <div className="wf-m" ref={ref}>
      <StepText s={s} i={i} active />
      <div className="wf-m-vis"><Scene on={seen} /></div>
    </div>
  );
}

export default function Workflow() {
  const wide = useMedia('(min-width: 960px)');
  const reduced = useReducedMotion();
  const [refs, active, setActive] = useActiveIndex(STEPS.length, wide);
  const [track, prog] = useScrollProgress(wide);
  const stepsRef = useRef(null);
  const [stageRef, stageVisible] = useVisible(0.25);

  const go = (i) => {
    const el = refs.current[i];
    if (el) { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); setActive(i); }
  };

  return (
    <section id="how" className="wf" aria-labelledby="wf-h">
      <div className="mk-wrap wf-head">
        <p className="eyebrow">How LandVerify works</p>
        <h2 id="wf-h" className="mk-h2">From a plot number to <em>a structured report.</em></h2>
        <p className="mk-lead">Six steps, shown on a made-up parcel. Scroll, or use the step markers to jump.</p>
      </div>

      {wide ? (
        <div className="mk-wrap wf-grid" ref={track}>
          <div className="wf-steps" ref={stepsRef}>
            {STEPS.map((s, i) => <StepText key={s.n} s={s} i={i} active={active === i} setRef={(el) => { refs.current[i] = el; }} />)}
          </div>
          <div className="wf-sticky">
            <nav className="wf-prog" aria-label="Workflow steps">
              <div className="wf-bar" aria-hidden="true"><i style={{ transform: `scaleX(${prog})` }} /></div>
              <ol>
                {STEPS.map((s, i) => (
                  <li key={s.n}><button type="button" className={i === active ? 'on' : i < active ? 'done' : ''} aria-current={i === active ? 'step' : undefined} onClick={() => go(i)}><span className="tnum">{s.n}</span><b>{s.t}</b></button></li>
                ))}
              </ol>
            </nav>
            <div className="wf-stage" ref={stageRef}>
              {SCENES.map((Scene, i) => <div key={i} className={`wf-layer ${i === active ? 'on' : ''}`}><Scene on={i === active && stageVisible} /></div>)}
            </div>
            <p className="wf-caption" aria-live="polite">Step {STEPS[active].n} of 06 · {STEPS[active].t}</p>
          </div>
        </div>
      ) : (
        <div className="mk-wrap wf-mobile">{STEPS.map((s, i) => <MobileStep key={s.n} s={s} i={i} />)}</div>
      )}
    </section>
  );
}
