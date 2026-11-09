import { PLOTS, PARCEL, SHADES, VB } from '../parcelGeometry.js';
import { RECORDS, AVAIL, FIELDS, COMPARE, STATUS, REPORT_SECTIONS, PARCEL as META } from '../data/sample.js';
import { StatusPill, Ico } from '../icons.jsx';

/* A scene is a self-contained, aria-hidden product illustration. Its animations only run while it has the
   `on` class, so they replay each time the step becomes active. Nothing here is real retrieved data. */

const Tag = ({ children = 'Illustrative sample data' }) => <span className="tag-sample">{children}</span>;
const d = (ms) => ({ '--d': `${ms}ms` });

/* Shared plot map with optional zoom to the selected parcel. */
function PlotMap({ zoom, layers = {}, drawAt = 0, label = true }) {
  const [cx, cy] = PARCEL.c;
  const z = zoom ? { '--zx': `${VB.w / 2}px`, '--zy': `${VB.h / 2}px`, '--px': `${cx}px`, '--py': `${cy}px`, '--zk': 1.7, '--zd': `${zoom}ms` } : {};
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="sc-map" preserveAspectRatio="xMidYMid slice">
      <rect width={VB.w} height={VB.h} fill="#fff" />
      <g className={zoom ? 'sc-zoom' : undefined} style={z}>
        {PLOTS.map((p) => (
          <g key={p.no}>
            <path d={p.d} fill={layers.landuse && !p.sel ? '#F3F1E8' : SHADES[p.shade]} stroke="#BFC5BC" strokeWidth="1" vectorEffect="non-scaling-stroke" className={layers.landuse ? 'sc-lu' : undefined} />
            {!p.sel && <text x={p.c[0]} y={p.c[1] + 4} textAnchor="middle" className="hm-no tnum">{p.no}</text>}
          </g>
        ))}
        {layers.landuse && PLOTS.filter((p) => !p.sel).map((p) => <path key={'h' + p.no} d={p.d} fill="url(#sc-hatch)" className="a-fade" style={d(600)} />)}
        <path d={PARCEL.d} fill="#B66A45" fillOpacity=".14" className="a-fade" style={d(drawAt)} />
        <path d={PARCEL.d} fill="none" stroke="#B66A45" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" pathLength="1" className="a-draw" style={{ '--d': `${drawAt}ms`, '--t': '1100ms' }} />
        {label && <text x={PARCEL.c[0]} y={PARCEL.c[1] + 5} textAnchor="middle" className="hm-sel tnum a-pop" style={d(drawAt + 900)}>{META.gata}</text>}
      </g>
      <defs><pattern id="sc-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0V8" stroke="#7C8B76" strokeWidth=".9" opacity=".55" /></pattern></defs>
    </svg>
  );
}

const Frame = ({ title, children, tag }) => (
  <div className="sc-frame">
    <div className="sc-bar"><i /><i /><i /><span>{title}</span>{tag ?? <Tag />}</div>
    <div className="sc-body">{children}</div>
  </div>
);

/* 01 Find the parcel */
export function SceneFind({ on }) {
  const rows = [['District', META.district], ['Tehsil', META.tehsil], ['Village', META.village], ['Gata / Khasra', META.gata]];
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Find the parcel">
        <div className="s1">
          <div className="s1-form">
            {rows.map(([k, v], i) => (
              <div key={k} className="s1-row a-rise" style={d(200 + i * 600)}>
                <small>{k}</small>
                <div className="s1-val"><span className="s1-type tnum" style={{ '--n': v.length, '--d': `${350 + i * 600}ms` }}>{v}</span></div>
              </div>
            ))}
            <div className="s1-go a-fade" style={d(2900)}>Locating parcel…</div>
          </div>
          <div className="s1-map"><PlotMap zoom={3000} drawAt={4300} /><div className="s1-id a-rise" style={d(5300)}><b className="tnum">Gata {META.gata}</b><span>{META.village}, {META.tehsil}</span></div></div>
        </div>
      </Frame>
    </div>
  );
}

/* 02 Gather the records */
const LANES = [['Revenue records', ['khatauni', 'khasra', 'mutation', 'revenue']], ['Registration', ['deed', 'encumbrance']], ['Legal and disputes', ['court']]];
export function SceneGather({ on }) {
  let n = 0;
  const count = (a) => RECORDS.filter((r) => r.avail === a).length;
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Verification workspace · Gata 142">
        <div className="s2">
          {LANES.map(([title, keys]) => (
            <div key={title} className="s2-lane">
              <h4>{title}</h4>
              {keys.map((k) => {
                const r = RECORDS.find((x) => x.key === k); const i = n++;
                const a = AVAIL[r.avail];
                return (
                  <div key={k} className={`s2-doc a-fly ${r.avail}`} style={d(300 + i * 330)}>
                    <Ico n="doc" size={18} />
                    <div><b>{r.name}</b><span lang="hi">{r.hi}</span></div>
                    <StatusPill tone={a.tone}>{a.label}</StatusPill>
                  </div>
                );
              })}
            </div>
          ))}
          <p className="s2-sum a-fade" style={d(3000)}>
            <b className="tnum">{count('held')}</b> on file · <b className="tnum">{count('requested') + count('pending')}</b> requested or pending · <b className="tnum">{count('unavailable')}</b> unavailable · <b className="tnum">{count('illustrative')}</b> illustrative
          </p>
        </div>
      </Frame>
    </div>
  );
}

/* 03 Read and structure the evidence */
export function SceneRead({ on }) {
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Khatauni extract · reading">
        <div className="s3">
          <div className="s3-paper">
            <div className="s3-head" lang="hi">खतौनी <small>नमूना / sample</small></div>
            <div className="s3-line"><span lang="hi">गाटा संख्या</span><mark className="hl tnum" style={d(600)}><i>2</i>142</mark></div>
            <div className="s3-line"><span lang="hi">खातेदार</span><mark className="hl" style={d(1500)}><i>1</i>Sample Holder A</mark></div>
            <div className="s3-line"><span lang="hi">क्षेत्रफल</span><mark className="hl tnum" style={d(2400)}><i>3</i>0.608 ha</mark></div>
            <div className="s3-line"><span lang="hi">दिनांक</span><mark className="hl tnum" style={d(3300)}><i>4</i>12-10-2026</mark></div>
            <div className="s3-ln" /><div className="s3-ln s" />
            <div className="s3-line foot"><span>Ref</span><mark className="hl tnum" style={d(4200)}><i>5</i>KH-SAMPLE-0142</mark></div>
          </div>
          <ul className="s3-fields">
            {[['Recorded holder', 'Sample Holder A', 'Confirmed', 'green', 1500, 1], ['Gata number', '142', 'Confirmed', 'green', 600, 2], ['Recorded area', '0.608 hectare', 'Needs review', 'amber', 2400, 3], ['Document date', '12 Oct 2026', 'Confirmed', 'green', 3300, 4], ['Source reference', 'KH-SAMPLE-0142', 'Confirmed', 'green', 4200, 5]].sort((a, b) => a[5] - b[5]).map(([k, v, s, tone, delay, no]) => (
              <li key={k} className="a-rise" style={d(delay + 250)}><i className="no">{no}</i><div><small>{k}</small><b className="tnum">{v}</b></div><StatusPill tone={tone === 'green' ? 'green' : 'amber'} icon={tone === 'green' ? 'check' : 'info'}>{s}</StatusPill></li>
            ))}
          </ul>
          <p className="s3-note a-fade" style={d(5000)}>Extraction can be wrong. Fields marked <b>Needs review</b> wait for a person to confirm them against the original.</p>
        </div>
      </Frame>
    </div>
  );
}

/* 04 Cross-check records */
export function SceneCompare({ on }) {
  const { left, right, results } = COMPARE;
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Cross-check · Gata 142">
        <div className="s4">
          <div className="s4-h"><div><b>{left.title}</b><small className="tnum">{left.ref}</small></div><span /><div><b>{right.title}</b><small className="tnum">{right.ref}</small></div></div>
          {left.rows.map(([k, v], i) => {
            const res = results[i]; const bad = res === 'mismatch';
            return (
              <div key={k} className={`s4-row ${bad ? 'bad' : ''}`}>
                <div className="s4-f a-rise" style={d(250 + i * 250)}><small>{k}</small><b className="tnum">{v}</b></div>
                <div className="s4-c"><i className="a-grow" style={d(1100 + i * 450)} />{bad && <em className="a-pop" style={d(2500)}>≠</em>}</div>
                <div className="s4-f a-rise" style={d(400 + i * 250)}><small>{right.rows[i][0]}</small><b className="tnum">{right.rows[i][1]}</b></div>
              </div>
            );
          })}
          <div className="s4-flag a-rise" style={d(2900)}>
            <StatusPill tone="red">{STATUS.mismatch.label}</StatusPill>
            <p><b className="tnum">0.032 ha</b> difference in recorded area. It may be a typing error, a part-transfer or a later correction. Supported by <span className="tnum">{left.ref}</span> and <span className="tnum">{right.ref}</span>.</p>
          </div>
          <div className="s4-legend a-fade" style={d(3600)}>
            {Object.values(STATUS).map((s) => <StatusPill key={s.short} tone={s.tone}>{s.label}</StatusPill>)}
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 05 Check the parcel and restrictions */
const LAYERS = [['Recorded plot boundaries', 'Sample', 'green', 300], ['Available map information', 'Pending', 'pending', 1300], ['Land-use records', 'Sample', 'green', 2300], ['Restrictions or acquisition', 'No data', 'plain', 3300]];
export function SceneMap({ on }) {
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Parcel and restrictions · layers">
        <div className="s5">
          <ul className="s5-layers">
            {LAYERS.map(([k, s, tone, delay]) => (
              <li key={k} className="a-rise" style={d(delay)}><span className="sw" /><span>{k}</span><StatusPill tone={tone}>{s}</StatusPill></li>
            ))}
            <li className="s5-note a-fade" style={d(4200)}>Where data is unavailable the layer stays empty. Nothing is implied.</li>
          </ul>
          <div className="s5-map">
            <PlotMap layers={{ landuse: true }} drawAt={500} label />
            <div className="s5-stamp a-pop" style={d(3600)}>No restriction data retrieved</div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* 06 Generate the report */
export function SceneReport({ on }) {
  return (
    <div className={`scene ${on ? 'on' : ''}`} aria-hidden="true">
      <Frame title="Report · assembling">
        <div className="s6">
          <ol className="s6-list">
            {REPORT_SECTIONS.map((s, i) => <li key={s} className="a-rise" style={d(250 + i * 320)}><Ico n="check" size={14} sw={2.2} />{s}</li>)}
          </ol>
          <div className="s6-pages a-fade" style={d(500)}>
            <div className="s6-page back" />
            <div className="s6-page">
              <div className="s6-top"><b>LandVerify</b><span className="tnum">{META.reportRef}</span></div>
              <h5>Land due-diligence report</h5>
              <p className="tnum">Gata {META.gata} · {META.village}, {META.tehsil}, {META.district}</p>
              {REPORT_SECTIONS.slice(0, 7).map((s, i) => (<div key={s} className="s6-blk a-grow" style={d(700 + i * 320)}><i /><i className="s" /></div>))}
              <div className="s6-foot a-fade" style={d(3300)}>Sample · not a legal opinion · PDF preview</div>
            </div>
          </div>
        </div>
        <p className="s6-msg a-rise" style={d(3500)}>Evidence organised. Potential risks highlighted. A better-informed decision, with professional review.</p>
      </Frame>
    </div>
  );
}

export const SCENES = [SceneFind, SceneGather, SceneRead, SceneCompare, SceneMap, SceneReport];
