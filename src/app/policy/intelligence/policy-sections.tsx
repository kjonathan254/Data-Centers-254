/**
 * /policy/intelligence — server-rendered dashboard sections.
 *
 * CountrySnapshot, ResearchQueue and ControlRooms are all derived straight
 * from the policy dataset via src/lib/policy (no prop-drilling of the full
 * payload); the interactive matrix lives in ops-console.tsx (client).
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CopyButton from "@/components/copy-button";
import { POLICY_PILLARS, POLICY_STATES, POLICY_SOURCE_TIERS, POLICY_CAPTURE_LABELS } from "@/lib/policy/config";
import {
  getPolicyCountries,
  policyClaimSources,
  type PolicyClaim,
  type PolicyCountry,
  type PillarGap,
} from "@/lib/policy";

// ─── Shared helpers ────────────────────────────────────────────────────────

const DOMAIN_LABELS: Record<string, string> = {
  communications: "Communications",
  dataProtection: "Data protection",
  investment: "Investment & zones",
  energy: "Energy",
  environment: "Environment",
  ict: "ICT & digital",
  tax: "Tax",
};

const STATE_SHORT: Record<string, string> = {
  verified: "Strong evidence threshold met",
  "partially-verified": "Evidence exists; some elements unresolved",
  "capture-pending": "Source identified, not yet captured",
  unverified: "Does not yet meet the publication threshold",
  contradicted: "Credible evidence conflicts with the claim",
};

function formatDate(iso: string, opts: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function claimStrength(sources: ReturnType<typeof policyClaimSources>): string {
  if (sources.length === 0) return "unregistered";
  const minTier = Math.min(...sources.map((s) => s.tier));
  return POLICY_SOURCE_TIERS[minTier] ?? `T${minTier}`;
}

function claimCaptureSummary(sources: ReturnType<typeof policyClaimSources>): string {
  const captured = sources.filter((s) => s.captureStatus === "captured").length;
  return `${sources.length} source${sources.length === 1 ? "" : "s"} · ${captured} captured`;
}

/** Segmented LED strip: one block per claim, coloured by verification state. */
export function ClaimStrip({
  counts,
  size = "md",
  showGaps = false,
  gaps = 0,
}: {
  counts: Record<string, number>;
  size?: "sm" | "md";
  showGaps?: boolean;
  gaps?: number;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const cls = size === "sm" ? "h-1.5" : "h-2.5";
  const segColor: Record<string, string> = {
    verified: "bg-emerald-500",
    "partially-verified": "bg-amber-500",
    "capture-pending": "bg-sky-500",
    unverified: "bg-slate-500",
    contradicted: "bg-red-500",
  };
  const order = ["verified", "partially-verified", "capture-pending", "unverified", "contradicted"];
  return (
    <div className="flex w-full items-center gap-3">
      <div className={`flex flex-1 gap-px overflow-hidden rounded-full bg-slate-800/80 ${cls}`}>
        {order.map((s) =>
          counts[s] ? <span key={s} className={segColor[s]} style={{ width: `${(counts[s] / total) * 100}%` }} /> : null
        )}
      </div>
      {showGaps && gaps > 0 && (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-500" title="Structured gaps — pillars owned but not yet researched">
          {gaps} gaps
        </span>
      )}
    </div>
  );
}

// ─── Country snapshot ──────────────────────────────────────────────────────

export function CountrySnapshot() {
  const countries = getPolicyCountries();
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {countries.map((c) => {
        const counts: Record<string, number> = {};
        for (const cl of c.claims) counts[cl.state] = (counts[cl.state] ?? 0) + 1;
        const verified = counts["verified"] ?? 0;
        const partial = counts["partially-verified"] ?? 0;
        const coveragePct = Math.round((verified / Math.max(c.claims.length, 1)) * 100);
        const gapPillars = (c.pillarGaps ?? []).map((g) => POLICY_PILLARS[g.pillar]?.label ?? g.pillar);
        return (
          <div key={c.key} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-white">{c.name}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">[{c.iso}]</span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {c.claims.length} claims · {c.directoryFacilities} facilities · {formatDate(c.investigatedAt, { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <div className="mt-3">
              <ClaimStrip counts={counts} size="sm" showGaps gaps={c.pillarGaps?.length ?? 0} />
            </div>
            <p className="mt-2 font-mono text-[11px]">
              <span className="text-emerald-400">{verified} verified</span>
              <span className="text-slate-600"> · </span>
              <span className="text-amber-400">{partial} partial</span>
              <span className="text-slate-600"> · </span>
              <span className="text-slate-400">{coveragePct}% coverage</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              <span className="text-slate-500">Regulators: </span>
              {Object.values(c.regulators).slice(0, 3).join(" · ")}
            </p>
            {gapPillars.length > 0 && (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                <span className="text-slate-500">Open: </span>
                {gapPillars.slice(0, 3).join(" · ")}
              </p>
            )}
            <a
              href={`#room-${c.key}`}
              className="mt-4 inline-flex items-center gap-1 pt-1 text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Open control room <ChevronRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        );
      })}
    </div>
  );
}

// ─── Open research queue ───────────────────────────────────────────────────

export function ResearchQueue() {
  const countries = getPolicyCountries();
  type Row = {
    key: string;
    country: string;
    countryName: string;
    gap: PillarGap;
    priority: "high" | "medium";
  };
  const rows: Row[] = [];
  for (const c of countries) {
    const pillarClaimCountries = new Map<string, Set<string>>();
    for (const other of countries) {
      for (const cl of other.claims) {
        const set = pillarClaimCountries.get(cl.pillar) ?? new Set<string>();
        set.add(other.key);
        pillarClaimCountries.set(cl.pillar, set);
      }
    }
    for (const gap of c.pillarGaps ?? []) {
      const others = pillarClaimCountries.get(gap.pillar) ?? new Set<string>();
      // Derived priority — not editorial: High = the pillar is already
      // evidenced in two or more peer countries, so this hole breaks
      // comparability. Medium = the pillar is still open region-wide.
      const priority: "high" | "medium" = others.size >= 2 ? "high" : "medium";
      rows.push({ key: `${c.key}-${gap.pillar}`, country: c.key, countryName: c.name, gap, priority });
    }
  }
  rows.sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "high" ? -1 : 1));

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
      <ul className="divide-y divide-slate-800/70">
        {rows.map((r) => (
          <li key={r.key}>
            <details className="group">
              <summary className="grid cursor-pointer list-none grid-cols-1 gap-1.5 px-4 py-3 transition-colors hover:bg-slate-800/40 sm:grid-cols-[100px_100px_210px_1fr] sm:items-center sm:gap-3 [&::-webkit-details-marker]:hidden">
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                    r.priority === "high"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                      : "border-sky-500/30 bg-sky-500/10 text-sky-300"
                  }`}
                >
                  {r.priority}
                </span>
                <span className="text-xs font-medium text-slate-300">{r.countryName}</span>
                <span className="text-xs text-slate-400">{POLICY_PILLARS[r.gap.pillar]?.label ?? r.gap.pillar}</span>
                <span className="min-w-0 text-xs leading-relaxed text-slate-400 sm:truncate">
                  <span className="text-slate-600">next action · </span>
                  {r.gap.upgradePath}
                </span>
              </summary>
              <div className="border-t border-slate-800/60 bg-slate-950/40 px-4 py-3">
                <p className="text-xs leading-relaxed text-slate-300">{r.gap.gap}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Expected sources: {r.gap.expectedSources.join("; ")}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Country control rooms ─────────────────────────────────────────────────

function EvidenceRecord({ claim }: { claim: PolicyClaim }) {
  const cfg = POLICY_STATES[claim.state as keyof typeof POLICY_STATES];
  const sources = policyClaimSources(claim);
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {cfg && (
          <span
            title={STATE_SHORT[claim.state] ?? cfg.blurb}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.chip}`}
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
        Evidence strength: {claimStrength(sources)} · {claimCaptureSummary(sources)}
      </p>
      {sources.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-sky-400 transition-colors hover:text-sky-300 [&::-webkit-details-marker]:hidden">
            Evidence trail · {sources.length} source{sources.length === 1 ? "" : "s"} ▾
          </summary>
          <ol className="mt-2 space-y-2 border-t border-slate-800 pt-2">
            {sources.map((s, i) => (
              <li key={s.url + s.label} className="text-xs leading-relaxed text-slate-400">
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
                  {POLICY_SOURCE_TIERS[s.tier] ?? `T${s.tier}`} · {POLICY_CAPTURE_LABELS[s.captureStatus] ?? s.captureStatus}
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

function GapCard({ gap }: { gap: PillarGap }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Structured gap — not a finding</p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{gap.gap}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">Expected sources: {gap.expectedSources.join("; ")}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">Upgrade path: {gap.upgradePath}</p>
    </div>
  );
}

export function ControlRooms() {
  const countries = getPolicyCountries();
  return (
    <div className="space-y-3">
      {countries.map((c) => {
        const byPillar = new Map<string, PolicyClaim[]>();
        for (const cl of c.claims) byPillar.set(cl.pillar, [...(byPillar.get(cl.pillar) ?? []), cl]);
        const counts: Record<string, number> = {};
        for (const cl of c.claims) counts[cl.state] = (counts[cl.state] ?? 0) + 1;
        const verified = counts["verified"] ?? 0;
        const coveragePct = Math.round((verified / Math.max(c.claims.length, 1)) * 100);
        const gapPillars = (c.pillarGaps ?? []).map((g) => POLICY_PILLARS[g.pillar]?.label ?? g.pillar);
        return (
          <details key={c.key} id={`room-${c.key}`} className="group scroll-mt-24 rounded-xl border border-slate-800 bg-slate-900/30">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 p-4 transition-colors hover:bg-slate-800/40 [&::-webkit-details-marker]:hidden">
              <span className="text-lg font-semibold text-white">{c.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">[{c.iso}]</span>
              <span className="font-mono text-[11px] text-slate-500">
                {c.claims.length} claims · {verified} verified · {(c.pillarGaps?.length ?? 0)} gaps · {coveragePct}% coverage
              </span>
              <span className="ml-auto flex items-center gap-2">
                <span className="hidden w-40 sm:block">
                  <ClaimStrip counts={counts} size="sm" />
                </span>
                <ChevronRight className="size-4 text-slate-500 transition-transform group-open:rotate-90" aria-hidden="true" />
              </span>
            </summary>
            <div className="border-t border-slate-800 p-4 sm:p-5">
              <RoomBody c={c} byPillar={byPillar} counts={counts} coveragePct={coveragePct} gapPillars={gapPillars} />
            </div>
          </details>
        );
      })}
    </div>
  );
}

function RoomBody({
  c,
  byPillar,
  counts,
  coveragePct,
  gapPillars,
}: {
  c: { key: string } & PolicyCountry;
  byPillar: Map<string, PolicyClaim[]>;
  counts: Record<string, number>;
  coveragePct: number;
  gapPillars: string[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Left rail: country summary */}
      <div className="space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Evidence health</p>
          <p className="mt-1.5 font-mono text-2xl font-bold text-white">{coveragePct}%</p>
          <div className="mt-2">
            <ClaimStrip counts={counts} size="sm" showGaps gaps={c.pillarGaps?.length ?? 0} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Investigated {formatDate(c.investigatedAt, { day: "numeric", month: "long", year: "numeric" })} ·{" "}
            {c.directoryFacilities} facilities in the directory
            {c.facilitiesNote ? ` · ${c.facilitiesNote}` : ""}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Regulator map</p>
          <dl className="mt-2 space-y-1.5">
            {Object.entries(c.regulators).map(([domain, name]) => (
              <div key={domain} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {DOMAIN_LABELS[domain] ?? domain}
                </dt>
                <dd className="text-slate-300">{name}</dd>
              </div>
            ))}
          </dl>
        </div>
        {gapPillars.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Top unresolved areas</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-slate-400">
              {gapPillars.slice(0, 4).map((label, i) => (
                <li key={i}>{label}</li>
              ))}
            </ol>
          </div>
        )}
        {c.investigationNote && (
          <p className="border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-500">{c.investigationNote}</p>
        )}
      </div>

      {/* Right: pillar-grouped evidence records */}
      <div className="min-w-0 space-y-6">
        {[...byPillar.entries()].map(([pid, claims]) => {
          const gap = c.pillarGaps?.find((g) => g.pillar === pid);
          return (
            <div key={pid}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                {POLICY_PILLARS[pid]?.label ?? pid}
                <span className="ml-2 text-slate-600">{claims.length} claim{claims.length === 1 ? "" : "s"}</span>
              </h3>
              <ul className="mt-2 space-y-3">
                {claims.map((cl) => (
                  <EvidenceRecord key={cl.id} claim={cl} />
                ))}
              </ul>
              {gap && (
                <div className="mt-3">
                  <GapCard gap={gap} />
                </div>
              )}
            </div>
          );
        })}
        {/* Gaps for pillars with no claims at all */}
        {(c.pillarGaps ?? [])
          .filter((g) => !byPillar.has(g.pillar))
          .map((g) => (
            <div key={`gap-${g.pillar}`}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">
                {POLICY_PILLARS[g.pillar]?.label ?? g.pillar}
                <span className="ml-2 text-slate-600">research gap</span>
              </h3>
              <div className="mt-2">
                <GapCard gap={g} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export { formatDate };
