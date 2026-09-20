import Link from "next/link";
import { ArrowRight, Cpu, CheckCircle, HardHat, Megaphone } from "lucide-react";
import { getFacilities, type Facility } from "@/lib/directory-data";
import { getPlatformStats } from "@/lib/site-stats";

/**
 * Featured facilities, the product, on the front page.
 * Four editorially-chosen flagship landers (hyperscale, pipeline, incumbent, coast)
 * deep-linked from the highest-authority page on the site. Server component: zero JS.
 */

const FEATURED_SLUGS = [
  "ixafrica-nbox1",
  "microsoft-g42-ai-dc",
  "africa-dc-nairobi-1",
  "africa-dc-mombasa",
];

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  Operational: { label: "Operational", cls: "text-neon bg-neon/10 border-neon/25", icon: CheckCircle },
  "Under Construction": { label: "Building", cls: "text-cyan bg-cyan/10 border-cyan/25", icon: HardHat },
  Announced: { label: "Announced", cls: "text-amber-500 bg-amber-500/10 border-amber-500/25", icon: Megaphone },
};

function fmtVerified(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", { month: "short", year: "numeric" });
}

function capacityLabel(f: Facility): { value: string; label: string } {
  if (f.itLoadMw) return { value: `${f.itLoadMw}`, label: "MW live IT load" };
  if (f.totalCapacityMw) return { value: `${f.totalCapacityMw}`, label: "MW planned capacity" };
  return { value: "-", label: "capacity undisclosed" };
}

export default function FeaturedFacilities() {
  const facilities = getFacilities();
  const featured = FEATURED_SLUGS.map((slug) => facilities.find((f) => f.slug === slug))
    .filter((f): f is Facility => Boolean(f));

  if (featured.length === 0) return null;

  // Status breakdown, derived, never hardcoded, so the line moves with the
  // dataset. Same stage language as the directory's pipeline tab.
  const stageOrder = ["Operational", "Under Construction", "Committed", "Early Stage", "Announced"];
  const counts = new Map<string, number>();
  for (const f of facilities) counts.set(f.status, (counts.get(f.status) ?? 0) + 1);
  const breakdown = stageOrder
    .filter((s) => counts.has(s))
    .map((s) => `${counts.get(s)} ${s.toLowerCase()}`)
    .join(" \u00b7 ");
  const extras = [...counts.keys()].filter((s) => !stageOrder.includes(s));
  for (const s of extras) {
    counts.set(s, counts.get(s) ?? 0);
  }
  const extraPart = extras.map((s) => `${counts.get(s)} ${s.toLowerCase()}`).join(" \u00b7 ");
  const statusLine = extraPart ? `${breakdown} \u00b7 ${extraPart}` : breakdown;

  const verifiedDate = new Date(
    `${getPlatformStats().lastVerified}T00:00:00`
  ).toLocaleDateString("en-KE", { month: "long", year: "numeric" });

  return (
    <section id="featured-facilities" className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The DC Directory</p>
            <h2 className="h-display mt-3 max-w-2xl text-foreground">
              Every known data-centre facility in Kenya.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              With operator, location, status, capacity, source and
              verification date on every record. This is a structured market
              record, not a list of articles.
            </p>
            <p className="mt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {statusLine} &mdash; directory last verified {verifiedDate}
            </p>
          </div>
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
          >
            View the full directory
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((f) => {
            const meta = STATUS_META[f.status] ?? {
              label: f.status,
              cls: "text-muted-foreground bg-accent/40 border-border",
              icon: CheckCircle,
            };
            const StatusIcon = meta.icon;
            const cap = capacityLabel(f);
            return (
              <Link
                key={f.slug}
                href={`/directory/${f.slug}`}
                className="group block"
              >
                <article className="card-solid card-solid-hover h-full rounded-xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${meta.cls}`}>
                      <StatusIcon className="size-3" />
                      {meta.label}
                    </span>
                    {f.aiReady && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan">
                        <Cpu className="size-3" />
                        AI-ready
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                    {f.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {f.operator.name} · {f.city}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                    <div>
                      <p className="text-2xl font-semibold tabular-nums text-foreground">
                        {cap.value}{" "}
                        <span className="text-sm font-normal text-muted-foreground">MW</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{cap.label}</p>
                    </div>
                    <ArrowRight className="mb-1 size-4 shrink-0 text-cyan transition-all group-hover:translate-x-1" />
                  </div>

                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-cyan/70">
                    Verified {fmtVerified(f.lastVerified)}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
