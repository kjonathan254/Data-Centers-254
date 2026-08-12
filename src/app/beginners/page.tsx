import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Beginner Guides",
  description: "New to data centres? Start here. Plain-language guides that explain data centres, servers, cloud computing, and more — using examples you already know like M-Pesa and WhatsApp.",
  alternates: { canonical: "https://datacentre254.com/beginners" },
  openGraph: {
    title: "Beginner Guides | Data Centre 254",
    description: "New to data centres? Start here. Plain-language guides that explain data centres, servers, cloud computing, and more — using examples you already know like M-Pesa and WhatsApp.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beginner Guides | Data Centre 254",
    description: "New to data centres? Start here. Plain-language guides using M-Pesa, WhatsApp, and Netflix examples.",
  },
};

export default function BeginnersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Beginner" /></main>
      <Footer />
    </div>
  );
}
