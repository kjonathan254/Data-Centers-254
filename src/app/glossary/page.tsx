import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlossaryContent from "./GlossaryContent";
import { glossaryTerms, glossaryCategories } from "@/lib/glossary-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Data Centre Glossary — 18 Key Terms Explained",
  description:
    "Plain-language definitions for 18 essential data centre terms — from PUE and tier ratings to submarine cables and peering. Every term explained with Kenya-specific context.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Data Centre Glossary | Data Centre 254",
    description:
      "18 essential data centre terms explained in plain language with Kenya-specific context. PUE, tier ratings, colocation, submarine cables, and more.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/og-default.png", width: 1152, height: 864, alt: "Data Centre Glossary — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Centre Glossary | Data Centre 254",
    description: "18 essential data centre terms explained with Kenya context.",
    images: ["/images/og-default.png"],
  },
};

/* Structured data — DefinedTermSet */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Data Centre 254 Glossary",
  description: "Essential data centre terminology explained with Kenya-specific context.",
  url: `${SITE_URL}/glossary`,
  publisher: {
    "@type": "Organization",
    name: "Data Centre 254",
    url: SITE_URL,
  },
  hasDefinedTerm: glossaryTerms.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    inDefinedTermSet: `${SITE_URL}/glossary`,
  })),
};

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <GlossaryContent
            terms={glossaryTerms}
            categories={glossaryCategories}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
