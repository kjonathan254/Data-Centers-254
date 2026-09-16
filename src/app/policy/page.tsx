import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Policy & Regulation: Kenya Data Centre Rules",
  description:
    "Licensing, data protection, taxation, and the regulatory frameworks shaping Kenya's data centre industry. Twelve deep dives, all sourced and dated.",
  alternates: { canonical: "/policy" },
  keywords: [
    "Kenya data centre regulation",
    "NFP-T2 licence",
    "Kenya Data Protection Act data centres",
    "data centre tax incentives Kenya",
    "CA licensing framework",
    "data centre policy East Africa",
  ],
  openGraph: {
    title: "Policy & Regulation: Kenya Data Centre Rules",
    description:
      "Licensing, data protection, taxation, and the rules shaping who builds what, where, in Kenya's data centre industry.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/images/dc-policy-regulation.webp",
        width: 1200,
        height: 675,
        alt: "Policy & Regulation coverage on Data Centre 254",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy & Regulation: Kenya Data Centre Rules",
    description:
      "Licensing, data protection, taxation, and the rules shaping Kenya's data centre industry.",
    images: ["/images/dc-policy-regulation.webp"],
  },
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Policy" /></main>
      <Footer />
    </div>
  );
}
