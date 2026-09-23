"use client";

/**
 * Control-room motion primitives — zero dependencies, hydration-safe.
 *
 * SSR always renders the FINAL value / full bar, so crawlers and no-JS
 * visitors see the complete evidence. Animations only arm after mount,
 * and only when the element scrolls into view. All motion respects
 * prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";

/** One-shot IntersectionObserver flag. Returns a ref + whether it entered view. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No IO support (ancient browsers): show the final state without
      // observing. Deferred so the effect body stays setState-free.
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Count-up number. Server render + no-JS: the final value. With JS: eases
 * 0 → value the first time it scrolls into view (writes textContent directly,
 * so no re-render cascade and no hydration mismatch).
 */
export function CountUp({
  value,
  className,
  duration = 900,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reducedMotion() || duration <= 0) {
      el.textContent = String(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/** Arms the CSS `dc-wipe` entrance (scaleX 0→1, origin left) when scrolled into view. */
export function useWipe<T extends HTMLElement>() {
  const { ref, inView } = useInView<T>();
  const cls = inView ? "dc-wipe origin-left" : "";
  // Tuple (not an object wrapping the ref) so ref-value lint rules can tell
  // the state-derived class string apart from the ref.
  return [ref, cls] as const;
}
