import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, FileCheck, History, Scale } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  correctionsLog,
  formatCorrectionDate,
  CORRECTIONS_EMAIL,
  CORRECTIONS_SLA,
} from "@/lib/corrections-data";

export const metadata: Metadata = {
  title: "Corrections: How DC254 Fixes Errors",
  description:
    "DC254's public corrections log and policy: how to challenge a figure, the 48-hour acknowledgement and five-working-day fix commitment, and every material correction we have made, dated.",
  alternates: { canonical: "/corrections" },
};

const steps = [
  {
    icon: Mail,
    title: "1. Send the challenge",
    body: (
      <>
        Email{" "}
        <a href={`mailto:${CORRECTIONS_EMAIL}`} className="text-cyan underline hover:underline">
          {CORRECTIONS_EMAIL}
        </a>{" "}
        with three things: the entry or page, the exact figure you are
        challenging, and a primary source (a regulator filing, an operator
        page, an official document). Trade press counts as a lead, not as
        proof.
      </>
    ),
  },
  {
    icon: Clock,
    title: `2. Acknowledged within ${CORRECTIONS_SLA.acknowledgementHours} hours`,
    body: "Every challenge is acknowledged, not just answered. If we cannot reproduce your source or the claim needs deeper checking, we say so plainly instead of going quiet.",
  },
  {
    icon: FileCheck,
    title: `3. Verified and fixed within ${CORRECTIONS_SLA.fixWorkingDays} working days`,
    body: (
      <>
        Where your source checks out, the correction is applied within five
        working days and the entry&apos;s verification date moves. Where it does
        not, the entry stands and we tell you why. Either way you get a
        substantive reply.
      </>
    ),
  },
  {
    icon: History,
    title: "4. Logged in public",
    body: (
      <>
        Material corrections and reclassifications are added to the log below
        and to the update log on the{" "}
        <Link href="/methodology" className="text-cyan underline hover:underline">
          methodology page
        </Link>
        , including our own errors. Accuracy beats ego.
      </>
    ),
  },
];

export default function CorrectionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Trust</p>
          <h1 className="text-display-sm text-foreground mb-5">Corrections</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-6">
            Fast, visible corrections are a product, not an embarrassment. A
            directory that never admits mistakes is telling you it never
            checks. Every figure on this site carries its source and the month
            it was last verified precisely so it can be challenged, and this
            page is where every material correction lands, dated, in public.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mb-12">
            The verification standard behind these numbers is explained in the{" "}
            <Link href="/methodology" className="text-cyan underline hover:underline">
              data methodology
            </Link>
            , and the editorial rules in the{" "}
            <Link href="/editorial-policy" className="text-cyan underline hover:underline">
              Editorial Policy
            </Link>
            .
          </p>

          {/* How to report */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How to report an error
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            One email is enough. It goes to the editor, not a form queue:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <s.icon className="size-5 text-cyan mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Correction vs update */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Corrections and updates, said precisely
          </h2>
          <div className="rounded-xl border border-border/50 bg-accent/30 p-6 mb-14">
            <div className="flex items-start gap-3 mb-4">
              <Scale className="size-5 text-cyan flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                We distinguish two things that round-ups usually blur together:
              </p>
            </div>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">A correction</span>{" "}
                means the world did not change, we did: a figure was wrong, a
                status was misread, a source was misquoted. These are fixed fast
                and logged below.
              </li>
              <li>
                <span className="font-medium text-foreground">An update</span>{" "}
                means the world moved: a facility launched, a cable went
                ready-for-service, a regulator issued a licence. Updates follow
                the{" "}
                <Link href="/methodology" className="text-cyan underline hover:underline">
                  update cadence
                </Link>{" "}
                and material ones are logged too, because a changed number
                should always be traceable to the event that changed it.
              </li>
            </ul>
          </div>

          {/* The public log */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Corrections and update log
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every material change to the dataset, dated, newest first. When a
            figure you relied on changes, this log is the receipt for why.
          </p>
          <div className="mb-14 space-y-4">
            {correctionsLog.map((u) => (
              <div key={u.date} className="rounded-xl border border-border/50 bg-accent/30 p-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                  <p className="text-sm font-semibold text-cyan">
                    {formatCorrectionDate(u.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.summary}</p>
                </div>
                <ul className="space-y-2.5">
                  {u.changes.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Closing commitment */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              The promise, in one line: challenges acknowledged within{" "}
              {CORRECTIONS_SLA.acknowledgementHours} hours, verified fixes
              applied within {CORRECTIONS_SLA.fixWorkingDays} working days with
              the verification date moved, and every material change logged
              here. If we ever miss that standard, the failure is logged too.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
