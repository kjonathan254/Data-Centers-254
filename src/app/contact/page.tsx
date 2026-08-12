import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Data Centre 254. Corrections, tips, feedback, collaboration inquiries, or just say hello.",
  alternates: { canonical: "https://datacentre254.com/contact" },
  openGraph: {
    title: "Contact | Data Centre 254",
    description: "Get in touch — corrections, tips, feedback, or collaboration inquiries.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Data Centre 254",
    description: "Get in touch with Data Centre 254.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactClient />
      </main>
      <Footer />
    </div>
  );
}
