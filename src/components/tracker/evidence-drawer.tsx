"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, ShieldCheck, X } from "lucide-react";
import type { CableRecord } from "@/lib/market-trackers";

// Phase 3 of DC254_Map_and_Cable_Tracker_UX_Redesign.md: "Add evidence
// drawers with source trails". One drawer component shared by the cable
// tracker and the infrastructure map so the verification treatment is
// identical wherever a cable record is opened.
//
// Accessibility: role=dialog + aria-modal, Esc to close, backdrop click to
// close, focus moves to the close button on open and returns to the opener
// via the caller (the caller keeps its trigger focused, since the drawer
// unmounts rather than hides). Body scroll is locked while open.

const KIND_LABEL: Record<CableRecord["sources"][number]["kind"], string> = {
  operator: "Operator",
  registry: "Registry",
  press: "Press",
  gov: "Government",
};

const KIND_BADGE: Record<CableRecord["sources"][number]["kind"], string> = {
  operator: "border-cyan/30 text-cyan bg-cyan/10",
  registry: "border-neon/30 text-neon bg-neon/10",
  press: "border-amber-500/30 text-amber-500 bg-amber-500/10",
  gov: "border-purple-400/30 text-purple-400 bg-purple-400/10",
};

const CONFIDENCE_DOT: Record<CableRecord["dataConfidence"], string> = {
  High: "bg-neon",
  Medium: "bg-amber-500",
  Low: "bg-red-400",
};

export default function EvidenceDrawer({ cable, onClose }: { cable: CableRecord | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cable) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [cable, onClose]);

  if (!cable) return null;
  const primary = cable.sources[0];

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-drawer-title"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close evidence drawer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
        tabIndex={-1}
      />
      {/* sheet: right rail on desktop, bottom sheet on mobile */}
      <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto scrollbar-thin rounded-t-2xl border border-border/60 bg-surface shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border/40 bg-surface/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Evidence record</p>
            <h2 id="evidence-drawer-title" className="mt-0.5 truncate text-lg font-semibold text-foreground">{cable.name}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close evidence drawer"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan/60"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* verification strip */}
          <div className="rounded-lg border border-neon/20 bg-neon/5 px-3.5 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck aria-hidden="true" className="size-4 text-neon" />
              <span aria-hidden="true" className={`inline-block size-1.5 rounded-full ${CONFIDENCE_DOT[cable.dataConfidence]}`} />
              {cable.dataConfidence.toUpperCase()} CONFIDENCE · VERIFIED {cable.lastVerified.replace("-", " ").toUpperCase()}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Source trail below lists every source behind this record&rsquo;s status, owners, landings and capacity.
            </p>
          </div>

          {/* status + record summary */}
          <dl className="space-y-2.5 text-xs">
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Status</dt>
              <dd className="mt-0.5 text-foreground">{cable.status}{cable.rfsDate ? ` · RFS ${cable.rfsDate}` : " · no RFS date published"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Owner / consortium</dt>
              <dd className="mt-0.5 text-foreground">{cable.owners}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Kenyan landing</dt>
              <dd className="mt-0.5 text-foreground">{cable.kenyanLandings.join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">Evidence note</dt>
              <dd className="mt-0.5 leading-relaxed text-muted-foreground">{cable.note}</dd>
            </div>
          </dl>

          {/* source trail */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/80">
              Source trail · {cable.sources.length} {cable.sources.length === 1 ? "source" : "sources"}
            </p>
            <ul className="mt-2 space-y-2">
              {cable.sources.map((s, i) => (
                <li key={`${s.url}-${i}`} className="rounded-lg border border-border/40 bg-accent/20 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium leading-snug text-foreground">{s.label}</span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${KIND_BADGE[s.kind]}`}>
                      {KIND_LABEL[s.kind]}
                    </span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate text-[11px] text-cyan hover:underline"
                  >
                    <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                  </a>
                </li>
              ))}
            </ul>
            {primary && (
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground/80">
                Primary record: <a href={primary.url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">{primary.label}</a>.
                Sources are republished as cited; figures are the source&rsquo;s own.
              </p>
            )}
          </div>

          {/* the caveat, attached to the drawer per the redesign doc */}
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3.5 py-3 text-xs leading-relaxed text-amber-500/90">
            Design capacity is operator-reported. Lit capacity is not published by operators and is deliberately not
            estimated anywhere on DC254.
          </p>

          {cable.dc254Article && (
            <Link
              href={`/articles/${cable.dc254Article}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
            >
              Read the full explainer <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
          <p className="flex items-center gap-1.5 pb-2 text-[11px] text-muted-foreground/70">
            <FileText aria-hidden="true" className="size-3.5" />
            DC254 verification: monthly sweep, every claim traced to a named source.
          </p>
        </div>
      </div>
    </div>
  );
}
