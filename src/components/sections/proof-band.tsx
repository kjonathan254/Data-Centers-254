import Link from "next/link";
import { getPlatformStats } from "@/lib/site-stats";

/**
 * Trust band, sits directly under the hero.
 * One job: prove the platform is verified and current before the visitor
 * meets a single product block. Every figure comes from site-stats.ts with
 * its canonical label; the 31/27/4 distinction is printed in full so the
 * same market is never counted two different ways.
 * Server component, zero client JS.
 */
export default function ProofBand() {
  const stats = getPlatformStats();

  const verifiedDate = new Date(`${stats.lastVerified}T00:00:00`).toLocaleDateString(
    "en-KE",
    { month: "long", year: "numeric" }
  );

  const proofs = [
    {
      value: String(stats.totalTracked),
      label: "Tracked records",
      note: `${stats.kenyaFacilities} facilities in Kenya and ${stats.regionalRecords} East African reference records, across every build stage.`,
    },
    {
      value: String(stats.kenyaFacilities),
      label: "Verified facilities in Kenya",
      note: "Each carries an operator, a capacity figure and a named source.",
    },
    {
      value: String(stats.operators),
      label: "Operators tracked",
      note: "From incumbents to new entrants, with ownership in the open.",
    },
    {
      value: verifiedDate,
      label: "Last verified",
      note: "Every record in the directory is dated. Stale claims do not survive a verification pass.",
    },
  ];

  return (
    <section className="border-b border-border/40 bg-card/40">
      <div className="container-site py-10 sm:py-12">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          A verified view of a market changing quickly.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Announcements are cheap. These numbers are checked against named
          sources and re-verified on a stated date.
        </p>

        <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {proofs.map((p) => (
            <div key={p.label} className="border-t border-border/60 pt-5">
              <dd className="text-2xl font-semibold tabular-nums text-foreground">
                {p.value}
              </dd>
              <dt className="mt-1.5 text-sm font-medium text-foreground">
                {p.label}
              </dt>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {p.note}
              </p>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-xs text-muted-foreground">
          How every figure is defined and checked:{" "}
          <Link
            href="/methodology"
            className="text-cyan underline underline-offset-2 hover:text-cyan"
          >
            the DC254 methodology
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
