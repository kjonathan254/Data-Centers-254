"use client";

import Link from "next/link";
import SubscribeForm from "@/components/subscribe-form";

export default function NewsletterV2() {
  return (
    <section className="section-y border-t border-border/40">
      <div className="container-site">
        <div className="card-solid mx-auto max-w-xl p-8 text-center sm:p-10">
          <p className="eyebrow">The Rack Report</p>
          <h2 className="h-display-sm mt-3 text-foreground">
            One monthly briefing on what changed in East Africa&apos;s digital
            infrastructure.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Track new facilities, capacity changes, operators, subsea cables,
            power, regulation, AI projects and the announcements that deserve
            closer attention.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground/90">
            For investors, operators, technology leaders, suppliers and
            journalists.
          </p>

          {/* Shared form machine (was a local copy — Task 132). Homepage copy
              is the component default; only the footer differs. */}
          <SubscribeForm
            source="homepage"
            footer={
              <>
                <p className="mt-4 text-xs text-muted-foreground">
                  One issue, the first Monday of every month. Unsubscribe anytime.
                  Your email is used
                  to send The Rack Report only &mdash; we do not sell subscriber
                  details.{" "}
                  <Link href="/privacy" className="text-cyan hover:underline">
                    Privacy
                  </Link>
                </p>
                <Link
                  href="/rack-report"
                  className="mt-2 inline-block text-xs text-cyan hover:underline"
                >
                  See what lands in every briefing →
                </Link>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
