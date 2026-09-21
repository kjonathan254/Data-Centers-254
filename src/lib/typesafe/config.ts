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
 * Noul bands for evidence judgments — INTERNAL review/ranking signals only.
 *
 * Editorial decision (2026-09-21, approved by the editor): Evidence Engine
 * v0.1 ships scores as a review/ranking signal with NO hard gates — no
 * record may be hidden, suppressed, or publicly badged on these bands, and
 * no UI may surface them to readers as "verified" claims. AI grades
 * evidence, never establishes facts.
 *
 * Calibration is empirical, cut at the two natural gaps of the observed
 * composite (min of traceability/independence) distribution across all 31
 * records [range 0.04–0.66]: a near-empty cohort ≤ 0.14, the homepage-
 * sourced bulk 0.21–0.48, and the registry/press-corroborated cohort
 * 0.55–0.66. The previous 0.75/0.5 cuts produced 0% verified because they
 * were aspirational rather than observed. Re-calibrate when the
 * distribution shape changes, not on a schedule.
 *
 *   composite >= NOUL_VERIFIED_MIN    → strongest-evidence cohort
 *   composite <  NOUL_UNSUPPORTED_MAX → no traceable evidence cohort
 *   in between                        → review (source-improvement worklist)
 */
export const NOUL_VERIFIED_MIN = 0.55;
export const NOUL_UNSUPPORTED_MAX = 0.2;

// ─── Article topic taxonomy (mirrors the site's clusters) ────────────────

export const ARTICLE_TOPICS: Record<string, string> = {
  // v3 note: Run 2 showed "cooling basics, PUE basics" listed under Beginner
  // contradicted the site's own clustering (PUE is frontmatter-cluster Energy)
  // and pulled system explainers toward Beginner. Beginner is now reserved for
  // concepts with no dedicated technical topic.
  Beginner: "Pure concept explainers whose subject is the concept itself and which have no dedicated technical topic on this list (what is a data centre, what is a server, tier ratings, beginner starter guides), even when Kenyan examples illustrate it. An explainer of a specific facility system does NOT take Beginner — it takes its technical topic (Infrastructure or Energy) even when written for beginners.",
  Kenya: "Kenya market stories: specific Kenyan or East African companies, facilities, deals, investments, operator comparisons, or business playbooks for Kenyan businesses — the company/market story is the subject",
  Internet: "Connectivity infrastructure — submarine cables, fibre routes, IXPs, latency, internet speeds, redundancy — even when Kenya-specific",
  Energy: "Power and energy: grid, geothermal, solar, renewables, tariffs, reliability, and power-efficiency metrics such as PUE",
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
      "Which topic does this article primarily belong to? First ask: is the subject a concept or system, or a Kenya market/company/policy story? Concepts and systems take their technical topic even when Kenya examples appear or the style is beginner-friendly — explainers of a facility system (cooling, power chain, cabling, fire suppression) take their technical topic. Stories about Kenyan companies, facilities, deals or markets take Kenya; stories about regulation and licensing take Policy regardless of country.",
    criteria: ARTICLE_TOPICS,
  },
  kenya_relevance: {
    type: "noul",
    instructions:
      "The article is specifically about Kenya or East African digital infrastructure — Kenya/East Africa context, data or actors are substantive to its value: someone outside the region would learn something different from it. A generic, country-agnostic explainer that only illustrates with Kenyan examples scores low, even if Kenya appears in the title or the examples. Kenya-specific data, regulation, market numbers, tariffs or operator decisions score high.",
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
  // v3 note: Run 2 misses came from a hard 10 MW floor (NBOX1, a 5 MW phase-1
  // hyperscale campus, was pushed to colocation) and from enterprise vs
  // operator-owned overlap (Safaricom Thika). Wording now follows the editor's
  // taxonomy: positioning and primary role first, MW as a guide not a rule.
  hyperscale: "Purpose-built large-scale campus positioned and built for hyperscale or AI/cloud-at-scale customers — large single- or few-tenant halls with high-density power, typically 10 MW or more at full build. An operator's flagship hyperscale/AI campus qualifies even if its first phase is below 10 MW.",
  colocation: "Carrier-neutral or retail colocation facility serving multiple customers",
  enterprise: "Facility built primarily to serve the operator's OWN workloads (a bank, telco or ISP running its internal systems), even if it also sells spare capacity or colocation",
  operator_owned: "Network or exchange facility whose primary role is hosting network equipment (POP, IXP, carrier hotel), not selling data centre services",
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
  // v3 fix (Run 2): the editor's own parenthetical states the primary role —
  // a cable-landing facility maps to cable_landing, not operator_owned.
  "Operator-owned (cable landing)": "cable_landing",
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
  // v3 change (Run 2 finding): the single compound evidence_support question
  // mixed two different judgments — can claims be TRACED to sources, and is
  // the evidence INDEPENDENT of the operator's own marketing. Jev graded the
  // blend far stricter than the pre-registered labels (agreement 46.7%), so
  // the question is now split into two atomic noul questions. CODE combines
  // them deterministically; see EVIDENCE_COMPOSITE below.
  evidence_traceability: {
    type: "noul",
    instructions:
      "Based only on this record: do the stated operational status and headline capacity each trace to at least one identifiable, relevant source — an operator page or announcement, a regulator or registry record (e.g. PeeringDB), or reputable news that corresponds to these specific claims? A source that merely restates a claim without corresponding detail (e.g. a homepage) traces the claim only weakly.",
  },
  evidence_independence: {
    type: "noul",
    instructions:
      "Based only on this record: is the evidence for the stated status and capacity independent — that is, at least two distinct organizations support the claims, or a registry/regulator record corroborates the operator's own statement? Multiple pages from the same operator, or one operator page alone, are not independent evidence.",
  },
} as const;

/**
 * How CODE combines the two atomic evidence judgments into one score.
 * min() is the honest default: a claim is only as strong as its weakest
 * dimension (traceable but uncorroborated, or corroborated in the aggregate
 * but not traceable to the specific claim, both cap the score).
 */
export const EVIDENCE_COMPOSITE = "min" as const;
