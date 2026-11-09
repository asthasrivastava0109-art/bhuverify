// A deterministic, hand-tuned illustrative field pattern. It is NOT derived from any survey,
// satellite image or official map. Every use of it on the site is labelled illustrative.
export const VB = { w: 640, h: 560 };
const COLS = 5, ROWS = 4;

function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const r = rng(142);

const verts = [];
for (let j = 0; j <= ROWS; j++) {
  const row = [];
  for (let i = 0; i <= COLS; i++) {
    const edgeX = i === 0 || i === COLS, edgeY = j === 0 || j === ROWS;
    const x = 24 + i * ((VB.w - 48) / COLS) + (edgeX ? 0 : (r() - 0.5) * 34) + j * 3;
    const y = 24 + j * ((VB.h - 48) / ROWS) + (edgeY ? 0 : (r() - 0.5) * 30) + (i % 2 ? 4 : -4);
    row.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }
  verts.push(row);
}

export const FIRST_GATA = 131;
export const SELECTED = 142;
export const PLOTS = [];
for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
  const pts = [verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]];
  const no = FIRST_GATA + j * COLS + i;
  const c = [pts.reduce((s, p) => s + p[0], 0) / 4, pts.reduce((s, p) => s + p[1], 0) / 4];
  PLOTS.push({ no, pts, c, d: 'M' + pts.map((p) => p.join(' ')).join('L') + 'Z', sel: no === SELECTED, shade: (i * 3 + j * 5 + no) % 3 });
}
export const PARCEL = PLOTS.find((p) => p.sel);
export const SHADES = ['#FFFFFF', '#FBFAF6', '#F7F6F0'];
// Corners of the selected parcel, used to anchor connectors.
export const PARCEL_TOP_RIGHT = PARCEL.pts[1];
export const PARCEL_BOTTOM_RIGHT = PARCEL.pts[2];
