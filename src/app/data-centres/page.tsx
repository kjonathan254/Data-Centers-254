import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Inside Data Centres",
  description:
    "How data centres actually work — cooling, power, cabling, fire suppression and building design — plus the facilities operating in Kenya today. Plain-language explainers from DC254.",
  alternates: { canonical: "/data-centres" },
  keywords: [
    "how data centres work",
    "data centre cooling",
    "data centre power",
    "Kenya data centres",
    "data centre design",
    "tiers data centre",
  ],
  openGraph: {
    title: "Inside Data Centres | Data Centre 254",
    description:
      "Cooling, power, cabling and design — how the buildings behind Kenya's digital economy actually work.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/dc-cooling-crac.webp", width: 1200, height: 653, alt: "Cooling plant inside a data centre" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside Data Centres | Data Centre 254",
    description: "How the buildings behind Kenya's digital economy actually work.",
    images: ["/images/dc-cooling-crac.webp"],
  },
};

export default function DataCentresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ArticleClusterPage cluster="Infrastructure" />
      </main>
      <Footer />
    </div>
  );
}
