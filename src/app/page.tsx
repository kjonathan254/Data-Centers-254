import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import ProofBand from "@/components/sections/proof-band";
import DirectorySearchBand from "@/components/sections/directory-search-band";
import FeaturedFacilities from "@/components/sections/featured-facilities";
import TheScale from "@/components/sections/the-scale";
import NewReportBanner from "@/components/sections/new-report-banner";
import LatestIntelligence from "@/components/sections/latest-intelligence";
import StartHere from "@/components/sections/start-here";
import NewsletterV2 from "@/components/sections/newsletter-v2";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1-2, Fullscreen photographic opening: proposition, three primary
               actions, verified stat strip - the whole product in one screen */}
        <Hero />
        {/* 3, Trust: what the numbers are and when they were last verified */}
        <ProofBand />
        {/* 4, Directory as the lead product: search immediately, then the
               flagship records and the market structure */}
        <DirectorySearchBand />
        <FeaturedFacilities />
        {/* 5, The map as a product: one preview, one action */}
        <TheScale />
        {/* 6, The report: the interpretation layer over the directory */}
        <NewReportBanner />
        {/* 7, Market intelligence: freshest reporting, image-led cards */}
        <LatestIntelligence />
        {/* 8, Learn the infrastructure: three beginner doors, not nine categories */}
        <StartHere />
        {/* 9, Stay informed: The Rack Report, monthly */}
        <NewsletterV2 />
      </main>
      <Footer />
    </div>
  );
}
