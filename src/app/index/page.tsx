import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Directory from "@/components/sections/directory";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kenya's Data Centre Index",
  description:
    "A searchable database of every data centre facility in Kenya. Filter by operator, status, type, and capacity. Every facility verified and sourced with evidence chains.",
  alternates: { canonical: "https://datacentre254.com/index" },
  openGraph: {
    title: "Kenya's Data Centre Index | Data Centre 254",
    description:
      "Kenya's most comprehensive data centre index. Search, filter, and compare facilities. Every claim sourced and verified.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya's Data Centre Index | Data Centre 254",
    description:
      "Kenya's most comprehensive data centre index. Search, filter, and compare facilities.",
  },
};

async function getDirectorySummary() {
  try {
    const facilities = await db.facility.findMany({
      include: {
        operator: { select: { name: true } },
        connectivityProviders: { include: { provider: { select: { name: true } } } },
        certifications: { include: { certification: { select: { name: true } } } },
      },
      orderBy: { name: "asc" },
    });
    return facilities;
  } catch {
    return [];
  }
}

export default async function IndexPage() {
  const facilities = await getDirectorySummary();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Server-rendered content for crawlers */}
        {facilities.length > 0 && (
          <div className="sr-only" aria-hidden="true">
            <h1>Kenya Data Centre Index</h1>
            <p>
              Data Centre 254's index lists {facilities.length} data centre facilities in Kenya.
              {" "}
              Operators include: {facilities.map((f) => f.operator.name).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.
            </p>
            <ul>
              {facilities.map((f) => (
                <li key={f.id}>
                  {f.name} — {f.operator.name} — {f.city}{f.tierRating ? `, ${f.tierRating}` : ""}
                  {f.itLoadMw ? `, ${f.itLoadMw}MW IT load` : ""}
                  {f.status !== "Operational" ? `, ${f.status}` : ""}
                  {f.connectivityProviders.length > 0
                    ? `, connectivity: ${f.connectivityProviders.map((cp) => cp.provider.name).join(", ")}`
                    : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Directory />
      </main>
      <Footer />
    </div>
  );
}
