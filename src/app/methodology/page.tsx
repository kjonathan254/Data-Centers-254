import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Search,
  FileText,
  CalendarCheck,
  ShieldCheck,
  Database,
  Newspaper,
  Scale,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology — How DC254 Verifies Its Data",
  description:
    "The DC254 verification methodology: how facility data is sourced and verified, our update cadence, data confidence levels, and the corrections policy behind Kenya's data centre directory.",
  alternates: { canonical: "/methodology" },
};

const chain = [
  {
    icon: Search,
    title: "1. The claim",
    body: "Every figure in the DC Directory starts as a specific claim: a capacity in megawatts, a rack count, a tier rating, a launch date. Vague claims are not recorded — if a source will not say what it means, neither do we.",
  },
  {
    icon: FileText,
    title: "2. The source",
    body: "Each claim is attached to its origin: operator websites and annual reports, regulator filings and gazette notices, funding announcements, and reporting from established trade press (DataCenterDynamics, TechCabal, Business Daily, ITWeb Africa). The source is printed on every directory entry.",
  },
  {
    icon: CalendarCheck,
    title: "3. The date verified",
    body: "Every directory entry carries the month it was last checked — not the month it was written. When a facility expands, changes status, or is challenged by new reporting, the date moves. Stale data is treated as a bug.",
  },
  {
    icon: ShieldCheck,
    title: "4. Independent evidence",
    body: "Where possible, a claim is cross-checked against a second, independent source — a regulator record behind a company press release, trade press behind an operator announcement. Where we could only find one source, the entry says so through its confidence level.",
  },
];

const confidence = [
  {
    level: "High",
    description:
      "Confirmed by the operator and at least one independent source (regulator filing, trade press, or official document). Example: iXAfrica NBOX1's capacity, reported by the operator and covered by DataCenterDynamics.",
    className: "border-neon/25 text-neon bg-neon/5",
  },
  {
    level: "Medium",
    description:
      "Reported by a credible single source — usually the operator itself — with no independent confirmation yet. Most facility specs sit here, because operators rarely publish third-party-audited figures.",
    className: "border-cyan/20 text-cyan bg-cyan/5",
  },
  {
    level: "Low",
    description:
      "Based on limited public information: a listing, a brief mention, or an out-of-date company page. The entry is published because it is part of Kenya's infrastructure map, but treat the numbers as indicative.",
    className: "border-border text-muted-foreground bg-accent/30",
  },
];

const cadence = [
  {
    icon: Database,
    title: "DC Directory — monthly sweep, quarterly re-verification",
    body: "The directory is swept monthly for status changes (new launches, expansions, outages reported in press). Every entry is fully re-verified against its sources each quarter. The current dataset was last verified in August 2026.",
  },
  {
    icon: Newspaper,
    title: "News & market moves — as they happen",
    body: "Material announcements — a new subsea cable, an acquisition, a licence award — are covered when they happen and dated. If a story develops, the article's updated_date moves with it.",
  },
  {
    icon: Scale,
    title: "Explainers & reference articles — reviewed on change",
    body: "Evergreen explainers are reviewed when the underlying facts change — a new licence framework, a new cable landing — and the updated date at the top of each article reflects the last material review.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Trust</p>
          <h1 className="text-display-sm text-foreground mb-5">Methodology</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-6">
            DC254&apos;s entire value is that you can trust the numbers. This
            page explains exactly how the data behind the{" "}
            <Link href="/directory" className="text-cyan hover:underline">
              DC Directory
            </Link>{" "}
            and our statistics is sourced, verified, dated, and corrected — and
            what to do when you think we got something wrong.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mb-12">
            For how articles are written, labelled, and kept editorially
            independent, see the{" "}
            <Link href="/editorial-policy" className="text-cyan hover:underline">
              Editorial Policy
            </Link>
            . This page is about the data.
          </p>

          {/* Verification chain */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How a data point gets verified
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Every facility entry in the directory passes through the same
            four-step chain before it is published:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {chain.map((s) => (
              <div key={s.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <s.icon className="size-5 text-cyan mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Confidence levels */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Data confidence levels
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Every directory entry carries one of three confidence badges, so
            you can see how strong the evidence behind it is:
          </p>
          <div className="space-y-3 mb-14">
            {confidence.map((c) => (
              <div key={c.level} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 rounded-lg border border-border/50 p-4">
                <span className={`flex-shrink-0 inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wider w-fit ${c.className}`}>
                  {c.level}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>

          {/* Update cadence */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Update cadence
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Kenya&apos;s infrastructure changes fast — capacity expands,
            licences are issued, cables land. Freshness is part of accuracy,
            so each part of the site runs on an explicit schedule:
          </p>
          <div className="space-y-4 mb-14">
            {cadence.map((c) => (
              <div key={c.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <c.icon className="size-5 text-cyan mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Estimates policy */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How we handle estimates
          </h2>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 sm:p-6 mb-14">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              Some important figures are simply not published anywhere — and
              pretending otherwise would break the trust this site runs on.
              When we estimate, the estimate is{" "}
              <strong className="text-foreground font-semibold">
                labelled as an estimate, shown with its reasoning, and kept out
                of headline stat rows
              </strong>
              . Estimated figures live inside article bodies where there is
              room to explain the calculation, and they carry the ESTIMATE
              label described in the{" "}
              <Link href="/editorial-policy" className="text-cyan hover:underline">
                Editorial Policy
              </Link>
              . Headline statistics on the homepage and in the directory are
              always drawn from the verified dataset.
            </p>
          </div>

          {/* Corrections */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8 mb-14">
            <div className="flex items-start gap-3 mb-3">
              <Mail className="size-5 text-cyan flex-shrink-0 mt-0.5" />
              <h2 className="text-lg font-semibold text-foreground">
                Corrections policy
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              If a figure is wrong, we want it fixed fast. Email{" "}
              <a
                href="mailto:elmaccommunicationslimited@gmail.com"
                className="text-cyan hover:underline"
              >
                elmaccommunicationslimited@gmail.com
              </a>{" "}
              with the entry, the figure you are challenging, and a primary
              source. Corrections are acknowledged within 48 hours and, where
              your source checks out, applied within five working days with the
              verification date updated. Material corrections are noted on the
              page itself — accuracy beats ego.
            </p>
          </div>

          {/* Citing DC254 */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Citing DC254
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            You are welcome to cite our data in reports, articles, and briefs.
            Please credit &ldquo;Data Centre 254&rdquo; with a link to the
            relevant page, and include the verification date shown on the entry
            (for example: &ldquo;DC254 Directory, verified August 2026&rdquo;).
            For bulk data, interviews, or briefing requests,{" "}
            <Link href="/contact" className="text-cyan hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
