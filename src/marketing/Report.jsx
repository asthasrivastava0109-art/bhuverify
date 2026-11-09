import { useState } from 'react';
import { PLOTS, PARCEL, SHADES, VB } from './parcelGeometry.js';
import { FINDINGS, STATUS, TIMELINE, RECORDS, AVAIL, COMPARE, TASKS, PARCEL as META, SAMPLE_NOTE } from './data/sample.js';
import { StatusPill, Ico } from './icons.jsx';

const pill = (key, text) => <StatusPill tone={STATUS[key].tone}>{text || STATUS[key].label}</StatusPill>;

/* Where each finding's marker sits on the illustrative map. */
const plotC = (no) => PLOTS.find((p) => p.no === no).c;
const MARK = {
  area: PARCEL.pts[1], holder: [PARCEL.c[0], PARCEL.c[1] - 30], mutation: PARCEL.pts[3],
  encumbrance: plotC(141), court: plotC(143), map: PARCEL.pts[0],
};
const TONE_COLOR = { green: '#2E7D52', red: '#B3261E', pending: '#4F5F78', plain: '#5B626A' };

export function MapPreview({ selected, onSelect, compact }) {
  return (
    <figure className="rp-map">
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} role="group" aria-label="Illustrative parcel map with finding markers. Select a marker to read the finding.">
        <rect width={VB.w} height={VB.h} fill="#fff" />
        {PLOTS.map((p) => (
          <g key={p.no}>
            <path d={p.d} fill={SHADES[p.shade]} stroke="#BFC5BC" strokeWidth="1" />
            {!p.sel && <text x={p.c[0]} y={p.c[1] + 4} textAnchor="middle" className="hm-no tnum">{p.no}</text>}
          </g>
        ))}
        <path d={PARCEL.d} fill="#B66A45" fillOpacity=".16" stroke="#B66A45" strokeWidth="3" strokeLinejoin="round" />
        <text x={PARCEL.c[0]} y={PARCEL.c[1] + 26} textAnchor="middle" className="hm-sel tnum">{META.gata}</text>
        {FINDINGS.map((f) => {
          const [x, y] = MARK[f.id]; const on = selected === f.id; const col = TONE_COLOR[STATUS[f.status].tone];
          return (
            <g key={f.id} className={`rp-mk ${on ? 'on' : ''}`} tabIndex={0} role="button" aria-pressed={on} aria-label={`${f.title}. ${STATUS[f.status].label}`}
              onClick={() => onSelect(f.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(f.id); } }}>
              <circle cx={x} cy={y} r={on ? 20 : 15} fill="#fff" stroke={col} strokeWidth="3" />
              <circle cx={x} cy={y} r="6" fill={col} />
            </g>
          );
        })}
      </svg>
      {!compact && <figcaption>Illustrative outline. Not taken from survey data. {SAMPLE_NOTE}</figcaption>}
    </figure>
  );
}

export function FindingDetail({ f }) {
  return (
    <div className="rp-detail" aria-live="polite">
      <div className="rp-d-h">{pill(f.status)}<h3>{f.title}</h3></div>
      <dl>
        <div><dt>Record checked</dt><dd>{f.record}</dd></div>
        <div><dt>Field or detail</dt><dd>{f.field}</dd></div>
        <div><dt>Comparison result</dt><dd>{f.result}</dd></div>
        <div><dt>Why it matters</dt><dd>{f.why}</dd></div>
        <div><dt>Source and date</dt><dd>{f.source}<br /><span className="tnum">Verification: {f.verified}</span></dd></div>
        <div><dt>Suggested next step</dt><dd>{f.next}</dd></div>
      </dl>
      <p className="rp-fine">{SAMPLE_NOTE}</p>
    </div>
  );
}

export function FindingList({ selected, onSelect }) {
  return (
    <ul className="rp-list" aria-label="Findings">
      {FINDINGS.map((f, i) => (
        <li key={f.id}>
          <button type="button" className={selected === f.id ? 'on' : ''} aria-pressed={selected === f.id} onClick={() => onSelect(f.id)}>
            <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
            <b>{f.title}</b>
            {pill(f.status, STATUS[f.status].short)}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* Used on the home page: a report page on the left, the open finding on the right. */
export function ReportPreview() {
  const [sel, setSel] = useState('area');
  const f = FINDINGS.find((x) => x.id === sel);
  return (
    <div className="rp-wrap">
      <div className="rp-paper">
        <div className="rp-top"><b>LandVerify</b><span className="tnum">{META.reportRef}</span><span className="tag-sample">Sample</span></div>
        <h3 className="rp-title">Land due-diligence report</h3>
        <dl className="rp-id">
          <div><dt>Gata No.</dt><dd className="tnum">{META.gata}</dd></div>
          <div><dt>Village</dt><dd>{META.village}</dd></div>
          <div><dt>Tehsil</dt><dd>{META.tehsil}</dd></div>
          <div><dt>District</dt><dd>{META.district}</dd></div>
          <div><dt>Recorded area</dt><dd className="tnum">{META.areaText}</dd></div>
        </dl>
        <div className="rp-body">
          <MapPreview selected={sel} onSelect={setSel} compact />
          <FindingList selected={sel} onSelect={setSel} />
        </div>
        <p className="rp-foot">Select a marker or a finding. {SAMPLE_NOTE}</p>
      </div>
      <FindingDetail f={f} />
    </div>
  );
}

/* ---------- views used on the full sample-report page ---------- */
export function RecordsView() {
  return (
    <div className="table-wrap">
      <table className="rp-table">
        <caption className="sr-only">Record categories and their availability in this sample file</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">Availability</th><th scope="col">Reference</th><th scope="col">Note</th></tr></thead>
        <tbody>{RECORDS.map((r) => (
          <tr key={r.key}><th scope="row"><b>{r.name}</b><span lang="hi">{r.hi}</span></th><td><StatusPill tone={AVAIL[r.avail].tone}>{AVAIL[r.avail].label}</StatusPill></td><td className="tnum">{r.ref || 'None'}</td><td>{r.note}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function TimelineView() {
  return (
    <ol className="rp-tl">
      {TIMELINE.map((e, i) => (
        <li key={i}>
          <span className="tnum yr">{e.year}</span>
          <div><b>{e.title}</b><p>{e.detail}</p><div className="rp-tl-m">{pill(e.status)}<span className="tnum">Source: {e.src}</span></div></div>
        </li>
      ))}
    </ol>
  );
}

export function CompareView() {
  const { left, right, results } = COMPARE;
  return (
    <div className="rp-cmp">
      <div className="rp-cmp-h"><div><b>{left.title}</b><small className="tnum">{left.ref}</small></div><span /><div><b>{right.title}</b><small className="tnum">{right.ref}</small></div></div>
      {left.rows.map(([k, v], i) => (
        <div key={k} className={`rp-cmp-row ${results[i]}`}>
          <div><small>{k}</small><b className="tnum">{v}</b></div>
          <div className="rp-cmp-c"><i />{pill(results[i], STATUS[results[i]].short)}</div>
          <div><small>{right.rows[i][0]}</small><b className="tnum">{right.rows[i][1]}</b></div>
        </div>
      ))}
      <p className="rp-fine">The area difference is a prompt to investigate. It does not show that either record is wrong.</p>
    </div>
  );
}

export function TasksView() {
  const [items, setItems] = useState(TASKS);
  const left = items.filter((t) => !t.done).length;
  return (
    <div>
      <p className="rp-fine" aria-live="polite" style={{ marginBottom: 12 }}>{left === 0 ? 'Every task is ticked. That does not make the title clear. A lawyer still decides.' : `${left} of ${items.length} outstanding. Tick a task to try it.`}</p>
      <ul className="rp-tasks">
        {items.map((t, i) => (
          <li key={t.t}><button type="button" aria-pressed={t.done} onClick={() => setItems(items.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}>
            <span className="bx"><Ico n="check" size={14} sw={2.6} /></span><span className="t">{t.t}</span><em>{t.who}</em></button></li>
        ))}
      </ul>
    </div>
  );
}

export function OverviewView() {
  const counts = FINDINGS.reduce((a, f) => ({ ...a, [f.status]: (a[f.status] || 0) + 1 }), {});
  return (
    <div className="rp-ov">
      <dl className="rp-id big">
        <div><dt>Gata No.</dt><dd className="tnum">{META.gata}</dd></div>
        <div><dt>Village</dt><dd>{META.village}</dd></div>
        <div><dt>Tehsil</dt><dd>{META.tehsil}</dd></div>
        <div><dt>District</dt><dd>{META.district}</dd></div>
        <div><dt>State</dt><dd>{META.state}</dd></div>
        <div><dt>Recorded area</dt><dd className="tnum">{META.areaText}</dd></div>
        <div><dt>Recorded holder</dt><dd>{META.holder} (fictional)</dd></div>
        <div><dt>Report reference</dt><dd className="tnum">{META.reportRef}</dd></div>
      </dl>
      <div className="rp-sum">
        <h3>What this sample file shows</h3>
        <ul>{Object.keys(STATUS).map((k) => <li key={k}>{pill(k)}<b className="tnum">{counts[k] || 0}</b></li>)}</ul>
        <p>Of seven record categories, two are on file, two are pending, one is requested, one is unavailable and one is shown only for illustration.</p>
      </div>
    </div>
  );
}
