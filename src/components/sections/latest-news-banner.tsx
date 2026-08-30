import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

/**
 * Featured analysis — one wide editorial card: photograph left,
 * story right. Server component.
 */
export default function LatestNewsBanner() {
  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <p className="eyebrow">Featured analysis</p>

        <Link href="/news/kenya-data-centre-licensing-framework" className="group mt-6 block">
          <article className="card-solid card-solid-hover grid overflow-hidden lg:grid-cols-5">
            {/* Photograph */}
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[320px] lg:col-span-2">
              <Image
                src="/images/nairobi-skyline-night.webp"
                alt="Regulatory authority building at dusk"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>

            {/* Story */}
            <div className="p-6 sm:p-8 lg:col-span-3 lg:self-center">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono uppercase tracking-wider text-cyan">
                  Regulatory intelligence
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3" />
                  12 min read
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan sm:text-2xl">
                Kenya&apos;s Data Centre Licensing Framework: what NFP-T1 and
                NFP-T2 mean for the industry
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                For the first time in Kenya&apos;s regulatory history, commercial
                data centres are explicitly licensed under the NFP-T2 tier
                (KES 15M initial fee, 15-year term). What Gazette Notice
                No. 3335 changes for operators, investors, and engineers.
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all group-hover:gap-2.5">
                Read the full analysis
                <ArrowRight className="size-4" />
              </span>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}
