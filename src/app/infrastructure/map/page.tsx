import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EastAfricaInfrastructureMap from "@/components/east-africa-infrastructure-map";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Kenya Data Centre Map — 14 Facilities, 6 Subsea Cables | Data Centre 254",
  description:
    "Interactive map of every data centre in Kenya — 13 in Nairobi, 1 in Mombasa — plus the six submarine cables landing at the coast and the fibre backbone of East Africa.",
  alternates: { canonical: "/infrastructure/map" },
  openGraph: {
    title: "Every data centre in Kenya, mapped | Data Centre 254",
    description:
      "Zoom from East Africa to the Nairobi cluster: 14 facilities, six subsea cables, and the fibre routes connecting them.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/og-infrastructure-map.webp", width: 1200, height: 630, alt: "Kenya data centre map — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Every data centre in Kenya, mapped",
    description:
      "14 facilities, six submarine cables, and the fibre backbone — zoom from East Africa down to the Nairobi cluster.",
    images: ["/images/og-infrastructure-map.webp"],
  },
};

export default function InfrastructureMapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <EastAfricaInfrastructureMap />
      </main>
      <Footer />
    </div>
  );
}
