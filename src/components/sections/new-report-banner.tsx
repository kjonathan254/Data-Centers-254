import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Download } from "lucide-react";
import { getPlatformStats } from "@/lib/site-stats";

/**
 * Report banner, the flagship DC254 report, surfaced on the homepage.
 * Image-led editorial card matching the house style: photograph left,
 * content right, mono badge, cyan accents. Server component.
 * Structure: the headline block links to the free summary; the PDF chip
 * is a real download link. Anchors are siblings, never nested.
 * Takeaways are derived from the live datasets so the banner never
 * repeats a stale print-run figure.
 */
export default function NewReportBanner() {
  const stats = getPlatformStats();
  const takeaways = [
    {
      t: "Live versus announced",
      b: `${stats.designedLiveMw} MW live designed capacity against ${stats.pipelineMw} MW announced across the build pipeline, staged honestly.`,
    },
    {
      t: "The operator landscape",
      b: `${stats.operators} operators tracked, who is carrier-neutral, who is incumbent-backed, and where the interconnection sits.`,
    },
    {
      t: "What shapes 2027",
      b: "The four events, from hyperscale entries to licence decisions, most likely to move the market next year.",
    },
  ];

  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">New report</p>
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-cyan"
          >
            All reports
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <article className="card-solid card-solid-hover group mt-6 grid overflow-hidden lg:grid-cols-5">
          {/* Photograph, links to the summary */}
          <Link
            href="/research/state-of-kenyan-data-centres-2026"
            aria-label="Read the free summary of State of Kenyan Data Centres 2026"
            className="relative block aspect-[16/9] lg:aspect-auto lg:min-h-[300px] lg:col-span-2"
          >
            <Image
              src="/images/limuru-campus-aerial-solar.webp"
              alt="Aerial view of the Safaricom Red Hill data centre campus at Limuru, with rooftop solar"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
          </Link>

          {/* Report */}
          <div className="p-6 sm:p-8 lg:col-span-3 lg:self-center">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono uppercase tracking-wider text-cyan">
                Brief / 01 · September 2026
              </span>
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                Free summary + downloadable PDF
              </span>
            </div>

            <Link href="/research/state-of-kenyan-data-centres-2026" className="mt-4 block">
              <h2 className="text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan sm:text-2xl">
                State of Kenyan Data Centres 2026
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                The verified annual review of Kenya&apos;s data centre market:
                the honestly staged supply pipeline, the interconnection league
                table, certification records read precisely, and the four
                events that will decide 2027. Every figure sourced and dated.
              </p>
            </Link>

            {/* Takeaways, the report's three answers, derived from the datasets */}
            <dl className="mt-5 space-y-2.5 max-w-2xl">
              {takeaways.map((t) => (
                <div key={t.t} className="flex gap-3">
                  <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-cyan/80 pt-0.5">
                    {t.t}
                  </dt>
                  <dd className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {t.b}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTAs, real links, siblings of the headline link */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href="/research/state-of-kenyan-data-centres-2026"
                className="inline-flex items-center gap-1.5 rounded-md bg-cyan px-4 py-2 text-sm font-medium text-cyan-foreground transition-colors hover:bg-cyan/90"
              >
                <BookOpen className="size-4" /> Read the free summary
              </Link>
              <a
                href="/reports/dc254-state-of-kenyan-data-centres-2026.pdf"
                download
                className="inline-flex items-center gap-1.5 rounded-md border border-cyan/25 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/10"
              >
                <Download className="size-4" /> PDF · 4 pages
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
