import Image from "next/image";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";

/**
 * The map, as a product block.
 * One preview, one action - no metric rows, no article links competing
 * with it. The map's job on the homepage is spatial discovery: cables
 * landing in Mombasa, facilities clustered in Nairobi, and the routes
 * between them. Server component, zero client JS.
 */
export default function TheScale() {
  return (
    <section id="the-scale" className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The infrastructure map</p>
            <h2 className="h-display mt-3 max-w-2xl text-foreground">
              See how the infrastructure connects.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              From submarine cables landing in Mombasa to data centres, IXPs
              and fibre routes around Nairobi.
            </p>
          </div>
          <Link
            href="/infrastructure/map"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-7 text-base font-semibold text-background transition-colors hover:bg-cyan/90"
          >
            <MapIcon className="size-4" />
            Open the infrastructure map
          </Link>
        </div>

        {/* Map preview, links to the full map */}
        <Link
          href="/infrastructure/map"
          aria-label="Open the infrastructure map"
          className="img-frame group mt-10 block"
        >
          <div className="relative aspect-[16/9]">
            <Image
              src="/images/africa-dc-map.webp"
              alt="Map of Kenya showing data centre locations, submarine cable landing points, and fibre connectivity routes"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </Link>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Live capacity, announced pipeline and cable landings, mapped and
          sourced. Kenya&apos;s digital infrastructure, in one view.
        </p>
      </div>
    </section>
  );
}
