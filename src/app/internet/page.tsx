import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Internet & Connectivity",
  description: "How the internet reaches Kenya, submarine cables explained, KIXP, internet peering, CDNs, and why cloud services need local infrastructure.",
  alternates: { canonical: "/internet" },
  keywords: ["subsea cables Kenya", "KIXP", "internet peering Kenya", "CDN Kenya", "submarine cables Mombasa", "TEAMS cable", "EASSy", "DARE1"],
  openGraph: {
    title: "Internet & Connectivity | Data Centre 254",
    description: "How the internet reaches Kenya, submarine cables explained, KIXP, internet peering, and why cloud services need local infrastructure.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/mombasa-cargo-ship.webp", width: 1200, height: 675, alt: "Internet Infrastructure — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet & Connectivity | Data Centre 254",
    description: "How the internet reaches Kenya. Submarine cables, KIXP, peering, CDNs, and local cloud infrastructure.",
    images: ["/images/mombasa-cargo-ship.webp"],
  },
};

export default function InternetPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Internet" /></main>
      <Footer />
    </div>
  );
}
