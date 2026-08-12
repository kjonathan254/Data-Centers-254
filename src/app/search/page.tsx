import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Data Centre 254 — articles, facilities, and digital infrastructure knowledge.",
  alternates: { canonical: "https://datacentre254.com/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense>
          <SearchClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}