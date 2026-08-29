import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The scale — "There is no cloud": full-width infrastructure map plus a
 * four-metric sourced row. Absorbs the old standalone "2 seconds" section.
 * Server component.
 */
export default function TheScale() {
  const metrics = [
    {
      value: "6",
      label: "Active submarine cables",
      note: "SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE land in Mombasa — a 7th (Meta's Daraja) is in development.",
      source: "Verified",
    },
    {
      value: "14",
      label: "Known facilities",
      note: "The buildings that house the servers, storage and networking behind Kenya's digital economy.",
      source: "DC254 database",
    },
    {
      value: "2",
      label: "Nairobi + Mombasa",
      note: "The two cities where nearly all of Kenya's data centre capacity is physically located.",
      source: "DC254 database",
    },
    {
      value: "<2s",
      label: "M-Pesa round trip",
      note: "Safaricom reports average USSD latency under two seconds — phone to data centre and back.",
      source: "Estimate",
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
        <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="border-t border-border/60 pt-5">
              <dd className="stat-value">{m.value}</dd>
              <dt className="mt-2 text-sm font-medium text-foreground">{m.label}</dt>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.note}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-cyan/50">
                {m.source}
              </p>
            </div>
          ))}
        </dl>

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
