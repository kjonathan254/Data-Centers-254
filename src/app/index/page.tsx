import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Directory from "@/components/sections/directory";
import { getFacilities } from "@/lib/directory-data";

export const metadata: Metadata = {
  title: "Kenya's Data Centre Index",
  description:
    "A searchable database of every data centre facility in Kenya. Filter by operator, status, type, and capacity.",
  alternates: { canonical: "https://datacentre254.com/index" },
  openGraph: {
    title: "Kenya's Data Centre Index | Data Centre 254",
    description: "Kenya's most comprehensive data centre index. Search, filter, and compare facilities.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
};

export default function IndexPage() {
  const facilities = getFacilities();
  const opNames = [...new Set(facilities.map((f) => f.operator.name))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="sr-only" aria-hidden="true">
          <h1>Kenya Data Centre Index</h1>
          <p>
            Data Centre 254's index lists {facilities.length} data centre facilities in Kenya.
            Operators include: {opNames.join(", ")}.
          </p>
          <ul>
            {facilities.map((f) => (
              <li key={f.id}>
                {f.name} — {f.operator.name} — {f.city}{f.tierRating ? `, ${f.tierRating}` : ""}
                {f.itLoadMw ? `, ${f.itLoadMw}MW IT load` : ""}
                {f.status !== "Operational" ? `, ${f.status}` : ""}
              </li>
            ))}
          </ul>
        </div>
        <Directory />
      </main>
      <Footer />
    </div>
  );
}
