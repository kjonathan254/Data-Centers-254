import Link from "next/link";
import { Activity, Cable, Zap, Landmark } from "lucide-react";

/**
 * Shared navigation across the four market trackers (capacity pipeline,
 * subsea cables, power tariffs, licensing). Lets each tracker page crosslink
 * its siblings without duplicating markup, and gives the trackers a single
 * recurring surface identity per the audit's Phase 2.
 */

const TRACKERS = [
  { href: "/tracker", label: "Capacity pipeline", icon: Activity },
  { href: "/tracker/cables", label: "Subsea cables", icon: Cable },
  { href: "/tracker/power", label: "Power tariffs", icon: Zap },
  { href: "/tracker/licensing", label: "Licensing", icon: Landmark },
] as const;

export type TrackerKey = (typeof TRACKERS)[number]["href"];

export default function TrackerNav({ current }: { current: TrackerKey }) {
  return (
    <nav aria-label="Market trackers" className="mt-8 flex flex-wrap gap-2">
      {TRACKERS.map((t) => {
        const active = t.href === current;
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-cyan/40 bg-cyan/10 text-cyan"
                : "border-border/60 bg-accent/30 text-muted-foreground hover:border-cyan/40 hover:text-cyan"
            }`}
          >
            <Icon className="size-3.5" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
