"use client";

import { useRouter } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";
import { useCompareSelection } from "@/components/compare/use-compare-selection";
import { getCompareCandidates } from "@/lib/compare";

/**
 * Sticky tray shown once at least one facility is ticked for comparison in
 * the directory. Names are resolved client-side from the lite candidate list
 * (no extra fetch); the CTA deep-links to the shareable comparison URL.
 */

export default function CompareTray() {
  const router = useRouter();
  const { slugs, clear } = useCompareSelection();
  if (slugs.length === 0) return null;

  const bySlug = new Map(getCompareCandidates().map((c) => [c.slug, c]));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cyan/25 bg-background/95 backdrop-blur-xl">
      <nav aria-label="Comparison tray" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
        <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan">
          <GitCompareArrows className="size-4" />
          {slugs.length} selected
        </p>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {slugs.map((slug) => (
            <li
              key={slug}
              className="max-w-full truncate rounded-full border border-border/60 bg-accent/50 px-2.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {bySlug.get(slug)?.name ?? slug}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => router.push(`/directory/compare?ids=${encodeURIComponent(slugs.join(","))}`)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan px-4 py-1.5 text-xs font-bold text-background transition-opacity hover:opacity-90"
          >
            Compare now
          </button>
          <button
            type="button"
            onClick={clear}
            aria-label="Close comparison tray"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
