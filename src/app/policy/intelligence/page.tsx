import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { POLICY_PILLARS, POLICY_STATES, POLICY_SOURCE_TIERS, POLICY_CAPTURE_LABELS } from "@/lib/policy/config";
import {
  getPolicyDataset,
  getPolicyCountries,
  getPolicyStats,
  getPillarMatrix,
  type PolicySource,
} from "@/lib/policy";
import OpsConsole, { type OpsClaim, type OpsCountry, type OpsData, type OpsGap, type OpsSource } from "./ops-console";
import { ClaimStrip, CountrySnapshot, ControlRooms, ResearchQueue, formatDate } from "./policy-sections";

export const metadata: Metadata = {
  title: "Policy Intelligence — East Africa data-centre regulation, claim by claim",
  description:
    "56 audited policy claims across Uganda, Rwanda, Tanzania and Kenya with full evidence chains: licensing, data protection, localisation, tax and energy. Not a blog — an evidence layer with a 5-state publication vocabulary.",
  alternates: { canonical: "/policy/intelligence" },
  openGraph: {
    title: "Policy Intelligence — East Africa data-centre regulation, claim by claim",
    description:
      "What policy and regulatory frameworks govern data-centre development across Uganda, Rwanda, Tanzania and Kenya, and where are the material differences? Every claim carries its source, tier and capture state.",
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

// ─── Serializable ops payload (client console input) ───────────────────────

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
      investigatedShort: formatDate(c.investigatedAt, { day: "2-digit", month: "short", year: "numeric" }),
      regulators: Object.entries(c.regulators).map(([domain, name]) => ({ domain, name })),
    };
  });

  const countryName = new Map(opsCountries.map((c) => [c.key, c.name]));

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
  return {
    countries: opsCountries,
    pillars: pillarIds.map((id) => ({ id, label: POLICY_PILLARS[id].label, blurb: POLICY_PILLARS[id].blurb })),
    claims: opsClaims,
    gaps: opsGaps,
    cells: opsCells,
    meta: {
      gateShort: stats.humanGateStatus.split(" (")[0],
      gateFull: stats.humanGateStatus,
      reviewedLong: formatDate(stats.reviewedAt, { day: "numeric", month: "long", year: "numeric" }),
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

// ─── Evidence-states legend ────────────────────────────────────────────────

const STATE_SHORT: Record<string, string> = {
  verified: "Strong evidence threshold met",
  "partially-verified": "Evidence exists; some elements unresolved",
  "capture-pending": "Source identified, not yet captured",
  unverified: "Does not yet meet the publication threshold",
  contradicted: "Credible evidence conflicts with the claim",
};

function Legend() {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(POLICY_STATES).map(([key, cfg]) => (
        <div
          key={key}
          title={cfg.blurb}
          className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5"
        >
          <span className={`mt-1 size-2 shrink-0 rounded-full ${cfg.dot}`} aria-hidden="true" />
          <span className="min-w-0">
            <span className="text-sm font-medium text-slate-200">{cfg.label}</span>
            <span className="block text-xs leading-relaxed text-slate-500">{STATE_SHORT[key] ?? cfg.blurb}</span>
          </span>
        </div>
      ))}
      <div
        title="A gap is the condition of research coverage, not of a claim: the pillar is owned by the pipeline but has no researched statements yet."
        className="flex items-start gap-2.5 rounded-lg border border-dashed border-slate-600 bg-transparent px-3 py-2.5"
      >
        <span className="mt-1 size-2 shrink-0 rounded-full border border-dashed border-slate-500" aria-hidden="true" />
        <span className="min-w-0">
          <span className="text-sm font-medium text-slate-300">Gap</span>
          <span className="block text-xs leading-relaxed text-slate-500">Pillar owned but not yet researched</span>
        </span>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PolicyIntelligencePage() {
  const ds = getPolicyDataset();
  const stats = getPolicyStats();
  const ops = buildOpsData();
  const pillarCount = ops.pillars.length;

  const healthCards = [
    { v: String(stats.countries), k: "Countries", meaning: "East African markets covered" },
    { v: String(stats.claims), k: "Audited claims", meaning: "Individual regulatory statements" },
    { v: String(stats.sources), k: "Registered sources", meaning: "Sources in the evidence base" },
    { v: formatDate(stats.reviewedAt, { day: "2-digit", month: "short", year: "numeric" }), k: "Last review", meaning: "Most recent editorial review" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          {/* ── Page header ─────────────────────────────────────────── */}
          <header>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Policy Intelligence · East Africa regulatory evidence engine ·{" "}
              <span className="text-slate-400">
                v{ops.meta.schemaVersion} · dataset {ops.meta.datasetVersion}
              </span>
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-[40px] sm:leading-[1.15]">
              Who governs the region&rsquo;s data centres?
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Compare the policies, regulators and evidence behind data-centre development in Kenya,
              Uganda, Rwanda and Tanzania.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              <span>Last reviewed: {ops.meta.reviewedLong}</span>
              <span aria-hidden="true" className="hidden sm:inline text-slate-700">|</span>
              <span>Editorial gate: complete</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#matrix"
                className="rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Explore the matrix
              </a>
              <a
                href="#method"
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900/60"
              >
                Read the methodology
              </a>
            </div>
          </header>

          {/* ── Publication status bar ──────────────────────────────── */}
          <section
            aria-label="Publication status"
            className="mt-10 rounded-xl border border-lime-500/25 bg-lime-500/[0.06] p-4 sm:p-5"
          >
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
              {ops.meta.reviewedLong} · AI proposes, the editor approves. Editorial approval is a
              publication decision — it is not a statement that every claim is fully verified.
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              Dataset: {ops.meta.schemaVersion} · {ops.meta.claims} claims · {ops.meta.sources} sources ·{" "}
              {ops.meta.gaps} open gaps
            </p>
          </section>

          {/* ── Regional evidence health ────────────────────────────── */}
          <section className="mt-12" aria-label="Regional evidence health">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500">Regional evidence health</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-slate-300">Evidence coverage</p>
                  <p className="font-mono text-3xl font-bold text-white">{ops.meta.coveragePct}%</p>
                </div>
                <div className="mt-4">
                  <ClaimStrip counts={stats.byState} showGaps gaps={stats.gaps} />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wider">
                  <span className="text-emerald-400">{ops.meta.verified} verified</span>
                  <span className="text-slate-600"> · </span>
                  <span className="text-amber-400">{ops.meta.partial} partially verified</span>
                  <span className="text-slate-600"> · </span>
                  <span className="text-slate-400">{ops.meta.gaps} structured gaps</span>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Coverage = share of published claims whose evidence has met the verification
                  threshold. Structured gaps sit outside the claim set: they are pillars owned by
                  the pipeline but not yet researched, never dressed up as findings.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                {healthCards.map((s) => (
                  <div key={s.k} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <dd className="text-2xl font-bold text-white">{s.v}</dd>
                    <dt className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">{s.k}</dt>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{s.meaning}</p>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ── Country snapshot ────────────────────────────────────── */}
          <section className="mt-12" aria-label="Country snapshot">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500">Country snapshot</h2>
            <div className="mt-4">
              <CountrySnapshot />
            </div>
          </section>

          {/* ── Open research queue ─────────────────────────────────── */}
          <section className="mt-12 scroll-mt-20" id="queue" aria-label="Open research queue">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500">Open research queue</h2>
              <p className="text-xs text-slate-500">
                {stats.gaps} structured gaps requiring evidence capture · priority is derived, not
                editorial
              </p>
            </div>
            <div className="mt-4">
              <ResearchQueue />
            </div>
          </section>

          {/* ── Interactive policy matrix ───────────────────────────── */}
          <section className="mt-12 scroll-mt-20" id="matrix" aria-label="Policy coverage matrix">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-white">Policy coverage matrix</h2>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                {pillarCount} pillars · {stats.countries} countries · {stats.claims} audited claims
              </p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
              Every tile counts claims by verification state; dashed tags mark structured gaps.
              Select a tile to inspect the underlying claims, sources and upgrade paths.
            </p>
            <div className="mt-2">
              <OpsConsole data={ops} />
            </div>
          </section>

          {/* ── Evidence states legend ──────────────────────────────── */}
          <section className="mt-12" aria-label="Evidence states">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500">Evidence states</h2>
            <div className="mt-4">
              <Legend />
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-500">
              Evidence states describe the condition of a <span className="text-slate-400">claim</span>.
              A gap describes the condition of <span className="text-slate-400">research coverage</span> —
              it is never a claim, and it never borrows a claim&rsquo;s status. Hover any state for the
              full definition.
            </p>
          </section>

          {/* ── Country control rooms ───────────────────────────────── */}
          <section className="mt-12 scroll-mt-20" id="rooms" aria-label="Country control rooms">
            <h2 className="text-2xl font-bold text-white">Country control rooms</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
              Expand a market for its regulator map, evidence health and the full claim set — every
              claim is an evidence record with its source trail one click away.
            </p>
            <div className="mt-4">
              <ControlRooms />
            </div>
          </section>

          {/* ── Method & governance ─────────────────────────────────── */}
          <section className="mt-14 scroll-mt-20" id="method" aria-label="Method and governance">
            <h2 className="text-2xl font-bold text-white">Method &amp; governance</h2>
            <blockquote className="mt-4 max-w-3xl border-l-2 border-slate-700 pl-4 text-sm leading-relaxed text-slate-400">
              {ds.researchQuestion}
            </blockquote>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">How claims are built</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{ds.method}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{ds.gapSchema.rule}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Source tiers &amp; capture states</h3>
                <dl className="mt-2 space-y-1.5">
                  {Object.entries(POLICY_SOURCE_TIERS).map(([tier, label]) => (
                    <div key={tier} className="flex gap-2 text-sm">
                      <dt className="w-8 shrink-0 font-mono text-xs uppercase leading-relaxed text-slate-500">T{tier}</dt>
                      <dd className="text-slate-400">{label.replace(/^T\d+ · /, "")}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="mt-3 space-y-1 border-t border-slate-800 pt-3">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
