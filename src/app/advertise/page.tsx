import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Phone, Megaphone, Newspaper, MailOpen, MapPin, Building2, PenLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise & Partner",
  description:
    "Reach Kenya's data centre and digital infrastructure audience. Sponsor DC254 Brief, publish a researched feature, or be listed in the DC Directory.",
  alternates: { canonical: "/advertise" },
};

const opportunities = [
  {
    icon: Newspaper,
    title: "Sponsored Features",
    body: "A researched, fact-checked article on a topic your brand cares about — clearly labelled as sponsored, written to the same editorial standard as the rest of the library.",
  },
  {
    icon: MailOpen,
    title: "Newsletter Sponsorship",
    body: "Put your brand inside DC254 Brief, the newsletter that reaches builders, operators, students, and decision-makers following Kenya's digital infrastructure.",
  },
  {
    icon: Building2,
    title: "Directory Placement",
    body: "Operators and service providers can enrich or expand their DC Directory profiles — certifications, capacity, connectivity, and expansions, verified and sourced.",
  },
  {
    icon: PenLine,
    title: "Research & Explainers",
    body: "Commission independent explainers and market notes on Kenya's data centre, energy, and connectivity landscape for your own channels.",
  },
];

const facts = [
  { icon: Building2, value: "14+", label: "Verified facilities in the DC Directory" },
  { icon: PenLine, value: "50+", label: "Researched explainers across 7 clusters" },
  { icon: MapPin, value: "Kenya-first", label: "Audience of builders, operators & students" },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-y">
          <p className="text-section-label mb-4">Work with us</p>
          <h1 className="text-display-sm text-foreground mb-5">
            Reach the people building Kenya&apos;s digital infrastructure
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-12">
            Data Centre 254 is an independent publication explaining data centres,
            connectivity, power, and AI infrastructure to a Kenyan and East African
            audience — engineers, operators, investors, students, and policymakers.
            Sponsorship on DC254 means your brand is associated with research and
            clarity, clearly labelled and never at the cost of editorial trust.
          </p>

          {/* Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <f.icon className="size-5 text-cyan mb-3" />
                <p className="text-2xl font-bold text-foreground mb-1">{f.value}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Opportunities */}
          <h2 className="text-xl font-semibold text-foreground mb-6">Ways to partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            {opportunities.map((o) => (
              <div key={o.title} className="rounded-xl border border-border/50 p-6 hover:border-cyan/30 transition-colors">
                <o.icon className="size-5 text-cyan mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-2">{o.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <Megaphone className="size-5 text-cyan flex-shrink-0 mt-0.5" />
              <h2 className="text-lg font-semibold text-foreground">Get the media kit</h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
              Tell us who you are and what you&apos;d like to do — we&apos;ll share formats,
              current audience numbers, and pricing. Every partnership is disclosed to
              readers, in line with our{" "}
              <a href="/editorial-policy" className="text-cyan hover:underline">editorial policy</a>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <a
                href="mailto:elmaccommunicationslimited@gmail.com?subject=Advertising%20enquiry%20%E2%80%94%20Data%20Centre%20254"
                className="inline-flex items-center justify-center gap-2 glow-cyan bg-cyan text-background rounded-lg px-6 h-11 text-sm font-semibold hover:bg-cyan/90 transition-all"
              >
                <Mail className="size-4" />
                elmaccommunicationslimited@gmail.com
              </a>
              <a
                href="tel:+254711707229"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 h-11 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-cyan/40 transition-all"
              >
                <Phone className="size-4" />
                0711 707 229
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Kevin Jonathan Otieno — Founder & Publisher, Nairobi, Kenya.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
