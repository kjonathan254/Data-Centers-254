import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, FileQuestion, Database, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description:
    "How Data Centre 254 researches, labels, and verifies its content — fact labels, sourcing standards, corrections, and editorial independence.",
  alternates: { canonical: "/editorial-policy" },
};

const labels = [
  {
    label: "FACT",
    description: "Verifiable from an authoritative primary source (regulator filings, company disclosures, official documents).",
  },
  {
    label: "REPORTED",
    description: "Stated by a credible media outlet or stakeholder, but not independently confirmed by us.",
  },
  {
    label: "ESTIMATE",
    description: "A reasoned calculation or industry projection when exact figures are not published.",
  },
  {
    label: "DC254 DATABASE",
    description: "Compiled by Data Centre 254 from operator announcements, filings, and verified public sources.",
  },
];

const principles = [
  {
    icon: CheckCircle2,
    title: "Sourcing first",
    body: "Every important number or claim carries a source and a fact label. Where a figure cannot be verified, we say so in the text rather than presenting it as settled.",
  },
  {
    icon: Database,
    title: "Verification with dates",
    body: "Directory entries and statistics carry a last-verified date. Kenya's infrastructure changes fast — capacity expands, licences get issued, cables land — so currency is part of accuracy.",
  },
  {
    icon: FileQuestion,
    title: "Corrections welcome",
    body: "If you spot an error, email us with the figure, the article, and a primary source. Verified corrections are made promptly and noted on the page.",
  },
  {
    icon: Scale,
    title: "Independence",
    body: "Sponsored content, when it exists, is always clearly labelled. Sponsors have no influence over editorial conclusions, directory data, or the fact labels applied to claims.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Standards</p>
          <h1 className="text-display-sm text-foreground mb-5">Editorial Policy</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-12">
            Data Centre 254 exists to make Kenya&apos;s digital infrastructure legible.
            Trust is the product — so here is exactly how our content is researched,
            labelled, and corrected.
          </p>

          {/* Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <p.icon className="size-5 text-cyan mb-3" />
                <h2 className="text-base font-semibold text-foreground mb-2">{p.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Fact labels */}
          <h2 className="text-xl font-semibold text-foreground mb-2">How we label facts</h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Statistics in our articles carry one of four labels, so you always know how
            strong a claim is:
          </p>
          <div className="space-y-3 mb-14">
            {labels.map((l) => (
              <div key={l.label} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 rounded-lg border border-border/50 p-4">
                <span className="flex-shrink-0 inline-flex items-center rounded-md bg-cyan/10 border border-cyan/25 px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wider text-cyan w-fit">
                  {l.label}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <h2 className="text-xl font-semibold text-foreground mb-2">Who is behind DC254</h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-10">
            Data Centre 254 is founded, researched, and written by{" "}
            <strong className="text-foreground font-semibold">Kevin Jonathan Otieno</strong>,
            a Kenyan writer and researcher with a background in communications, digital
            media, digital marketing, and technology, and self-taught depth in AI, cloud
            computing, and digital infrastructure. He publishes from Nairobi, Kenya.
          </p>

          {/* Corrections */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-3">
              <Mail className="size-5 text-cyan flex-shrink-0 mt-0.5" />
              <h2 className="text-lg font-semibold text-foreground">Corrections & feedback</h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              Spotted an error or a figure that needs updating? Email{" "}
              <a href="mailto:elmaccommunicationslimited@gmail.com" className="text-cyan hover:underline">
                elmaccommunicationslimited@gmail.com
              </a>{" "}
              or call{" "}
              <a href="tel:+254711707229" className="text-cyan hover:underline">
                0711 707 229
              </a>
              . Verified corrections are applied promptly — accuracy beats ego.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
