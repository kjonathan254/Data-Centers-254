import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Energy & Power",
  description: "How much electricity do data centres use? Can Kenya's geothermal energy power AI? Understanding the energy question behind data centres.",
  alternates: { canonical: "/energy" },
  keywords: ["data centre power Kenya", "geothermal energy data centre", "PUE", "Kenya electricity grid", "renewable energy data centre", "AI power consumption", "Olkaria geothermal"],
  openGraph: {
    title: "Energy & Power | Data Centre 254",
    description: "How much electricity do data centres use? Can Kenya's geothermal energy power AI? Understanding the energy question.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/dc-power-systems.webp", width: 1200, height: 675, alt: "Power & Energy — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Energy & Power | Data Centre 254",
    description: "Data centre electricity usage, Kenya's geothermal advantage, and the energy question behind AI infrastructure.",
    images: ["/images/dc-power-systems.webp"],
  },
};

export default function EnergyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Energy" /></main>
      <Footer />
    </div>
  );
}
