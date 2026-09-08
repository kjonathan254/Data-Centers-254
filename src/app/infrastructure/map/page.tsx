import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";
import EastAfricaInfrastructureMap from "@/components/east-africa-infrastructure-map";
import { PIDA_PROJECTS, PIDA_SOURCE } from "@/lib/pida-data";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Kenya Data Centre Map — 26 Facilities, 8 Subsea Cables | Data Centre 254",
  description:
    "Interactive map of every data centre in Kenya — Nairobi, Mombasa and beyond — plus the eight submarine cables landing at the coast, the fibre backbone of East Africa, and the PIDA continental project layer.",
  alternates: { canonical: "/infrastructure/map" },
  openGraph: {
    title: "Every data centre in Kenya, mapped | Data Centre 254",
    description:
      "Zoom from East Africa to the Nairobi cluster: 26 facilities, eight subsea cables, the fibre routes connecting them — and the continental PIDA project layer.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/og-infrastructure-map.webp", width: 1200, height: 630, alt: "Kenya data centre map — Data Centre 254" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Every data centre in Kenya, mapped",
    description:
      "26 facilities, eight submarine cables, and the fibre backbone — zoom from East Africa down to the Nairobi cluster.",
    images: ["/images/og-infrastructure-map.webp"],
  },
};

const sectorBadge: Record<string, string> = {
  ICT: "border-cyan/30 text-cyan bg-cyan/5",
  Energy: "border-amber-500/30 text-amber-500 bg-amber-500/5",
  Transport: "border-purple-400/30 text-purple-400 bg-purple-400/5",
  Water: "border-blue-400/30 text-blue-400 bg-blue-400/5",
};

export default function InfrastructureMapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <EastAfricaInfrastructureMap />

        {/* PIDA / African Infrastructure Database layer */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 mt-12">
          <div className="glass-card rounded-2xl border border-border/50 p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <span className="mt-0.5 inline-flex items-center justify-center size-9 shrink-0 rounded-xl border border-purple-400/30 bg-purple-400/10">
                <Database className="size-4.5 text-purple-400" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  The PIDA layer — Kenya on the continental pipeline
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Violet diamonds: projects registered in the African Infrastructure Database
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-6">
              <p>
                Beyond the facilities we verify building-by-building, this map now shows
                Kenya&apos;s registered projects from the{" "}
                <a href={PIDA_SOURCE.url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                  African Infrastructure Database
                </a>{" "}
                — AUDA-NEPAD&apos;s continental registry of infrastructure development,
                home of the Programme for Infrastructure Development in Africa (PIDA).
                Fetched from the public API on <strong className="text-foreground">{PIDA_SOURCE.fetched}</strong>.
              </p>
              <p>
                Kenya&apos;s registry holds <strong className="text-foreground">186 projects worth about US$172
                billion</strong> across four sectors (transport, energy, water, ICT). The
                public endpoint serves the first 100 records per request; this layer
                curates every ICT-sector project in that slice, plus the power and
                transport corridors that bear directly on Kenya&apos;s data centre
                build-out.
              </p>
              <p className="text-amber-500/90">
                One rule, stated plainly: a registry entry is a project preparation, not
                a built facility. Nothing in this layer is counted in our capacity
                totals — the <Link href="/directory" className="text-cyan hover:underline">DC Directory</Link>{" "}
                and this layer are kept deliberately separate.
              </p>
            </div>

            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[680px]">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Project</th>
                    <th className="px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Sector</th>
                    <th className="px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Capex</th>
                    <th className="px-2 py-2.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">PIDA code</th>
                  </tr>
                </thead>
                <tbody>
                  {PIDA_PROJECTS.map((p) => (
                    <tr key={p.id} className="border-b border-border/30 last:border-0 align-top">
                      <td className="px-2 py-3">
                        <p className="font-medium text-foreground leading-snug">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.countries.join(" · ")}</p>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${sectorBadge[p.sector] ?? "border-border text-muted-foreground"}`}>
                          {p.sector}{p.subsector ? ` · ${p.subsector}` : ""}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-muted-foreground">{p.status}</td>
                      <td className="px-2 py-3 text-muted-foreground tabular-nums">{p.capexM ? `US$${p.capexM}m` : "n/p"}</td>
                      <td className="px-2 py-3 text-muted-foreground font-mono text-xs">{p.pidaCode ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground/70 max-w-md">
                Source: {PIDA_SOURCE.label}, fetched {PIDA_SOURCE.fetched}. Registry records
                carry the registrant&apos;s own figures — we republish them dated, not verified.
              </p>
              <Link
                href="/articles/kenya-pida-infrastructure-pipeline"
                className="inline-flex items-center gap-1.5 text-cyan text-sm font-medium hover:gap-2.5 transition-all"
              >
                Read the full analysis <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
