import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Internet and connectivity infrastructure in Kenya — submarine cables, KIXP, terrestrial fibre, and the physical network that connects data centres to the world.",
  alternates: { canonical: "/infrastructure" },
  openGraph: {
    title: "Infrastructure | Data Centre 254",
    description:
      "Internet and connectivity infrastructure in Kenya — submarine cables, KIXP, terrestrial fibre, and the physical network powering data centres.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/dc-switchgear.webp", width: 1200, height: 675, alt: "Infrastructure — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrastructure | Data Centre 254",
    description:
      "Internet and connectivity infrastructure in Kenya — submarine cables, KIXP, terrestrial fibre, and more.",
    images: ["/images/dc-switchgear.webp"],
  },
};

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ArticleClusterPage cluster="Internet" />
      </main>
      <Footer />
    </div>
  );
}
