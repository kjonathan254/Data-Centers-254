import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Search,
  FileText,
  CalendarCheck,
  ShieldCheck,
  Database,
  Newspaper,
  Scale,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology — How DC254 Verifies Its Data",
  description:
    "The DC254 verification methodology: how facility data is sourced and verified, our update cadence, data confidence levels, and the corrections policy behind Kenya's data centre directory.",
  alternates: { canonical: "/methodology" },
};

const chain = [
  {
    icon: Search,
    title: "1. The claim",
    body: "Every figure in the DC Directory starts as a specific claim: a capacity in megawatts, a rack count, a tier rating, a launch date. Vague claims are not recorded — if a source will not say what it means, neither do we.",
  },
  {
    icon: FileText,
    title: "2. The source",
    body: "Each claim is attached to its origin: operator websites and annual reports, regulator filings and gazette notices, funding announcements, and reporting from established trade press (DataCenterDynamics, TechCabal, Business Daily, ITWeb Africa). The source is printed on every directory entry.",
  },
  {
    icon: CalendarCheck,
    title: "3. The date verified",
    body: "Every directory entry carries the month it was last checked — not the month it was written. When a facility expands, changes status, or is challenged by new reporting, the date moves. Stale data is treated as a bug.",
  },
  {
    icon: ShieldCheck,
    title: "4. Independent evidence",
    body: "Where possible, a claim is cross-checked against a second, independent source — a regulator record behind a company press release, trade press behind an operator announcement. Where we could only find one source, the entry says so through its confidence level.",
  },
];

const confidence = [
  {
    level: "High",
    description:
      "Confirmed by the operator and at least one independent source (regulator filing, trade press, or official document). Example: iXAfrica NBOX1's capacity, reported by the operator and covered by DataCenterDynamics.",
    className: "border-neon/25 text-neon bg-neon/5",
  },
  {
    level: "Medium",
    description:
      "Reported by a credible single source — usually the operator itself — with no independent confirmation yet. Most facility specs sit here, because operators rarely publish third-party-audited figures.",
    className: "border-cyan/20 text-cyan bg-cyan/5",
  },
  {
    level: "Low",
    description:
      "Based on limited public information: a listing, a brief mention, or an out-of-date company page. The entry is published because it is part of Kenya's infrastructure map, but treat the numbers as indicative.",
    className: "border-border text-muted-foreground bg-accent/30",
  },
];

const cadence = [
  {
    icon: Database,
    title: "DC Directory — monthly sweep, quarterly re-verification",
    body: "The directory is swept monthly for status changes (new launches, expansions, outages reported in press). Every entry is fully re-verified against its sources each quarter. The current dataset was last verified in September 2026.",
  },
  {
    icon: Newspaper,
    title: "News & market moves — as they happen",
    body: "Material announcements — a new subsea cable, an acquisition, a licence award — are covered when they happen and dated. If a story develops, the article's updated_date moves with it.",
  },
  {
    icon: Scale,
    title: "Explainers & reference articles — reviewed on change",
    body: "Evergreen explainers are reviewed when the underlying facts change — a new licence framework, a new cable landing — and the updated date at the top of each article reflects the last material review.",
  },
];

const countRules = [
  {
    title: "What we count as a facility",
    body: "A physical building in Kenya where IT equipment can be housed under a service agreement — carrier-neutral colocation, operator-owned sites that sell colocation, government facilities that accept outside workloads, and cable landing stations (labelled as such).",
  },
  {
    title: "What we exclude",
    body: "Pure enterprise server rooms with no outside colocation offer, and duplicate register entries. Example: the PeeringDB register carries an entry simply named \"Icolo\" registered by a third party at LRC Road — we treat it as a duplicate registration, not a distinct facility, and do not count it.",
  },
  {
    title: "One building, one entry",
    body: "Where a facility has been rebranded we keep one entry and say so. Example: \"East Africa Data Centre\" and \"Africa Data Centres Nairobi\" are the same Sameer Business Park building — it opened as EADC and was rebranded when Liquid Telecom consolidated its data centre arm under Cassava Technologies.",
  },
  {
    title: "Announced is not operating",
    body: "Committed, early-stage and under-construction projects are labelled as such and never counted as operating capacity. Where a press-release figure (e.g. a groundbreaking MW target) is shown, the entry states plainly that it is a plan, not an as-built figure.",
  },
];

const updateLog = [
  {
    date: "8 September 2026",
    changes: [
      "Added the four iColo (Digital Realty) facilities — NBO1, NBO2, MBA1, MBA2 — previously missing despite MBA1 being the most interconnected building on the Kenyan coast (94 networks on PeeringDB).",
      "Added PAIX Nairobi (Britam Tower), Safaricom Thika, Safaricom Red Hill (Limuru), Telkom Milimani, Telkom Telephone House (Nairobi and Mombasa), Konza National Data Centre, SEACOM Mombasa cable landing station, and SimbaNET Nairobi.",
      "Removed Wingu Nairobi after checking the operator's own website, which names only Djibouti, Ethiopia and Tanzania — Wingu does not operate in Kenya, despite appearing in many round-ups (including ours previously).",
      "Removed Africa Data Centres Mombasa: no operator page, no register entry, and no independent evidence supports it.",
      "Reclassified ADC Nairobi 2 as under construction — ADC's own site lists only NBO1 in Nairobi, and no source confirms the January 2023 expansion completed.",
      "Withdrew the capacity figures previously shown for Raxio Nairobi and reclassified it as early stage — the facility does not appear on the PeeringDB register (checked 8 Sep 2026) and no operator page confirms an opened Nairobi site.",
      "Updated iColo NBO2 for its formal launch on 7 September 2026 (Capital FM / Digital Realty) — still ramping on interconnection.",
      "Cross-checked every PeeringDB-registered Kenyan facility (14 records fetched 8 Sep 2026) and added per-entry network and exchange counts.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Trust</p>
          <h1 className="text-display-sm text-foreground mb-5">Methodology</h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-6">
            DC254&apos;s entire value is that you can trust the numbers. This
            page explains exactly how the data behind the{" "}
            <Link href="/directory" className="text-cyan underline hover:underline">
              DC Directory
            </Link>{" "}
            and our statistics is sourced, verified, dated, and corrected — and
            what to do when you think we got something wrong.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mb-12">
            For how articles are written, labelled, and kept editorially
            independent, see the{" "}
            <Link href="/editorial-policy" className="text-cyan underline hover:underline">
              Editorial Policy
            </Link>
            . This page is about the data.
          </p>

          {/* Verification chain */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How a data point gets verified
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Every facility entry in the directory passes through the same
            four-step chain before it is published:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {chain.map((s) => (
              <div key={s.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <s.icon className="size-5 text-cyan mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Confidence levels */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Data confidence levels
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Every directory entry carries one of three confidence badges, so
            you can see how strong the evidence behind it is:
          </p>
          <div className="space-y-3 mb-14">
            {confidence.map((c) => (
              <div key={c.level} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 rounded-lg border border-border/50 p-4">
                <span className={`flex-shrink-0 inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wider w-fit ${c.className}`}>
                  {c.level}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              </div>
            ))}
          </div>

          {/* Counting rules */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Counting rules
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Before any source is checked, the question has to be sharp. These
            are the rules that decide what appears in the directory:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {countRules.map((r) => (
              <div key={r.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <h3 className="text-base font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>

          {/* Update cadence */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Update cadence
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
            Kenya&apos;s infrastructure changes fast — capacity expands,
            licences are issued, cables land. Freshness is part of accuracy,
            so each part of the site runs on an explicit schedule:
          </p>
          <div className="space-y-4 mb-14">
            {cadence.map((c) => (
              <div key={c.title} className="rounded-xl border border-border/50 bg-accent/30 p-5">
                <c.icon className="size-5 text-cyan mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          {/* PeeringDB cross-check */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            The PeeringDB cross-check
          </h2>
          <div className="rounded-xl border border-border/50 bg-accent/30 p-6 mb-6">
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Every facility entry that exists on the{" "}
              <a href="https://www.peeringdb.com/api/fac?country=KE" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">PeeringDB facility register for Kenya</a>{" "}
              carries a cross-reference with the number of networks and internet
              exchanges registered at that building, plus the date we fetched it.
              The network count is the single best public proxy for how
              well-connected a building actually is — marketing pages rarely say.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Two caveats we state openly. First, PeeringDB coverage is evidence
              of interconnection, not of existence: genuinely operator-owned
              facilities (Safaricom Waiyaki Way, for example) may be absent from
              the register while being entirely real. Second, the register is
              community-maintained — a sparse record (iColo NBO2&apos;s two networks
              against a 6.5 MW design load) is a signal that a building is
              ramping, not proof that it does not exist. We treat the register
              as a cross-check, never as ground truth.
            </p>
          </div>

          {/* PIDA / continental registry layer */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            The PIDA layer — registry, not facilities
          </h2>
          <div className="rounded-xl border border-border/50 bg-accent/30 p-6 mb-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Separately from the facility directory, our map carries a layer drawn
              from the{" "}
              <a href="https://aid.nepad.org/" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">African Infrastructure Database</a>{" "}
              (AUDA-NEPAD&apos;s continental registry behind PIDA), fetched from its
              public API with dated requests. Registry entries are project
              preparations — sometimes at feasibility or structuring stage — and
              their figures are the registrant&apos;s own. They are shown as a
              distinct layer (violet diamonds) with their own table, and they are
              never counted in facility totals, capacity sums, or pipeline
              megawatts. Where a registry claim conflicts with an independent
              source (as the DARE1 capacity figures do), we publish both with the
              divergence noted.
            </p>
          </div>

          {/* Certification language */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Certification, read precisely
          </h2>
          <div className="rounded-xl border border-border/50 bg-accent/30 p-6 mb-14">
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              Most Kenyan data centre marketing uses &ldquo;Tier III&rdquo; loosely. Uptime
              Institute issues three distinct things, and the difference is money:
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li><span className="font-medium text-foreground">Tier Certification of Design Documents (TCDD)</span> — Uptime reviewed the drawings. Nothing has been inspected. These certificates carry expiry dates.</li>
              <li><span className="font-medium text-foreground">Tier Certification of Constructed Facility (TCCF)</span> — Uptime inspected and demonstration-tested the finished building. Substantially stronger.</li>
              <li><span className="font-medium text-foreground">Tier Certification of Operational Sustainability (TCOS)</span> — Uptime assessed how the facility is actually run.</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              &ldquo;Built to Tier III standards&rdquo; is a design statement by the operator,
              not a third-party certification — and directory entries say which is
              which. Where a facility carries no Uptime certification at all, the
              entry says that too, without treating it as a fault: plenty of
              excellent facilities are uncertified, but they should be priced
              differently.
            </p>
          </div>

          {/* Estimates policy */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            How we handle estimates
          </h2>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 sm:p-6 mb-14">
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              Some important figures are simply not published anywhere — and
              pretending otherwise would break the trust this site runs on.
              When we estimate, the estimate is{" "}
              <strong className="text-foreground font-semibold">
                labelled as an estimate, shown with its reasoning, and kept out
                of headline stat rows
              </strong>
              . Estimated figures live inside article bodies where there is
              room to explain the calculation, and they carry the ESTIMATE
              label described in the{" "}
              <Link href="/editorial-policy" className="text-cyan underline hover:underline">
                Editorial Policy
              </Link>
              . Headline statistics on the homepage and in the directory are
              always drawn from the verified dataset.
            </p>
          </div>

          {/* Update log */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Update log
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every correction and reclassification is logged here, dated, including
            our own errors — because a directory that never admits mistakes is
            telling you it never checks.
          </p>
          <div className="mb-14 space-y-4">
            {updateLog.map((u) => (
              <div key={u.date} className="rounded-xl border border-border/50 bg-accent/30 p-6">
                <p className="mb-3 text-sm font-semibold text-cyan">{u.date}</p>
                <ul className="space-y-2.5">
                  {u.changes.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan/40" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Corrections */}
          <div className="rounded-xl border border-cyan/25 bg-cyan/5 p-6 sm:p-8 mb-14">
            <div className="flex items-start gap-3 mb-3">
              <Mail className="size-5 text-cyan flex-shrink-0 mt-0.5" />
              <h2 className="text-lg font-semibold text-foreground">
                Corrections policy
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              If a figure is wrong, we want it fixed fast. Email{" "}
              <a
                href="mailto:elmaccommunicationslimited@gmail.com"
                className="text-cyan underline hover:underline"
              >
                elmaccommunicationslimited@gmail.com
              </a>{" "}
              with the entry, the figure you are challenging, and a primary
              source. Corrections are acknowledged within 48 hours and, where
              your source checks out, applied within five working days with the
              verification date updated. Material corrections are noted on the
              page itself — accuracy beats ego.
            </p>
          </div>

          {/* Citing DC254 */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Citing DC254
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            You are welcome to cite our data in reports, articles, and briefs.
            Please credit &ldquo;Data Centre 254&rdquo; with a link to the
            relevant page, and include the verification date shown on the entry
            (for example: &ldquo;DC254 Directory, verified August 2026&rdquo;).
            For bulk data, interviews, or briefing requests,{" "}
            <Link href="/contact" className="text-cyan underline hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
