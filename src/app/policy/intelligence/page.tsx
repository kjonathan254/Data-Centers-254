import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { POLICY_PILLARS, POLICY_SOURCE_TIERS, POLICY_CAPTURE_LABELS, SINCE_LAST_REVIEW, CONTROL_ROOM_SURFACES } from "@/lib/policy/config";
import {
  getPolicyDataset,
  getPolicyCountries,
  getPolicyStats,
  getPillarMatrix,
  getPolicyChangelog,
  countLabel,
  formatPolicyDate,
  type PolicySource,
} from "@/lib/policy";
import ControlRoomDashboard from "./control-room";
import { ConsoleRail, ConsoleHeader } from "./console-chrome";
import type { OpsClaim, OpsCountry, OpsData, OpsGap, OpsSource } from "./dashboard-types";

// Metadata is computed from the live dataset (never hardcoded stats) and kept
// inside search-engine limits: title ≤70 chars incl. the "%s | DC254" root
// template; description 25–160 chars (Bing/Google truncate beyond that).
export function generateMetadata(): Metadata {
  const stats = getPolicyStats();
  const verified = stats.byState["verified"] ?? 0;
  const title = "Policy Intelligence — East Africa Data Centre Regulation"; // 57 + 8 template = 65
  const description = `${verified}/${stats.claims} audited claims on East African data-centre policy: licensing, data protection, tax and energy. Every claim sourced, tiered and capture-stamped.`;
  return {
    title,
    description,
    alternates: { canonical: "/policy/intelligence" },
    openGraph: {
      title,
      description,
      siteName: "Data Centre 254",
      type: "website",
      locale: "en_KE",
      images: [
        {
          url: "/images/dc-policy-regulation.webp",
          width: 1200,
          height: 675,
          alt: "Policy Intelligence on Data Centre 254",
        },
      ],
    },
  };
}

// ─── Serializable ops payload (control-room client input) ──────────────────

function buildOpsData(): OpsData {
  const ds = getPolicyDataset();
  const stats = getPolicyStats();
  const countries = getPolicyCountries();
  const matrix = getPillarMatrix();
  const pillarIds = ds.pillars.filter((p) => p in POLICY_PILLARS);

  const opsCountries: OpsCountry[] = countries.map((c) => {
    const verified = c.claims.filter((cl) => cl.state === "verified").length;
    const partial = c.claims.filter((cl) => cl.state === "partially-verified").length;
    return {
      key: c.key,
      name: c.name,
      iso: c.iso,
      facilities: c.directoryFacilities,
      claims: c.claims.length,
      verified,
      partial,
      coveragePct: Math.round((verified / Math.max(c.claims.length, 1)) * 100),
      investigatedLong: formatPolicyDate(c.investigatedAt),
      regulators: Object.entries(c.regulators).map(([domain, name]) => ({ domain, name })),
      facilitiesNote: c.facilitiesNote,
      investigationNote: c.investigationNote,
    };
  });
  // Console order (mockup): ascending coverage — the story runs from
  // "needs attention" to "most established", and every panel (KPI cards,
  // matrix columns, room switcher) shares one consistent jurisdiction order.
  opsCountries.sort((a, b) => a.coveragePct - b.coveragePct || a.name.localeCompare(b.name));

  const opsClaims: OpsClaim[] = countries.flatMap((c) =>
    c.claims.map((cl) => {
      const sources: OpsSource[] = cl.sourceIds
        .map((id) => ({ id, ...(ds.sources[id] ?? ({} as Partial<PolicySource>)) }))
        .filter((s) => Boolean((s as OpsSource).url))
        .map((s) => {
          const src = s as OpsSource & PolicySource;
          return {
            id: s.id,
            label: src.label,
            url: src.url,
            tier: src.tier,
            publisher: src.publisher,
            captureStatus: src.captureStatus,
            sourceType: src.sourceType,
            excerpt: src.excerpt ?? "",
          };
        });
      const minTier = sources.length ? Math.min(...sources.map((s) => s.tier)) : null;
      const captured = sources.filter((s) => s.captureStatus === "captured").length;
      return {
        id: cl.id,
        country: c.key,
        countryName: c.name,
        pillar: cl.pillar,
        statement: cl.statement,
        note: cl.note,
        state: cl.state,
        strength: minTier ? (POLICY_SOURCE_TIERS[minTier] ?? `T${minTier}`) : "unregistered",
        captureSummary: `${sources.length} source${sources.length === 1 ? "" : "s"} · ${captured} captured`,
        sources,
      };
    })
  );

  const claimCountries = new Map<string, Set<string>>();
  for (const cl of opsClaims) {
    const set = claimCountries.get(cl.pillar) ?? new Set<string>();
    set.add(cl.country);
    claimCountries.set(cl.pillar, set);
  }

  const opsGaps: OpsGap[] = countries.flatMap((c) =>
    (c.pillarGaps ?? []).map((gap) => ({
      country: c.key,
      countryName: c.name,
      pillar: gap.pillar,
      gap: gap.gap,
      expectedSources: gap.expectedSources,
      upgradePath: gap.upgradePath,
      priority: ((claimCountries.get(gap.pillar)?.size ?? 0) >= 2 ? "high" : "medium") as OpsGap["priority"],
    }))
  );

  const opsCells = countries.flatMap((c) =>
    pillarIds.flatMap((pid) => {
      const cell = matrix[c.key]?.[pid];
      if (!cell) return [];
      return [
        {
          country: c.key,
          pillar: pid,
          states: cell.stateCounts,
          total: cell.total,
          gap: Boolean(cell.gap),
        },
      ];
    })
  );

  const verified = stats.byState["verified"] ?? 0;

  // Claim-level changelog: sources resolve from the registry by id so the
  // changelog file never duplicates registry data (edit once, everywhere).
  const toOpsSource = (id: string, s: PolicySource): OpsSource => ({
    id,
    label: s.label,
    url: s.url,
    tier: s.tier,
    publisher: s.publisher,
    captureStatus: s.captureStatus,
    sourceType: s.sourceType,
    excerpt: s.excerpt ?? "",
  });
  const changelog = getPolicyChangelog().map((e) => ({
    version: e.version,
    previousVersion: e.previousVersion,
    date: e.date,
    summary: e.summary,
    editorialDecisionSummary: e.editorialDecisionSummary,
    claims: e.claims.map((cl) => ({
      id: cl.id,
      country: cl.country,
      pillar: cl.pillar,
      action: cl.action,
      previousState: cl.previousState,
      state: cl.state as string,
      previousVersionNote: cl.previousVersionNote,
      statement: cl.statement,
      editorialDecision: cl.editorialDecision,
      sources: cl.sourceIds
        .map((id) => (ds.sources[id] ? toOpsSource(id, ds.sources[id]) : null))
        .filter((s): s is OpsSource => Boolean(s)),
    })),
    sourcesAdded: e.sourcesAdded
      .map((id) => (ds.sources[id] ? toOpsSource(id, ds.sources[id]) : null))
      .filter((s): s is OpsSource => Boolean(s)),
  }));

  // Full source registry for the source-quality panel — sorted tier asc
  // (the T1 backbone first), then publisher. Computed here so every number
  // on the panel is derived from the dataset, never hardcoded.
  const opsSources: OpsSource[] = Object.entries(ds.sources)
    .map(([id, s]) => ({
      id,
      label: s.label,
      url: s.url,
      tier: s.tier,
      publisher: s.publisher,
      captureStatus: s.captureStatus,
      sourceType: s.sourceType,
      excerpt: s.excerpt ?? "",
    }))
    .sort((a, b) => a.tier - b.tier || a.publisher.localeCompare(b.publisher) || a.id.localeCompare(b.id));

  return {
    countries: opsCountries,
    pillars: pillarIds.map((id) => ({ id, label: POLICY_PILLARS[id].label, blurb: POLICY_PILLARS[id].blurb })),
    claims: opsClaims,
    gaps: opsGaps,
    cells: opsCells,
    sources: opsSources,
    sinceReview: { ...SINCE_LAST_REVIEW },
    changelog,
    meta: {
      gateShort: stats.humanGateStatus.split(" (")[0],
      gateFull: stats.humanGateStatus,
      reviewedLong: formatPolicyDate(stats.reviewedAt),
      schemaVersion: ds.schemaVersion,
      datasetVersion: ds.datasetVersion,
      claims: stats.claims,
      sources: stats.sources,
      gaps: stats.gaps,
      verified,
      partial: stats.byState["partially-verified"] ?? 0,
      coveragePct: Math.round((verified / Math.max(stats.claims, 1)) * 100),
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PolicyIntelligencePage() {
  const ds = getPolicyDataset();
  const stats = getPolicyStats();
  const ops = buildOpsData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className={`flex-1 ${CONTROL_ROOM_SURFACES.canvas}`}
        style={{
          backgroundImage:
            "radial-gradient(1100px 480px at 50% -120px, rgba(34,211,238,0.08), transparent 62%), linear-gradient(to right, rgba(135,180,220,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(135,180,220,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      >
        {/* Console frame: fixed icon rail (xl+) + sticky console header */}
        <ConsoleRail />
        <div className="xl:pl-[76px]">
          <div className="mx-auto w-full max-w-[1440px] px-3 pb-10 pt-[72px] sm:px-5 lg:pb-14">
            <ConsoleHeader datasetVersion={ops.meta.datasetVersion} reviewedLong={ops.meta.reviewedLong} />

            {/* ── Lede: why policy intelligence matters (editor review 2026-09-24) ── */}
            <div className="mb-5 max-w-3xl">
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Data-centre investment increasingly depends on understanding the rules governing
                licences, data, power, taxation, construction and cross-border transfers. DC254
                tracks the underlying regulatory evidence across East Africa.
              </p>
            </div>

            {/* ── The control-room canvas ────────────────────────────── */}
            <ControlRoomDashboard data={ops} />

            {/* ── Method & governance ────────────────────────────────── */}
            <section className="mt-12 scroll-mt-32" id="method" aria-label="Method and governance">
              <h2 className="text-2xl font-bold text-white">Method &amp; governance</h2>

              {/* Publication status (governance language, kept prominent) */}
              <div className="mt-4 rounded-xl border border-lime-500/25 bg-lime-500/[0.06] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="relative flex size-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-lime-400" />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-widest text-lime-300 sm:text-sm">
                    Publication status: {ops.meta.gateShort}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  All {stats.countries} country pipelines approved for publication. Reviewed{" "}
                  {ops.meta.reviewedLong} · AI proposes, the editor approves. <strong className="font-semibold text-slate-100">Editorial approval is a
                  publication decision — it is not a statement that every claim is fully
                  verified.</strong>
                </p>
              </div>

              <blockquote className="mt-4 max-w-3xl border-l-2 border-slate-700 pl-4 text-sm leading-relaxed text-slate-400">
                {ds.researchQuestion}
              </blockquote>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className={`rounded-xl border p-5 ${CONTROL_ROOM_SURFACES.border} ${CONTROL_ROOM_SURFACES.card}`}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">How claims are built</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{ds.method}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{ds.gapSchema.rule}</p>
                </div>
                <div className={`rounded-xl border p-5 ${CONTROL_ROOM_SURFACES.border} ${CONTROL_ROOM_SURFACES.card}`}>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Source tiers &amp; capture states</h3>
                  <dl className="mt-2 space-y-1.5">
                    {Object.entries(POLICY_SOURCE_TIERS).map(([tier, label]) => (
                      <div key={tier} className="flex gap-2 text-sm">
                        <dt className="w-8 shrink-0 font-mono text-xs uppercase leading-relaxed text-slate-500">T{tier}</dt>
                        <dd className="text-slate-400">{label.replace(/^T\d+ · /, "")}</dd>
                      </div>
                    ))}
                  </dl>
                  <dl className="mt-3 space-y-1 border-t border-[rgba(135,180,220,0.10)] pt-3">
                    {Object.entries(POLICY_CAPTURE_LABELS).map(([key, label]) => (
                      <div key={key} className="flex gap-2 text-xs">
                        <dt className="w-28 shrink-0 font-mono text-[10px] uppercase leading-relaxed text-slate-500">{key}</dt>
                        <dd className="text-slate-500">{label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
                This is not a blog category. It is the auditable evidence layer behind our policy
                coverage: every statement above is a dataset claim with named sources, tiers and
                capture states, published under a five-state vocabulary. Where a pillar has not been
                researched yet it appears as a structured gap. The interpretation lives in our{" "}
                <Link href="/policy" className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-400">
                  policy explainers
                </Link>
                ; the claims live here. Full editorial gate: {ops.meta.gateFull}. Our{" "}
                <Link href="/methodology" className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-400">
                  methodology
                </Link>{" "}
                and{" "}
                <Link href="/editorial-policy" className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-400">
                  editorial policy
                </Link>{" "}
                govern this page. This is regulatory intelligence, not legal advice.
              </p>
            </section>

            <p className="mt-10 border-t border-[rgba(135,180,220,0.10)] pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              {ops.meta.datasetVersion} · {countLabel(ops.meta.claims, "claim")} · {countLabel(ops.meta.sources, "source")} ·{" "}
              {ops.meta.gaps} structured gaps ·{" "}
              <a
                href="/policy/intelligence/dataset"
                className="underline decoration-slate-700 underline-offset-2 transition-colors hover:text-cyan-400 hover:decoration-cyan-500/50"
              >
                download the dataset (JSON)
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
