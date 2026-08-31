import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CompareTable from "@/components/compare/compare-table";
import ComparePicker from "@/components/compare/compare-picker";
import CopyLinkButton from "@/components/compare/copy-link-button";
import {
  parseCompareIds, getCompareFacilities, pickDefaultCompare,
  getCompareCandidates,
} from "@/lib/compare";

/**
 * Side-by-side facility comparison. Fully URL-driven (?ids=a,b,c) so every
 * comparison is a shareable link; the server renders the table, the picker
 * updates the URL in place. All param variants canonicalise to the bare page.
 */

export const metadata: Metadata = {
  title: "Compare Kenya Data Centres Side by Side",
  description:
    "Put any Kenyan data centres head to head — IT load, designed capacity, racks, tier rating, AI readiness, connectivity, cooling and power, with every figure sourced and dated. Free from Data Centre 254.",
  alternates: { canonical: "/directory/compare" },
  openGraph: {
    title: "Compare Kenya Data Centres Side by Side | Data Centre 254",
    description:
      "Any facilities, head to head: capacity, racks, tier, AI readiness, connectivity and power — sourced and dated.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "Data centre comparison — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Kenya Data Centres Side by Side",
    description: "Any facilities, head to head — sourced and dated. Free from Data Centre 254.",
    images: ["/images/africa-dc-map.webp"],
  },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const requested = parseCompareIds(ids);
  const facilities = getCompareFacilities(requested);
  const usedDefaults = facilities.length === 0;
  const shown = usedDefaults ? pickDefaultCompare() : facilities;
  const candidates = getCompareCandidates();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-16">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="eyebrow">DC Directory · Compare</span>
            <h1 className="h-display mt-3 text-foreground">
              Put Kenya&apos;s data centres head to head.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Choose up to four facilities and read them side by side — capacity,
              racks, tier, AI readiness, connectivity and power. Every figure is
              sourced and dated; nothing here is behind a signup wall.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/directory"
              className="text-sm text-cyan underline underline-offset-2 hover:text-foreground"
            >
              ← Browse the full directory
            </Link>
            {!usedDefaults && <CopyLinkButton />}
          </div>

          {/* Picker */}
          <div className="mt-8">
            <ComparePicker
              candidates={candidates}
              selected={shown.map((f) => f.slug)}
            />
          </div>

          {/* Table */}
          <div className="mt-8">
            {usedDefaults && (
              <p className="mb-4 text-sm text-muted-foreground">
                Showing a default trio to start from — add and remove facilities
                above to build your own comparison.
              </p>
            )}
            <CompareTable facilities={shown} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
