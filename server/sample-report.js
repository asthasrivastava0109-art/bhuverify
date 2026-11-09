import PDFDocument from 'pdfkit';
import { PARCEL, RECORDS, AVAIL, TIMELINE, COMPARE, FINDINGS, STATUS, TASKS, REPORT_SECTIONS, SOURCES, SAMPLE_NOTE, NOT_ADVICE } from '../src/marketing/data/sample.js';

// Public, unauthenticated sample report. It renders ONLY the invented sample data in
// src/marketing/data/sample.js, so it can never leak workspace data and never claims a real record.
const INK = '#292F36', MUTED = '#5B626A', CLAY = '#9C5532', RULE = '#E6E9E4';

export function streamSampleReport(res) {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 64, bottom: 64, left: 56, right: 56 }, bufferPages: true, info: { Title: `Sample land due-diligence report ${PARCEL.reportRef}`, Author: 'LandVerify' } });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="LandVerify-sample-report-${PARCEL.reportRef}.pdf"`);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  doc.pipe(res);
  const W = doc.page.width - 112;
  const room = (n) => { if (doc.y + n > doc.page.height - 72) doc.addPage(); };
  const h1 = (t) => { room(70); doc.moveDown(1.1).font('Helvetica-Bold').fontSize(14).fillColor(INK).text(t); doc.moveTo(56, doc.y + 3).lineTo(56 + W, doc.y + 3).strokeColor(RULE).lineWidth(0.7).stroke(); doc.moveDown(0.7); };
  const p = (t, o = {}) => { room(30); doc.font('Helvetica').fontSize(9.5).fillColor(o.color || INK).text(t, 56, doc.y, { width: W, lineGap: 2, ...o }); doc.moveDown(0.3); };
  const kv = (k, v) => { room(18); const y = doc.y; doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(k, 56, y, { width: 150 }); doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(v, 210, y, { width: W - 154 }); doc.y = Math.max(doc.y, y + 14); };

  doc.font('Helvetica-Bold').fontSize(11).fillColor(CLAY).text('LandVerify');
  doc.moveDown(2).font('Helvetica-Bold').fontSize(24).fillColor(INK).text('Land due-diligence report');
  doc.font('Helvetica').fontSize(13).text(`Gata ${PARCEL.gata}, ${PARCEL.village}, ${PARCEL.tehsil}, ${PARCEL.district}`);
  doc.moveDown(0.3).font('Courier').fontSize(9).fillColor(MUTED).text(`Report ${PARCEL.reportRef}`);
  doc.moveDown(0.8).font('Helvetica-Bold').fontSize(9.5).fillColor('#8A5A00').text(`SAMPLE. ${SAMPLE_NOTE}`, { width: W });

  h1('How to read this report');
  p(NOT_ADVICE);
  p('Statuses used throughout: ' + Object.values(STATUS).map((s) => s.label).join('; ') + '.', { color: MUTED });

  h1('1. Property summary');
  kv('Gata number', PARCEL.gata); kv('Village', PARCEL.village); kv('Tehsil', PARCEL.tehsil); kv('District', PARCEL.district); kv('State', PARCEL.state);
  kv('Recorded area (Khatauni)', PARCEL.areaText); kv('Recorded holder', `${PARCEL.holder} (fictional)`);
  kv('Boundary', 'Illustrative only. No authorised boundary data is used.');

  h1('2. Record categories');
  for (const r of RECORDS) { room(34); doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK).text(`${r.name}: ${AVAIL[r.avail].label}`, 56, doc.y, { width: W }); doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(`${r.ref ? r.ref + '. ' : ''}${r.note}`, { width: W }); doc.moveDown(0.4); }

  h1('3. Ownership timeline');
  for (const e of TIMELINE) { room(44); doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK).text(`${e.year}  ${e.title}`, 56, doc.y, { width: W }); doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(`${e.detail}  [${STATUS[e.status].label}; source ${e.src}]`, { width: W }); doc.moveDown(0.4); }

  h1('4. Cross-document comparison');
  p(`${COMPARE.left.title} (${COMPARE.left.ref}) against ${COMPARE.right.title} (${COMPARE.right.ref}).`, { color: MUTED });
  COMPARE.left.rows.forEach(([k, v], i) => { room(18); doc.font('Helvetica').fontSize(9.5).fillColor(INK).text(`${k}: ${v}   |   ${COMPARE.right.rows[i][0]}: ${COMPARE.right.rows[i][1]}   ->   ${STATUS[COMPARE.results[i]].label}`, 56, doc.y, { width: W }); doc.moveDown(0.25); });

  h1('5. Findings and discrepancies');
  for (const f of FINDINGS) {
    room(150);
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(f.title, 56, doc.y, { width: W });
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(CLAY).text(STATUS[f.status].label.toUpperCase(), { width: W });
    kv('Record checked', f.record); kv('Field or detail', f.field); kv('Comparison result', f.result); kv('Why it matters', f.why); kv('Source', f.source); kv('Verification', f.verified); kv('Next step', f.next);
    doc.moveDown(0.6);
  }

  h1('6. Outstanding verification tasks');
  for (const t of TASKS) p(`[ ] ${t.t} (${t.who})`);

  h1('7. Sources and integration status');
  p('No government source is connected to LandVerify. Records are looked up on the official portals by a person.', { color: MUTED });
  for (const s of SOURCES) p(`${s.name}${s.url ? ' (' + s.url + ')' : ''}: ${s.integrationLabel}  ${s.review}.`);

  h1('8. Limitations');
  ['This is sample data and does not describe any real property.', NOT_ADVICE, 'A comparison between records is not a legal conclusion and does not establish ownership.', 'A lawyer should review the evidence before any transaction proceeds.'].forEach((t) => p(`- ${t}`));
  p(`Report sections: ${REPORT_SECTIONS.join('; ')}.`, { color: MUTED });

  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i); doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(8).fillColor(MUTED);
    doc.text(`LandVerify   ${PARCEL.reportRef}   SAMPLE. Not a legal opinion or certificate of title`, 56, doc.page.height - 44, { width: W - 60, lineBreak: false });
    doc.text(`${i + 1} / ${range.count}`, 56 + W - 50, doc.page.height - 44, { width: 50, align: 'right', lineBreak: false });
  }
  doc.end();
}
