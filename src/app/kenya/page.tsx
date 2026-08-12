import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ArticleClusterPage from "@/components/article-cluster-page";

export const metadata: Metadata = {
  title: "Kenya's Data Centre Industry",
  description: "Where are Kenya's data centres? Who owns them? Why is Nairobi becoming East Africa's data centre hub? Deep dives into Kenya's digital infrastructure market.",
  alternates: { canonical: "https://datacentre254.com/kenya" },
  keywords: ["data centres Kenya", "iXAfrica", "Africa Data Centres", "Nairobi data centre", "Kenya DC market", "hyperscale Kenya", "Microsoft G42 Kenya"],
  openGraph: {
    title: "Kenya's Data Centre Industry | Data Centre 254",
    description: "Where are Kenya's data centres? Who owns them? Why is Nairobi becoming East Africa's data centre hub?",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya's Data Centre Industry | Data Centre 254",
    description: "Where are Kenya's data centres? Who owns them? Why Nairobi is becoming East Africa's data centre hub.",
  },
};

export default function KenyaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><ArticleClusterPage cluster="Kenya" /></main>
      <Footer />
    </div>
  );
}
