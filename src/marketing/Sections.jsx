import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ico, StatusPill } from './icons.jsx';
import { ReportPreview } from './Report.jsx';
import { SOURCES, NOT_ADVICE } from './data/sample.js';
import { Wordmark } from './Nav.jsx';
import { useInView } from '../lib/hooks.js';

/* Reveals children with one calm motion the first time they scroll into view. */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.15 });
  return <Tag ref={ref} className={`rv2 ${seen ? 'in' : ''} ${className}`} style={{ '--rd': `${delay}ms` }} {...rest}>{children}</Tag>;
}

/* ---------- What LandVerify checks ---------- */
const CHECKS = [
  ['chain', 'Ownership and title chain', 'Follow who held the land, and by what deed, from the earliest record you can obtain to the present holder.'],
  ['record', 'Khatauni and Khasra records', 'Compare the recorded holder, Gata number, area and land class against the deed and each other.', 'खतौनी · खसरा'],
  ['mutation', 'Mutation', 'See whether each transfer is reflected in the revenue record, and whether the mutation order exists.', 'दाखिल-खारिज'],
  ['lock', 'Encumbrance and mortgage', 'Note registered mortgages, charges and leases that could limit what a buyer acquires.'],
  ['scale', 'Litigation and disputes', 'Record what court and revenue-court searches were made, when, and what they showed.'],
  ['map', 'Land maps and boundaries', 'Set the plot as recorded against the map sheet, and flag where extent cannot be confirmed.'],
  ['land', 'Land use and applicable restrictions', 'Check the recorded land class against the intended use, and list restrictions or acquisition notices that may apply.'],
];
export function Checks() {
  return (
    <section className="ck" aria-labelledby="ck-h">
      <div className="mk-wrap ck-grid">
        <Reveal className="ck-intro">
          <p className="eyebrow">What LandVerify checks</p>
          <h2 id="ck-h" className="mk-h2">Seven questions behind every <em>property decision.</em></h2>
          <p className="mk-lead">Each check is recorded with its source, its date and what it found, or with a plain note that it has not been done.</p>
        </Reveal>
        <ol className="ck-list">
          {CHECKS.map(([ic, t, b, hi], i) => (
            <Reveal as="li" key={t} delay={(i % 2) * 90} className={i === CHECKS.length - 1 ? 'wide' : ''}>
              <span className="ck-n tnum">{String(i + 1).padStart(2, '0')}</span>
              <Ico n={ic} size={30} sw={1.3} className="ck-ico" />
              <h3>{t}{hi && <small lang="hi">{hi}</small>}</h3>
              <p>{b}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Inside a report ---------- */
export function InsideReport() {
  return (
    <section id="reports" className="ir" aria-labelledby="ir-h">
      <div className="mk-wrap">
        <Reveal className="ir-head">
          <p className="eyebrow">Inside a LandVerify report</p>
          <h2 id="ir-h" className="mk-h2">Every finding shows its <em>evidence.</em></h2>
          <p className="mk-lead">Select a finding to see the record, the field checked, the result, why it matters and where it came from.</p>
        </Reveal>
        <Reveal><ReportPreview /></Reveal>
        <div className="ir-cta"><Link to="/sample-report" className="btn secondary">Open the full sample report <Ico n="arrow" size={16} sw={1.8} /></Link></div>
      </div>
    </section>
  );
}

/* ---------- Audiences ---------- */
const WHO = [
  ['buyer', 'Property buyers', 'Understand what you are being asked to pay for.', 'See whether the seller’s papers agree with the revenue record, which documents are missing, and what to ask before money moves.'],
  ['owner', 'Landowners', 'Know what your own records say.', 'Find mismatches in your holding before a buyer, a bank or a dispute finds them for you.'],
  ['pro', 'Real estate professionals', 'Bring order to a file before it reaches the client.', 'Collect the documents once, keep them with their sources, and hand over a structured file with open questions listed.'],
  ['doc', 'Lawyers and due-diligence teams', 'Start from organised evidence.', 'Every document, field and comparison carries its source reference, so review time goes on judgement, not on assembling papers.'],
  ['dev', 'Developers and other organisations', 'Compare many parcels the same way.', 'Use one checklist and one report format across parcels, with discrepancies and gaps surfaced consistently for institutional review.'],
];
export function Audiences() {
  const [open, setOpen] = useState(0);
  return (
    <section className="au" aria-labelledby="au-h">
      <div className="mk-wrap au-grid">
        <Reveal className="au-intro">
          <p className="eyebrow">Who it is for</p>
          <h2 id="au-h" className="mk-h2">Built for people who <em>need clarity.</em></h2>
        </Reveal>
        <ul className="au-list">
          {WHO.map(([ic, t, h, b], i) => (
            <li key={t} className={open === i ? 'open' : ''}>
              <button type="button" aria-expanded={open === i} aria-controls={`au-p${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <Ico n={ic} size={26} sw={1.3} /><span>{t}</span><i aria-hidden="true" />
              </button>
              <div className="au-panel" id={`au-p${i}`} role="region" aria-label={t} hidden={open !== i}>
                <div><b>{h}</b><p>{b}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Sources ---------- */
const INTEG = { none: ['plain', 'No active integration'], planned: ['pending', 'Planned, not built'] };
export function Sources() {
  return (
    <section id="sources" className="so" aria-labelledby="so-h">
      <div className="mk-wrap">
        <Reveal className="so-head">
          <p className="eyebrow">Sources and transparency</p>
          <h2 id="so-h" className="mk-h2">Where information comes from, and <em>what is connected today.</em></h2>
          <p className="mk-lead so-lead"><b>No government source is connected to LandVerify at present.</b> Records are looked up on the official portals by a person and brought into a file. Nothing is labelled as retrieved unless it was.</p>
        </Reveal>
        <div className="so-table" role="table" aria-label="Source directory">
          <div className="so-row so-hd" role="row">
            <span role="columnheader">Source</span><span role="columnheader">May provide</span><span role="columnheader">Access</span><span role="columnheader">LandVerify integration</span><span role="columnheader">Last retrieved</span><span role="columnheader">Review</span>
          </div>
          {SOURCES.map((s) => {
            const [tone, label] = INTEG[s.integration];
            return (
              <Reveal key={s.key} className="so-row" role="row">
                <span role="cell" className="so-name"><b>{s.name}</b><small lang="hi">{s.hi}</small>
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}<Ico n="external" size={12} sw={2} /><span className="sr-only"> (opens in a new tab)</span></a>}</span>
                <span role="cell" data-l="May provide">{s.provides}</span>
                <span role="cell" data-l="Access">{s.access}</span>
                <span role="cell" data-l="Integration"><StatusPill tone={tone}>{label}</StatusPill><small>{s.integrationLabel}</small></span>
                <span role="cell" data-l="Last retrieved">{s.retrieved}</span>
                <span role="cell" data-l="Review">{s.review}</span>
              </Reveal>
            );
          })}
        </div>
        <p className="so-foot">Links go to the official portals. Whether a portal permits automated access has not been established, so none is attempted. See <code>docs/INTEGRATION-UP-LAND-RECORDS.md</code> in the project.</p>
      </div>
    </section>
  );
}

/* ---------- About, status, final CTA ---------- */
export function About() {
  const works = ['Accounts, workspaces and roles', 'Private document vault with version history', 'Fields recorded from documents, with source locations', 'Checklists, findings and review decisions', 'Cross-document difference flags', 'PDF reports that state their own limits', 'Guided UP Bhulekh and Bhunaksha lookup with manual import'];
  const not = ['Automatic retrieval from any government system', 'Automatic reading of documents (OCR)', 'Authorised parcel boundary data', 'Court-record or registration integrations', 'Stamp-duty and registration services'];
  return (
    <section id="about" className="ab" aria-labelledby="ab-h">
      <div className="mk-wrap ab-grid">
        <Reveal className="ab-copy">
          <p className="eyebrow">About</p>
          <h2 id="ab-h" className="mk-h2">An honest account of <em>what exists.</em></h2>
          <p className="mk-lead">LandVerify is a land due-diligence workspace for Uttar Pradesh. It brings records together, cross-checks the evidence that is available and helps people understand potential risks before a property decision.</p>
        </Reveal>
        <Reveal className="ab-status">
          <div><h3><Ico n="check" size={16} sw={2} /> Working today</h3><ul>{works.map((w) => <li key={w}>{w}</li>)}</ul></div>
          <div><h3><Ico n="clock" size={16} sw={2} /> Not built yet</h3><ul>{not.map((w) => <li key={w}>{w}</li>)}</ul></div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="fc" aria-labelledby="fc-h">
      <div className="mk-wrap">
        <Reveal>
          <h2 id="fc-h" className="mk-h2 big">Before you commit to the land, <em>understand the records.</em></h2>
          <div className="fc-row">
            <Link to="/verify" className="btn lg cta">Start Land Verification <Ico n="arrow" size={18} sw={1.8} className="cta-arrow" /></Link>
            <p>{NOT_ADVICE}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-wrap">
        <div className="ft-grid">
          <div><Wordmark /><p>Land due diligence for Uttar Pradesh.</p></div>
          <nav aria-label="Product"><h4>Product</h4><ul>
            <li><Link to="/verify">Verify land</Link></li>
            <li><Link to={{ pathname: '/', hash: '#how' }}>How it works</Link></li>
            <li><Link to="/sample-report">Sample report</Link></li>
            <li><Link to={{ pathname: '/', hash: '#sources' }}>Sources</Link></li>
          </ul></nav>
          <nav aria-label="Official portals"><h4>Official portals</h4><ul>
            {SOURCES.filter((s) => s.url).map((s) => <li key={s.key}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
          </ul></nav>
          <nav aria-label="Account"><h4>Account</h4><ul>
            <li><Link to="/login">Sign in</Link></li><li><Link to="/signup">Create a workspace</Link></li>
          </ul></nav>
        </div>
        <div className="ft-legal">
          <p id="disclaimer"><b>Disclaimer.</b> LandVerify is a workflow and record-keeping tool. It does not provide legal advice, certify title, guarantee that a title is clear, or replace a qualified lawyer. Reports describe only the checks that were recorded. All parcels, people and references on the public pages are made-up samples.</p>
          <p id="privacy"><b>Privacy and security.</b> Uploaded documents are stored privately, served only to signed-in members of the workspace, and every view and change is written to an audit log. Have counsel review this wording before real use.</p>
          <p className="ft-copy">Contact details will be added here when available.</p>
        </div>
      </div>
    </footer>
  );
}
