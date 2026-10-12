"use client";

import SubscribeForm from "@/components/subscribe-form";

const COMPACT_ROLES = [
  { value: "operator", label: "Data centre staff" },
  { value: "leadership", label: "CTO / IT leader" },
  { value: "investor", label: "Investor / analyst" },
  { value: "journalist", label: "Journalist" },
  { value: "vendor", label: "Vendor / supplier" },
  { value: "student", label: "Student" },
  { value: "other", label: "Just interested" },
];

/**
 * Compact end-of-article signup for The Rack Report. Sits right after the
 * article body, the moment a reader has just finished something useful is
 * the highest-intent moment to ask. Each placement is source-tagged so the
 * media kit can eventually say which articles convert.
 * Form machine lives in the shared SubscribeForm (Task 132); this placement
 * inlines the role select between email and button and uses its own copy.
 */
export default function SubscribeCompact({
  source = "article",
}: {
  source?: string;
}) {
  return (
    <aside className="mt-14 rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8">
      <p className="eyebrow">The Rack Report · Monthly intelligence briefing</p>
      <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
        This was one article. The monthly briefing is the whole build-out.
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        The monthly briefing on Kenya&apos;s data-centre industry, read by
        operators, investors and journalists.
      </p>
      <p className="mt-2 text-sm font-medium text-foreground/90">
        Data centres. Power. Cloud. Connectivity. Investment. Policy.
      </p>

      <SubscribeForm
        source={source}
        roles={COMPACT_ROLES}
        selectPlacement="inline"
        selectAriaLabel="Which describes you"
        selectClassName="h-11 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/30 disabled:opacity-50 sm:max-w-[180px]"
        formClassName="mt-4 flex flex-col items-stretch gap-2 sm:flex-row"
        buttonClassName="h-11 cursor-pointer whitespace-nowrap rounded-lg bg-cyan px-5 text-sm font-semibold text-background transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-50"
        copy={{ subscribed: "Done, you're on the list." }}
        successClassName="mt-4 rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-sm text-foreground"
        errorClassName="mt-2 text-xs text-destructive"
        footer={
          <p className="mt-3 text-xs text-muted-foreground">
            One issue, the first Monday of every month. Unsubscribe anytime.
          </p>
        }
      />
    </aside>
  );
}
