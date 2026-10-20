import { describe, expect, it } from "vitest";
import { getPolicyCountries, getPolicyDataset } from "../src/lib/policy/index";

/**
 * Security audit C3 (2026-10-20) regression: claims carrying the editor's
 * publicationHold must never be reachable from a public accessor. The held
 * claim's id is pinned here so a rename cannot silently re-expose it.
 */
const HELD_CLAIM_ID = "UG-LC-C3";

describe("policy publicationHold gate", () => {
  it("excludes held claims from getPolicyDataset()", () => {
    const dataset = getPolicyDataset();
    for (const country of Object.values(dataset.countries)) {
      for (const claim of country.claims) {
        expect(claim.publicationHold, `claim ${claim.id} must not carry publicationHold publicly`).toBeUndefined();
      }
    }
  });

  it("never serves the held claim UG-LC-C3 publicly", () => {
    const dataset = getPolicyDataset();
    const uganda = dataset.countries.uganda;
    if (uganda) {
      expect(uganda.claims.some((c) => c.id === HELD_CLAIM_ID)).toBe(false);
    }
    for (const country of getPolicyCountries()) {
      expect(country.claims.some((c) => c.id === HELD_CLAIM_ID)).toBe(false);
    }
  });

  it("keeps held claims available to editor-side accessors via includeHeld", () => {
    const held = getPolicyDataset(true).countries.uganda?.claims.find((c) => c.id === HELD_CLAIM_ID);
    expect(held?.publicationHold).toBeTruthy();
  });
});
