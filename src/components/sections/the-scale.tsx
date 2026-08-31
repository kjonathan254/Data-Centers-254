import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFacilities, getMarketSnapshot } from "@/lib/directory-data";

/**
 * The scale — "There is no cloud": full-width infrastructure map plus a
 * four-metric sourced row. Absorbs the old standalone "2 seconds" section.
 * Server component; counts derive from directory-data.ts so the homepage
 * never drifts from the directory.
 */
export default function TheScale() {
  const snap = getMarketSnapshot();
  const facilities = getFacilities();
  const pipelineMw = Math.round(snap.totalSupplyMw - snap.stages[0].mw);
  const metrics: {
    value: string;
    label: string;
    note: string;
    source: string;
    href?: string;
    linkLabel?: string;
  }[] = [
    {
      value: "6",
      label: "Active submarine cables",
      note: "SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE land in Mombasa — a 7th (Meta's Daraja) is in development.",
      source: "Verified",
    },
    {
      value: String(facilities.length),
      label: "Known facilities",
      note: "The buildings that house the servers, storage and networking behind Kenya's digital economy — live, under construction, and committed.",
      source: "DC254 database",
    },
    {
      value: "2",
      label: "Nairobi + Mombasa",
      note: "The two cities where nearly all of Kenya's data centre capacity is physically located. Cables, power and demand explain why.",
      source: "DC254 database",
      href: "/articles/why-data-centres-cluster-nairobi-mombasa",
      linkLabel: "Read the investigation",
    },
    {
      value: "~14 MW",
      label: "Installed IT capacity",
      note: `Combined operational IT load across Kenya's tracked facilities — with ${pipelineMw} MW more announced across the build pipeline.`,
      source: "DC254 database",
      href: "/directory",
      linkLabel: "View the market snapshot",
    },
  ];

  return (
    <section id="the-scale" className="section-y section-surface border-y border-border/40">
      <div className="container-site">
        <p className="eyebrow">The ecosystem</p>
        <h2 className="h-display mt-3 max-w-2xl text-foreground">
          There is no cloud — just infrastructure you&apos;ve never noticed.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          When someone says &ldquo;the cloud,&rdquo; they mean buildings in
          Nairobi, cables under the Indian Ocean, and power lines from the
          Rift Valley. It is physical, measurable, and growing.
        </p>

        {/* Full-width map */}
        <div className="img-frame mt-10">
          <div className="relative aspect-[16/9]">
            <Image
              src="/images/africa-dc-map.webp"
              alt="Map of Kenya showing data centre locations, submarine cable landing points, and fibre connectivity routes"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          From submarine cables landing in Mombasa to data centres in Nairobi —
          Kenya&apos;s digital infrastructure, mapped.
        </p>

        {/* Sourced metric row */}
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="border-t border-border/60 pt-5">
              <p className="stat-value">{m.value}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{m.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
              {m.href && (
                <Link
                  href={m.href}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-cyan transition-all hover:gap-2"
                >
                  {m.linkLabel}
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-cyan/70">
                {m.source}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          How these numbers are verified:{" "}
          <Link href="/methodology" className="text-cyan underline hover:underline">
            read the DC254 methodology
          </Link>
          . Directory data last verified August 2026.
        </p>

        {/* Global context — where Kenya sits in the world's largest facilities */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div>
            <p className="eyebrow">Global context</p>
            <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
              Kenya&apos;s {snap.facilities} tracked facilities sit inside a much bigger machine.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The largest data centre campuses on Earth — led by China
              Telecom&apos;s Inner Mongolia complex at a reported ~10.7 million
              square feet — are industrial installations on a scale no African
              facility yet approaches. It is precisely this capacity gap that
              new ventures, from the Microsoft&ndash;G42 project planned for
              Kenya to the MTN-backed Africa Data Hub, are now moving to
              close.
            </p>
            <Link
              href="/articles/mtn-africa-data-hub-ai-data-centres"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
            >
              Read the analysis: Africa&apos;s AI data centre race
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <figure>
            <div className="img-frame">
              <div className="relative aspect-[725/864]">
                <Image
                  src="/images/worlds-largest-data-centers-2026.webp"
                  alt="Ranked list of the world's largest data centres in 2026, led by China Telecom Inner Mongolia, The Citadel Campus and the Utah Data Center"
                  fill
                  sizes="(max-width: 1024px) 100vw, 340px"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
              The world&apos;s largest data centre campuses, per industry
              rankings (2026). Figures as reported by operators and trade
              press — see{" "}
              <Link href="/methodology" className="text-cyan underline hover:underline">
                how we handle reported data
              </Link>
              .
            </figcaption>
          </figure>
        </div>

        <Link
          href="/directory"
          className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
        >
          Explore the DC Directory
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
