/**
 * Capacity-honesty contract for Jibu's deterministic intents.
 *
 * Background (2026-10-16 incident): "Which is the largest data centre?" was
 * answered "…Africa Data Centres Nairobi 1 (NBO1) leads the market at null MW"
 * — the biggest intent ranked facilities on `itLoadMw ?? totalCapacityMw`,
 * letting a 7.5 MW DESIGNED figure outrank NBOX1's 4.5 MW VERIFIED LIVE load,
 * and then interpolated the absent `itLoadMw` as the string "null". These
 * tests pin the fixed contract: figures never leak template literals, live
 * load is never ranked against designed capacity, and every number carries
 * its basis. Dataset-derived values (4.5 / 1.75 / 7.5 MW) come straight from
 * src/data/directory/current.json — if the data changes, update the pins.
 *
 * Run: npx vitest run tests/chatbot-intents.test.ts
 */
import { describe, expect, it } from "vitest";
import { answerQuestion, scrubReply } from "@/lib/chatbot/engine";
import { getFacilities } from "@/lib/directory-data";

// A leak is any bare template artefact reaching the reader.
const LEAK_RE = /\b(null|undefined|NaN)\b/;

const facility = (name: string) => {
  const f = getFacilities().find((x) => x.name === name);
  if (!f) throw new Error(`Facility not in dataset: ${name}`);
  return f;
};

describe("biggest intent — verified live IT load ranking", () => {
  it("answers the flagship question with the live-load leader, never 'null'", () => {
    const r = answerQuestion("Which is the largest data centre?");
    expect(r.intent).toBe("biggest");
    expect(r.reply).not.toMatch(LEAK_RE);
    // Consistent with the curated FAQ answer: NBOX1 leads on live capacity.
    expect(r.reply).toContain("verified live IT load");
    expect(r.reply).toContain("iXAfrica NBOX1");
    expect(r.reply).toContain("4.5 MW");
  });

  it("names the designed-only bigger site and why it is not ranked", () => {
    const adc = facility("Africa Data Centres Nairobi 1 (NBO1)");
    expect(adc.itLoadMw).toBeNull(); // precondition: live load undisclosed
    const r = answerQuestion("Which is the largest data centre?");
    expect(r.reply).toContain("Africa Data Centres Nairobi 1 (NBO1)");
    expect(r.reply).toContain("designed capacity");
    // The designed figure must be labelled, never presented as live load.
    expect(r.reply).not.toContain("7.5 MW live");
  });

  it("runs the runners-up on live figures with basis-labelled phrasing", () => {
    const r = answerQuestion("Which is the largest data centre?");
    expect(r.reply).toContain("iColo Mombasa Two (MBA2) at 1.75 MW");
  });

  it("city-scoped question (Mombasa) ranks on live load with no leak", () => {
    const r = answerQuestion("Which is the largest data centre in Mombasa?");
    expect(r.intent).toBe("biggest");
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("iColo Mombasa Two");
    expect(r.reply).toContain("1.75 MW");
  });
});

describe("compare intent — like-for-like only", () => {
  it("refuses to rank a live figure against a designed one", () => {
    const r = answerQuestion("Compare iXAfrica NBOX1 and Africa Data Centres Nairobi 1");
    expect(r.intent).toBe("compare");
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("like-for-like");
    // Each spec line carries its basis.
    expect(r.reply).toContain("4.5 MW live IT load");
    expect(r.reply).toContain("7.5 MW designed capacity");
  });

  it("ranks two live figures head-to-head", () => {
    const r = answerQuestion("Compare iColo Mombasa One and iColo Mombasa Two");
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("bigger of the two on verified live IT load at 1.75 MW");
  });

  it("ranks two designed-only facilities on designed capacity, labelled", () => {
    const r = answerQuestion(
      "Compare Africa Data Centres Nairobi 1 and iColo Nairobi Two",
    );
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("designed capacity");
    expect(r.reply).toContain("7.5 MW designed");
  });
});

describe("operator listing — basis-labelled figures", () => {
  it("labels every capacity tag in an operator's facility list", () => {
    const r = answerQuestion("What facilities does Africa Data Centres run?");
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("7.5 MW designed");
    expect(r.reply).toContain("under construction");
  });

  it("pipeline listing carries basis tags, no bare null", () => {
    const r = answerQuestion("What's under construction right now?");
    expect(r.reply).not.toMatch(LEAK_RE);
    expect(r.reply).toContain("MW designed");
  });
});

describe("scrubReply — last line of defence", () => {
  it("rewrites the exact incident string", () => {
    expect(scrubReply("leads the market at null MW")).toBe(
      "leads the market at capacity not disclosed",
    );
  });

  it("catches undefined/NaN artefacts and keeps clean text untouched", () => {
    expect(scrubReply("runs undefined MW of load")).not.toMatch(/undefined/);
    expect(scrubReply("about NaN MW total")).not.toMatch(/NaN/);
    expect(scrubReply("4.5 MW of live IT load")).toBe("4.5 MW of live IT load");
  });
});
