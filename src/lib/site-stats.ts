import { getMarketSnapshot } from "./directory-data";
import { SUBSEA_CABLES } from "./market-trackers";

/**
 * Single source of truth for every platform-level figure shown anywhere on
 * the site (hero, homepage sections, map, metadata, chatbot). Audit finding:
 * the same numbers were previously re-stated with different labels and
 * different vintages across surfaces ("31 verified facilities" vs "27+4",
 * "~14 MW installed" vs "10.5 published" vs "28.2 mapped" vs "38.5 designed",
 * "six/nine/ten cables"). Every consumer imports from here so a dataset
 * update propagates everywhere at once, with one canonical label per number.
 *
 * Canonical labels (audit Table: "use consistent labels everywhere"):
 *   27      -> Verified facilities in Kenya
 *   31      -> Tracked facilities & projects (27 Kenya + 4 EA reference records)
 *   10.5 MW -> Published in-service IT load (verified, operational Kenya)
 *   38.5 MW -> Live designed capacity (built, operational Kenya)
 *   28.2 MW -> Mapped live capacity (map-layer subset with published MW)
 *   230 MW  -> Announced pipeline (under construction + committed + early stage)
 *   268.5 MW-> Total tracked supply, all stages
 *   7 / 10  -> Subsea cables in service / systems tracked
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

export interface CableStats {
  /** All systems in the register, regardless of status (10). */
  tracked: number;
  /** Ready for service at a Kenyan landing (7). */
  inService: number;
  /** Come ashore, RFS not yet announced; NOT counted live (1: Africa-1). */
  landedRfsPending: number;
  /** Announced or planned, not landed (Daraja, LuLu). */
  inDevelopment: number;
}

export interface PlatformStats {
  /** 31: every facility record including East Africa reference records. */
  totalTracked: number;
  /** 27: facilities physically in Kenya. */
  kenyaFacilities: number;
  /** 4: Tanzania, Uganda, Rwanda reference records. */
  regionalRecords: number;
  operators: number;
  /** 10.5 MW: verified in-service IT load, operational Kenya facilities. */
  publishedItLoadMw: number;
  /** 38.5 MW: designed capacity of operational Kenya facilities. */
  designedLiveMw: number;
  /** 230 MW: UC + committed + early stage, developer-announced. */
  pipelineMw: number;
  /** 268.5 MW: designed live + announced pipeline. */
  totalSupplyMw: number;
  cables: CableStats;
  lastVerified: string;
}

export function getPlatformStats(): PlatformStats {
  const snap = getMarketSnapshot();
  const designedLiveMw = r1(snap.stages[0].mw);
  const totalSupplyMw = r1(snap.totalSupplyMw);
  const inService = SUBSEA_CABLES.filter((c) => c.status === "In service").length;
  const landedRfsPending = SUBSEA_CABLES.filter(
    (c) => c.status === "Landed, RFS pending"
  ).length;
  return {
    totalTracked: snap.facilities,
    kenyaFacilities: snap.kenyaFacilities,
    regionalRecords: snap.regionalFacilities,
    operators: snap.operators,
    publishedItLoadMw: r1(snap.liveItLoadMw),
    designedLiveMw,
    pipelineMw: r1(totalSupplyMw - designedLiveMw),
    totalSupplyMw,
    cables: {
      tracked: SUBSEA_CABLES.length,
      inService,
      landedRfsPending,
      inDevelopment: SUBSEA_CABLES.length - inService - landedRfsPending,
    },
    lastVerified: snap.lastVerified,
  };
}

/** The one label each number wears, everywhere it appears. */
export const STAT_LABELS = {
  totalTracked: "Tracked facilities & projects",
  kenya: "Verified facilities in Kenya",
  publishedItLoad: "Published in-service IT load",
  designedLive: "Live designed capacity",
  mappedLive: "Mapped live capacity",
  pipeline: "Announced pipeline",
  totalSupply: "Total tracked supply, all stages",
  cablesInService: "Subsea cables in service",
  operators: "Operators tracked",
} as const;
