import Link from "next/link";
import {
  CheckCircle, HardHat, ShieldCheck, Megaphone, ArrowRight,
} from "lucide-react";
import type { Facility } from "@/lib/directory-data";
import CopyLinkButton from "@/components/compare/copy-link-button";

/**
 * Side-by-side facility comparison — server-rendered from directory-data.ts.
 * Numeric rows highlight the leading facility; blanks render as an explicit
 * "Not disclosed" so the comparison stays honest (no invented data).
 */

const STAGE_BADGE: Record<string, string> = {
  Operational: "border-neon/25 text-neon bg-neon/10",
  "Under Construction": "border-cyan/25 text-cyan bg-cyan/10",
  Committed: "border-amber-500/25 text-amber-500 bg-amber-500/10",
  "Early Stage": "border-border text-muted-foreground bg-accent/50",
};

const STAGE_ICON: Record<string, typeof CheckCircle> = {
  Operational: CheckCircle,
  "Under Construction": HardHat,
  Committed: ShieldCheck,
  "Early Stage": Megaphone,
};

const VERIFIED_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmtVerified(v: string | null): string {
  if (!v) return "—";
  const [y, m] = v.split("-");
  const mi = parseInt(m, 10) - 1;
  if (!y || Number.isNaN(mi) || !VERIFIED_MONTHS[mi]) return v;
  return `${VERIFIED_MONTHS[mi]} ${y}`;
}

function list(items: string[]): string {
  return items.length ? items.join(" · ") : "Not disclosed";
}

interface RowSpec {
  label: string;
  /** String shown for every facility. */
  value: (f: Facility) => string;
  /** Numeric basis for "leading value" highlighting (higher wins). */
  numeric?: (f: Facility) => number | null;
  /** Long-form row (smaller type, more room). */
  long?: boolean;
}

const ROWS: RowSpec[] = [
  {
    label: "Status",
    value: (f) => f.status,
  },
  {
    label: "Operator",
    value: (f) => f.operator.name,
  },
  {
    label: "Location",
    value: (f) => [f.address, f.city].filter(Boolean).join(", ") || "—",
  },
  {
    label: "Live IT load",
    value: (f) => (f.itLoadMw != null ? `${f.itLoadMw} MW` : "Not disclosed / not live"),
    numeric: (f) => f.itLoadMw,
  },
  {
    label: "Designed capacity",
    value: (f) => (f.totalCapacityMw != null ? `${f.totalCapacityMw} MW` : "Not disclosed"),
    numeric: (f) => f.totalCapacityMw,
  },
  {
    label: "Racks",
    value: (f) => (f.rackCount != null ? f.rackCount.toLocaleString("en-US") : "Not disclosed"),
    numeric: (f) => f.rackCount,
  },
  {
    label: "Tier rating",
    value: (f) => (f.tierRating ? `Tier ${f.tierRating}` : "Not disclosed"),
  },
  {
    label: "Facility type",
    value: (f) => f.facilityType ?? "Not disclosed",
  },
  {
    label: "AI-ready",
    value: (f) => (f.aiReady ? "Yes" : "No"),
  },
  {
    label: "Opened / expected",
    value: (f) => f.openedDate ?? f.expansionDate ?? "Not announced",
  },
  {
    label: "Cooling",
    value: (f) => f.coolingType ?? "Not disclosed",
  },
  {
    label: "Power source",
    value: (f) => f.powerSource ?? "Not disclosed",
  },
  {
    label: "Renewable claim",
    value: (f) => f.renewableClaim ?? "None on record",
  },
  {
    label: "Connectivity",
    value: (f) =>
      list(f.connectivityFacility.map((c) => `${c.provider.name} (${c.provider.type})`)),
  },
  {
    label: "Certifications",
    value: (f) => list(f.certifications.map((c) => c.certification.name)),
  },
  {
    label: "Data confidence",
    value: (f) => f.dataConfidence,
  },
  {
    label: "Last verified",
    value: (f) => fmtVerified(f.lastVerified),
  },
  {
    label: "Notable",
    value: (f) => f.notable ?? "—",
    long: true,
  },
];

export default function CompareTable({ facilities }: { facilities: Facility[] }) {
  const cols = facilities.length;

  // Leading numeric value per row (only meaningful with 2+ comparable values).
  const leaders = new Set<number>();
  ROWS.forEach((row, ri) => {
    if (!row.numeric || cols < 2) return;
    const nums = facilities.map((f) => row.numeric!(f));
    const valid = nums.filter((n): n is number => n != null);
    if (valid.length < 2) return;
    const max = Math.max(...valid);
    if (max <= 0) return;
    nums.forEach((n, fi) => {
      if (n === max) leaders.add(fi * ROWS.length + ri);
    });
  });

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border/60 card-solid">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Side-by-side comparison of {facilities.map((f) => f.name).join(", ")}
          </caption>
          <thead>
            <tr className="border-b border-border/60">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-card px-4 py-4 text-left text-xs font-mono uppercase tracking-widest text-muted-foreground w-36 sm:w-44"
              >
                Specification
              </th>
              {facilities.map((f) => {
                const Icon = STAGE_ICON[f.status] ?? Megaphone;
                return (
                  <th
                    key={f.id}
                    scope="col"
                    className="px-4 py-4 text-left align-bottom border-l border-border/40"
                  >
                    <span
                      className={`mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STAGE_BADGE[f.status] ?? STAGE_BADGE["Early Stage"]}`}
                    >
                      <Icon className="size-3" />
                      {f.status === "Operational" ? "Live" : f.status}
                    </span>
                    <span className="block text-base font-semibold leading-snug text-foreground">
                      {f.name}
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {f.operator.name}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, ri) => (
              <tr
                key={row.label}
                className="border-b border-border/30 last:border-b-0 align-top"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {row.label}
                </th>
                {facilities.map((f, fi) => {
                  const isLeader = leaders.has(fi * ROWS.length + ri);
                  return (
                    <td
                      key={f.id}
                      className={`border-l border-border/40 px-4 py-3 ${
                        row.long ? "text-xs leading-relaxed" : "text-[13px]"
                      } ${
                        isLeader
                          ? "bg-cyan/5 font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isLeader && row.numeric ? (
                        <>
                          {row.value(f)}
                          <span className="ml-1.5 inline-block rounded bg-cyan/15 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-cyan align-middle">
                            Leads
                          </span>
                        </>
                      ) : (
                        row.value(f)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-border/60">
              <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Full profile
              </th>
              {facilities.map((f) => (
                <td key={f.id} className="border-l border-border/40 px-4 py-3">
                  <Link
                    href={`/directory/${f.slug}`}
                    className="inline-flex items-center gap-1 text-cyan underline underline-offset-2 hover:text-foreground"
                  >
                    View <ArrowRight className="size-3" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground/80">
        <strong className="font-medium text-muted-foreground">Reading this table:</strong>{" "}
        a cyan <span className="font-semibold text-cyan">Leads</span> flag marks the highest
        figure in a row — it is not an endorsement, and &ldquo;Not disclosed&rdquo; means the
        operator has not published the figure, not that it is zero. Every value carries a
        source and a verification date on the facility&apos;s own profile — see{" "}
        <Link href="/methodology" className="text-cyan underline underline-offset-2 hover:text-foreground">
          the methodology
        </Link>
        .
      </p>
    </div>
  );
}
