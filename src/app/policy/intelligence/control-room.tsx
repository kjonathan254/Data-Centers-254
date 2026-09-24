"use client";

/**
 * Policy Intelligence Control Room — mockup round 2 layout (2026-09-23).
 *
 * Console canvas, first viewport mirrors the approved mockup:
 *
 *   [evidence coverage hero]  [4 country KPI cards]
 *   [policy coverage matrix — dominant, pill cells, drawer]
 *   [open research queue]     [evidence states]
 *   [since last review — slim strip]
 *   [source quality & provenance]
 *   [selected country control room — tabs]
 *   [legend]                  [gaps by pillar]
 *
 * Cross-panel interaction: selecting a country (KPI card, matrix column
 * header, or drawer footer) focuses its matrix column. Every number is
 * computed from the dataset payload — never hardcoded. All content is
 * server-rendered HTML (rooms are hidden, not unmounted) so the evidence
 * stays crawlable.
 */

import { useMemo, useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import { POLICY_STATES, POLICY_GAP_STYLE } from "@/lib/policy/config";
import { countLabel } from "@/lib/policy";
import MatrixConsole from "./matrix-console";
import SourceQuality from "./source-quality";
import { CountUp, useWipe } from "./motion";
import type { OpsData, OpsGap, OpsSource } from "./dashboard-types";

const STATE_ORDER = ["verified", "partially-verified", "capture-pending", "unverified", "contradicted"] as const;
const STATE_META: Record<string, { label: string; dot: string; text: string; seg: string }> = Object.fromEntries(
  Object.entries(POLICY_STATES).map(([k, v]) => [
    k,
    { label: v.label, dot: v.dot, text: v.chip.match(/text-[\w-]+/)?.[0] ?? "text-slate-300", seg: v.dot },
  ])
);

const FLAGS: Record<string, string> = { KE: "🇰🇪", UG: "🇺🇬", RW: "🇷🇼", TZ: "🇹🇿" };

const DOMAIN_LABELS: Record<string, string> = {
  communications: "Communications",
  dataProtection: "Data protection",
  investment: "Investment & zones",
  energy: "Energy",
  environment: "Environment",
  ict: "ICT & digital",
  tax: "Tax",
};

type RoomTab = "overview" | "claims" | "regulators" | "sources" | "gaps";
const ROOM_TABS: { id: RoomTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "claims", label: "Claims" },
  { id: "regulators", label: "Regulators" },
  { id: "sources", label: "Sources" },
  { id: "gaps", label: "Research gaps" },
];

function PanelLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">{children}</h2>
      {right}
    </div>
  );
}

// ─── Row 1 left: evidence coverage hero (mockup anchor card) ────────────────

function EvidenceCoverageHero({ data }: { data: OpsData }) {
  const m = data.meta;
  const total = m.claims || 1;
  const other = Math.max(total - m.verified - m.partial, 0);
  const [wipeRef, wipeCls] = useWipe<HTMLDivElement>();
  return (
    <section
      aria-label="Regional claim verification"
      className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-gradient-to-br from-[#101D30] to-[#0E1D31] p-5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h1 className="max-w-[24ch] text-lg font-bold leading-snug text-white sm:text-xl">
          Who governs East Africa&rsquo;s data centres?
        </h1>
        <span
          title="Verification rate = verified claims / claims entered in the dataset. Structured gaps are unresearched pillars: excluded from the denominator, never counted as findings."
          className="mt-1 cursor-help text-slate-500 transition-colors hover:text-slate-300"
        >
          <Info className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-6xl font-bold leading-none text-white">
          <CountUp value={m.coveragePct} />
          <span className="text-2xl text-slate-500">%</span>
          <span className="mt-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Claim verification rate
          </span>
        </p>
        <ul className="flex flex-col gap-1.5 text-xs">
          <li className="flex items-center gap-2 text-slate-300">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <CountUp value={m.verified} duration={1100} /> verified
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
            <CountUp value={m.partial} duration={1200} /> partial
          </li>
          <li className={`flex items-center gap-2 ${POLICY_GAP_STYLE.text}`}>
            <span className="size-2 rounded-full border border-dashed border-violet-400" aria-hidden="true" />
            <CountUp value={m.gaps} duration={1300} /> structured gaps
          </li>
        </ul>
      </div>

      <p className="mt-3 max-w-[42ch] text-[11px] leading-relaxed text-slate-500">
        Share of entered claims meeting the evidence threshold. {m.gaps} research gaps remain across
        the {data.pillars.length} policy pillars.
      </p>

      <div className="mt-5" aria-hidden="true">
        <div ref={wipeRef} className="flex h-3 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]">
          <div className={`flex h-full w-full gap-px overflow-hidden rounded-full ${wipeCls}`} style={{ animationDelay: "120ms" }}>
            <span className="bg-emerald-500" style={{ width: `${(m.verified / total) * 100}%` }} />
            <span className="bg-amber-500" style={{ width: `${(m.partial / total) * 100}%` }} />
            {other > 0 && <span className="bg-slate-600" style={{ width: `${(other / total) * 100}%` }} />}
          </div>
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-600">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-[rgba(135,180,220,0.10)] pt-4">
        {[
          { v: m.claims, k: "claims" },
          { v: m.sources, k: "sources" },
          { v: m.gaps, k: "gaps" },
        ].map((s) => (
          <div key={s.k}>
            <dd className="font-mono text-xl font-bold text-white">
              <CountUp value={s.v} duration={1100} />
            </dd>
            <dt className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{s.k}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ─── Row 1 right: country KPI cards (mockup jurisdiction strip) ─────────────

function CountryKpiCards({
  data,
  focus,
  onSelect,
}: {
  data: OpsData;
  focus: string | null;
  onSelect: (key: string) => void;
}) {
  const ranked = [...data.countries].sort(
    (a, b) => a.coveragePct - b.coveragePct || a.name.localeCompare(b.name)
  );
  return (
    <div
      id="countries"
      aria-label="Jurisdiction verification rates"
      className="grid h-full scroll-mt-32 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
    >
      {ranked.map((c) => {
        const isFocus = focus === c.key;
        const toneCls = c.coveragePct >= 75 ? "text-emerald-400" : "text-amber-400";
        const barCls = c.coveragePct >= 75 ? "bg-emerald-500" : "bg-amber-500";
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onSelect(c.key)}
            aria-pressed={isFocus}
            title={`Focus ${c.name} in the coverage matrix`}
            className={`flex flex-col rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/[0.07] focus:outline-none ${
              isFocus
                ? "border-cyan-400/60 bg-[#13253A] shadow-[0_0_20px_rgba(34,211,238,0.10)]"
                : "border-[rgba(135,180,220,0.16)] bg-[#101D30]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-base leading-none">{FLAGS[c.iso] ?? ""}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">{c.name}</span>
            </span>
            <span className={`mt-2.5 font-mono text-4xl font-bold leading-none ${toneCls}`}>
              <CountUp value={c.coveragePct} duration={1200} />
              <span className="text-lg text-slate-500">%</span>
            </span>
            <span className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-[#0B1627]" aria-hidden="true">
              <span className={`block h-full rounded-full ${barCls}`} style={{ width: `${c.coveragePct}%` }} />
            </span>
            <span className="mt-auto flex items-center justify-between gap-1 pt-3 text-[11px]">
              <span className="font-medium">
                <span className="text-emerald-400">{c.verified} verified</span>
                <span className="text-slate-600"> / </span>
                <span className="text-amber-400">{c.partial} partial</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">{c.claims} claims</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Row 3 right: evidence states (mockup bottom-right panel) ───────────────

function EvidenceStatesPanel({ data }: { data: OpsData }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cl of data.claims) c[cl.state] = (c[cl.state] ?? 0) + 1;
    return c;
  }, [data.claims]);
  const total = data.meta.claims || 1;
  const [wipeRef, wipeCls] = useWipe<HTMLUListElement>();
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5">
      <PanelLabel
        right={
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            claim states · live
          </span>
        }
      >
        Evidence states
      </PanelLabel>
      <ul ref={wipeRef} className="mt-4 flex-1 space-y-3.5">
        {STATE_ORDER.map((s, i) => {
          const n = counts[s] ?? 0;
          const meta = STATE_META[s];
          return (
            <li key={s}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className={`size-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                  {meta.label}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  <span className={`font-bold ${meta.text}`}>{n}</span>{" "}
                  <span className="text-slate-600">({Math.round((n / total) * 100)}%)</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#0B1627]" aria-hidden="true">
                <div className={`h-full rounded-full ${meta.seg} ${wipeCls}`} style={{ width: `${(n / total) * 100}%`, animationDelay: `${i * 100}ms` }} />
              </div>
            </li>
          );
        })}
        <li className="border-t border-[rgba(135,180,220,0.10)] pt-3">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className={`flex items-center gap-2 ${POLICY_GAP_STYLE.text}`}>
              <span className="size-2 rounded-full border border-dashed border-violet-400" aria-hidden="true" />
              Structured gaps
            </span>
            <span className={`font-mono text-xs font-bold ${POLICY_GAP_STYLE.text}`}>{data.gaps.length}</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Unresearched pillars — a condition of research coverage, never a claim state.
          </p>
        </li>
      </ul>
      <p className="mt-4 flex items-baseline justify-between border-t border-[rgba(135,180,220,0.10)] pt-3 text-sm">
        <span className="text-slate-400">Total items</span>
        <span className="font-mono text-xs font-bold text-white">
          {data.meta.claims} claims · {data.meta.sources} sources
        </span>
      </p>
    </div>
  );
}

// ─── Since last review ─────────────────────────────────────────────────────

function SinceLastReview({
  since,
  changelog,
  pillarLabel,
}: {
  since: OpsData["sinceReview"];
  changelog: OpsData["changelog"];
  pillarLabel: (id: string) => string;
}) {
  const toneCls: Record<string, string> = {
    up: "text-emerald-400",
    flat: "text-slate-300",
    note: "text-sky-300",
  };
  return (
    <section
      aria-label="Changes since last dataset review"
      className="rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0B1627] p-4 sm:p-5"
    >
      <PanelLabel
        right={
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {since.fromVersion.replace("policy-", "")} → {since.toVersion.replace("policy-", "")} ·{" "}
            {since.date}
          </span>
        }
      >
        Since last dataset review
      </PanelLabel>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {since.items.map((it) => (
          <li key={it.label} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2.5">
            <p className={`text-sm font-semibold ${toneCls[it.tone] ?? "text-slate-200"}`}>{it.label}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{it.detail}</p>
          </li>
        ))}
      </ul>

      {/* Claim-level changelog: claim -> sources -> previous version -> editorial decision.
          Zero-JS <details> so the audit trail stays server-rendered and crawlable. */}
      {changelog.map((entry) => (
        <details key={entry.version} className="group mt-3 rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30]">
          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:text-cyan-300 [&::-webkit-details-marker]:hidden">
            <ChevronRight className="size-3.5 shrink-0 text-slate-600 transition-transform group-open:rotate-90" aria-hidden="true" />
            Claim-level changes
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {entry.previousVersion.replace("policy-", "")} <span aria-hidden="true">&rarr;</span>{" "}
              {entry.version.replace("policy-", "")}
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <span>{entry.claims.length} claims</span>
              <span className="text-slate-700">/</span>
              <span>{entry.sourcesAdded.length} sources</span>
            </span>
          </summary>
          <div className="border-t border-[rgba(135,180,220,0.10)] px-3.5 py-3">
            <p className="text-xs leading-relaxed text-slate-400">{entry.summary}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Editorial decision &middot; </span>
              {entry.editorialDecisionSummary}
            </p>
            <ol className="mt-3 space-y-3 divide-y divide-[rgba(135,180,220,0.08)]">
              {entry.claims.map((cl) => {
                const cfg = STATE_META[cl.state];
                return (
                  <li key={cl.id} className="pt-3 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{cl.id}</span>
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-300">
                        {cl.action}
                      </span>
                      {cfg && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium ${cfg.text}`}
                        >
                          <span className={`size-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
                          {cfg.label}
                        </span>
                      )}
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {cl.country} &middot; {pillarLabel(cl.pillar)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{cl.statement}</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{cl.previousVersionNote}</p>
                    {cl.sources.length > 0 && (
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-slate-500">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Evidence &middot; </span>
                        {cl.sources.map((s, i) => (
                          <span key={`${s.id}-${i}`} className="inline-flex items-center gap-1">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300"
                            >
                              {s.publisher}
                            </a>
                            <span className="font-mono text-[10px] uppercase text-slate-500">
                              T{s.tier} &middot; {s.captureStatus}
                            </span>
                            {i < cl.sources.length - 1 && <span className="text-slate-700">/</span>}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Editorial decision &middot; </span>
                      {cl.editorialDecision}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </details>
      ))}
    </section>
  );
}

// ─── Research queue (mockup alert panel) ──────────────────────────────────

function ResearchQueueAlert({ gaps, pillarLabel }: { gaps: OpsGap[]; pillarLabel: (id: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<"priority" | "pillar">("priority");
  const high = gaps.filter((g) => g.priority === "high").length;
  const sorted = useMemo(() => {
    const arr = [...gaps];
    if (sort === "priority") {
      arr.sort((a, b) => (a.priority === b.priority ? a.countryName.localeCompare(b.countryName) : a.priority === "high" ? -1 : 1));
    } else {
      arr.sort((a, b) => pillarLabel(a.pillar).localeCompare(pillarLabel(b.pillar)) || a.countryName.localeCompare(b.countryName));
    }
    return arr;
  }, [gaps, sort, pillarLabel]);
  const rows = expanded ? sorted : sorted.slice(0, 5);
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PanelLabel
          right={
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-px text-cyan-300">
                {high} high
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-px text-slate-400">
                {gaps.length - high} medium
              </span>
            </span>
          }
        >
          Research queue <span className="ml-1 text-slate-300">{gaps.length}</span>
          <span className="ml-2 hidden font-sans normal-case tracking-normal text-slate-500 sm:inline">
            What we&apos;re investigating next
          </span>
        </PanelLabel>
        <select
          aria-label="Sort research queue"
          value={sort}
          onChange={(e) => setSort(e.target.value as "priority" | "pillar")}
          className="h-7 rounded-lg border border-slate-700/70 bg-[#101D30] px-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 focus:border-cyan-500/60 focus:outline-none"
        >
          <option value="priority">HIGH ▾ priority</option>
          <option value="pillar">PILLAR ▾ a–z</option>
        </select>
      </div>
      <ol className="mt-3 flex-1 divide-y divide-[rgba(135,180,220,0.08)]">
        {rows.map((g, i) => (
          <li key={`${g.country}-${g.pillar}`}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-2.5 transition-colors hover:bg-[#13253A]/40 [&::-webkit-details-marker]:hidden">
                <span className={`relative flex shrink-0 size-2 ${g.priority === "high" ? "" : "opacity-50"}`} aria-hidden="true">
                  {g.priority === "high" && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                  )}
                  <span className="relative inline-flex size-2 rounded-full bg-violet-400" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-200">
                  {g.gap.charAt(0).toUpperCase()}
                  {g.gap.slice(1)}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-slate-500 sm:block">
                  {g.countryName} · {pillarLabel(g.pillar)}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-slate-600 transition-transform group-open:rotate-90" aria-hidden="true" />
                <span className="sr-only">{String(i + 1)}</span>
              </summary>
              <div className="border-l border-violet-400/20 bg-[#0B1627]/60 px-4 py-3">
                <p className="text-xs leading-relaxed text-slate-300">{g.gap}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Expected sources · </span>
                  {g.expectedSources.join("; ")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">Upgrade path · </span>
                  {g.upgradePath}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full rounded-lg border border-slate-700/70 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
      >
        {expanded ? "Show top 5 only" : `View all ${gaps.length} research gaps`}
      </button>
    </div>
  );
}

// ─── Gaps by pillar (ranked bars) ──────────────────────────────────────────

function GapsByPillar({ gaps, pillarLabel }: { gaps: OpsGap[]; pillarLabel: (id: string) => string }) {
  const counts = new Map<string, number>();
  for (const g of gaps) counts.set(g.pillar, (counts.get(g.pillar) ?? 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = rows[0]?.[1] ?? 1;
  const [wipeRef, wipeCls] = useWipe<HTMLUListElement>();
  return (
    <div className="flex h-full flex-col rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.30)]">
      <PanelLabel right={<span className={`font-mono text-[10px] uppercase tracking-wider ${POLICY_GAP_STYLE.text}`}>structured gaps</span>}>
        Open gaps by pillar
      </PanelLabel>
      <ul ref={wipeRef} className="mt-4 flex-1 space-y-3">
        {rows.map(([pid, n], i) => (
          <li key={pid}>
            <div className="flex items-baseline justify-between gap-2">
              <Link
                href={`/policy/intelligence/pillars/${pid}`}
                title={`Open the ${pillarLabel(pid)} deep dive`}
                className="text-xs text-slate-300 underline decoration-transparent underline-offset-2 transition-colors hover:text-cyan-300 hover:decoration-cyan-500/50"
              >
                {pillarLabel(pid)}
              </Link>
              <span className="font-mono text-xs font-bold text-slate-200">{n}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#0B1627]">
              <div
                className={`h-full rounded-full bg-violet-400/70 ${wipeCls}`}
                style={{ width: `${(n / max) * 100}%`, animationDelay: `${i * 90}ms` }}
              />
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-slate-500">No open gaps.</li>}
      </ul>
    </div>
  );
}

// ─── Country control room (tabs) ───────────────────────────────────────────

function ClaimCard({ claim }: { claim: OpsData["claims"][number] }) {
  const cfg = STATE_META[claim.state];
  return (
    <li className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] p-4">
      <div className="flex flex-wrap items-center gap-2">
        {cfg && (
          <span
            title={POLICY_STATES[claim.state as keyof typeof POLICY_STATES]?.blurb}
            className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium ${cfg.text}`}
          >
            <span className={`size-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
            {cfg.label}
          </span>
        )}
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">{claim.id}</span>
        <CopyButton value={claim.id} className="ml-auto" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">{claim.statement}</p>
      {claim.note && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{claim.note}</p>}
      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        Evidence strength: {claim.strength} · {claim.captureSummary}
      </p>
      {claim.sources.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-sky-400 hover:text-sky-300 [&::-webkit-details-marker]:hidden">
            View evidence trail · {countLabel(claim.sources.length, "source")} ▾
          </summary>
          <ol className="mt-2 space-y-2 border-t border-[rgba(135,180,220,0.10)] pt-2">
            {claim.sources.map((s, i) => (
              <li key={`${s.id}-${i}`} className="text-xs leading-relaxed text-slate-400">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300"
                >
                  {i + 1}. {s.publisher}
                </a>{" "}
                — {s.label}
                <span className="ml-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  T{s.tier} · {s.captureStatus}
                </span>
                {s.excerpt && (
                  <span className="mt-1 block border-l border-slate-700 pl-2 font-mono text-[10px] leading-relaxed text-slate-500 line-clamp-4">
                    {s.excerpt}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
    </li>
  );
}

function GapCard({ gap, pillarLabel }: { gap: OpsGap; pillarLabel: (id: string) => string }) {
  return (
    <div className={`rounded-lg border bg-violet-400/[0.04] p-4 ${POLICY_GAP_STYLE.chip}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        Structured gap — not a finding · {pillarLabel(gap.pillar)}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{gap.gap}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">Expected sources: {gap.expectedSources.join("; ")}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">Upgrade path: {gap.upgradePath}</p>
    </div>
  );
}

function CountryRoom({
  data,
  roomKey,
  tab,
  onTab,
  pillarLabel,
  switcher,
}: {
  data: OpsData;
  roomKey: string;
  tab: RoomTab;
  onTab: (t: RoomTab) => void;
  pillarLabel: (id: string) => string;
  switcher: React.ReactNode;
}) {
  const c = data.countries.find((x) => x.key === roomKey);
  if (!c) return null;
  const claims = data.claims.filter((cl) => cl.country === roomKey);
  const gaps = data.gaps.filter((g) => g.country === roomKey);
  const counts: Record<string, number> = {};
  for (const cl of claims) counts[cl.state] = (counts[cl.state] ?? 0) + 1;
  const uniqueSources: OpsSource[] = [];
  const seen = new Set<string>();
  for (const cl of claims) {
    for (const s of cl.sources) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        uniqueSources.push(s);
      }
    }
  }
  uniqueSources.sort((a, b) => a.tier - b.tier || a.publisher.localeCompare(b.publisher));
  const priorityGaps = gaps.filter((g) => g.priority === "high");

  return (
    <div className="rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31]">
      {/* Room header + country switcher + tabs */}
      <div className="border-b border-[rgba(135,180,220,0.16)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-bold text-white">
              {c.name} <span className="ml-1 font-mono text-xs text-slate-500">{c.iso}</span>
            </h3>
            <span className="font-mono text-[11px] text-slate-500">
              {c.coveragePct}% verified · {countLabel(claims.length, "claim")} · {c.facilities}{" "}
              {c.facilities === 1 ? "facility" : "facilities"} · {countLabel(gaps.length, "open gap")}
            </span>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Choose country control room">
            {switcher}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1" role="tablist" aria-label={`${c.name} control room sections`}>
          {ROOM_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => onTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.id ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:bg-[#13253A]/60 hover:text-slate-200"
              }`}
            >
              {t.label}
              {t.id === "claims" && <span className="ml-1.5 font-mono text-[10px] text-slate-500">{claims.length}</span>}
              {t.id === "gaps" && <span className="ml-1.5 font-mono text-[10px] text-slate-500">{gaps.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Evidence profile</p>
              <p className="mt-1.5 font-mono text-3xl font-bold text-white">{c.coveragePct}%</p>
              <div className="mt-2 flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]">
                {STATE_ORDER.map((s) =>
                  counts[s] ? (
                    <span key={s} className={STATE_META[s].seg} style={{ width: `${(counts[s] / claims.length) * 100}%` }} />
                  ) : null
                )}
              </div>
              <p className="mt-2 font-mono text-[11px]">
                <span className="text-emerald-400">{c.verified} verified</span>
                <span className="text-slate-600"> · </span>
                <span className="text-amber-400">{c.partial} partial</span>
                <span className="text-slate-600"> · </span>
                <span className={POLICY_GAP_STYLE.text}>{gaps.length} structured gaps</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Investigated {c.investigatedLong}
                {c.facilitiesNote ? ` · ${c.facilitiesNote}` : ""}
              </p>
            </div>
            {priorityGaps.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Priority gaps</p>
                <ul className="mt-2 space-y-1">
                  {priorityGaps.map((g) => (
                    <li key={g.pillar} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`size-1.5 rounded-full border border-dashed ${"border-violet-400"}`} aria-hidden="true" />
                      {pillarLabel(g.pillar)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.investigationNote && (
              <p className="border-t border-[rgba(135,180,220,0.10)] pt-3 text-[11px] leading-relaxed text-slate-500">
                {c.investigationNote}
              </p>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Regulator map</p>
            <dl className="mt-2 space-y-1.5">
              {c.regulators.map((r) => (
                <div key={r.domain} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {DOMAIN_LABELS[r.domain] ?? r.domain}
                  </dt>
                  <dd className="text-slate-300">{r.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Claims tab */}
      {tab === "claims" && (
        <div className="space-y-6 p-4 sm:p-5">
          {data.pillars.map((p) => {
            const pClaims = claims.filter((cl) => cl.pillar === p.id);
            const pGap = gaps.find((g) => g.pillar === p.id);
            if (pClaims.length === 0 && !pGap) return null;
            return (
              <div key={p.id}>
                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                  <Link
                    href={`/policy/intelligence/pillars/${p.id}`}
                    title={`Open the ${p.label} deep dive`}
                    className="underline decoration-transparent underline-offset-2 transition-colors hover:text-cyan-300 hover:decoration-cyan-500/50"
                  >
                    {p.label}
                  </Link>
                  {pClaims.length > 0 && (
                    <span className="ml-2 text-slate-600">{countLabel(pClaims.length, "claim")}</span>
                  )}
                </h4>
                {pClaims.length > 0 && (
                  <ul className="mt-2 space-y-3">
                    {pClaims.map((cl) => (
                      <ClaimCard key={cl.id} claim={cl} />
                    ))}
                  </ul>
                )}
                {pGap && (
                  <div className={pClaims.length > 0 ? "mt-3" : "mt-2"}>
                    <GapCard gap={pGap} pillarLabel={pillarLabel} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regulators tab */}
      {tab === "regulators" && (
        <div className="p-4 sm:p-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            {c.regulators.map((r) => (
              <div key={r.domain} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] p-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {DOMAIN_LABELS[r.domain] ?? r.domain}
                </dt>
                <dd className="mt-1 text-sm text-slate-200">{r.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Sources tab */}
      {tab === "sources" && (
        <div className="p-4 sm:p-5">
          <p className="text-xs text-slate-500">
            {countLabel(uniqueSources.length, "distinct source")} across this country&rsquo;s claims.
          </p>
          <ul className="mt-3 space-y-2">
            {uniqueSources.map((s) => (
              <li key={s.id} className="rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-200 underline decoration-slate-600 underline-offset-2 hover:decoration-cyan-400"
                >
                  {s.publisher}
                </a>
                <span className="block text-xs text-slate-500">{s.label}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-slate-600">
                  T{s.tier} · {s.captureStatus}
                  {s.id ? ` · ${s.id}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps tab */}
      {tab === "gaps" && (
        <div className="space-y-3 p-4 sm:p-5">
          {gaps.map((g) => (
            <GapCard key={`${g.country}-${g.pillar}`} gap={g} pillarLabel={pillarLabel} />
          ))}
          {gaps.length === 0 && <p className="text-sm text-slate-500">No structured gaps for this country.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────

function Legend({ data }: { data: OpsData }) {
  const desc: Record<string, string> = {
    verified: "Strong evidence threshold met",
    "partially-verified": "Evidence exists; some elements unresolved",
    "capture-pending": "Source identified, not yet captured",
    unverified: "Does not yet meet the publication threshold",
    contradicted: "Credible evidence conflicts with the claim",
  };
  const liveCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cl of data.claims) c[cl.state] = (c[cl.state] ?? 0) + 1;
    return c;
  }, [data.claims]);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Object.entries(POLICY_STATES).map(([key, cfg]) => (
        <div
          key={key}
          title={cfg.blurb}
          className="flex items-start gap-2.5 rounded-lg border border-[rgba(135,180,220,0.10)] bg-[#101D30] px-3 py-2.5 transition-colors duration-300 hover:border-[rgba(135,180,220,0.26)]"
        >
          <span className={`mt-1 size-2 shrink-0 rounded-full ${cfg.dot}`} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-slate-200">{cfg.label}</span>
              {liveCounts[key] !== undefined && (
                <span className={`font-mono text-xs font-bold ${cfg.chip.match(/text-[\w-]+/)?.[0] ?? "text-slate-300"}`}>
                  {liveCounts[key]}
                  <span className="ml-1 font-normal text-slate-600">/ {data.meta.claims}</span>
                </span>
              )}
            </span>
            <span className="block text-xs leading-relaxed text-slate-500">{desc[key] ?? cfg.blurb}</span>
          </span>
        </div>
      ))}
      <div
        title="A gap is the condition of research coverage, not of a claim: the pillar is owned by the pipeline but has no researched statements yet."
        className={`flex items-start gap-2.5 rounded-lg border bg-transparent px-3 py-2.5 transition-colors duration-300 hover:border-violet-400/60 sm:col-span-2 ${POLICY_GAP_STYLE.chip}`}
      >
        <span className="mt-1 size-2 shrink-0 rounded-full border border-dashed border-violet-400" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-slate-200">Structured gap</span>
            <span className={`font-mono text-xs font-bold ${POLICY_GAP_STYLE.text}`}>
              {data.gaps.length}
              <span className="ml-1 font-normal text-slate-600">pillars</span>
            </span>
          </span>
          <span className="block text-xs leading-relaxed text-slate-500">Pillar owned but not yet researched — never a finding</span>
        </span>
      </div>
    </div>
  );
}

// ─── Dashboard shell ───────────────────────────────────────────────────────

export default function ControlRoomDashboard({ data }: { data: OpsData }) {
  const [focus, setFocus] = useState<string | null>(null);
  const [roomKey, setRoomKey] = useState<string>(
    () => [...data.countries].sort((a, b) => b.coveragePct - a.coveragePct || b.claims - a.claims)[0]?.key ?? data.countries[0]?.key ?? ""
  );
  const [roomTab, setRoomTab] = useState<RoomTab>("overview");

  const pillarLabel = useMemo(
    () => (id: string) => data.pillars.find((p) => p.id === id)?.label ?? id,
    [data.pillars]
  );

  function selectCountry(key: string) {
    setFocus(focus === key ? null : key);
    document.getElementById("matrix")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-5">
      {/* Row 1: coverage hero + jurisdiction cards */}
      <div id="health" className="grid scroll-mt-32 gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <EvidenceCoverageHero data={data} />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <CountryKpiCards data={data} focus={focus} onSelect={selectCountry} />
          <p className="mt-2.5 max-w-3xl text-[11px] leading-relaxed text-slate-500">
            Verification rate = verified claims / claims entered for that country. A pillar not yet
            researched is a structured gap, never a failed claim.
          </p>
        </div>
      </div>

      {/* Row 2: the matrix (dominant) */}
      <section id="matrix" className="scroll-mt-32" aria-label="Policy coverage matrix">
        <MatrixConsole data={data} focus={focus} onFocus={(k) => setFocus(k)} />
      </section>

      {/* Row 3: queue + evidence states */}
      <div id="queue" className="grid scroll-mt-32 gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <ResearchQueueAlert gaps={data.gaps} pillarLabel={pillarLabel} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <EvidenceStatesPanel data={data} />
        </div>
      </div>

      {/* Row 4: since last review + claim-level changelog */}
      <SinceLastReview since={data.sinceReview} changelog={data.changelog} pillarLabel={pillarLabel} />

      {/* Row 5: source quality & provenance */}
      <section id="sources" className="scroll-mt-32" aria-label="Source quality and provenance">
        <SourceQuality data={data} />
      </section>

      {/* Row 6: country control room */}
      <section id="control-room" className="scroll-mt-32" aria-label="Country control room">
        <PanelLabel>Selected country control room</PanelLabel>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Drill into one market: evidence profile, regulator map, the full claim set with evidence
          trails, distinct sources and the open research gaps.
        </p>
        <div className="mt-3">
          <CountryRoomSwitcher data={data} roomKey={roomKey} setRoomKey={setRoomKey} roomTab={roomTab} setRoomTab={setRoomTab} pillarLabel={pillarLabel} />
        </div>
      </section>

      {/* Row 7: legend + gaps by pillar */}
      <div id="legend" className="grid scroll-mt-32 gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <section aria-label="Evidence states legend">
            <PanelLabel>Evidence states</PanelLabel>
            <div className="mt-3">
              <Legend data={data} />
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-500">
              Evidence states describe the condition of a <span className="text-slate-400">claim</span>.
              A gap describes the condition of <span className="text-slate-400">research coverage</span> —
              it is never a claim, and it never borrows a claim&rsquo;s status. Hover any state for the
              full definition.
            </p>
          </section>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <GapsByPillar gaps={data.gaps} pillarLabel={pillarLabel} />
        </div>
      </div>
    </div>
  );
}

/** Thin wrapper so the switcher buttons inside the room header can drive state. */
function CountryRoomSwitcher({
  data,
  roomKey,
  setRoomKey,
  roomTab,
  setRoomTab,
  pillarLabel,
}: {
  data: OpsData;
  roomKey: string;
  setRoomKey: (k: string) => void;
  roomTab: RoomTab;
  setRoomTab: (t: RoomTab) => void;
  pillarLabel: (id: string) => string;
}) {
  const switcher = (
    <div className="flex items-center gap-1 rounded-lg border border-slate-700/70 p-0.5" role="group" aria-label="Choose country control room">
      {data.countries.map((x) => (
        <button
          key={x.key}
          type="button"
          onClick={() => setRoomKey(x.key)}
          aria-pressed={x.key === roomKey}
          className={`rounded-md px-2 py-1 font-mono text-[10px] uppercase transition-colors ${
            x.key === roomKey ? "bg-cyan-500/15 text-cyan-300" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {x.iso}
        </button>
      ))}
    </div>
  );
  return (
    <CountryRoom
      data={data}
      roomKey={roomKey}
      tab={roomTab}
      onTab={setRoomTab}
      pillarLabel={pillarLabel}
      switcher={switcher}
    />
  );
}
