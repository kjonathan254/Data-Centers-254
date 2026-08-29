import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Breaking news strip — one line, one link, sits directly under the hero.
 * Solid band, no animation. Update copy per story; keep it to a single item.
 * Server component.
 */
export default function BreakingNewsBar() {
  return (
    <section aria-label="Breaking news" className="border-b border-border/40 bg-card">
      <Link
        href="/articles/mtn-africa-data-hub-ai-data-centres"
        className="group block transition-colors hover:bg-background"
      >
        <div className="container-site flex items-center gap-3 py-3 sm:gap-4">
          <span className="shrink-0 rounded border border-red-400/30 bg-red-400/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-red-400">
            Breaking
          </span>
          <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-snug text-foreground sm:truncate sm:text-[15px]">
            MTN and Dubai investor Tarek Al Ashram launch Africa Data Hub —
            150&nbsp;MW of AI data centres planned for Nigeria and South Africa
          </p>
          <span className="hidden shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-cyan sm:flex">
            27 Aug 2026
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-cyan" />
        </div>
      </Link>
    </section>
  );
}
