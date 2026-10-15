/**
 * Typed access layer for the versioned Opportunity Brief editions
 * (src/data/opportunity-briefs/*.json).
 *
 * The brief JSON carries narrative only (signals, watchlist, sources,
 * redaction notes). Every market-level figure renders live from
 * @/lib/site-stats / @/lib/directory-data so the page, the sample PDF and
 * the directory can never disagree - no second source of truth for MW.
 */

import briefJson from "../data/opportunity-briefs/2026-q4-capacity-delivery.json";

export interface BriefSource {
  label: string;
  url: string;
  kind: "operator" | "registry" | "press" | "gov";
  usedFor?: string;
}

export interface BriefSignal {
  id: string;
  signal: string;
  project: string;
  organisation: string;
  location: string;
  status: string;
  whatChanged: string;
  sources: { label: string; url: string; kind: BriefSource["kind"] }[];
  supplierRelevance: string;
  confidence: string;
  confidenceReason: string;
  nextQuestion: string;
  lastChecked: string;
}

export interface BriefWatchItem {
  item: string;
  trigger: string;
  timeframe: string;
  confidence: string;
}

export interface OpportunityBrief {
  id: string;
  edition: string;
  title: string;
  decisionQuestion: string;
  headline: string;
  oneLineAnswer: string;
  audience: string[];
  intendedBuyers: string;
  /** Month the evidence was last verified, e.g. "2026-10". */
  verifiedThrough: string;
  publishedAt: string;
  lastUpdated: string;
  /** "pilot-sample" = the redacted sample is published; the paid edition is produced on purchase. */
  status: string;
  format: string;
  dataset: { source: string; note: string };
  signals: BriefSignal[];
  watchlist: BriefWatchItem[];
  sourcesRegister: BriefSource[];
  redactedFields: string[];
  methodologyNote: string;
  limitations: string;
  /** Privacy-policy version the enquiry consent text was written against. */
  privacyVersion: string;
}

const brief = briefJson as unknown as OpportunityBrief;

export function getOpportunityBrief(): OpportunityBrief {
  return brief;
}
