import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Directory from "@/components/sections/directory";
import { getFacilities } from "@/lib/directory-data";

export const metadata: Metadata = {
  title: "DC Directory",
  description:
    "A searchable database of every data centre facility in Kenya. Filter by operator, status, type, and capacity. Every facility verified and sourced.",
  alternates: { canonical: "/directory" },
  openGraph: {
    title: "DC Directory | Data Centre 254",
    description:
      "Kenya's most comprehensive data centre directory. Search, filter, and compare facilities.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 675, alt: "DC Directory — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DC Directory | Data Centre 254",
    description: "Kenya's most comprehensive data centre directory. Search, filter, and compare facilities.",
    images: ["/images/africa-dc-map.webp"],
  },
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const facilities = getFacilities();
  const opNames = [...new Set(facilities.map((f) => f.operator.name))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="sr-only" aria-hidden="true">
          <h1>Kenya Data Centre Directory</h1>
          <p>
            Data Centre 254's directory lists {facilities.length} data centre facilities in Kenya.
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
        <Directory initialSearch={search ?? ""} />
      </main>
      <Footer />
    </div>
  );
}
