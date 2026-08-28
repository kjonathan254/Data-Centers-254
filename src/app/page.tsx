import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import DirectorySearchBand from "@/components/sections/directory-search-band";
import LatestIntelligence from "@/components/sections/latest-intelligence";
import LatestNewsBanner from "@/components/sections/latest-news-banner";
import WhatIsDC from "@/components/sections/what-is-dc";
import TheScale from "@/components/sections/the-scale";
import TheNumber from "@/components/sections/the-number";
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
        {/* 1 — Cinematic opening (compact, working CTAs) */}
        <Hero />
        {/* 2 — Directory search: the strongest asset, immediately reachable */}
        <DirectorySearchBand />
        {/* 3 — Latest articles: freshest content near the top */}
        <LatestIntelligence />
        {/* 4 — Featured editorial */}
        <LatestNewsBanner />
        {/* 5 — The foundation: what is a data centre, with revelations */}
        <WhatIsDC />
        {/* 6 — The scale: "There is no cloud" + map + sourced facts */}
        <TheScale />
        {/* 7 — Visual silence: one massive number */}
        <TheNumber />
        {/* 8 — The library: 50 articles, discoverable */}
        <ReadTheLibrary />
        {/* 9 — Careers: the people behind the infrastructure */}
        <CareersSection />
        {/* Closer: editorial invitation — almost an afterthought */}
        <NewsletterV2 />
      </main>
      <Footer />
    </div>
  );
}
