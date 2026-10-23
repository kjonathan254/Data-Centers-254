/**
 * Canonical-pipeline tests: directory stats, the tracker snapshot and the
 * CSV export must all reconcile to the same underlying dataset.
 *
 * Tech-audit 2026-10-23 (one-canonical-pipeline finding): every published
 * total must derive from the same aggregation over
 * src/data/directory/current.json - never recomputed independently per
 * surface. These tests import the raw JSON and the shared aggregation
 * module plus the CSV route, then assert the three agree. A future edit
 * that makes one surface diverge breaks the build here, before it breaks
 * the platform's central promise.
 *
 * Run: npx vitest run
 */
import { describe, expect, it } from "vitest";
import rawDataset from "../src/data/directory/current.json";
import {
  getDirectoryStats,
  getMarketSnapshot,
  facilityCountry,
  STATUS_ORDER,
  type Facility,
} from "@/lib/directory-data";

const facilities = rawDataset.facilities as unknown as Facility[];
const kenya = facilities.filter(
  (f) => (f.country || "Kenya") === "Kenya"
);

// Raw sum, no rounding: the shared aggregator emits raw float totals and
// the display layers round them. Comparing raw to raw keeps float dust as
// the only allowed difference (toBeCloseTo below).
function sum(list: (number | null)[]): number {
  return list.reduce<number>((s, x) => s + (x || 0), 0);
}

describe("canonical pipeline: directory stats reconcile to the raw dataset", () => {
  it("getDirectoryStats equals a manual aggregation of current.json", () => {
    const stats = getDirectoryStats();
    const ops = facilities.filter((f) => f.status === "Operational");
    expect(stats.totalFacilities).toBe(facilities.length);
    expect(stats.operationalCount).toBe(ops.length);
    expect(stats.totalMw).toBeCloseTo(sum(facilities.map((f) => f.itLoadMw)), 5);
    expect(stats.totalRacks).toBe(sum(facilities.map((f) => f.rackCount)));
    expect(stats.aiReadyCount).toBe(facilities.filter((f) => f.aiReady).length);
    expect(stats.countryCount).toBe(new Set(facilities.map(facilityCountry)).size);
  });

  it("getMarketSnapshot stage buckets equal a manual Kenya aggregation", () => {
    const snap = getMarketSnapshot();
    expect(snap.kenyaFacilities).toBe(kenya.length);
    expect(snap.facilities).toBe(facilities.length);
    expect(snap.regionalFacilities).toBe(facilities.length - kenya.length);

    for (const stage of STATUS_ORDER) {
      const inStage = kenya.filter((f) => f.status === stage);
      const published = snap.stages.find((s) => s.stage === stage);
      expect(published, `tracker stage ${stage} must exist`).toBeTruthy();
      expect(published!.count).toBe(inStage.length);
      expect(published!.mw).toBeCloseTo(sum(inStage.map((f) => f.totalCapacityMw)), 5);
    }
    expect(snap.totalSupplyMw).toBeCloseTo(
      sum(kenya.map((f) => f.totalCapacityMw)),
      5
    );
    expect(snap.liveItLoadMw).toBeCloseTo(
      sum(kenya.filter((f) => f.status === "Operational").map((f) => f.itLoadMw)),
      5
    );
  });

  it("stage buckets partition the Kenya census with no facility lost", () => {
    const snap = getMarketSnapshot();
    expect(snap.stages.reduce((s, x) => s + x.count, 0)).toBe(kenya.length);
  });

  it("the CSV export carries exactly the dataset's rows and statuses", async () => {
    const csvRoute = await import("@/app/api/directory/csv/route");
    const res = await (
      csvRoute as unknown as { GET: () => Response }
    ).GET();
    expect(res.status).toBe(200);
    const text = await res.text();
    const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim());
    const [header, ...rows] = lines;
    expect(header).toContain("slug");
    expect(header).toContain("status");
    expect(rows.length).toBe(facilities.length);

    const slugCol = header.split(",").indexOf("slug");
    const statusCol = header.split(",").findIndex((h) => h === "status");
    const csvBySlug = new Map(
      rows.map((r) => {
        const cells = r.split(",");
        return [cells[slugCol], cells[statusCol]];
      })
    );
    for (const f of facilities) {
      expect(csvBySlug.get(f.slug), `CSV row for ${f.slug}`).toBe(f.status);
    }
  });
});
