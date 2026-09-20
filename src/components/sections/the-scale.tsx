import Link from "next/link";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import MapPreview from "@/components/map/map-preview";
import { AMBER, CYAN, NEON } from "@/components/map/shared";

const PIDA_VIOLET = "oklch(0.72 0.15 305)";

/**
 * The map, as a product block.
 * The preview is the site's own map, server-rendered from the same
 * datasets as the interactive map (facilities, cables, landing station,
 * fibre, PIDA layer) - not a stock image. One preview, one action.
 * Zero client JS: every animation is CSS/SMIL inside the SVG.
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-stretch">
          {/* How to read it, before the click */}
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <ul className="space-y-3.5 text-sm leading-relaxed text-muted-foreground">
              <li className="flex items-center gap-3">
                <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: NEON }} />
                <span>
                  <strong className="font-medium text-foreground">Operational facilities</strong>, live today
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block size-2.5 shrink-0 rounded-full border border-dashed" style={{ borderColor: AMBER }} />
                <span>
                  <strong className="font-medium text-foreground">Building and committed</strong> — pipeline, not yet live
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block h-0.5 w-5 shrink-0 rounded-full" style={{ background: CYAN }} />
                <span>
                  <strong className="font-medium text-foreground">Submarine cables</strong> — solid in service, dashed in development
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block size-2.5 shrink-0 rotate-45" style={{ background: PIDA_VIOLET }} />
                <span>
                  <strong className="font-medium text-foreground">PIDA registry projects</strong> — Kenya on the continental pipeline
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-5 shrink-0 border-t border-dashed border-foreground/40" />
                <span>
                  <strong className="font-medium text-foreground">Terrestrial fibre</strong> linking the hubs together
                </span>
              </li>
            </ul>
            <p className="mt-6 max-w-lg text-xs leading-relaxed text-muted-foreground/80">
              This preview is drawn from the same verified dataset as the
              directory — the counts, routes and landing points are the real
              records, not an illustration. The full map adds Nairobi and
              Mombasa metro zoom, filters, search and a list view.
            </p>
            <Link
              href="/infrastructure/map"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
            >
              Explore the interactive map <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* The site's own map, server-rendered — links to the full map */}
          <Link
            href="/infrastructure/map"
            aria-label="Open the infrastructure map"
            className="group relative block h-[440px] overflow-hidden rounded-xl border border-border/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:h-[540px] lg:order-2 lg:h-auto lg:min-h-[600px]"
          >
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.015]"
              style={{ background: "radial-gradient(120% 90% at 50% 38%, #0a1526 0%, #070d18 55%, #04080e 100%)" }}
            >
              <MapPreview />
            </div>
            <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-[#0b1424]/85 px-3 py-1 text-xs font-medium text-cyan backdrop-blur transition-colors group-hover:border-cyan/70">
              <MapIcon className="size-3.5" />
              Interactive map
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
