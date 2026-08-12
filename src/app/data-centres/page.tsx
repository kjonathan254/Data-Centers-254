import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Data Centres",
  description:
    "Explore data centres in Kenya — from colocation facilities to hyperscale campuses. Understand the infrastructure powering Kenya's digital economy, with guides on operators, capacity, and connectivity.",
  alternates: { canonical: "https://datacentre254.com/data-centres" },
  openGraph: {
    title: "Data Centres | Data Centre 254",
    description:
      "Explore data centres in Kenya — operators, capacity, connectivity, and the infrastructure powering Kenya's digital economy.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Centres | Data Centre 254",
    description:
      "Explore data centres in Kenya — operators, capacity, connectivity, and the infrastructure powering Kenya's digital economy.",
  },
};

export default function DataCentresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ArticleClusterPage cluster="Beginner" />
      </main>
      <Footer />
    </div>
  );
}
