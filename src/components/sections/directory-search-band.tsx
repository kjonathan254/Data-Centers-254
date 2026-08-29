import Link from "next/link";
import { Search, Map, ArrowRight, Zap } from "lucide-react";
import { getFacilities } from "@/lib/directory-data";

/**
 * Directory search band — sits directly under the hero so the platform's
 * strongest asset (the verified DC Directory) is reachable immediately.
 * Native GET form to /directory — zero client JS.
 */
export default function DirectorySearchBand() {
  const facilities = getFacilities();
  const totalMw =
    facilities.reduce((sum, f) => sum + (f.itLoadMw ?? 0), 0) ||
    facilities.reduce((sum, f) => sum + (f.totalCapacityMw ?? 0), 0);
  const mwLabel = totalMw > 0 ? `${Math.round(totalMw)} MW tracked` : "Verified data";

  return (
    <section className="border-y border-border/40 bg-card">
      <div className="container-site flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:gap-8">
        {/* Copy */}
        <div className="shrink-0 lg:max-w-[15rem]">
          <p className="eyebrow">DC Directory</p>
          <h2 className="mt-1.5 text-lg font-semibold leading-tight text-foreground">
            Every data centre in Kenya. Verified.
          </h2>
        </div>

        {/* Search */}
        <form action="/directory" method="get" className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="search"
              placeholder="Search facilities, operators, cities…"
              aria-label="Search the data centre directory"
              className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/40"
            />
          </div>
          <button
            type="submit"
            className="h-11 rounded-lg bg-cyan px-6 text-sm font-semibold text-background transition-colors hover:bg-cyan/90"
          >
            Search
          </button>
        </form>

        {/* Capacity + map */}
        <div className="flex shrink-0 items-center gap-6">
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <Zap className="size-3.5 text-cyan" />
            {mwLabel}
          </span>
          <Link
            href="/infrastructure/map"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-all hover:gap-2.5"
          >
            <Map className="size-4" />
            View the map
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
