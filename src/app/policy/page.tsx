import type { Metadata } from "next";
import Link from "next/link";
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
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
          <Link
            href="/policy/intelligence"
            className="block rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-slate-600"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              New · Policy Intelligence
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              43 audited regulatory claims across Uganda, Rwanda and Tanzania — every claim with
              its sources, tiers and a five-state verification vocabulary.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Open the evidence layer →
            </p>
          </Link>
        </div>
        <ArticleClusterPage cluster="Policy" />
      </main>
      <Footer />
    </div>
  );
}
