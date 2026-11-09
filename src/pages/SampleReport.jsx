import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../marketing/Nav.jsx';
import { Footer } from '../marketing/Sections.jsx';
import { Ico } from '../marketing/icons.jsx';
import { FindingDetail, FindingList, MapPreview, OverviewView, RecordsView, TasksView, TimelineView, CompareView } from '../marketing/Report.jsx';
import { FINDINGS, PARCEL as META, SAMPLE_NOTE, NOT_ADVICE } from '../marketing/data/sample.js';
import { downloadSamplePdf } from '../lib/downloadSamplePdf.js';
import { useToast } from '../ui.jsx';

const TABS = [['overview', 'Overview'], ['records', 'Records'], ['timeline', 'Ownership timeline'], ['compare', 'Cross-check'], ['map', 'Map'], ['findings', 'Findings'], ['tasks', 'Outstanding tasks']];

function FindingsPanel() {
  const [sel, setSel] = useState(FINDINGS[0].id);
  return (
    <div className="rp-two">
      <FindingList selected={sel} onSelect={setSel} />
      <FindingDetail f={FINDINGS.find((f) => f.id === sel)} />
    </div>
  );
}
function MapPanel() {
  const [sel, setSel] = useState('area');
  return (
    <div className="rp-two">
      <MapPreview selected={sel} onSelect={setSel} />
      <FindingDetail f={FINDINGS.find((f) => f.id === sel)} />
    </div>
  );
}

export default function SampleReport() {
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const list = useRef(null);
  const idx = TABS.findIndex(([k]) => k === tab);
  const move = (n) => { const k = TABS[(n + TABS.length) % TABS.length][0]; setTab(k); requestAnimationFrame(() => list.current?.querySelector(`#rt-${k}`)?.focus()); };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(idx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(TABS.length - 1); }
  };
  async function pdf() {
    setBusy(true);
    try { await downloadSamplePdf(); toast('Sample report downloaded.'); }
    catch (e) { toast(e.message, 'err'); }
    finally { setBusy(false); }
  }
  const PANELS = { overview: <OverviewView />, records: <RecordsView />, timeline: <TimelineView />, compare: <CompareView />, map: <MapPanel />, findings: <FindingsPanel />, tasks: <TasksView /> };

  return (
    <div className="mk">
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main" className="srp">
        <div className="mk-wrap">
          <header className="srp-head">
            <div>
              <p className="eyebrow">Interactive sample report</p>
              <h1 className="mk-h1">Land due-diligence report, <em>Gata {META.gata}.</em></h1>
              <p className="mk-lead">{META.village}, {META.tehsil}, {META.district}. <span className="tnum">{META.reportRef}</span></p>
            </div>
            <div className="srp-actions no-print">
              <button className="btn" onClick={pdf} disabled={busy} aria-busy={busy}><Ico n="download" size={17} sw={1.8} />{busy ? 'Preparing PDF…' : 'Download PDF'}</button>
              <button className="btn secondary" onClick={() => window.print()}><Ico n="print" size={17} sw={1.6} />Print</button>
            </div>
          </header>
          <div className="srp-banner" role="note"><span className="tag-sample">Sample</span><p>{SAMPLE_NOTE} Explore it freely. Nothing needs uploading and no account is needed.</p></div>

          <div className="srp-tabs no-print" role="tablist" aria-label="Report sections" ref={list} onKeyDown={onKey}>
            {TABS.map(([k, l]) => <button key={k} id={`rt-${k}`} role="tab" aria-selected={tab === k} aria-controls={`rp-${k}`} tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)}>{l}</button>)}
          </div>
          {TABS.map(([k, l]) => (
            <section key={k} id={`rp-${k}`} role="tabpanel" aria-labelledby={`rt-${k}`} className="srp-panel" hidden={tab !== k} tabIndex={0}>
              <h2 className="srp-ph">{l}</h2>
              {PANELS[k]}
            </section>
          ))}
          <p className="srp-limits"><b>Limits.</b> {NOT_ADVICE} Comparisons are between the records shown and do not establish ownership.</p>
          <p className="srp-back no-print"><Link to="/verify">Search for a parcel</Link> · <Link to="/">Back to home</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
