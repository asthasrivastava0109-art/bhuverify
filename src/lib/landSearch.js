// Data-access layer for the public land search.
//
// HONEST BY DESIGN: LandVerify has no authorised access to UP Bhulekh, UP Bhunaksha or any
// other government data service (see docs/INTEGRATION-UP-LAND-RECORDS.md). This module therefore
// never returns "live" records. It returns either
//   - a clearly labelled SAMPLE record, if the query is exactly the demonstration parcel, or
//   - a guided hand-off to the official portals with the user's details ready to copy.
//
// To add a real source later, implement a provider with the same signature, add it to
// PROVIDERS before `guidedProvider`, and return { kind: 'official', retrievedAt, record }.
import { PARCEL, RECORDS, SOURCES, UP_DISTRICTS } from '../marketing/data/sample.js';

const NAME_RE = /^[A-Za-zऀ-ॿ][A-Za-zऀ-ॿ .'()\-]{1,59}$/;
const GATA_RE = /^(?=.*[0-9०-९])[0-9०-९A-Za-zऀ-ॿ/\-]{1,14}$/;

export const SAMPLE_QUERY = { district: PARCEL.district, tehsil: PARCEL.tehsil, village: PARCEL.village, gata: PARCEL.gata };

const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ');
const same = (a, b) => norm(a).toLowerCase() === norm(b).toLowerCase();

export function validate(raw) {
  const q = { district: norm(raw.district), tehsil: norm(raw.tehsil), village: norm(raw.village), gata: norm(raw.gata) };
  const errors = {};
  if (!q.district) errors.district = 'Choose a district.';
  else if (!UP_DISTRICTS.includes(q.district)) errors.district = 'Choose a district from the list. Only Uttar Pradesh is supported.';
  if (!q.tehsil) errors.tehsil = 'Enter the tehsil.';
  else if (!NAME_RE.test(q.tehsil)) errors.tehsil = 'Use letters only, 2 to 60 characters.';
  if (!q.village) errors.village = 'Enter the village.';
  else if (!NAME_RE.test(q.village)) errors.village = 'Use letters only, 2 to 60 characters.';
  if (!q.gata) errors.gata = 'Enter the Gata or Khasra number.';
  else if (!GATA_RE.test(q.gata)) errors.gata = 'Use digits, with an optional suffix such as 142/1 or 142क. Up to 14 characters.';
  return { ok: Object.keys(errors).length === 0, errors, query: q };
}

const sampleProvider = {
  id: 'sample',
  async search(q) {
    if (!(same(q.district, PARCEL.district) && same(q.tehsil, PARCEL.tehsil) && same(q.village, PARCEL.village) && same(q.gata, PARCEL.gata))) return null;
    return { kind: 'sample', record: { ...PARCEL, records: RECORDS } };
  },
};

// Placeholder for an authorised connector. Deliberately inert.
export const officialProvider = { id: 'official', configured: false, async search() { return null; } };

const guidedProvider = {
  id: 'guided',
  async search(q) {
    return {
      kind: 'guided',
      portals: SOURCES.filter((s) => s.key === 'bhulekh' || s.key === 'bhunaksha'),
      fields: [['District', q.district], ['Tehsil', q.tehsil], ['Village', q.village], ['Gata / Khasra number', q.gata]],
    };
  },
};

const PROVIDERS = [officialProvider, sampleProvider, guidedProvider];

export async function searchParcel(raw, { signal } = {}) {
  const v = validate(raw);
  if (!v.ok) { const e = new Error('Check the highlighted fields.'); e.fields = v.errors; throw e; }
  // A short pause keeps the loading state honest about doing work on this device.
  await new Promise((res, rej) => { const t = setTimeout(res, 520); signal?.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('aborted', 'AbortError')); }); });
  for (const p of PROVIDERS) {
    const r = await p.search(v.query);
    if (r) return { query: v.query, at: new Date().toISOString(), ...r };
  }
  throw new Error('No source could be reached. Try again.');
}
