import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Directory from "@/components/sections/directory";
import MarketSnapshot from "@/components/sections/market-snapshot";
import { getFacilities, getMarketSnapshot, getKenyaCitySplit } from "@/lib/directory-data";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const facilities = getFacilities();
  const regional = facilities.filter((f) => (f.country || "Kenya") !== "Kenya");
  const kenyaCount = facilities.length - regional.length;
  const kenyaOp = facilities.filter((f) => f.status === "Operational" && (f.country || "Kenya") === "Kenya").length;
  const nairobi = facilities.filter((f) => f.city === "Nairobi").length;
  const mombasa = facilities.filter((f) => f.city === "Mombasa").length;
  // The city split must sum to kenyaCount or the description re-introduces the
  // old "19 + 4 of 27" contradiction. Shared dataset-derived helper, sorted,
  // so a future bump updates body copy and metadata together. Rendered string
  // stays <= 156 chars (149 today).
  const citySplit = getKenyaCitySplit();
  const restPart = citySplit.count > 0 ? `, ${citySplit.count} in ${citySplit.list}` : "";
  // Canonical labels, per the audit: 31 = tracked incl. regional records,
  // 27 = verified facilities in Kenya. Never blended in one number.
  const title = `Kenya Data Centre Directory: ${facilities.length} Tracked, ${kenyaCount} in Kenya`;
  const description = `How many data centres are in Kenya? ${kenyaCount} verified facilities: ${nairobi} Nairobi, ${mombasa} Mombasa${restPart}; ${kenyaOp} operational. Fully sourced.`;
  return {
    title,
    description,
    alternates: { canonical: "/directory" },
    openGraph: {
      title,
      description: `${kenyaCount} Kenya data centre facilities verified and sourced, ${kenyaOp} operational, plus ${regional.length} East Africa reference records. Search, filter, and compare with a staged market snapshot.`,
      siteName: "Data Centre 254",
      type: "website",
      locale: "en_KE",
      images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "DC Directory, Data Centre 254" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${kenyaCount} Kenya data centres verified and sourced, ${kenyaOp} operational. Search, filter, and compare.`,
      images: ["/images/africa-dc-map.webp"],
    },
  };
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const facilities = getFacilities();
  const snap = getMarketSnapshot();
  const regional = facilities.filter((f) => (f.country || "Kenya") !== "Kenya");
  const opNames = [...new Set(facilities.map((f) => f.operator.name))];
  const operationalCount = facilities.filter((f) => f.status === "Operational").length;
  const nairobiCount = facilities.filter((f) => f.city === "Nairobi").length;
  const mombasaCount = facilities.filter((f) => f.city === "Mombasa").length;
  const citySplitBody = getKenyaCitySplit();
  // Tab counts for the directory's four views (server-computed, passed down).
  const kenyaCount = facilities.length - regional.length;
  const pipelineCount = facilities.filter(
    (f) => (f.country || "Kenya") === "Kenya" && f.status !== "Operational"
  ).length;

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "DC254 Kenya & East Africa Data Centre Directory",
    description: `A verified, source-cited database of ${facilities.length} data centre facilities (${snap.kenyaFacilities} in Kenya, ${snap.regionalFacilities} across East Africa), covering operators, operational status, IT load in MW, rack counts, tier ratings, AI readiness and connectivity.`,
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
                {f.name}, {f.operator.name}, {f.city}{f.tierRating ? `, ${f.tierRating}` : ""}
                {f.itLoadMw ? `, ${f.itLoadMw}MW IT load` : ""}
                {f.status !== "Operational" ? `, ${f.status}` : ""}
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site mt-6">
          <h2 className="text-display-sm text-foreground mb-3">How many data centres are in Kenya?</h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl mb-2">
            DC254 currently tracks <strong className="text-foreground">{snap.kenyaFacilities} data centre facilities in Kenya</strong>{" "}
            ({nairobiCount} in Nairobi, {mombasaCount} in Mombasa, the rest in {citySplitBody.list}), of which{" "}
            {operationalCount - regional.filter((f) => f.status === "Operational").length} are operational, plus {snap.regionalFacilities} verified
            East Africa records: {regional.map((f) => `${f.name} (${f.country || "Kenya"})`).join(", ")}. The
            remaining {facilities.length - operationalCount} tracked sites are under construction, committed, or at an early
            stage. Every row is verified against a published source and dated, and the
            full dataset is free to download below.
          </p>
        </div>
        {/* Data export, the "free, no signup wall" promise, made real. Server-rendered: works with JS disabled. */}
        <div className="container-site mt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Analysts and journalists: the full directory is free to download and
            cite , {" "}
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
            date, see{" "}
            <Link href="/methodology" className="text-cyan underline underline-offset-2 hover:text-foreground">
              the methodology
            </Link>
            .
          </p>
        </div>
        <MarketSnapshot />
        <Directory
          initialSearch={search ?? ""}
          tabCounts={{ kenya: kenyaCount, ea: regional.length, pipeline: pipelineCount }}
        />
      </main>
      <Footer />
    </div>
  );
}
