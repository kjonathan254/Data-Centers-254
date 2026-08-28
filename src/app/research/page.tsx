import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ResearchContent from "@/components/research-content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Independent research and analysis on Kenya's digital infrastructure — data centre markets, AI infrastructure, energy, and cloud computing.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research | Data Centre 254",
    description:
      "Independent research and analysis on Kenya's digital infrastructure — data centre markets, AI infrastructure, energy, and cloud computing.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | Data Centre 254",
    description:
      "Independent research and analysis on Kenya's digital infrastructure.",
  },
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ResearchContent />
      </main>
      <Footer />
    </div>
  );
}
