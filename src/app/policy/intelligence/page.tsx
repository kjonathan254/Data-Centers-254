import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  POLICY_PILLARS,
  POLICY_STATES,
  POLICY_SOURCE_TIERS,
  POLICY_CAPTURE_LABELS,
} from "@/lib/policy/config";
import {
  getPolicyDataset,
  getPolicyCountries,
  getPolicyStats,
  getPillarMatrix,
  policyClaimSources,
  type PolicyClaim,
  type PolicySource,
} from "@/lib/policy";

export const metadata: Metadata = {
  title: "Policy Intelligence — East Africa data-centre regulation, claim by claim",
  description:
    "56 audited policy claims across Uganda, Rwanda, Tanzania and Kenya with full evidence chains: licensing, data protection, localisation, tax and energy. Not a blog — an evidence layer with a 5-state publication vocabulary.",
  alternates: { canonical: "/policy/intelligence" },
  openGraph: {
    title: "Policy Intelligence — East Africa data-centre regulation, claim by claim",
    description:
      "What policy and regulatory frameworks govern data-centre development across Uganda, Rwanda and Tanzania, and where are the material differences? Every claim carries its source, tier and capture state.",
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

const COUNTRY_LABELS: Record<string, string> = {
  uganda: "Uganda",
  rwanda: "Rwanda",
  tanzania: "Tanzania",
  kenya: "Kenya",
};

const REGULATOR_DOMAIN_LABELS: Record<string, string> = {
  communications: "Communications",
  dataProtection: "Data protection",
  investment: "Investment & zones",
  energy: "Energy",
  environment: "Environment",
};

function StateChip({ state, count }: { state: string; count: number }) {
  const cfg = POLICY_STATES[state as keyof typeof POLICY_STATES];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cfg.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {count} {count === 1 ? cfg.label : `${cfg.label}`}
    </span>
  );
}

function ClaimCard({ claim }: { claim: PolicyClaim }) {
  const cfg = POLICY_STATES[claim.state];
  const sources = policyClaimSources(claim);
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cfg.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
          {claim.id}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">{claim.statement}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{claim.note}</p>
      <ul className="mt-3 space-y-1.5 border-t border-slate-800 pt-3">
        {sources.map((s) => (
          <SourceLine key={s.url + s.label} source={s} />
        ))}
      </ul>
    </li>
  );
}

function SourceLine({ source }: { source: PolicySource }) {
  return (
    <li className="text-xs leading-relaxed text-slate-400">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300"
      >
        {source.publisher}
      </a>
      {" — "}
      <span className="text-slate-500">{source.label}</span>
      <span className="ml-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {POLICY_SOURCE_TIERS[source.tier] ?? `T${source.tier}`} ·{" "}
        {POLICY_CAPTURE_LABELS[source.captureStatus] ?? source.captureStatus}
      </span>
    </li>
  );
}

export default function PolicyIntelligencePage() {
  const ds = getPolicyDataset();
  const stats = getPolicyStats();
  const countries = getPolicyCountries();
  const matrix = getPillarMatrix();
  const pillarIds = ds.pillars.filter((p) => p in POLICY_PILLARS);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Policy Intelligence · Evidence Engine v0.2-policy
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Who governs the region&rsquo;s data centres — claim by claim
          </h1>
          <blockquote className="mt-4 max-w-3xl border-l-2 border-slate-700 pl-4 text-base leading-relaxed text-slate-300">
            {ds.researchQuestion}
          </blockquote>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
            This is not a blog category. It is the auditable evidence layer behind our policy
            coverage: every statement below is a dataset claim with named sources, source tiers and
            capture states, published under a five-state vocabulary. Where a pillar has not been
            researched yet it appears as a structured gap — never dressed up as a finding. The
            interpretation lives in our{" "}
            <Link href="/policy" className="underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300">
              policy explainers
            </Link>
            ; the claims live here.
          </p>

          {/* ── Stats band ───────────────────────────────────────────── */}
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { k: "Countries researched", v: stats.countries },
              { k: "Audited claims", v: stats.claims },
              { k: "Registered sources", v: stats.sources },
              { k: "Verified", v: stats.byState["verified"] ?? 0 },
              { k: "Partially verified", v: stats.byState["partially-verified"] ?? 0 },
              { k: "Structured gaps", v: stats.gaps },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <dd className="text-2xl font-bold text-white">{s.v}</dd>
                <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-500">{s.k}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            Editorial gate: {stats.humanGateStatus} · reviewed {stats.reviewedAt}. AI proposes,
            the editor disposes; nothing publishes outside this gate.
          </p>

          {/* ── 5-state legend ───────────────────────────────────────── */}
          <section className="mt-10">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">
              How to read a state
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(POLICY_STATES).map(([key, cfg]) => (
                <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cfg.chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{cfg.blurb}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Pillar × country matrix ──────────────────────────────── */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white">
              The matrix: 10 pillars × {countries.length} countries
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
              Cells count claims by state. A &ldquo;gap&rdquo; cell means the pillar is owned but
              not yet researched — expected sources and upgrade paths are listed in the country
              dossier below. Kenya&rsquo;s dossier is anchored on captured regulator operations
              (registers, procedures, licensing platforms); its statute-text upgrades are pending
              the Kenya Law full-text captures. The interpretation layer lives in our{" "}
              <Link href="/policy" className="underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300">
                policy explainers
              </Link>
              .
            </p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="px-4 py-3 font-medium text-slate-400">Pillar</th>
                    {countries.map((c) => (
                      <th key={c.key} className="px-4 py-3 font-medium text-slate-300">
                        {COUNTRY_LABELS[c.key] ?? c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pillarIds.map((pid) => (
                    <tr key={pid} className="border-b border-slate-800/60 last:border-0">
                      <td className="px-4 py-3 align-top">
                        <span className="font-medium text-slate-200">
                          {POLICY_PILLARS[pid].label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {POLICY_PILLARS[pid].blurb}
                        </span>
                      </td>
                      {countries.map((c) => {
                        const cell = matrix[c.key]?.[pid];
                        return (
                          <td key={c.key} className="px-4 py-3 align-top">
                            {cell ? (
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(cell.stateCounts).map(([st, n]) => (
                                  <StateChip key={st} state={st} count={n ?? 0} />
                                ))}
                                {cell.gap && (
                                  <span
                                    title={cell.gap.gap}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-600 px-2 py-0.5 text-[11px] text-slate-400"
                                  >
                                    gap · upgrade path recorded
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Country dossiers ─────────────────────────────────────── */}
          {countries.map((c) => {
            const byPillar = new Map<string, PolicyClaim[]>();
            for (const cl of c.claims) {
              byPillar.set(cl.pillar, [...(byPillar.get(cl.pillar) ?? []), cl]);
            }
            return (
              <section key={c.key} className="mt-14 border-t border-slate-800 pt-10">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {c.name}{" "}
                    <span className="font-mono text-sm font-normal text-slate-500">
                      [{c.iso}]
                    </span>
                  </h2>
                  <span className="text-xs text-slate-500">
                    investigated {c.investigatedAt} · {c.claims.length} claims ·{" "}
                    {c.directoryFacilities} facilities in directory
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Regulators in scope:{" "}
                  {Object.entries(c.regulators)
                    .map(([domain, name]) => `${REGULATOR_DOMAIN_LABELS[domain] ?? domain}: ${name}`)
                    .join(" · ")}
                </p>
                {c.facilitiesNote && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.facilitiesNote}</p>
                )}

                <div className="mt-6 space-y-8">
                  {[...byPillar.entries()].map(([pid, claims]) => {
                    const gap = c.pillarGaps?.find((g) => g.pillar === pid);
                    return (
                      <div key={pid}>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">
                          {POLICY_PILLARS[pid]?.label ?? pid}
                        </h3>
                        <ul className="mt-2 space-y-3">
                          {claims.map((cl) => (
                            <ClaimCard key={cl.id} claim={cl} />
                          ))}
                        </ul>
                        {gap && (
                          <div className="mt-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/20 p-4">
                            <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                              Structured gap — not a finding
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                              {gap.gap}
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                              Expected sources: {gap.expectedSources.join("; ")}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                              Upgrade path: {gap.upgradePath}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* ── Methodology footer ───────────────────────────────────── */}
          <section className="mt-14 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-semibold text-slate-200">Method & governance</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{ds.method}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{ds.gapSchema.rule}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              States derive from source tiers and capture status, then pass the editorial gate
              described above. Our{" "}
              <Link href="/methodology" className="underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300">
                methodology
              </Link>{" "}
              and{" "}
              <Link href="/editorial-policy" className="underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300">
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
