import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../marketing/Nav.jsx';
import { Footer } from '../marketing/Sections.jsx';
import { Ico, StatusPill } from '../marketing/icons.jsx';
import { UP_DISTRICTS, AVAIL, SAMPLE_NOTE } from '../marketing/data/sample.js';
import { SAMPLE_QUERY, searchParcel, validate } from '../lib/landSearch.js';
import { useToast } from '../ui.jsx';

const EMPTY = { district: '', tehsil: '', village: '', gata: '' };

function CopyBtn({ text, label }) {
  const toast = useToast();
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="copy" aria-label={`Copy ${label}: ${text}`} onClick={async () => {
      try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1400); }
      catch { toast('Copying is not available here. Select the text instead.', 'err'); }
    }}>{done ? 'Copied' : 'Copy'}</button>
  );
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className={`vf ${error ? 'bad' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <span className="vf-hint" id={`${id}-h`}>{hint}</span>}
      {error && <span className="vf-err" id={`${id}-e`}><Ico n="warn" size={14} sw={2} />{error}</span>}
    </div>
  );
}

function Guided({ r }) {
  return (
    <div className="vr-guided">
      <div className="vr-banner info" role="note">
        <Ico n="info" size={20} />
        <div><b>No live record is available through LandVerify.</b> It is not connected to any government system, so it cannot fetch this parcel. Your details are ready to use on the official portals, then bring the result back to a LandVerify file to organise and compare it.</div>
      </div>
      <dl className="vr-fields">{r.fields.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="tnum">{v}</dd><CopyBtn text={v} label={k} /></div>)}</dl>
      <div className="vr-portals">
        {r.portals.map((p, i) => (
          <article key={p.key}>
            <span className="vr-step tnum">{String(i + 1).padStart(2, '0')}</span>
            <h3>{p.name} <small lang="hi">{p.hi}</small></h3>
            <p>{p.provides}</p>
            <a className="btn secondary" href={p.url} target="_blank" rel="noopener noreferrer">Open {p.name} <Ico n="external" size={15} sw={1.8} /><span className="sr-only"> (opens in a new tab)</span></a>
            <small>Last retrieved: none. {p.integrationLabel}</small>
          </article>
        ))}
      </div>
      <div className="vr-next">
        <h3>Then bring the record back</h3>
        <p>In a LandVerify workspace you can upload what you found, record the fields, compare sources, and get a report that lists what is still unchecked.</p>
        <div className="vr-actions"><Link to="/signup" className="btn">Create a workspace</Link><Link to="/login" className="btn secondary">Sign in</Link><Link to="/sample-report" className="btn quiet">See a sample report</Link></div>
      </div>
    </div>
  );
}

function Sample({ r }) {
  const s = r.record;
  return (
    <div className="vr-sample">
      <div className="vr-banner amber" role="note"><Ico n="warn" size={20} /><div><b>Illustrative sample parcel.</b> {SAMPLE_NOTE} It matches only because you entered the demonstration details.</div></div>
      <div className="vr-id">
        <h3 className="tnum">Gata No. {s.gata}</h3>
        <p>{s.village}, {s.tehsil}, {s.district}, {s.state} · <span className="tnum">{s.areaText}</span></p>
      </div>
      <ul className="vr-recs">
        {s.records.map((x) => (
          <li key={x.key}><div><b>{x.name}</b><span lang="hi">{x.hi}</span><p>{x.note}</p></div><StatusPill tone={AVAIL[x.avail].tone}>{AVAIL[x.avail].label}</StatusPill></li>
        ))}
      </ul>
      <div className="vr-actions"><Link to="/sample-report" className="btn">Open the sample report <Ico n="arrow" size={16} sw={1.8} /></Link></div>
    </div>
  );
}

export default function Verify() {
  const [sp, setSp] = useSearchParams();
  const [f, setF] = useState(() => ({ district: sp.get('district') || '', tehsil: sp.get('tehsil') || '', village: sp.get('village') || '', gata: sp.get('gata') || '' }));
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ phase: 'idle' }); // idle | loading | done | error
  const summary = useRef(null);
  const out = useRef(null);
  const abort = useRef(null);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }); };

  async function run(values) {
    const v = validate(values);
    setErrors(v.errors);
    if (!v.ok) { setState({ phase: 'idle' }); setTimeout(() => summary.current?.focus(), 0); return; }
    abort.current?.abort(); const ac = new AbortController(); abort.current = ac;
    setState({ phase: 'loading' });
    setSp(v.query, { replace: true });
    try {
      const r = await searchParcel(v.query, { signal: ac.signal });
      setState({ phase: 'done', r });
      setTimeout(() => out.current?.focus(), 0);
    } catch (e) {
      if (e.name === 'AbortError') return;
      if (e.fields) { setErrors(e.fields); setState({ phase: 'idle' }); return; }
      setState({ phase: 'error', message: e.message });
    }
  }
  useEffect(() => { if (sp.get('gata') && sp.get('district')) run(f); return () => abort.current?.abort(); /* eslint-disable-next-line */ }, []);

  const errList = Object.entries(errors).filter(([, m]) => m);
  const busy = state.phase === 'loading';
  const useSample = () => { setF(SAMPLE_QUERY); setErrors({}); run(SAMPLE_QUERY); };

  return (
    <div className="mk">
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main" className="ver">
        <div className="mk-wrap ver-grid">
          <section className="ver-intro" aria-labelledby="v-h">
            <p className="eyebrow">Verify land · Uttar Pradesh</p>
            <h1 id="v-h" className="mk-h1">Find the parcel. <em>Know what is on record.</em></h1>
            <p className="mk-lead">Enter the location and Gata number. LandVerify prepares your details for the official portals and shows what a verified file would look like.</p>
            <p className="ver-honest"><Ico n="info" size={16} /> No government data service is connected yet, so no result here is a live record. <Link to={{ pathname: '/', hash: '#sources' }}>See the sources</Link></p>
          </section>

          <section className="ver-form" aria-label="Land search">
            <form onSubmit={(e) => { e.preventDefault(); run(f); }} noValidate>
              {errList.length > 0 && (
                <div className="vf-summary" role="alert" tabIndex={-1} ref={summary}>
                  <b>Please fix {errList.length === 1 ? 'one thing' : `${errList.length} things`}:</b>
                  <ul>{errList.map(([k, m]) => <li key={k}><a href={`#vf-${k}`}>{m}</a></li>)}</ul>
                </div>
              )}
              <Field id="vf-district" label="District" error={errors.district}>
                <select id="vf-district" value={f.district} onChange={set('district')} aria-invalid={!!errors.district} aria-describedby={errors.district ? 'vf-district-e' : undefined} required>
                  <option value="">Select a district</option>
                  {UP_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <div className="vf-two">
                <Field id="vf-tehsil" label="Tehsil" hint="As named on the Khatauni" error={errors.tehsil}>
                  <input id="vf-tehsil" value={f.tehsil} onChange={set('tehsil')} autoComplete="off" aria-invalid={!!errors.tehsil} aria-describedby={errors.tehsil ? 'vf-tehsil-e' : 'vf-tehsil-h'} required />
                </Field>
                <Field id="vf-village" label="Village" hint="Revenue village (gram)" error={errors.village}>
                  <input id="vf-village" value={f.village} onChange={set('village')} autoComplete="off" aria-invalid={!!errors.village} aria-describedby={errors.village ? 'vf-village-e' : 'vf-village-h'} required />
                </Field>
              </div>
              <Field id="vf-gata" label="Gata / Khasra number" hint="Digits with an optional suffix, such as 142 or 142/1" error={errors.gata}>
                <input id="vf-gata" className="tnum" value={f.gata} onChange={set('gata')} inputMode="text" autoComplete="off" aria-invalid={!!errors.gata} aria-describedby={errors.gata ? 'vf-gata-e' : 'vf-gata-h'} required />
              </Field>
              <div className="ver-actions">
                <button className="btn lg cta" disabled={busy} aria-busy={busy}>{busy ? 'Preparing…' : <>Verify Your Land <Ico n="arrow" size={18} sw={1.8} className="cta-arrow" /></>}</button>
                <button type="button" className="btn quiet" onClick={useSample} disabled={busy}>Try the sample parcel</button>
              </div>
              <p className="vf-fine">Tehsil and village names are not validated against an official list, because no verified list is available. Use the spelling shown on the portal.</p>
            </form>
          </section>

          <section className="ver-out" aria-live="polite" aria-label="Search result">
            <div ref={out} tabIndex={-1} className="ver-out-in">
              {state.phase === 'idle' && <div className="vr-empty"><Ico n="map" size={34} sw={1.2} /><h2>Your result appears here</h2><p>Fill in the four fields, or try the sample parcel to see what a file contains.</p></div>}
              {busy && <div className="vr-loading" role="status"><span className="spin" /><div><b>Preparing your search…</b><p>Checking the details and the available sources.</p></div></div>}
              {state.phase === 'error' && <div className="vr-banner red" role="alert"><Ico n="warn" size={20} /><div><b>The search could not be completed.</b> {state.message} <button type="button" className="btn quiet sm" onClick={() => run(f)}>Try again</button></div></div>}
              {state.phase === 'done' && (
                <>
                  <p className="vr-q"><span>Searched</span> <b>{state.r.query.district}</b> · {state.r.query.tehsil} · {state.r.query.village} · Gata <b className="tnum">{state.r.query.gata}</b></p>
                  {state.r.kind === 'sample' ? <Sample r={state.r} /> : <Guided r={state.r} />}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
