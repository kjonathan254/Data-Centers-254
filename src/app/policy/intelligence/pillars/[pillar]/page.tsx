import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CopyButton from "@/components/copy-button";
import {
  POLICY_PILLARS,
  POLICY_STATES,
  POLICY_GAP_STYLE,
  CONTROL_ROOM_SURFACES,
} from "@/lib/policy/config";
import {
  getPolicyCountries,
  getPolicyDataset,
  getPolicySource,
  countLabel,
  type PolicySource,
} from "@/lib/policy";
import { CountUp } from "../../motion";

/**
 * Per-pillar deep dives (Control Room Phase 2).
 *
 * One statically generated page per research pillar: the pillar's coverage
 * across all four markets, every claim with its evidence trail, the distinct
 * sources behind it, and the structured gaps with their upgrade paths.
 *
 * Server-rendered (crawlable), zero new dependencies, control-room palette,
 * and every number derived from the dataset at build time.
 */

const PILLAR_IDS = Object.keys(POLICY_PILLARS);

interface Params {
  pillar: string;
}

export function generateStaticParams(): Params[] {
  return PILLAR_IDS.map((pillar) => ({ pillar }));
}

export const dynamicParams = false;

// ─── Data assembly ─────────────────────────────────────────────────────────

type RegisteredSource = PolicySource & { id: string };

interface DeepClaim {
  id: string;
  country: string;
  countryName: string;
  state: string;
  statement: string;
  note: string;
  sources: RegisteredSource[];
}

interface DeepCountry {
  key: string;
  name: string;
  iso: string;
  claims: DeepClaim[];
  gap: { gap: string; expectedSources: string[]; upgradePath: string } | null;
}

function buildPillarData(pillarId: string) {
  const perCountry: DeepCountry[] = getPolicyCountries().map((c) => ({
    key: c.key,
    name: c.name,
    iso: c.iso,
    claims: c.claims
      .filter((cl) => cl.pillar === pillarId)
      .map((cl) => ({
        id: cl.id,
        country: c.key,
        countryName: c.name,
        state: cl.state,
        statement: cl.statement,
        note: cl.note,
        sources: cl.sourceIds
          .map((sid) => {
            const s = getPolicySource(sid);
            return s ? { ...s, id: sid } : null;
          })
          .filter((s): s is RegisteredSource => Boolean(s)),
      })),
    gap: (c.pillarGaps ?? []).find((g) => g.pillar === pillarId) ?? null,
  }));

  const allClaims = perCountry.flatMap((c) => c.claims);
  const byId = new Map<string, RegisteredSource>();
  for (const cl of allClaims) for (const s of cl.sources) byId.set(s.id, s);
  const sources = [...byId.values()].sort(
    (a, b) => a.tier - b.tier || a.publisher.localeCompare(b.publisher)
  );

  const verified = allClaims.filter((cl) => cl.state === "verified").length;
  const partial = allClaims.filter((cl) => cl.state === "partially-verified").length;
  return {
    perCountry,
    allClaims,
    sources,
    verified,
    partial,
    coveragePct: Math.round((verified / Math.max(allClaims.length, 1)) * 100),
    gapsCount: perCountry.filter((c) => c.gap).length,
    countriesCovered: perCountry.filter((c) => c.claims.length > 0).length,
  };
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar: id } = await params;
  const p = POLICY_PILLARS[id];
  if (!p) return {};
  const d = buildPillarData(id);
  const title = `${p.label} — Policy Intelligence`;
  const description = `${p.blurb} ${d.verified} of ${d.allClaims.length} audited claims verified across Kenya, Uganda, Rwanda and Tanzania, with ${countLabel(d.sources.length, "source")} and full evidence trails.`;
  return {
    title,
    description,
    alternates: { canonical: `/policy/intelligence/pillars/${id}` },
    openGraph: {
      title,
      description,
      siteName: "Data Centre 254",
      type: "website",
      locale: "en_KE",
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function PillarDeepDivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { pillar: pillarId } = await params;
  if (!(pillarId in POLICY_PILLARS)) notFound();
  const p = POLICY_PILLARS[pillarId];
  const d = buildPillarData(pillarId);
  const ds = getPolicyDataset();

  const idx = PILLAR_IDS.indexOf(pillarId);
  const prevId = PILLAR_IDS[(idx - 1 + PILLAR_IDS.length) % PILLAR_IDS.length];
  const nextId = PILLAR_IDS[(idx + 1) % PILLAR_IDS.length];

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
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500"
          >
            <Link
              href="/policy/intelligence"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-cyan-300"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Policy Intelligence
            </Link>
            <ChevronRight className="size-3.5 text-slate-700" aria-hidden="true" />
            <span className="text-slate-300">{p.label}</span>
          </nav>

          {/* Header */}
          <header className="mt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Policy pillar deep dive · dataset {ds.datasetVersion}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-[40px] sm:leading-[1.15]">
              {p.label}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{p.blurb}</p>

            {/* Stat chips — all derived from the dataset */}
            <dl className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
              <div className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] px-3 py-2">
                <dt className="sr-only">Coverage</dt>
                <dd className="text-white">
                  <CountUp value={d.coveragePct} />% <span className="text-slate-500">verified</span>
                </dd>
              </div>
              <div className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] px-3 py-2">
                <dt className="sr-only">Claims</dt>
                <dd className="text-white">
                  {d.allClaims.length} <span className="text-slate-500">claims</span>
                </dd>
              </div>
              <div className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] px-3 py-2">
                <dt className="sr-only">Sources</dt>
                <dd className="text-white">
                  {d.sources.length} <span className="text-slate-500">sources</span>
                </dd>
              </div>
              <div className="rounded-lg border border-[rgba(135,180,220,0.16)] bg-[#101D30] px-3 py-2">
                <dt className="sr-only">Countries covered</dt>
                <dd className="text-white">
                  {d.countriesCovered}/4 <span className="text-slate-500">markets</span>
                </dd>
              </div>
              <div className="rounded-lg border border-dashed border-violet-400/40 bg-violet-400/5 px-3 py-2">
                <dt className="sr-only">Structured gaps</dt>
                <dd className={POLICY_GAP_STYLE.text}>
                  {d.gapsCount} <span className="text-slate-500">gaps</span>
                </dd>
              </div>
            </dl>
          </header>

          {/* Coverage across the four markets */}
          <section className="mt-10" aria-label={`${p.label} coverage by country`}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Coverage across the four markets
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {d.perCountry.map((c) => {
                const total = c.claims.length;
                const v = c.claims.filter((cl) => cl.state === "verified").length;
                const pv = c.claims.filter((cl) => cl.state === "partially-verified").length;
                return (
                  <div
                    key={c.key}
                    className={`rounded-xl border p-4 ${
                      total > 0 && v === total
                        ? "border-emerald-500/25 bg-emerald-500/[0.05]"
                        : total > 0
                          ? "border-amber-500/20 bg-amber-500/[0.04]"
                          : `border-dashed bg-violet-400/[0.04] ${POLICY_GAP_STYLE.chip}`
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">
                      {c.name} <span className="ml-1 font-mono text-[10px] text-slate-500">{c.iso}</span>
                    </p>
                    {total > 0 ? (
                      <>
                        <p className="mt-1 font-mono text-2xl font-bold text-white">
                          {Math.round((v / total) * 100)}%
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                          {v} verified · {pv} partial · {total - v - pv} other
                        </p>
                        <div
                          className="mt-2 flex h-1.5 w-full gap-px overflow-hidden rounded-full bg-[#0B1627]"
                          aria-hidden="true"
                        >
                          {(["verified", "partially-verified"] as const).map((s) =>
                            c.claims.some((cl) => cl.state === s) ? (
                              <span
                                key={s}
                                className={POLICY_STATES[s].dot}
                                style={{
                                  width: `${(c.claims.filter((cl) => cl.state === s).length / total) * 100}%`,
                                }}
                              />
                            ) : null
                          )}
                          {total - v - pv > 0 && (
                            <span className="bg-slate-600" style={{ width: `${((total - v - pv) / total) * 100}%` }} />
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        no researched claims
                      </p>
                    )}
                    {c.gap && (
                      <p
                        className={`mt-2 rounded-full border px-2 py-px text-center font-mono text-[10px] ${POLICY_GAP_STYLE.chip}`}
                      >
                        structured gap
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Open the same tiles in the{" "}
              <Link
                href="/policy/intelligence#matrix"
                className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:decoration-cyan-400"
              >
                coverage matrix
              </Link>{" "}
              to compare this pillar against every other pillar.
            </p>
          </section>

          {/* Claims by country */}
          <section className="mt-12" aria-label={`${p.label} claims`}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Claims &amp; evidence trails
            </h2>
            {d.allClaims.length === 0 && (
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                No claims researched yet for this pillar — see the structured gaps below for what
                the pipeline expects to find, and where.
              </p>
            )}
            <div className="mt-3 space-y-6">
              {d.perCountry
                .filter((c) => c.claims.length > 0)
                .map((c) => (
                  <div key={c.key} className="rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(135,180,220,0.16)] p-4">
                      <h3 className="text-base font-bold text-white">
                        {c.name} <span className="ml-1 font-mono text-[11px] text-slate-500">{c.iso}</span>
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {countLabel(c.claims.length, "claim")}
                      </span>
                    </div>
                    <ul className="divide-y divide-[rgba(135,180,220,0.08)]">
                      {c.claims.map((cl) => (
                        <li key={cl.id} className="p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              title={POLICY_STATES[cl.state as keyof typeof POLICY_STATES]?.blurb}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                POLICY_STATES[cl.state as keyof typeof POLICY_STATES]?.chip ??
                                "border-slate-700 text-slate-300"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  POLICY_STATES[cl.state as keyof typeof POLICY_STATES]?.dot ?? "bg-slate-400"
                                }`}
                                aria-hidden="true"
                              />
                              {POLICY_STATES[cl.state as keyof typeof POLICY_STATES]?.label ?? cl.state}
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                              {cl.id}
                            </span>
                            <CopyButton value={cl.id} className="ml-auto" />
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-200">{cl.statement}</p>
                          {cl.note && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{cl.note}</p>}
                          {cl.sources.length > 0 && (
                            <details className="mt-2">
                              <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-sky-400 hover:text-sky-300 [&::-webkit-details-marker]:hidden">
                                View evidence trail · {countLabel(cl.sources.length, "source")} ▾
                              </summary>
                              <ol className="mt-2 space-y-2 border-t border-[rgba(135,180,220,0.10)] pt-2">
                                {cl.sources.map((s) => (
                                  <li key={s.id} className="text-xs leading-relaxed text-slate-400">
                                    <a
                                      href={s.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-slate-300 underline decoration-slate-600 underline-offset-2 hover:decoration-slate-300"
                                    >
                                      {s.publisher}
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
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>

          {/* Sources + gaps */}
          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            <section className="lg:col-span-3" aria-label={`${p.label} sources`}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Sources behind this pillar
              </h2>
              {d.sources.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No sources registered for this pillar yet.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-[rgba(135,180,220,0.08)] rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31]">
                  {d.sources.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#13253A]/60"
                      >
                        <span
                          className={`mt-0.5 inline-flex shrink-0 items-center rounded border px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${
                            s.tier === 1
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                              : s.tier === 2
                                ? "border-sky-500/30 bg-sky-500/10 text-sky-300"
                                : "border-slate-600 bg-slate-500/10 text-slate-300"
                          }`}
                        >
                          T{s.tier}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm leading-snug text-slate-200 group-hover:text-cyan-200">
                            {s.publisher} <span className="text-slate-500">— {s.label}</span>
                          </span>
                          <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider text-slate-600">
                            {s.sourceType} · {s.captureStatus} · {s.id}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="mt-1 size-3.5 shrink-0 text-slate-600 group-hover:text-cyan-300"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="lg:col-span-2" aria-label={`${p.label} structured gaps`}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Structured gaps
              </h2>
              {d.gapsCount === 0 ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  No structured gaps — every market has researched coverage for this pillar.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {d.perCountry
                    .filter((c) => c.gap)
                    .map((c) => (
                      <div
                        key={c.key}
                        className={`rounded-xl border bg-violet-400/[0.04] p-4 ${POLICY_GAP_STYLE.chip}`}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          {c.name} — structured gap, not a finding
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{c.gap!.gap}</p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                          Expected sources: {c.gap!.expectedSources.join("; ")}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          Upgrade path: {c.gap!.upgradePath}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* Prev / next pillar navigation */}
          <nav aria-label="More pillars" className="mt-12 grid gap-3 sm:grid-cols-2">
            <Link
              href={`/policy/intelligence/pillars/${prevId}`}
              className="group rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-4 transition-colors hover:border-cyan-500/40"
            >
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                <ArrowLeft
                  className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                Previous pillar
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-200 group-hover:text-cyan-300">
                {POLICY_PILLARS[prevId].label}
              </span>
            </Link>
            <Link
              href={`/policy/intelligence/pillars/${nextId}`}
              className="group rounded-xl border border-[rgba(135,180,220,0.16)] bg-[#0E1D31] p-4 text-right transition-colors hover:border-cyan-500/40"
            >
              <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Next pillar
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-200 group-hover:text-cyan-300">
                {POLICY_PILLARS[nextId].label}
              </span>
            </Link>
          </nav>

          <p className="mt-10 border-t border-[rgba(135,180,220,0.10)] pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-600">
            {ds.datasetVersion} · {countLabel(d.allClaims.length, "claim")} in this pillar ·{" "}
            {countLabel(d.sources.length, "source")} · editorial gate: {ds.humanGate.status}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
