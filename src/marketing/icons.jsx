// Fine-line icons for the public site (1.5px strokes, 24 grid).
const D = {
  chain: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  record: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5',
  mutation: 'M4 8h13l-3-3M20 16H7l3 3M4 8v0M20 16v0',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  scale: 'M12 4v16M6 20h12M5 8h14M5 8l-2.5 6a3 3 0 005 0zM19 8l-2.5 6a3 3 0 005 0z',
  map: 'M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2zM9 4v14M15 6v14',
  land: 'M3 19h18M5 19c1-5 3-8 7-8s6 3 7 8M12 11V5M12 5l3 2M12 5l-3 2',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  check: 'M5 12.5l4.5 4.5L19 7',
  menu: 'M4 8h16M4 16h16',
  x: 'M6 6l12 12M18 6L6 18',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  download: 'M12 4v12M7 11l5 5 5-5M5 20h14',
  print: 'M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z',
  buyer: 'M3 11l9-7 9 7v9H3zM9 20v-6h6v6',
  owner: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  pro: 'M3 8h18v12H3zM8 8V5h8v3M3 13h18',
  dev: 'M3 21V9l6-4 6 4v12M15 21V13l6 3v5M7 21v-5h4v5',
  bank: 'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01',
  warn: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  dash: 'M12 21a9 9 0 100-18 9 9 0 000 18z',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5',
};
export function Ico({ n, size = 22, sw = 1.5, className, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>
      <path d={D[n]} />
    </svg>
  );
}

/* Status chip with an icon so colour is never the only signal. */
export function StatusPill({ tone, children, icon }) {
  const ic = icon || { green: 'check', red: 'warn', pending: 'clock', plain: 'dash', amber: 'info' }[tone] || 'info';
  return <span className={`pill ${tone}`}><Ico n={ic} size={13} sw={2} />{children}</span>;
}
