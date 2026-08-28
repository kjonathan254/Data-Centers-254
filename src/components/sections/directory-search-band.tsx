import Link from "next/link";
import { Search, Map, ArrowRight, Building2, Zap, Server } from "lucide-react";
import { getFacilities } from "@/lib/directory-data";

/**
 * Compact directory search band — sits right below the hero so the site's
 * strongest asset (the verified DC Directory) is reachable without scrolling.
 * Uses a native GET form to /directory (zero client JS).
 */
export default function DirectorySearchBand() {
  const facilities = getFacilities();
  const operators = new Set(facilities.map((f) => f.operator.name)).size;
  const totalMw =
    facilities.reduce((sum, f) => sum + (f.itLoadMw ?? 0), 0) ||
    facilities.reduce((sum, f) => sum + (f.totalCapacityMw ?? 0), 0);
  const mwLabel = totalMw > 0 ? `${Math.round(totalMw)}MW` : "Verified data";

  return (
    <section className="relative section-surface border-y border-border/50 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          {/* Copy */}
          <div className="flex-shrink-0 lg:max-w-xs">
            <p className="text-section-label mb-2">DC Directory</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-tight">
              Every data centre in Kenya. Verified.
            </h2>
          </div>

          {/* Search + stats */}
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
            <form action="/directory" method="get" className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search facilities, operators, cities…"
                  aria-label="Search the data centre directory"
                  className="w-full h-11 rounded-lg bg-background border border-border pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/40"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 rounded-lg bg-cyan text-background text-sm font-semibold hover:bg-cyan/90 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick stats */}
            <div className="flex items-center gap-4 sm:gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-cyan" />
                {facilities.length} facilities
              </span>
              <span className="flex items-center gap-1.5">
                <Server className="size-3.5 text-cyan" />
                {operators} operators
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Zap className="size-3.5 text-cyan" />
                {mwLabel}
              </span>
            </div>
          </div>

          {/* Map link */}
          <Link
            href="/infrastructure/map"
            className="flex-shrink-0 inline-flex items-center gap-2 text-cyan text-sm font-medium hover:gap-3 transition-all duration-300"
          >
            <Map className="size-4" />
            View the Map
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
