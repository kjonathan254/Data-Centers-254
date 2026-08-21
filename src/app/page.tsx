import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/sections/hero";
import WhatIsDC from "@/components/sections/what-is-dc";
import TheScale from "@/components/sections/the-scale";
import FollowData from "@/components/sections/follow-data";
import AIInfrastructure from "@/components/sections/ai-infrastructure";
import EnergySection from "@/components/sections/energy-section";
import TheNumber from "@/components/sections/the-number";
import ReadTheLibrary from "@/components/sections/read-the-library";
import CareersSection from "@/components/sections/careers-section";
import NewsletterV2 from "@/components/sections/newsletter-v2";
import LatestIntelligence from "@/components/sections/latest-intelligence";
import LatestNewsBanner from "@/components/sections/latest-news-banner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1 — Cinematic opening */}
        <Hero />
        {/* 2 — The foundation: what is a data centre, with revelations */}
        <WhatIsDC />
        {/* 3 — The scale: "There is no cloud" + map + sourced facts */}
        <TheScale />
        {/* 4 — The journey: M-Pesa KSh 1,000 through the chain */}
        <FollowData />
        {/* 5 — AI: the physical stack beneath "the cloud" */}
        <AIInfrastructure />
        {/* 6 — Energy: Rift Valley → Grid → Data Centre */}
        <EnergySection />
        {/* 6.5 — Latest News: featured editorial (static, no DB required) */}
        <LatestNewsBanner />
        {/* 7 — Latest Intelligence: newest articles from the DB */}
        <LatestIntelligence />
        {/* 8 — Visual silence: one massive number */}
        <TheNumber />
        {/* 9 — The library: 50 articles, discoverable */}
        <ReadTheLibrary />
        {/* 10 — Careers: the people behind the infrastructure */}
        <CareersSection />
        {/* Closer: editorial invitation — almost an afterthought */}
        <NewsletterV2 />
      </main>
      <Footer />
    </div>
  );
}
