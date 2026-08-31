import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Directory from "@/components/sections/directory";
import MarketSnapshot from "@/components/sections/market-snapshot";
import { getFacilities } from "@/lib/directory-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kenya Data Centre Directory & Market Snapshot",
  description:
    "Every data centre facility in Kenya, staged by supply pipeline — Live, Under Construction, Committed, Early Stage. Search, filter, and compare. Every facility verified and sourced.",
  alternates: { canonical: "/directory" },
  openGraph: {
    title: "Kenya Data Centre Directory | Data Centre 254",
    description:
      "Kenya's most comprehensive data centre directory with a staged market snapshot. Search, filter, and compare facilities.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "DC Directory — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Data Centre Directory | Data Centre 254",
    description: "Kenya's most comprehensive data centre directory. Search, filter, and compare facilities.",
    images: ["/images/africa-dc-map.webp"],
  },
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const facilities = getFacilities();
  const opNames = [...new Set(facilities.map((f) => f.operator.name))];

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya Data Centre Directory",
    description: `A verified, source-cited database of ${facilities.length} data centre facilities in Kenya, covering operators, operational status, IT load in MW, rack counts, tier ratings, AI readiness and connectivity for Nairobi, Mombasa and beyond.`,
    url: `${SITE_URL}/directory`,
    isAccessibleForFree: true,
    keywords: [
      "Kenya",
      "data centres",
      "data center directory",
      "colocation",
      "Nairobi",
      "Mombasa",
      "submarine cables",
      "AI infrastructure",
      "East Africa",
    ],
    creator: {
      "@type": "Organization",
      name: "Data Centre 254",
      url: SITE_URL,
    },
    variableMeasured: [
      "IT load (MW)",
      "Total designed capacity (MW)",
      "Operational status",
      "Rack count",
      "Tier rating",
      "AI readiness",
      "Operator",
      "Last verified date",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}/api/directory/csv`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/api/directory`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
        />
        <div className="sr-only" aria-hidden="true">
          <h1>Kenya Data Centre Directory</h1>
          <p>
            Data Centre 254's directory lists {facilities.length} data centre facilities in Kenya.
            Operators include: {opNames.join(", ")}.
          </p>
          <ul>
            {facilities.map((f) => (
              <li key={f.id}>
                {f.name} — {f.operator.name} — {f.city}{f.tierRating ? `, ${f.tierRating}` : ""}
                {f.itLoadMw ? `, ${f.itLoadMw}MW IT load` : ""}
                {f.status !== "Operational" ? `, ${f.status}` : ""}
              </li>
            ))}
          </ul>
        </div>
        {/* Data export — the "free, no signup wall" promise, made real. Server-rendered: works with JS disabled. */}
        <div className="container-site mt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Analysts and journalists: the full directory is free to download and
            cite —{" "}
            <a
              href="/api/directory/csv"
              download
              className="text-cyan underline underline-offset-2 hover:text-foreground"
            >
              CSV dataset
            </a>{" "}
            ·{" "}
            <a
              href="/api/directory"
              className="text-cyan underline underline-offset-2 hover:text-foreground"
            >
              JSON API
            </a>{" "}
            · no signup wall. Every row carries its source and verification
            date — see{" "}
            <Link href="/methodology" className="text-cyan underline underline-offset-2 hover:text-foreground">
              the methodology
            </Link>
            .
          </p>
        </div>
        <MarketSnapshot />
        <Directory initialSearch={search ?? ""} />
      </main>
      <Footer />
    </div>
  );
}
