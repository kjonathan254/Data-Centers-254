"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Shared "add to compare" selection, persisted in sessionStorage so it
 * survives navigation within the session. Components sync via a custom
 * window event (storage events only fire cross-tab).
 */

const KEY = "dc254:compare";
const EVENT = "dc254:compare-change";
export const COMPARE_LIMIT = 4;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    // Storage unavailable (private mode quota) — selection just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useCompareSelection() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
    const sync = () => setSlugs(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug].slice(0, COMPARE_LIMIT);
    write(next);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { slugs, toggle, clear };
}
