"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Search, GitCompareArrows } from "lucide-react";
import { MAX_COMPARE, type CompareCandidate } from "@/lib/compare";

/**
 * Facility picker for the comparison page. Selection lives entirely in the
 * URL (?ids=slug,slug) — every add/remove does a router.replace so the server
 * re-renders the table and the link in the address bar stays shareable.
 */

const STATUS_HINT: Record<string, string> = {
  Operational: "Live",
  "Under Construction": "Building",
  Committed: "Committed",
  "Early Stage": "Early stage",
};

export default function ComparePicker({
  candidates,
  selected,
}: {
  candidates: CompareCandidate[];
  selected: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const bySlug = useMemo(
    () => new Map(candidates.map((c) => [c.slug, c])),
    [candidates],
  );
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.operator.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q),
        )
      : candidates;
    return base.filter((c) => !selectedSet.has(c.slug)).slice(0, 8);
  }, [candidates, query, selectedSet]);

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function pushIds(next: string[]) {
    const url = next.length
      ? `/directory/compare?ids=${encodeURIComponent(next.join(","))}`
      : "/directory/compare";
    router.replace(url, { scroll: false });
  }

  function add(slug: string) {
    if (selectedSet.has(slug) || selected.length >= MAX_COMPARE) return;
    pushIds([...selected, slug]);
    setQuery("");
    setOpen(false);
  }

  function remove(slug: string) {
    pushIds(selected.filter((s) => s !== slug));
  }

  const full = selected.length >= MAX_COMPARE;

  return (
    <div className="card-solid rounded-xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <GitCompareArrows className="size-4 text-cyan" />
          Comparing {selected.length} of {MAX_COMPARE} facilities
        </p>
        <p className="text-xs text-muted-foreground/70">
          Pick up to {MAX_COMPARE} — the table below updates and the link stays shareable.
        </p>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Facilities in this comparison">
          {selected.map((slug) => {
            const c = bySlug.get(slug);
            if (!c) return null;
            return (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 py-1 pl-3 pr-2 text-xs font-medium text-foreground transition-colors hover:border-red-400/40 hover:bg-red-400/10"
                  aria-label={`Remove ${c.name} from comparison`}
                >
                  {c.name}
                  <X className="size-3.5 text-muted-foreground transition-colors group-hover:text-red-400" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add facility */}
      <div ref={rootRef} className="relative mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-label="Add a facility to compare"
            placeholder={full ? `Maximum of ${MAX_COMPARE} facilities` : "Add a facility — search by name, operator or city…"}
            value={query}
            disabled={full}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="h-10 w-full rounded-lg border border-border/50 bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:outline-none focus:ring-1 focus:ring-cyan/20 disabled:opacity-50"
          />
        </div>

        {open && !full && results.length > 0 && (
          <ul className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl shadow-black/30">
            {results.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => add(c.slug)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.operator} · {c.city}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {STATUS_HINT[c.status] ?? c.status}
                    </span>
                    {c.mw != null && (
                      <span className="block text-xs font-semibold tabular-nums text-cyan">
                        {c.mw} MW
                      </span>
                    )}
                  </span>
                  <Plus className="size-3.5 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && !full && query.trim() && results.length === 0 && (
          <p className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-muted-foreground shadow-xl">
            No facility matches &ldquo;{query}&rdquo; in the verified dataset.
          </p>
        )}
      </div>
    </div>
  );
}
