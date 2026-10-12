"use client";

import SubscribeForm from "@/components/subscribe-form";

/**
 * Signup form for the /rack-report landing page. Same pipeline as the
 * homepage band, POST /api/subscribe with a page-specific source tag.
 * Form machine lives in the shared SubscribeForm (Task 132) — this placement
 * overrides its check/subscribed copy and centers the success + fine print.
 */
export default function RackReportSignup() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <SubscribeForm
        source="rack-report-page"
        copy={{
          check:
            "Almost there - check your inbox and click the confirmation link to get the next issue.",
          subscribed:
            "You're on the list. The next issue lands on Monday morning. Watch your inbox.",
        }}
        formClassName="flex flex-col items-stretch gap-2 text-left"
        successClassName="rounded-lg border border-neon/25 bg-neon/10 px-4 py-3 text-center text-sm text-foreground"
        footer={
          <p className="mt-3 text-center text-xs text-muted-foreground">
            One concise briefing, the first Monday of every month. Unsubscribe
            anytime. We do not sell subscriber details.
          </p>
        }
      />
    </div>
  );
}
