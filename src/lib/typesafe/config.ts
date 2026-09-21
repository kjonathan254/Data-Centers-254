/**
 * TypeSafe integration config — SINGLE SOURCE OF TRUTH
 * =====================================================
 * Every question, option, level and threshold used by TypeSafe features
 * lives here. Nothing else in the codebase may hardcode question text.
 *
 * Editing rules (project principles):
 *  - Questions and thresholds are reviewed collaboratively; expect to edit.
 *  - Keep each question atomic (one judgment per question).
 *  - Code owns workflow; TypeSafe only supplies semantic judgments.
 *
 * This file must stay dependency-free (plain data) so both the Next.js
 * runtime and offline harness scripts can import it directly.
 */

// ─── Connection ──────────────────────────────────────────────────────────

export const TYPESAFE_MODEL = "jev-latest";
export const TYPESAFE_ENDPOINT = "https://api.typesafe.ai/v1/systemone";

/** Jev 1.13 pricing: $42 per billion input tokens = $0.042 per million. Output tokens are free. */
export const PRICE_PER_MTOK_INPUT = 0.042;

// ─── Thresholds (confidence gates — edit here, nowhere else) ─────────────

/** Choice/Score answers below this confidence are routed to human review. */
export const CONFIDENCE_MIN_AUTO = 0.6;
/**
 * Noul bands for evidence judgments:
 *   >= VERIFIED_MIN  → treat as supported (still logged for audit)
 *   <  UNSUPPORTED_MAX → treat as unsupported
 *   in between         → human review
 */
export const NOUL_VERIFIED_MIN = 0.75;
export const NOUL_UNSUPPORTED_MAX = 0.5;

// ─── Article topic taxonomy (mirrors the site's clusters) ────────────────

export const ARTICLE_TOPICS: Record<string, string> = {
  Beginner: "Concept explainers where the concept itself is the subject (what is a data centre, tier ratings, cooling basics, PUE basics, beginner careers guidance), even when Kenyan examples illustrate it",
  Kenya: "Kenya market stories: specific Kenyan or East African companies, facilities, deals, investments, operator comparisons, or business playbooks for Kenyan businesses — the company/market story is the subject",
  Internet: "Connectivity infrastructure — submarine cables, fibre routes, IXPs, latency, internet speeds, redundancy — even when Kenya-specific",
  Energy: "Power and energy: grid, geothermal, solar, renewables, tariffs, PUE economics and reliability",
  Careers: "Jobs, skills, certifications, salaries, business models and investment opportunities as the subject",
  AI: "AI and cloud computing demand and services — GPU compute, AI-ready facilities, cloud regions, model training, hosting markets",
  Infrastructure: "The physical facility and its systems — building design, cooling plant, racks, in-facility cabling, fire suppression, edge hardware deployments",
  Policy: "Regulation and policy — licensing, data protection, localisation, consultations, tax incentives, government policy — even when Kenya-specific",
  other: "Does not fit any of the listed topics",
};

export const ARTICLE_QUESTIONS = {
  topic: {
    type: "choice",
    instructions:
      "Which topic does this article primarily belong to? First ask: is the subject a concept or system, or a Kenya market/company/policy story? Concepts and systems take their technical topic even when Kenya examples appear. Stories about Kenyan companies, facilities, deals or markets take Kenya; stories about regulation and licensing take Policy regardless of country.",
    criteria: ARTICLE_TOPICS,
  },
  kenya_relevance: {
    type: "noul",
    instructions:
      "The article is specifically about Kenya or East African digital infrastructure — meaning Kenya/East Africa context, data or actors are substantive to its value, not just illustrative examples in a generic explainer.",
  },
  depth: {
    type: "score",
    instructions:
      "How deep does this article go? Judge the overall editorial depth of the piece.",
    criteria: [
      "News brief or announcement summary: short, mainly reporting what happened",
      "Practitioner explainer: how something works, with practical detail and local context",
      "Deep analysis: original research, data comparisons, or sustained argumentation",
    ],
  },
} as const;

// ─── Facility record questions (evidence engine v0) ──────────────────────

export const FACILITY_TYPE_OPTIONS: Record<string, string> = {
  hyperscale: "Purpose-built large-scale campus (roughly 10 MW or more, planned or built) positioned as hyperscale or AI/cloud at scale, whether or not it also sells colocation",
  colocation: "Carrier-neutral or retail colocation facility serving multiple customers",
  enterprise: "Single-operator facility built for its own enterprise workloads (banks, telcos, ISPs)",
  operator_owned: "Operator-owned exchange or network facility that also hosts equipment",
  government: "Government or state-run national data centre",
  cable_landing: "Cable landing station or facility whose primary role is submarine cable termination",
  other: "None of the listed categories clearly applies",
};

/**
 * Maps directory `facilityType` values (free-form, curated by the editor)
 * to the canonical options above. Code owns this mapping, not the model.
 */
export const FACILITY_TYPE_MAP: Record<string, string> = {
  Hyperscale: "hyperscale",
  Colocation: "colocation",
  Enterprise: "enterprise",
  "Enterprise (sells colocation)": "enterprise",
  "Operator-owned": "operator_owned",
  "Operator-owned (open access)": "operator_owned",
  "Operator-owned (cable landing)": "operator_owned",
  Government: "government",
  "Government / Enterprise": "government",
  "Cable Landing Station": "cable_landing",
};

export const FACILITY_QUESTIONS = {
  facility_type: {
    type: "choice",
    instructions:
      "Based on this facility record, which category best describes the facility's primary role? Judge by what the facility actually is, not by marketing language.",
    criteria: FACILITY_TYPE_OPTIONS,
  },
  evidence_support: {
    type: "noul",
    instructions:
      "Based only on this record, are the stated operational status and capacity figures backed by identifiable, relevant sources — operator pages or announcements, regulator records, PeeringDB, or reputable news that correspond to these specific claims? Answer yes when each major claim (status, headline capacity) traces to at least one such source. Answer no when a major claim rests on a single vague or promotional source, on no source, or on evidence that does not correspond to the claim.",
  },
} as const;
