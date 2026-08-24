import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EastAfricaInfrastructureMap from "@/components/east-africa-infrastructure-map";

export const metadata: Metadata = {
  title: "East Africa Digital Infrastructure Map | Data Centre 254",
  description:
    "Interactive visualization of data centres, submarine cables, fibre networks, and internet exchange points across Kenya, Tanzania, Uganda, Rwanda, and Ethiopia.",
  alternates: { canonical: "https://datacentre254.com/infrastructure/map" },
  openGraph: {
    title: "East Africa Digital Infrastructure Map | Data Centre 254",
    description:
      "Explore the digital infrastructure powering East Africa — from carrier-neutral data centres to submarine cable landing stations and internet exchange points.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "East Africa Digital Infrastructure Map",
    description:
      "Interactive map of data centres, cables, and IXPs across East Africa.",
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
