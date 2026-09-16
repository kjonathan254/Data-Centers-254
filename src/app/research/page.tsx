import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ResearchContent from "@/components/research-content";

export const metadata: Metadata = {
  title: "Research: Kenya Data Centre Reports",
  description:
    "DC254 reports and briefs on Kenya's digital infrastructure: free web summaries plus downloadable deep-dive PDFs. Open data, no signup wall.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "Research: Kenya Data Centre Reports",
    description:
      "Free summaries plus downloadable deep-dive PDFs on Kenya's data centre market.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/og-default.png", width: 1152, height: 864, alt: "Research, Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research: Kenya Data Centre Reports",
    description:
      "Free summaries plus downloadable deep-dive PDFs on Kenya's data centre market.",
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
