import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Languages, BookOpen } from "lucide-react";
import { kiswahiliTerms } from "@/lib/glossary-kiswahili";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kamusi ya Kituo cha Data — Misamiato 22 kwa Kiswahili | Data Centre 254",
  description:
    "Pilot ya Kiswahili: misamiato 22 muhimu ya vituo vya data kwa lugha rahisi ya Kiswahili — kutoka kolokesheni na Peering hadi kebo za chini ya bahari na PUE.",
  alternates: { canonical: "/glossary/kiswahili" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Kamusi ya Kituo cha Data kwa Kiswahili — Data Centre 254",
  description: "Misamiato muhimu ya vituo vya data iliyoelezwa kwa Kiswahili rahisi.",
  url: `${SITE_URL}/glossary/kiswahili`,
  inLanguage: "sw-KE",
  hasDefinedTerm: kiswahiliTerms.map((t) => ({
    "@type": "DefinedTerm",
    name: `${t.sw} (${t.en})`,
    description: t.def,
  })),
};

export default function KiswahiliGlossaryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Kamusi · Pilot ya Kiswahili</p>
          <h1 className="text-display-sm text-foreground mb-5 flex items-start gap-3">
            <Languages className="mt-1 size-7 shrink-0 text-cyan" />
            Kamusi ya Kituo cha Data — kwa Kiswahili
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4">
            Miundombinu ya kidijitali ya Kenya inajengwa na Watanzania wa Kenya —
            lakini karibu yote ya vifaa vya kujifunza kuhusu vituo vya data viko
            kwa Kiingereza pekee. Hii ni <strong className="text-foreground">pilot</strong>:
            misamiato {kiswahiliTerms.length} muhimu, kila moja imeelezwa kwa
            Kiswahili rahisi na muktadha wa Kenya.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mb-10">
            Tunapima kama kuna mahitaji ya maudhui ya Kiswahili kwenye tovuti
            hii. Kama ungependa kupata maelezo mengi kwa Kiswahili — kamusi
            kamili, makala, au matoleo ya Kiswahili ya Kurasa za Msingi —
            tuandikie. Maoni yako yataamua tunachojenga ifuatayo.
          </p>

          {/* Terms */}
          <div className="space-y-4 mb-14">
            {kiswahiliTerms.map((t, i) => (
              <div key={t.en} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <span className="text-[11px] font-mono text-cyan/60">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-base font-semibold text-foreground">{t.sw}</h2>
                  <span className="text-xs text-muted-foreground">· {t.en}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.def}</p>
              </div>
            ))}
          </div>

          {/* Feedback CTA */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8 mb-14">
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="size-5 flex-shrink-0 mt-0.5 text-cyan" />
              <h2 className="text-lg font-semibold text-foreground">Ungependa zaidi kwa Kiswahili?</h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-5">
              Tuambie ni nini ungependa: kamusi kamili zaidi, makala za kina kwa
              Kiswahili, au matoleo ya Kiswahili ya Kurasa za Msingi? Tunaomba
              maoni ya watumiaji kabla ya kuwekeza — hii ni sehemu ya jinsi
              tunavyojenga, sio tu tunavyochapisha.
            </p>
            <a
              href="mailto:elmaccommunicationslimited@gmail.com?subject=Kiswahili%20feedback%20%E2%80%94%20Data%20Centre%20254"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan px-6 h-11 text-sm font-semibold text-background transition-colors hover:bg-cyan/90"
            >
              <Mail className="size-4" />
              Tuandikie maoni yako
            </a>
          </div>

          {/* Cross-links */}
          <div className="rounded-xl border border-border/50 p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">Endelea kujifunza</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/glossary" className="text-cyan hover:underline">
                  Kamusi kamili ya Kiingereza — misamiato 18 na muktadha wa Kenya →
                </Link>
              </li>
              <li>
                <Link href="/beginners" className="text-cyan hover:underline">
                  Kurasa za Msingi — anza kutoka mwanzo kabisa →
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-cyan hover:underline">
                  Jinsi tunavyothibitisha takwimu zetu →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
