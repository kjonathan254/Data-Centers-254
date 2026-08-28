import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Careers & Business",
  description: "Data centre jobs in Kenya, certifications, how to get started, business opportunities, and investment in the data centre industry.",
  alternates: { canonical: "/careers" },
  keywords: ["data centre jobs Kenya", "CDCP certification", "data centre careers Nairobi", "colocation business Kenya", "data centre investment Africa", "DCIM skills", "facility manager Kenya"],
  openGraph: {
    title: "Careers & Business | Data Centre 254",
    description: "Data centre jobs in Kenya, certifications, business opportunities, and investment in the data centre industry.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/dc-careers-tech.png", width: 1200, height: 675, alt: "Careers — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Business | Data Centre 254",
    description: "Data centre jobs, certifications, and business opportunities in Kenya's growing DC industry.",
    images: ["/images/dc-careers-tech.png"],
  },
};

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Careers" /></main>
      <Footer />
    </div>
  );
}
