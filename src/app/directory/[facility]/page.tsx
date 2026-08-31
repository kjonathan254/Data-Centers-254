import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, HardHat, Megaphone, ShieldCheck,
  Zap, Server, Shield, Building2, Globe, Wifi, FileText, Database,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  getFacilities, getFacilityBySlug,
} from "@/lib/directory-data";
import { getArticleBySlug } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

/**
 * Per-facility profile pages — the SEO landers for queries like
 * "Safaricom Limuru data centre". Fully static, server-rendered from
 * directory-data.ts, with JSON-LD and prev/next navigation.
 */

type Params = { facility: string };

export function generateStaticParams(): Params[] {
  return getFacilities().map((f) => ({ facility: f.slug }));
}

export const dynamicParams = false;

const STAGE_BADGE: Record<string, string> = {
  Operational: "border-neon/25 text-neon bg-neon/10",
  "Under Construction": "border-cyan/25 text-cyan bg-cyan/10",
  Committed: "border-amber-500/25 text-amber-500 bg-amber-500/10",
  "Early Stage": "border-border text-muted-foreground bg-accent/50",
};

const STAGE_ICON: Record<string, typeof CheckCircle> = {
  Operational: CheckCircle,
  "Under Construction": HardHat,
  Committed: ShieldCheck,
  "Early Stage": Megaphone,
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtVerified(v: string | null): string {
  if (!v) return "Unknown";
  const [y, m] = v.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

function stagePhrase(status: string): string {
  switch (status) {
    case "Operational": return "operational";
    case "Under Construction": return "currently under construction";
    case "Committed": return "committed (land or funding secured, pre-build)";
    case "Early Stage": return "at an early, announced stage";
    default: return status.toLowerCase();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { facility: slug } = await params;
  const f = getFacilityBySlug(slug);
  if (!f) return {};
  const mw = f.totalCapacityMw
    ? `${f.totalCapacityMw} MW`
    : "capacity undisclosed";
  const title = `${f.name}, ${f.city} — ${f.operator.name} | DC254`;
  const description = `${f.name} is a ${stagePhrase(f.status)} data centre in ${f.city}, Kenya, operated by ${f.operator.name} (${mw}). Specs, connectivity, power and sourcing — verified ${fmtVerified(f.lastVerified)}.`;
  return {
    title,
    description,
    alternates: { canonical: `/directory/${f.slug}` },
    openGraph: {
      title,
      description,
      siteName: "Data Centre 254",
      type: "website",
      locale: "en_KE",
      images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: `${f.name} — Data Centre 254` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/africa-dc-map.webp"] },
  };
}

export default async function FacilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { facility: slug } = await params;
  const f = getFacilityBySlug(slug);
  if (!f) notFound();

  const all = [...getFacilities()].sort(
    (a, b) =>
      (b.totalCapacityMw || 0) - (a.totalCapacityMw || 0) ||
      a.name.localeCompare(b.name),
  );
  const idx = all.findIndex((x) => x.id === f.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const related = (f.articleSlugs || [])
    .map((s) => getArticleBySlug(s))
    .filter((a) => a !== null)
    .map((a) => ({ slug: a.frontmatter.slug, title: a.frontmatter.title }));

  const BadgeIcon = STAGE_ICON[f.status] || Clock;

  const specs: { icon: typeof Zap; label: string; value: string }[] = [];
  if (f.itLoadMw) specs.push({ icon: Zap, label: "Live IT load", value: `${f.itLoadMw} MW` });
  if (f.totalCapacityMw) specs.push({ icon: Zap, label: "Total capacity", value: `${f.totalCapacityMw} MW` });
  if (f.rackCount) specs.push({ icon: Server, label: "Racks", value: f.rackCount.toLocaleString() });
  if (f.tierRating) specs.push({ icon: Shield, label: "Tier rating", value: f.tierRating });
  if (f.facilityType) specs.push({ icon: Building2, label: "Facility type", value: f.facilityType });
  if (f.aiReady) specs.push({ icon: Wifi, label: "AI ready", value: "Yes" });
  if (f.coolingType) specs.push({ icon: Globe, label: "Cooling", value: f.coolingType });
  if (f.openedDate) specs.push({ icon: Clock, label: "Opened", value: f.openedDate });
  if (f.expansionDate) specs.push({ icon: Clock, label: "Expansion", value: f.expansionDate });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Directory", item: `${SITE_URL}/directory` },
          { "@type": "ListItem", position: 3, name: f.name, item: `${SITE_URL}/directory/${f.slug}` },
        ],
      },
      {
        "@type": "WebPage",
        name: f.name,
        description: f.description || undefined,
        url: `${SITE_URL}/directory/${f.slug}`,
        about: {
          "@type": "Place",
          name: f.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: f.city,
            addressRegion: f.region,
            addressCountry: "KE",
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <div className="container-site py-14 lg:py-20">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/directory" className="inline-flex items-center gap-1.5 hover:text-cyan">
              <ArrowLeft className="size-3.5" /> Directory
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground/80">{f.name}</span>
          </nav>

          {/* Header */}
          <header className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${STAGE_BADGE[f.status] || STAGE_BADGE["Early Stage"]}`}>
                <BadgeIcon className="size-3.5" />
                {f.status === "Operational" ? "Live · Operational" : f.status}
              </span>
              {f.aiReady && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/25 bg-neon/5 px-3 py-1 text-xs font-medium text-neon">
                  AI-Ready
                </span>
              )}
            </div>
            <h1 className="h-display mt-4 text-foreground">{f.name}</h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              {f.operator.name}
              {f.operator.parentCompany ? ` · ${f.operator.parentCompany}` : ""} ·{" "}
              {[f.address, f.city, f.region].filter(Boolean).join(", ")}
            </p>
          </header>

          {/* Lead paragraph — synthesised from verified fields */}
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {f.name} is a {stagePhrase(f.status)} data centre facility in{" "}
            {f.city}, Kenya, operated by {f.operator.name}.{" "}
            {f.totalCapacityMw
              ? `Its designed capacity is ${f.totalCapacityMw} MW${f.itLoadMw ? `, of which ${f.itLoadMw} MW of IT load is live` : ""}.`
              : "Its total capacity has not been publicly disclosed."}{" "}
            {f.tierRating ? `The facility carries a Tier ${f.tierRating} rating. ` : ""}
            It sits inside DC254&apos;s four-stage supply pipeline —{" "}
            <Link href="/directory" className="text-cyan hover:underline">
              see how Kenya&apos;s market stages up
            </Link>
            .
          </p>

          {/* Spec grid */}
          {specs.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {specs.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="card-solid rounded-xl p-4">
                    <Icon className="size-4 text-cyan mb-2" />
                    <dd className="text-base font-semibold text-foreground">{s.value}</dd>
                    <dt className="text-[11px] text-muted-foreground mt-0.5">{s.label}</dt>
                  </div>
                );
              })}
            </dl>
          )}

          {/* Narrative */}
          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              {f.description && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Overview</h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{f.description}</p>
                </div>
              )}
              {f.notable && (
                <div className="card-solid rounded-lg border-l-4 border-l-cyan p-4">
                  <h2 className="text-xs font-mono uppercase tracking-widest text-cyan">Why it matters</h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{f.notable}</p>
                </div>
              )}

              {/* Power */}
              {f.powerSource && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Power</h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{f.powerSource}</p>
                  {f.renewableClaim && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.renewableClaim}</p>
                  )}
                </div>
              )}

              {/* Connectivity */}
              {f.connectivityFacility.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Connectivity · {f.connectivityFacility.length} provider{f.connectivityFacility.length === 1 ? "" : "s"}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {f.connectivityFacility.map((cf) => (
                      <li key={cf.provider.name} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {cf.provider.name} <span className="ml-1 text-[10px] text-cyan/60">{cf.provider.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related coverage */}
              {related.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">DC254 coverage</h2>
                  <ul className="mt-3 space-y-2">
                    {related.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/articles/${a.slug}`} className="group inline-flex items-center gap-2 text-sm text-foreground/90 hover:text-cyan">
                          <FileText className="size-4 shrink-0 text-cyan/70" />
                          <span className="group-hover:underline">{a.title}</span>
                          <ArrowRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trust sidebar */}
            <aside className="lg:col-span-2">
              <div className="card-solid rounded-xl p-5 lg:sticky lg:top-24">
                <h2 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  <Database className="size-4 text-neon" /> Data provenance
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Source</dt>
                    <dd className="mt-0.5 text-foreground/90">{f.dataSource}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Last verified</dt>
                    <dd className="mt-0.5 text-foreground/90">{fmtVerified(f.lastVerified)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground/70">Confidence</dt>
                    <dd className="mt-0.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${
                        f.dataConfidence === "High"
                          ? "border-neon/25 text-neon bg-neon/5"
                          : f.dataConfidence === "Medium"
                            ? "border-cyan/20 text-cyan bg-cyan/5"
                            : "border-border text-muted-foreground"
                      }`}>
                        {f.dataConfidence}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 border-t border-border/40 pt-3 text-[11px] leading-relaxed text-muted-foreground/70">
                  Every DC254 data point follows the same discipline: claim,
                  source, date verified, independent evidence.
                </p>
                <Link href="/methodology" className="mt-2 inline-block text-xs text-cyan hover:underline">
                  How we verify →
                </Link>
              </div>
            </aside>
          </div>

          {/* Prev / next */}
          <nav aria-label="More facilities" className="mt-14 grid gap-3 border-t border-border/40 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/directory/${prev.slug}`} className="card-solid card-solid-hover group rounded-xl p-4">
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <ArrowLeft className="size-3.5" /> Larger capacity
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground group-hover:text-cyan">{prev.name}</span>
              </Link>
            ) : <div />}
            {next && (
              <Link href={`/directory/${next.slug}`} className="card-solid card-solid-hover group rounded-xl p-4 sm:text-right">
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground sm:justify-end">
                  Next facility <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground group-hover:text-cyan">{next.name}</span>
              </Link>
            )}
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
