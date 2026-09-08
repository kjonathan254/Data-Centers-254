import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Phone, Megaphone, MailOpen, MapPin, Building2, PenLine, TrendingUp, BarChart3, MapPinned } from "lucide-react";
import { getStats, SUBSCRIBER_ROLES } from "@/lib/newsletter-store";

export const metadata: Metadata = {
  title: "Advertise & Partner",
  description:
    "Reach a specialist audience across Kenya's rapidly developing digital infrastructure ecosystem. Sponsor The Rack Report, commission sponsored intelligence, or license market data.",
  alternates: { canonical: "/advertise" },
};

// The live-list block below must not be frozen at build time — ISR keeps
// the page cached while the audience numbers refresh every 5 minutes.
export const revalidate = 300;

const opportunities = [
  {
    icon: MailOpen,
    num: "01",
    title: "Briefing sponsorship",
    body: "One sponsor per issue of The Rack Report, the weekly intelligence briefing on East Africa's data centre build-out. A 75–100 word sponsored message with your logo and link, clearly labelled — plus a tracked click report every month.",
  },
  {
    icon: PenLine,
    num: "02",
    title: "Sponsored intelligence",
    body: "A researched editorial piece presented by your brand — for example “Kenya's Data Centre Power Challenge, presented by [Company]”. You attach to the reporting; the conclusions stay fully independent. That independence is exactly what makes the attachment worth paying for.",
  },
  {
    icon: BarChart3,
    num: "03",
    title: "Market reports",
    body: "“Kenya Data Centre Market” — operators, capacity, locations, power, connectivity and investment in one report. License it for your team, or sponsor its production and put your brand on the definitive market document.",
  },
  {
    icon: Building2,
    num: "04",
    title: "Directory placement & featured listing",
    body: "Operators and service providers can enrich their DC Directory profiles — certifications, capacity, connectivity, expansions, verified and sourced like every entry. Featured listings add priority placement in relevant searches. Paid placement changes prominence, never the data — verification stays mandatory in every tier.",
  },
  {
    icon: MapPinned,
    num: "05",
    title: "Market sponsorship",
    body: "Name sponsorship of the Kenya DC Directory or the Infrastructure Map — the two reference assets this market cites. One sponsor per section, clearly disclosed, in the tradition of the sponsored industry maps everybody already cites.",
  },
  {
    icon: Building2,
    num: "06",
    title: "Annual industry partnership",
    body: "The full bundle for companies building long-term position in this market: briefing sponsorship, directory presence, commissioned research, events, interviews, reports and thought leadership. This is where the real B2B relationship lands.",
  },
];

const facts = [
  { icon: Building2, value: "26", label: "Verified facilities in the DC Directory" },
  { icon: PenLine, value: "60+", label: "Researched explainers across 7 clusters" },
  { icon: MapPin, value: "Kenya-first", label: "Audience of builders, operators & students" },
];

export default async function AdvertisePage() {
  // Live signup segmentation — the real media-kit numbers. Display-only:
  // degrades to zeros without drama if the store is unreachable.
  let stats: Awaited<ReturnType<typeof getStats>> | null = null;
  try {
    stats = await getStats();
  } catch {
    stats = null;
  }
  const hasAudience = (stats?.total ?? 0) > 0;
  const topRoles = stats
    ? SUBSCRIBER_ROLES.filter((r) => stats!.byRole[r.value] > 0)
        .sort((a, b) => stats!.byRole[b.value] - stats!.byRole[a.value])
        .slice(0, 4)
    : [];

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
            DataCentre254 is a specialist media channel focused exclusively on
            Kenya&apos;s data-centre and digital-infrastructure ecosystem — not a
            general tech site. Sponsorship here means your brand is associated
            with research and clarity, clearly labelled and never at the cost
            of editorial trust.
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

          {/* Commercial ladder */}
          <h2 className="text-xl font-semibold text-foreground mb-2">The commercial ladder</h2>
          <p className="text-sm text-muted-foreground mb-6">Start where the fit is right — each rung deepens the relationship.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            {opportunities.map((o) => (
              <div key={o.num} className="rounded-xl border border-border/50 p-6 hover:border-cyan/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-cyan">{o.num}</span>
                  <o.icon className="size-5 text-cyan" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{o.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>

          {/* Briefing sponsorship — slot pricing */}
          <h2 className="text-xl font-semibold text-foreground mb-2">Sponsor The Rack Report</h2>
          <p className="text-sm text-muted-foreground mb-6">The weekly intelligence briefing from DataCentre254 — infrastructure, power, connectivity, money and policy, every Monday.</p>
          <div className="rounded-xl border border-border/50 bg-card/60 p-6 sm:p-8 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-2xl font-bold text-foreground">$100–250</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">per slot, flat fee — priced on audience quality, not CPM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1 / issue</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">one sponsor per issue, four briefings a month — never an ad block</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Monthly report</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">tracked links show exactly what your slot delivered</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              <strong className="text-foreground">Founding industry partners:</strong> the first two partners ever pay{" "}
              <strong className="text-foreground">$75 per slot</strong> for
              their first two issues — after that, pricing follows the audience numbers below. Sponsors are vendors who
              sell to this market: cooling, power, connectivity, construction, consulting. New to the briefing?{" "}
              <a href="/rack-report" className="text-cyan hover:underline">See what lands in every issue</a>.
            </p>
            {/* Live audience composition */}
            {hasAudience && stats ? (
              <div className="rounded-lg border border-border/40 bg-accent/20 p-4">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  Live list — {stats.total} subscriber{stats.total === 1 ? "" : "s"}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {topRoles.map((r) => (
                    <span key={r.value} className="text-sm text-muted-foreground">
                      <strong className="text-foreground">{stats!.byRole[r.value]}</strong> {r.label.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-cyan/25 bg-cyan/5 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Founding partner window is open.</strong> The list is young —
                  which is exactly why the founding rate exists. Lock a slot before the numbers move the price.
                </p>
              </div>
            )}
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
              <a href="/editorial-policy" className="text-cyan underline hover:underline">editorial policy</a>.
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
