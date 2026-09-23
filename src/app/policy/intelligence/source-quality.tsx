"use client";

/**
 * Source Quality & Provenance panel (Control Room Phase 2).
 *
 * The evidence layer inspects itself: what the 60 registered sources ARE,
 * how strong they are (tier mix) and how much of the backbone is actually
 * captured (capture health) — with a filterable source explorer.
 *
 * Every number is derived from the dataset's source registry at build time;
 * nothing on this panel is hardcoded. Tier filters are clickable and sync
 * with the explorer below (progressive disclosure: the full registry is in
 * the DOM, filters only reveal it).
 *
 * Colour semantics (audit §15): emerald = captured / Tier-1 strength,
 * sky = snippet / Tier-2, amber = capture-pending, slate = Tier-3.
 */

import { useMemo, useState } from "react";
import { ArrowUpRight, Database } from "lucide-react";
import { countLabel } from "@/lib/policy";
import { useWipe } from "./motion";
import type { OpsData, OpsSource } from "./dashboard-types";

const TIERS = [
  {
    id: 1,
    label: "Tier 1",
    short: "T1",
    desc: "Primary instruments — statutes, regulations, official gazettes, regulator publications",
    seg: "bg-emerald-500",
    text: "text-emerald-400",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  {
    id: 2,
    label: "Tier 2",
    short: "T2",
    desc: "Independent authoritative — auditors, standards bodies, major institutions",
    seg: "bg-sky-500",
    text: "text-sky-400",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },
  {
    id: 3,
    label: "Tier 3",
    short: "T3",
    desc: "Reputable secondary — established press, specialist trade coverage",
    seg: "bg-slate-500",
    text: "text-slate-400",
    chip: "border-slate-600 bg-slate-500/10 text-slate-300",
  },
] as const;

const CAPTURE_STATES = [
  { id: "captured", label: "Captured", desc: "full text stored in research/captures and drift-monitored", seg: "bg-emerald-500" },
  { id: "snippet", label: "Snippet", desc: "short quote captured; full text not yet stored", seg: "bg-sky-500" },
  { id: "capture-pending", label: "Pending capture", desc: "identified and registered; retrieval queued", seg: "bg-amber-500" },
] as const;

type TierFilter = "all" | 1 | 2 | 3;
type CaptureFilter = "all" | "captured" | "snippet" | "capture-pending";

export default function SourceQuality({ data }: { data: OpsData }) {
  const [tier, setTier] = useState<TierFilter>("all");
  const [capture, setCapture] = useState<CaptureFilter>("all");
  const [showAll, setShowAll] = useState(false);
  const [wipeRef, wipeCls] = useWipe<HTMLDivElement>();

  const sources = data.sources;

  const tierCounts = useMemo(() => {
    const c: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const s of sources) c[s.tier] = (c[s.tier] ?? 0) + 1;
    return c;
  }, [sources]);

  const captureCounts = useMemo(() => {
    const c: Record<string, number> = { captured: 0, snippet: 0, "capture-pending": 0 };
    for (const s of sources) c[s.captureStatus] = (c[s.captureStatus] ?? 0) + 1;
    return c;
  }, [sources]);

  const filtered = useMemo(
    () =>
      sources.filter(
        (s) => (tier === "all" || s.tier === tier) && (capture === "all" || s.captureStatus === capture)
      ),
    [sources, tier, capture]
  );

  const visible = showAll ? filtered : filtered.slice(0, 8);
  const t1Share = Math.round(((tierCounts[1] ?? 0) / Math.max(sources.length, 1)) * 100);
  const capturedShare = Math.round(((captureCounts["captured"] ?? 0) / Math.max(sources.length, 1)) * 100);

  return (
    <div
      id="sources"
      className="scroll-mt-28 rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 p-5 pb-0">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Source quality &amp; provenance
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          {countLabel(sources.length, "registered source")} · {t1Share}% Tier-1 · {capturedShare}% captured
        </span>
      </div>

      <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-12">
        {/* ── Left: tier mix + capture health ─────────────────────────── */}
        <div className="min-w-0 space-y-5 lg:col-span-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Tier mix</p>
            <div ref={wipeRef} className="mt-2" aria-hidden="true">
              <div className={`flex h-3 w-full gap-px overflow-hidden rounded-full bg-[#0B1627] ${wipeCls}`}>
                {TIERS.map((t) =>
                  tierCounts[t.id] ? (
                    <span
                      key={t.id}
                      className={`${t.seg} transition-opacity duration-300 ${tier !== "all" && tier !== t.id ? "opacity-25" : ""}`}
                      style={{ width: `${(tierCounts[t.id] / Math.max(sources.length, 1)) * 100}%` }}
                    />
                  ) : null
                )}
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {TIERS.map((t) => {
                const active = tier === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setTier(active ? "all" : t.id);
                        setShowAll(false);
                      }}
                      aria-pressed={active}
                      title={t.desc}
                      className={`group flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors ${
                        active
                          ? `${t.chip}`
                          : "border-transparent text-slate-400 hover:border-[rgba(135,180,220,0.14)] hover:bg-[#13253A]/50 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <span className={`inline-block size-2 rounded-full ${t.seg}`} aria-hidden="true" />
                        {t.label}
                        <span className="hidden font-mono text-[9px] uppercase tracking-wider text-slate-600 group-hover:inline">
                          filter
                        </span>
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {tierCounts[t.id] ?? 0}
                        <span className="ml-1 font-normal text-slate-600">
                          {Math.round(((tierCounts[t.id] ?? 0) / Math.max(sources.length, 1)) * 100)}%
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-[rgba(135,180,220,0.10)] pt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Capture health</p>
            <div className={`mt-2 flex h-3 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]`} aria-hidden="true">
              {CAPTURE_STATES.map((c) =>
                captureCounts[c.id] ? (
                  <span
                    key={c.id}
                    className={`${c.seg} transition-opacity duration-300 ${capture !== "all" && capture !== c.id ? "opacity-25" : ""}`}
                    style={{ width: `${(captureCounts[c.id] / Math.max(sources.length, 1)) * 100}%` }}
                  />
                ) : null
              )}
            </div>
            <ul className="mt-3 space-y-1.5">
              {CAPTURE_STATES.map((c) => {
                const active = capture === c.id;
                const n = captureCounts[c.id] ?? 0;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCapture(active ? "all" : c.id);
                        setShowAll(false);
                      }}
                      aria-pressed={active}
                      title={c.desc}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1 text-left text-xs transition-colors ${
                        active ? "bg-[#13253A] text-slate-100" : "text-slate-400 hover:bg-[#13253A]/50 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <span className={`inline-block size-2 rounded-full ${c.seg}`} aria-hidden="true" />
                        {c.label}
                      </span>
                      <span className="font-mono font-bold">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Captured sources are stored verbatim in{" "}
              <span className="font-mono text-slate-400">research/captures/</span> and watched for content drift.
            </p>
          </div>
        </div>

        {/* ── Right: source explorer ──────────────────────────────────── */}
        <div className="min-w-0 lg:col-span-8">
          <div className="flex h-full min-w-0 flex-col rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#0B1627]/60">
            <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(135,180,220,0.10)] px-3 py-2.5">
              <Database className="size-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Source explorer</p>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-slate-500">
                {countLabel(filtered.length, "match", "matches")}
                {filtered.length !== sources.length && <span className="text-slate-600"> / {sources.length}</span>}
              </span>
            </div>

            <ul className="min-h-0 flex-1 divide-y divide-[rgba(135,180,220,0.08)] overflow-y-auto" style={{ maxHeight: 372 }}>
              {visible.map((s) => (
                <SourceRow key={s.id} source={s} />
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-slate-500">
                  No sources match this filter combination.
                </li>
              )}
            </ul>

            {(filtered.length > 8 || showAll) && (
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="border-t border-[rgba(135,180,220,0.10)] w-full py-2 text-center font-mono text-[10px] uppercase tracking-widest text-slate-400 transition-colors hover:bg-[#13253A]/60 hover:text-cyan-300"
              >
                {showAll ? "Show fewer" : `Show all ${filtered.length} sources`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceRow({ source: s }: { source: OpsSource }) {
  const tierMeta = TIERS.find((t) => t.id === s.tier);
  const capMeta = CAPTURE_STATES.find((c) => c.id === s.captureStatus);
  return (
    <li>
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        title={s.excerpt ? `${s.label} — ${s.excerpt}` : s.label}
        className="group flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-[#13253A]/60"
      >
        <span
          className={`mt-0.5 inline-flex shrink-0 items-center rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${
            tierMeta?.chip ?? "border-slate-700 text-slate-400"
          }`}
        >
          {tierMeta?.short ?? `T${s.tier}`}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm leading-snug text-slate-200 group-hover:text-cyan-200">
            {s.publisher}
            <span className="text-slate-500"> — {s.label}</span>
          </span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-slate-600">
            {s.sourceType} · {capMeta?.label ?? s.captureStatus} · {s.id}
          </span>
        </span>
        <ArrowUpRight
          className="mt-1 size-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-cyan-300"
          aria-hidden="true"
        />
      </a>
    </li>
  );
}
