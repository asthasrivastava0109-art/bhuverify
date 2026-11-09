import { useEffect, useRef, useState } from 'react';

const mq = (q) => (typeof matchMedia !== 'undefined' ? matchMedia(q) : null);

export function useMedia(query, initial = false) {
  const [m, set] = useState(() => mq(query)?.matches ?? initial);
  useEffect(() => {
    const l = mq(query); if (!l) return;
    const on = () => set(l.matches); on();
    l.addEventListener('change', on);
    return () => l.removeEventListener('change', on);
  }, [query]);
  return m;
}
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

/** True once the element has entered the viewport (stays true). With reduced motion it is true immediately. */
export function useInView(opts = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.25, ...opts });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line
  }, [reduced]);
  return [ref, seen || reduced];
}

/** 0..1 progress of a tall element passing through the viewport (for sticky scroll scenes). */
export function useScrollProgress(enabled = true) {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const span = Math.max(r.height - window.innerHeight, 1);
      setP(Math.max(0, Math.min(1, -r.top / span)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [enabled]);
  return [ref, p];
}

/** Which of several elements is nearest the middle of the viewport. */
export function useActiveIndex(count, enabled = true) {
  const refs = useRef([]);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setI(Number(e.target.dataset.idx)); });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count, enabled]);
  return [refs, i, setI];
}

export function useScrolled(px = 8) {
  const [s, set] = useState(false);
  useEffect(() => {
    const on = () => set(window.scrollY > px);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [px]);
  return s;
}

/** True while the element is on screen (toggles), used to start and replay scene animations only when visible. */
export function useVisible(threshold = 0.3) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { setVis(true); return; }
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis || reduced];
}
