import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getFacilities, getDirectoryStats, getOperators } from "@/lib/directory-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Kenya's data centres, answered",
  description:
    "How many data centres does Kenya have? Which is the largest? What powers them? Straight answers from DC254's verified directory of Kenyan and East African digital infrastructure.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Kenya's data centres, answered | Data Centre 254",
    description:
      "How many data centres does Kenya have? Which is the largest? What powers them? Straight answers from the verified DC254 directory.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "Kenya's digital infrastructure map — DC254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Kenya's data centres, answered | Data Centre 254",
    description:
      "How many data centres does Kenya have? Which is the largest? What powers them? Answers from the verified DC254 directory.",
    images: ["/images/africa-dc-map.webp"],
  },
};

function fmtVerified(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", { month: "long", year: "numeric" });
}

export default function FaqPage() {
  const facilities = getFacilities();
  const operators = getOperators();
  const stats = getDirectoryStats();

  const largest = facilities
    .filter((f) => f.itLoadMw)
    .sort((a, b) => (b.itLoadMw ?? 0) - (a.itLoadMw ?? 0))[0];
  const pipelineMw = facilities
    .filter((f) => f.status !== "Operational")
    .reduce((s, f) => s + (f.totalCapacityMw || 0), 0);
  const aiReady = facilities.filter((f) => f.aiReady);

  const qa = [
    {
      q: "How many data centres does Kenya have?",
      a: `DC254 currently tracks ${facilities.length} data centre facilities across Kenya, of which ${stats.operationalCount} are operational. The rest are under construction or announced, including some of the largest projects in the region. The count covers commercial colocation campuses, telecom-owned facilities and government installations in Nairobi, Mombasa and secondary cities.`,
      links: [{ label: "browse the full directory", href: "/directory" }],
    },
    {
      q: "What is the largest data centre in Kenya or East Africa?",
      a: `By live capacity, ${largest?.name ?? "iXAfrica NBOX1"} in Nairobi leads the market with ${(largest?.itLoadMw ?? 4.5).toString()} MW of live IT load — East Africa's first hyperscale, AI-ready facility. The biggest number on the horizon is the Microsoft–G42 AI data centre project, a $1 billion commitment with around 100 MW of planned capacity announced for Nairobi. Scale claims change quickly in this market, so every figure on DC254 carries its source and verification date.`,
      links: [
        { label: "see the facility record", href: "/directory/ixafrica-nbox1" },
        { label: "read the AI cluster analysis", href: "/ai" },
      ],
    },
    {
      q: "How much new data centre capacity is coming to Kenya?",
      a: `Projects that are announced or under construction — outside today's operational fleet — represent roughly ${Math.round(pipelineMw)} MW of planned capacity. That includes iXAfrica's NBOX2 expansion, the Microsoft–G42 campus and other operator build-outs. Pipeline figures are developer-announced, not independently measured, which is exactly why DC254 separates live IT load from planned capacity throughout the directory.`,
      links: [{ label: "how we count capacity", href: "/methodology" }],
    },
    {
      q: "How many submarine cables connect Kenya to the global internet?",
      a: "Six international submarine cable systems are live in Kenya — SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE — all landing on the coast at Mombasa. A seventh, Meta's Daraja, is in development. This concentration is both Kenya's strength and its single point of failure: nearly all of the country's international bandwidth rides cables that meet at the same shoreline.",
      links: [{ label: "the infrastructure map", href: "/infrastructure/map" }],
    },
    {
      q: "What powers Kenya's data centres — and are they green?",
      a: "Kenya's electricity grid is one of the greenest on Earth: roughly 90% of generation comes from renewables, anchored by geothermal baseload from the Rift Valley plus hydro and wind. For data centres, that means a genuinely low-carbon power supply without relying on renewable-energy certificates — a structural advantage almost no other emerging market can match. This is quietly becoming Kenya's strongest pitch for AI and cloud investment.",
      links: [
        { label: "the energy cluster", href: "/energy" },
        { label: "Kenya's green data centre edge", href: "/articles/kenya-renewables-industrial-power-data-centres" },
      ],
    },
    {
      q: "Which Kenyan data centres are AI-ready?",
      a: `${stats.aiReadyCount} of the ${facilities.length} tracked facilities are flagged AI-ready on DC254, meaning they offer high-density racks, liquid-cooling readiness or GPU-capable power envelopes. AI workloads demand far more power per rack than conventional cloud hosting, and not every existing facility can retrofit to meet them. Each facility page lists what the operator has publicly committed to.`,
      links: [{ label: "filter AI-ready facilities", href: "/directory" }],
    },
    {
      q: "Who operates Kenya's data centres?",
      a: `The market runs on ${operators.length} tracked operators, spanning regional specialists (iXAfrica, Wingu Africa, Raxio), pan-African platforms (Africa Data Centres, Liquid Intelligent Technologies), national telecoms (Safaricom, Telkom Kenya) and government-backed players (Kenya Data Centres under the ICT Authority). It is a competitive, carrier-neutral market by regional standards — no single operator controls the majority of live capacity.`,
      links: [{ label: "see all operators", href: "/directory" }],
    },
    {
      q: "Do you need a licence to run a data centre in Kenya?",
      a: "Kenya's data centre market is liberalised, and the regulatory picture has been moving quickly — from licensing frameworks under the Communications Authority to county-level approvals and the national digital economy agenda. DC254 maintains a dedicated explainer on the licensing and regulatory framework as it stands, and tracks material changes as they happen.",
      links: [{ label: "the licensing framework explainer", href: "/news/kenya-data-centre-licensing-framework" }],
    },
    {
      q: "How does DC254 verify its numbers?",
      a: `Every facility in the directory carries a named data source, a confidence rating and a last-verified date — currently ${fmtVerified(facilities[0]?.lastVerified ?? new Date().toISOString())} across the board. We separate verified, in-service IT load from developer-announced pipeline figures, and we publish the method so you can check our work. When a claim cannot be verified, the directory says so instead of rounding up.`,
      links: [{ label: "read the DC254 methodology", href: "/methodology" }],
    },
    {
      q: "Can I download or reuse DC254's data?",
      a: "Yes — the full directory is free to download and cite, with no signup wall. Grab the CSV dataset or query the JSON API directly; both carry the same source and verification fields you see on the site. Attribution to Data Centre 254 is appreciated and helps the project keep the data current.",
      links: [
        { label: "download the CSV", href: "/api/directory/csv" },
        { label: "query the JSON API", href: "/api/directory" },
      ],
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <section className="section-y">
          <div className="container-site">
            <p className="eyebrow">FAQ</p>
            <h1 className="h-display mt-3 max-w-3xl text-foreground">
              Kenya&apos;s data centres, answered.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The questions journalists, investors and policymakers ask most —
              answered from DC254&apos;s verified directory, with the sources
              one click away.
            </p>

            <div className="mt-12 max-w-3xl space-y-10">
              {qa.map((item, i) => (
                <div key={item.q} className="border-t border-border/40 pt-8">
                  <h2 className="flex items-baseline gap-3 text-lg font-semibold text-foreground">
                    <span className="font-mono text-sm text-cyan/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.q}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.a}{" "}
                    {item.links.map((l, j) => (
                      <span key={l.href}>
                        {j > 0 && " · "}
                        <Link
                          href={l.href}
                          className="text-cyan underline underline-offset-2 hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      </span>
                    ))}
                    {item.links.length > 0 && "."}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-14 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Something we got wrong or left out?{" "}
              <Link href="/contact" className="text-cyan underline underline-offset-2 hover:text-foreground">
                Tell us
              </Link>{" "}
              — corrections are welcome and published.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
