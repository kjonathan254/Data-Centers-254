import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import BreakingNewsBar from "@/components/sections/breaking-news-bar";
import DirectorySearchBand from "@/components/sections/directory-search-band";
import FeaturedFacilities from "@/components/sections/featured-facilities";
import LatestIntelligence from "@/components/sections/latest-intelligence";
import LatestNewsBanner from "@/components/sections/latest-news-banner";
import WhatIsDC from "@/components/sections/what-is-dc";
import TheScale from "@/components/sections/the-scale";
import ReadTheLibrary from "@/components/sections/read-the-library";
import WhoWeHelp from "@/components/sections/who-we-help";
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
        {/* 2 — Breaking story, one line, straight to the reporting */}
        <BreakingNewsBar />
        {/* 3 — The strongest asset, searchable immediately (zero JS) */}
        <DirectorySearchBand />
        {/* 3.5 — The product itself: flagship facilities, deep-linked */}
        <FeaturedFacilities />
        {/* 4 — Freshest reporting, image-led cards */}
        <LatestIntelligence />
        {/* 5 — One deep-dive feature */}
        <LatestNewsBanner />
        {/* 6 — From your pocket to the rack: the basics, with a real facility */}
        <WhatIsDC />
        {/* 7 — Map + sourced metrics (cables, facilities, cities, latency) */}
        <TheScale />
        {/* 8 — Every topic as an image-led entry point into 56 explainers */}
        <ReadTheLibrary />
        {/* 9 — Audience entry points: students / journalists / operators / researchers */}
        <WhoWeHelp />
        {/* 10 — The people inside the buildings */}
        <CareersSection />
        {/* 11 — Weekly briefing signup */}
        <NewsletterV2 />
      </main>
      <Footer />
    </div>
  );
}
