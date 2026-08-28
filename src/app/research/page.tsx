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
    images: [{ url: "/images/og-default.png", width: 1152, height: 864, alt: "Research — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | Data Centre 254",
    description:
      "Independent research and analysis on Kenya's digital infrastructure.",
    images: ["/images/og-default.png"],
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
