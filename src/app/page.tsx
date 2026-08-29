import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import DirectorySearchBand from "@/components/sections/directory-search-band";
import LatestIntelligence from "@/components/sections/latest-intelligence";
import LatestNewsBanner from "@/components/sections/latest-news-banner";
import WhatIsDC from "@/components/sections/what-is-dc";
import TheScale from "@/components/sections/the-scale";
import ReadTheLibrary from "@/components/sections/read-the-library";
import CareersSection from "@/components/sections/careers-section";
import NewsletterV2 from "@/components/sections/newsletter-v2";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1 — Fullscreen photographic opening with overlay text + verified stat strip */}
        <Hero />
        {/* 2 — The strongest asset, searchable immediately (zero JS) */}
        <DirectorySearchBand />
        {/* 3 — Freshest reporting, image-led cards */}
        <LatestIntelligence />
        {/* 4 — One deep-dive feature */}
        <LatestNewsBanner />
        {/* 5 — From your pocket to the rack: the basics, with a real facility */}
        <WhatIsDC />
        {/* 6 — Map + sourced metrics (cables, facilities, cities, latency) */}
        <TheScale />
        {/* 7 — Every topic as an image-led entry point into 56 explainers */}
        <ReadTheLibrary />
        {/* 8 — The people inside the buildings */}
        <CareersSection />
        {/* 9 — Weekly briefing signup */}
        <NewsletterV2 />
      </main>
      <Footer />
    </div>
  );
}
