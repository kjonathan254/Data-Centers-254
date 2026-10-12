"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
    // Storage unavailable (private mode quota), selection just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useCompareSelection() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Mount-time hydration from sessionStorage: state must start server-safe
    // ([]) and sync after mount to avoid a hydration mismatch. The proper
    // React 19 refactor is useSyncExternalStore with a cached snapshot —
    // tracked as follow-up, not worth the regression risk inline.
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
    if (current.includes(slug)) {
      write(current.filter((s) => s !== slug));
      return;
    }
    if (current.length >= COMPARE_LIMIT) {
      // Silent slicing used to swallow the tap — tell the user why nothing
      // appeared instead of leaving the button looking broken.
      toast({
        title: "Compare holds 4 facilities",
        description: "Remove one from the tray first, then add this one.",
      });
      return;
    }
    write([...current, slug]);
  }, [toast]);

  const clear = useCallback(() => write([]), []);

  return { slugs, toggle, clear };
}
