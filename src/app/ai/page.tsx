import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "AI Infrastructure",
  description:
    "AI infrastructure in Kenya — GPU capacity, cloud regions, AI-ready data centres, and the computing demand shaping Africa's next technology frontier.",
  alternates: { canonical: "https://datacentre254.com/ai" },
  openGraph: {
    title: "AI Infrastructure | Data Centre 254",
    description:
      "AI infrastructure in Kenya — GPU capacity, cloud regions, AI-ready data centres, and the computing demand shaping Africa's technology frontier.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/ai-gpu-servers.png", width: 1200, height: 675, alt: "AI & Cloud — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Infrastructure | Data Centre 254",
    description:
      "AI infrastructure in Kenya — GPU capacity, cloud regions, AI-ready data centres, and computing demand.",
    images: ["/images/ai-gpu-servers.png"],
  },
};

export default function AIPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ArticleClusterPage cluster="Kenya" />
      </main>
      <Footer />
    </div>
  );
}
