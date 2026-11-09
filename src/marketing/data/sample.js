// Illustrative sample data used across the public site, the interactive sample report
// and the sample PDF. NOTHING here was retrieved from a government system. The parcel,
// the people and the references are invented for demonstration. This module is pure data
// so the server can import it to render the sample PDF from the same source.

export const SAMPLE_NOTE = 'Illustrative sample data. Not retrieved from any government system and not a statement about any real property.';

export const PARCEL = {
  gata: '142',
  village: 'Baragaon',
  tehsil: 'Pindra',
  district: 'Varanasi',
  state: 'Uttar Pradesh',
  areaHa: '0.608',
  areaText: '0.608 hectare',
  reportRef: 'LV-SAMPLE-0142',
  holder: 'Sample Holder A',
  prevHolder: 'Sample Holder B',
};

/* The four statuses used for every comparison, everywhere on the site. */
export const STATUS = {
  consistent: { label: 'Consistent across checked records', short: 'Consistent', tone: 'green' },
  mismatch: { label: 'Mismatch found', short: 'Mismatch', tone: 'red' },
  pending: { label: 'Pending verification', short: 'Pending', tone: 'pending' },
  insufficient: { label: 'Insufficient information', short: 'Insufficient', tone: 'plain' },
};

/* How a record category stands in THIS sample file. Only 'held' would ever be shown as retrieved. */
export const AVAIL = {
  held: { label: 'On file (sample)', tone: 'green' },
  requested: { label: 'Requested', tone: 'pending' },
  pending: { label: 'Pending', tone: 'pending' },
  unavailable: { label: 'Unavailable', tone: 'plain' },
  illustrative: { label: 'Illustrative', tone: 'amber' },
};

export const RECORDS = [
  { key: 'khatauni', name: 'Khatauni', hi: 'खतौनी', avail: 'held', ref: 'KH-SAMPLE-0142', note: 'Record of rights extract for Gata 142.' },
  { key: 'khasra', name: 'Khasra', hi: 'खसरा', avail: 'held', ref: 'KS-SAMPLE-0142', note: 'Plot-wise entry: area and land class.' },
  { key: 'deed', name: 'Registered sale deed', hi: 'बैनामा', avail: 'requested', ref: 'SD-SAMPLE-2019-0457', note: 'Copy requested from the seller. Not yet received.' },
  { key: 'mutation', name: 'Mutation record', hi: 'दाखिल-खारिज', avail: 'pending', ref: 'MU-SAMPLE-2019-0113', note: 'Referenced in the Khatauni. The order itself is not on file.' },
  { key: 'revenue', name: 'Other revenue records', hi: 'राजस्व अभिलेख', avail: 'illustrative', ref: null, note: 'Shown for illustration. None attached to this sample.' },
  { key: 'encumbrance', name: 'Encumbrance information', hi: 'भार प्रमाणपत्र', avail: 'pending', ref: null, note: 'Search not yet performed.' },
  { key: 'court', name: 'Court and dispute records', hi: 'वाद अभिलेख', avail: 'unavailable', ref: null, note: 'No searchable source is integrated. Needs a manual search.' },
];

export const FIELDS = [
  { k: 'Recorded holder', v: 'Sample Holder A (fictional)', where: 'Khatauni, column 3', state: 'confirmed' },
  { k: 'Gata number', v: '142', where: 'Khatauni, column 1', state: 'confirmed' },
  { k: 'Recorded area', v: '0.608 hectare', where: 'Khatauni, column 5', state: 'review' },
  { k: 'Document date', v: '12 Oct 2026 (sample)', where: 'Extract header', state: 'confirmed' },
  { k: 'Source reference', v: 'KH-SAMPLE-0142', where: 'Extract footer', state: 'confirmed' },
];

export const TIMELINE = [
  { year: '2012', title: 'Sample Holder B recorded as holder', detail: 'Khatauni entry for Gata 142.', status: 'consistent', src: 'Khatauni (sample)' },
  { year: '2019', title: 'Sale deed: Holder B to Holder A', detail: 'Registered deed referenced in the Khatauni. The deed copy has been requested and is not on file.', status: 'pending', src: 'SD-SAMPLE-2019-0457' },
  { year: '2019', title: 'Mutation entry', detail: 'The Khatauni cites a mutation order. The order itself has not been supplied.', status: 'pending', src: 'MU-SAMPLE-2019-0113' },
  { year: '2026', title: 'Sample Holder A recorded as holder', detail: 'Current Khatauni extract names Holder A for 0.608 hectare.', status: 'consistent', src: 'KH-SAMPLE-0142' },
];

export const COMPARE = {
  left: { title: 'Khatauni extract', ref: 'KH-SAMPLE-0142', rows: [['Holder', 'Sample Holder A'], ['Gata number', '142'], ['Area', '0.608 ha']] },
  right: { title: 'Sale deed schedule', ref: 'SD-SAMPLE-2019-0457', rows: [['Buyer', 'Sample Holder A'], ['Gata number', '142'], ['Area', '0.640 ha']] },
  results: ['consistent', 'consistent', 'mismatch'],
};

export const FINDINGS = [
  {
    id: 'area', status: 'mismatch', title: 'Recorded area differs between records',
    record: 'Khatauni extract KH-SAMPLE-0142 and sale deed schedule SD-SAMPLE-2019-0457',
    field: 'Area of Gata 142',
    result: 'Khatauni records 0.608 ha. The deed schedule states 0.640 ha. Difference: 0.032 ha.',
    why: 'A difference can come from a typing error, a part-transfer, a later partition or a measurement correction. Until it is explained, it is unclear whether the whole area described in the deed is recorded in the buyer’s name.',
    next: 'Ask the seller for the mutation order and any partition or correction order. Have a lawyer compare the deed schedule with the revenue entry.',
    source: 'Khatauni (sample) and sale deed (sample)', verified: '12 Oct 2026 (sample date)', x: 168, y: 104,
  },
  {
    id: 'holder', status: 'consistent', title: 'Holder name matches the deed',
    record: 'Khatauni extract and sale deed buyer clause',
    field: 'Recorded holder / buyer',
    result: 'The holder in the Khatauni and the buyer in the deed read “Sample Holder A”. Compared as text only.',
    why: 'A matching name is a useful signal, not proof of identity or title. Spelling variants and similar names are common in revenue records.',
    next: 'No action on the name. Identity documents still need to be checked separately.',
    source: 'Khatauni (sample) and sale deed (sample)', verified: '12 Oct 2026 (sample date)', x: 300, y: 70,
  },
  {
    id: 'mutation', status: 'pending', title: 'Mutation order not supplied',
    record: 'Mutation record MU-SAMPLE-2019-0113',
    field: 'Existence and content of the mutation order',
    result: 'The Khatauni cites a mutation entry. No copy of the order is on file, so its content has not been checked.',
    why: 'Mutation is how a transfer is reflected in the revenue record. Without the order, the link between the deed and the current entry is assumed, not shown.',
    next: 'Request the mutation order from the tehsil record room or the seller.',
    source: 'Reference in the Khatauni (sample)', verified: 'Not yet verified', x: 252, y: 188,
  },
  {
    id: 'encumbrance', status: 'insufficient', title: 'No encumbrance information',
    record: 'Encumbrance search for Gata 142',
    field: 'Registered mortgages, charges or leases',
    result: 'No search has been performed and no certificate is on file. Nothing can be said about third-party interests.',
    why: 'A recorded mortgage or lease can limit what a buyer actually acquires.',
    next: 'Search the registration records for the relevant period and add the result to the file.',
    source: 'None yet', verified: 'Not yet verified', x: 86, y: 166,
  },
  {
    id: 'court', status: 'pending', title: 'Court and dispute search not done',
    record: 'Court and revenue-court records',
    field: 'Proceedings naming the parcel or the holder',
    result: 'No search recorded. LandVerify does not have an active court-record integration.',
    why: 'A pending dispute can affect the right to transfer or use the land.',
    next: 'Search the public case-status services manually and record what was searched and when.',
    source: 'None yet', verified: 'Not yet verified', x: 330, y: 150,
  },
  {
    id: 'map', status: 'insufficient', title: 'Boundary cannot be confirmed from the map',
    record: 'Cadastral map sheet for Baragaon',
    field: 'Plot boundary and neighbouring plots',
    result: 'No authorised boundary geometry is available. The outline on this page is illustrative.',
    why: 'Without a map comparison, the extent on the ground is not tested against the record.',
    next: 'Obtain the official map sheet and arrange a physical inspection by a surveyor.',
    source: 'Illustrative outline', verified: 'Not applicable', x: 140, y: 40,
  },
];

export const TASKS = [
  { t: 'Obtain a copy of the registered sale deed', who: 'Buyer', done: false },
  { t: 'Request the 2019 mutation order', who: 'Buyer / lawyer', done: false },
  { t: 'Explain the 0.032 ha area difference', who: 'Lawyer', done: false },
  { t: 'Search encumbrance records for the relevant period', who: 'Due-diligence team', done: false },
  { t: 'Search court and revenue-court records', who: 'Due-diligence team', done: false },
  { t: 'Arrange a physical boundary inspection', who: 'Surveyor', done: false },
];

export const REPORT_SECTIONS = [
  'Property summary',
  'Ownership and title-chain review',
  'Revenue-record checks',
  'Mutation history',
  'Encumbrance findings',
  'Litigation and dispute findings',
  'Land-use and map checks',
  'Discrepancies and missing documents',
  'Source references and verification timestamps',
];

export const NOT_ADVICE = 'LandVerify organises evidence and highlights potential risks. It does not certify title, guarantee that a title is clear, or replace review by a qualified lawyer.';

/* Source directory. `integration` is the truth about what the product does today. */
export const SOURCES = [
  {
    key: 'bhulekh', name: 'UP Bhulekh', hi: 'यूपी भूलेख', url: 'https://upbhulekh.gov.in', linkChecked: true,
    provides: 'Revenue record extracts: Khatauni and Khasra/Gata entries, recorded holders and areas.',
    access: 'Public lookup', integration: 'none', integrationLabel: 'No active integration. Guided lookup and manual import only.',
    retrieved: 'Nothing retrieved automatically', review: 'Manual review required',
  },
  {
    key: 'bhunaksha', name: 'UP Bhunaksha', hi: 'यूपी भू-नक्शा', url: 'https://upbhunaksha.gov.in', linkChecked: true,
    provides: 'Cadastral map sheets and plot outlines as shown in the official viewer.',
    access: 'Public lookup', integration: 'none', integrationLabel: 'No active integration. No map geometry is downloaded or drawn from this source.',
    retrieved: 'Nothing retrieved automatically', review: 'Manual review required',
  },
  {
    key: 'igrsup', name: 'IGRSUP', hi: 'आईजीआरएसयूपी', url: 'https://igrsup.gov.in', linkChecked: false,
    provides: 'Registration and stamp department services, including registered-document and encumbrance enquiries.',
    access: 'Some services may need an account or fee. Confirm on the portal.', integration: 'planned', integrationLabel: 'Planned. Not built.',
    retrieved: 'Nothing retrieved', review: 'Manual review required',
  },
  {
    key: 'revenue', name: 'Revenue authorities', hi: 'राजस्व विभाग', url: null, linkChecked: false,
    provides: 'Mutation orders, partition and correction orders, certified copies from the tehsil record room.',
    access: 'Authorised or in-person access', integration: 'none', integrationLabel: 'No integration. Documents are obtained and uploaded by a person.',
    retrieved: 'Not applicable', review: 'Manual review required',
  },
  {
    key: 'courts', name: 'Court-record systems', hi: 'ई-कोर्ट', url: 'https://ecourts.gov.in/ecourts_home/', linkChecked: false,
    provides: 'Case-status information for district courts and high courts.',
    access: 'Public search', integration: 'planned', integrationLabel: 'Planned. Not built. Revenue-court coverage is not established.',
    retrieved: 'Nothing retrieved', review: 'Manual review required',
  },
  {
    key: 'authority', name: 'Development authority records', hi: 'विकास प्राधिकरण', url: null, linkChecked: false,
    provides: 'Master plans, land-use zoning and acquisition notices where the parcel lies in a planning area.',
    access: 'Varies by authority', integration: 'none', integrationLabel: 'No integration. Coverage differs by city and district.',
    retrieved: 'Not applicable', review: 'Manual review required',
  },
];

export const UP_DISTRICTS = ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'];
