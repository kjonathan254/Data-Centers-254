import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ArrowRight, CheckCircle2, HardHat, ShieldCheck, Megaphone, Zap,
  GitCompareArrows, Database, Shield, FileText, RefreshCw, Landmark, Download,
} from "lucide-react";
import {
  getFacilities, getMarketSnapshot, STATUS_ORDER,
} from "@/lib/directory-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "State of Kenyan Data Centres 2026 — The Annual Review | Data Centre 254",
  description:
    "The verified annual review of Kenya's data centre market: 26 tracked facilities, the live supply pipeline, interconnection league table, certification leaders, the power constraint, and what 2027 will decide.",
  alternates: { canonical: "/research/state-of-kenyan-data-centres-2026" },
  openGraph: {
    title: "State of Kenyan Data Centres 2026 | Data Centre 254",
    description:
      "Kenya's data centre market, verified: live capacity, pipeline stages, interconnection leaders, certification records and the power constraint — all sourced and dated.",
    siteName: "Data Centre 254",
    type: "article",
    locale: "en_KE",
    images: [{ url: "/images/africa-dc-map.webp", width: 1200, height: 630, alt: "State of Kenyan Data Centres 2026 — Data Centre 254" }],
  },
};

const STAGE_META: Record<string, { icon: typeof CheckCircle2; blurb: string }> = {
  Operational: { icon: CheckCircle2, blurb: "Built and in service. Capacity shown is designed facility capacity where the operator publishes it — commissioned IT load is tracked separately and is lower." },
  "Under Construction": { icon: HardHat, blurb: "Financed and physically underway. Completion dates shown are operator statements; none are independently confirmed until they open." },
  Committed: { icon: ShieldCheck, blurb: "Land secured and funding in place, pre-build. These projects are real intent, not yet real capacity." },
  "Early Stage": { icon: Megaphone, blurb: "Announced interest — from a national AI campus to an operator's entry signal. Tracked so the market's direction is visible, never counted as capacity." },
};

export default function StateOfKenyanDataCentres2026() {
  const snapshot = getMarketSnapshot();
  const facilities = getFacilities();
  const operational = facilities.filter((f) => f.status === "Operational");
  const ranked = [...operational]
    .filter((f) => (f.peeringdbNetworks ?? 0) > 0)
    .sort((a, b) => (b.peeringdbNetworks ?? 0) - (a.peeringdbNetworks ?? 0))
    .slice(0, 8);
  const pipeline = STATUS_ORDER.filter((s) => s !== "Operational")
    .flatMap((s) => facilities.filter((f) => f.status === s).map((f) => ({ f, s })));
  const certed = operational.filter((f) => f.certNote && (f.certifications.length > 0 || f.certNote.includes("Uptime")));
  const neutralCount = operational.filter((f) => f.carrierNeutral === true).length;
  const publishedMw = operational.reduce((s, f) => s + (f.itLoadMw || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-y">
          <p className="text-section-label mb-4">Annual Review · 2026 Edition</p>
          <h1 className="text-display-sm text-foreground mb-5">State of Kenyan Data Centres 2026</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4">
            The first edition of our annual review — every figure below is drawn
            live from the {facilities.length}-entry{" "}
            <Link href="/directory" className="text-cyan underline hover:underline">DC Directory</Link>{" "}
            dataset on the day you read this page, which is why this review never
            goes stale. Scope, sources and confidence tiers are documented in our{" "}
            <Link href="/methodology" className="text-cyan underline hover:underline">data methodology</Link>.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Dataset last verified: {snapshot.lastVerified} · Cross-checked against the PeeringDB Kenya register (fetched 8 Sep 2026)
          </p>

          {/* PDF edition CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan/25 bg-cyan/5 p-5 mb-12">
            <div>
              <p className="text-sm font-semibold text-foreground">Prefer the brief? Download the PDF edition</p>
              <p className="text-xs text-muted-foreground mt-1">
                Brief / 01 — 4 pages, a cover, two infographics, dated sources. Free, no signup wall.
              </p>
            </div>
            <a
              href="/reports/dc254-state-of-kenyan-data-centres-2026.pdf"
              download
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-cyan px-4 py-2.5 text-sm font-medium text-cyan-foreground hover:bg-cyan/90 transition-colors"
            >
              <Download className="size-4" /> Download PDF
              <span className="text-[10px] opacity-70 font-normal">4 pages · 2.7 MB</span>
            </a>
          </div>

          {/* Headline stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
            {[
              { label: "Facilities tracked", value: String(snapshot.facilities), sub: `${operational.length} operational` },
              { label: "Live IT load (published)", value: `${snapshot.liveItLoadMw.toFixed(1)} MW`, sub: "sum of operator-published IT load" },
              { label: "Built capacity (published)", value: `${snapshot.stages[0]?.mw.toFixed(1) ?? "0"} MW`, sub: "designed capacity of live sites" },
              { label: "Announced pipeline", value: `${(snapshot.totalSupplyMw - snapshot.stages[0]?.mw).toFixed(0)} MW`, sub: "UC + committed + early stage" },
            ].map((s) => (
              <div key={s.label} className="card-solid rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[11px] font-medium text-foreground/80 mt-1">{s.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Supply pipeline */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Database className="size-5 text-cyan" /> The supply pipeline, honestly staged
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Kenya&apos;s market is routinely described with a single inflated number
            that blends live capacity with press releases. We keep the stages
            separate — because &ldquo;announced&rdquo; and &ldquo;operating&rdquo; are different universes:
          </p>
          <div className="space-y-3 mb-14">
            {snapshot.stages.map((st) => {
              const meta = STAGE_META[st.stage];
              const Icon = meta?.icon ?? RefreshCw;
              return (
                <div key={st.stage} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <Icon className="size-4 text-cyan" /> {st.stage}
                      <span className="text-xs font-normal text-muted-foreground">· {st.count} facilit{st.count === 1 ? "y" : "ies"}</span>
                    </h3>
                    <span className="text-lg font-bold text-foreground tabular-nums">{st.mw.toFixed(1)} MW</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{meta?.blurb}</p>
                </div>
              );
            })}
          </div>

          {/* Interconnection league */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <GitCompareArrows className="size-5 text-cyan" /> The interconnection league table
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            In a market where almost everyone claims &ldquo;Tier III&rdquo;, the number that
            actually differentiates buildings is networks present. This is the
            PeeringDB-registered hierarchy on the day of verification:
          </p>
          <div className="overflow-hidden rounded-xl border border-border/50 mb-14">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-accent/40 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Facility</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">City</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Networks</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">IXs on site</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((f, i) => (
                  <tr key={f.id} className="border-b border-border/30 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/directory/${f.slug}`} className="font-medium text-foreground hover:text-cyan">{f.name}</Link>
                      <span className="block text-xs text-muted-foreground">{f.operator.name}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{f.city}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">{f.peeringdbNetworks}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">{f.peeringdbIxs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-xs text-muted-foreground border-t border-border/30 bg-accent/20">
              {neutralCount} of {operational.length} operating facilities are genuinely carrier-neutral. Register fetched 8 Sep 2026 — community-maintained, so treat as a floor, not a ceiling.
            </p>
          </div>

          {/* Certification leaders */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Shield className="size-5 text-cyan" /> Certification, read precisely
          </h2>
          <div className="rounded-xl border border-border/50 bg-accent/30 p-6 mb-14 space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Most Kenyan marketing says &ldquo;Tier III standards&rdquo; — a design claim, not a
              third-party certification. The facilities with the strongest formal
              records this year:
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li><span className="font-medium text-foreground">Safaricom Red Hill (Limuru)</span> — Uptime Tier III Design + Tier III Certification of Constructed Facility (26 Mar 2024): the strongest record of any commercial operator facility in Kenya.</li>
              <li><span className="font-medium text-foreground">Konza National Data Centre</span> — Uptime Tier III Constructed Facility (23 Aug 2022) + Design (13 Feb 2020): the government flagship&apos;s formal record.</li>
              <li><span className="font-medium text-foreground">Africa Data Centres NBO1</span> — operator states four data halls certified Uptime Tier 3, plus PCI DSS; Uptime&apos;s registry still files the building under legacy Liquid Telecom Group.</li>
              <li><span className="font-medium text-foreground">iColo campus</span> — ISO 27001 and PCI-DSS on the Digital Realty listings; no Uptime Tier certification published.</li>
              <li><span className="font-medium text-foreground">iXAfrica NBOX1</span> — no Uptime record; &ldquo;Tier III standard&rdquo; is an operator design statement. Excellent facilities can be uncertified — but they should be priced differently.</li>
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground border-t border-border/40 pt-3">
              TCDD = drawings reviewed · TCCF = finished building inspected · TCOS = operations assessed. Full explainer in the <Link href="/methodology" className="text-cyan underline hover:underline">methodology</Link>.
            </p>
          </div>

          {/* Pipeline to watch */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <HardHat className="size-5 text-cyan" /> The pipeline to watch
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            {pipeline.length} projects sit behind the operating fleet. The ones
            that will define 2027:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 mb-14">
            {pipeline.map(({ f, s }) => (
              <Link key={f.id} href={`/directory/${f.slug}`} className="card-solid card-solid-hover group rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground group-hover:text-cyan">{f.name}</span>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {f.totalCapacityMw ? `${f.totalCapacityMw} MW announced` : "capacity undisclosed"} · {f.operator.name}
                </p>
              </Link>
            ))}
          </div>

          {/* 2026 in review */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <FileText className="size-5 text-cyan" /> What changed in 2026
          </h2>
          <ul className="space-y-3 mb-14 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" /><span><strong className="text-foreground">Digital Realty launched NBO2 (7 Sep 2026)</strong> — iColo&apos;s second Karen building formally opened with state backing; still ramping on interconnection (2 networks registered). The year&apos;s biggest capacity event.</span></li>
            <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" /><span><strong className="text-foreground">Oracle chose iXAfrica (27 Jan 2026)</strong> — the OCI Nairobi region announcement is Kenya&apos;s first hyperscale-cloud-on-local-soil transaction, and the template for the inference edge.</span></li>
            <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" /><span><strong className="text-foreground">The G2M fibre route went live</strong> — Paratus&apos;s 2,000 km Goma–Mombasa artery added east-west terrestrial diversity to a corridor that needed it.</span></li>
            <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" /><span><strong className="text-foreground">EU money kept flowing</strong> — the EUR 102m EU-Kenya Digital Partnership and the DIF/Xalam country briefs keep Europe positioned as the market&apos;s enabler-of-record.</span></li>
            <li className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" /><span><strong className="text-foreground">The power ceiling held</strong> — the Microsoft–G42 project remains stalled on grid delivery at single-site scale, the market&apos;s clearest reminder that megawatts, not ambitions, are the currency.</span></li>
          </ul>

          {/* Outlook */}
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
            <Zap className="size-5 text-cyan" /> The 2027 question
          </h2>
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 mb-14">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              The published forecasts bracket Kenya&apos;s trajectory tightly: Xalam
              projects roughly 30% annual colocation growth through 2030; Ken
              Research&apos;s July 2026 report tracks commissioned IT load from 20 MW
              (2025) toward 90 MW (2031). Reconciling those with the verified
              base — {snapshot.liveItLoadMw.toFixed(1)} MW of published live IT
              load and {snapshot.stages.find((s) => s.stage === "Under Construction")?.mw.toFixed(0) ?? "33"} MW
              under construction — the decisive variable is not demand. It is
              whether power delivery and financing let the under-construction
              and committed stages convert on schedule. Watch four events in
              2027: NBOX1.2&apos;s completion, the first hyperscaler cloud region
              going live, the Microsoft–G42 site decision, and NBO2&apos;s
              interconnection count. Everything else is commentary.
            </p>
          </div>

          {/* Sources */}
          <div className="rounded-xl border border-border/50 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
              <Landmark className="size-4 text-cyan" /> Sources & verification
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Facility data: operator primary pages, the PeeringDB facility
              register (fetched 8 Sep 2026), Uptime Institute&apos;s public
              certification directory, and credible trade press — per-facility
              sources are listed on each{" "}
              <Link href="/directory" className="text-cyan underline hover:underline">directory entry</Link>.
              Market context: Xalam Analytics via the EU Digital Investment
              Facility country briefs; Ken Research&apos;s Kenya Data Center Market
              2019–2030 (July 2026). This page re-computes from the live
              dataset on every visit — if a number moves, so does the review.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/articles/kenya-data-centre-market-numbers" className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:gap-2.5 transition-all">
                Deep-dive: Kenya&apos;s market in numbers <ArrowRight className="size-4" />
              </Link>
              <a href="/reports/dc254-state-of-kenyan-data-centres-2026.pdf" download className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:gap-2.5 transition-all">
                PDF edition: Brief / 01 <Download className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
