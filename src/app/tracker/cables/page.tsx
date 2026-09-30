import type { Metadata } from "next";
import { SUBSEA_CABLES, CABLES_LAST_VERIFIED } from "@/lib/market-trackers";
import { SITE_URL } from "@/lib/site";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TrackerNav from "@/components/tracker-nav";
import CableExplorer from "@/components/tracker/cable-explorer";

export const metadata: Metadata = {
  title: "Kenya Subsea Cable Tracker: Mombasa Landings & Pipeline",
  description:
    "Every submarine cable at Kenya's Mombasa landings: seven live systems, what is landed but not yet in service, and what is announced, with sources and dates.",
  alternates: { canonical: "/tracker/cables" },
  openGraph: {
    title: "Kenya Subsea Cable Tracker: Mombasa Landings & Pipeline",
    description:
      "Seven live systems, one landed and pending, two announced: Mombasa's cable slate, sourced and dated.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/og/mombasa-cable-landing-4.jpg", width: 1200, height: 630, alt: "Kenya subsea cable tracker, Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Subsea Cable Tracker",
    description: "Mombasa's cable slate: live, landed and announced, sourced and dated.",
    images: ["/og/mombasa-cable-landing-4.jpg"],
  },
};

export default function CablesTrackerPage() {
  const live = SUBSEA_CABLES.filter((c) => c.status === "In service");
  const pending = SUBSEA_CABLES.filter((c) => c.status === "Landed, RFS pending");
  const pipeline = SUBSEA_CABLES.filter((c) => c.status === "Announced" || c.status === "Planned");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya Subsea Cable Tracker",
    description: `A source-cited tracker of submarine cable systems at Kenya's Mombasa landings: ${live.length} live systems, ${pending.length} landed awaiting ready-for-service and ${pipeline.length} announced or planned, with owners, landing points and reported design capacity.`,
    url: `${SITE_URL}/tracker/cables`,
    isAccessibleForFree: true,
    keywords: ["submarine cables", "Mombasa", "subsea", "Kenya", "EASSy", "TEAMS", "2Africa", "East Africa connectivity"],
    creator: { "@type": "Organization", name: "Data Centre 254", url: SITE_URL },
    temporalCoverage: CABLES_LAST_VERIFIED,
    variableMeasured: ["Cable status", "Ready-for-service date", "Kenyan landing points", "Owners", "Design capacity"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 py-10 lg:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="container-site">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="eyebrow">Cable tracker · Kenya</span>
            <h1 className="h-display mt-3 text-foreground">
              The cables under Mombasa, tracked.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Live systems, landed systems and planned routes — separated by evidence and
              status. A cable joins the live count when it carries traffic, not when it makes
              headlines. Verified monthly, every row sourced.
            </p>
          </div>
          <TrackerNav current="/tracker/cables" />

          {/* Status story, actions, trust modules, searchable full slate */}
          <CableExplorer />

          {/* Methodology */}
          <section aria-labelledby="methodology" id="methodology" className="mt-16 scroll-mt-20">
            <div className="card-solid rounded-xl p-5 sm:p-6">
              <h2 id="methodology" className="text-base font-semibold text-foreground">
                Methodology: the counting rule
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  The live count changes on ready-for-service, not on landing. Africa-1 is
                  ashore but not counted until an RFS date is published; Daraja and LuLu are
                  tracked so the pipeline is visible, never counted. Where a claim and the
                  evidence part ways, the row says so. Sources per row; full methodology on the
                  linked explainers.
                </p>
                <p>
                  Design capacity is operator-reported. Lit capacity is not published by
                  operators and is deliberately not estimated here, so the capacity column
                  tells you what was announced, never what is lit.
                </p>
                <p>
                  The dataset is re-verified in a monthly sweep (last verified{" "}
                  {CABLES_LAST_VERIFIED.replace("-", " ")}); when something changes, the update
                  panel at the top of the page says what moved and why.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
