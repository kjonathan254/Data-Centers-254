import { getFacilities, type Facility } from "@/lib/directory-data";

/**
 * Comparison tool helpers — /directory/compare?ids=slug-a,slug-b
 *
 * The compare page is a server component driven entirely by the URL, so any
 * comparison is a shareable, crawlable link (canonical always points at the
 * bare /directory/compare to keep param variants out of the index).
 */

export const MAX_COMPARE = 4;

/** Parse the `ids` query param into a de-duplicated slug list (max 4). */
export function parseCompareIds(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const slug = part.trim();
    if (slug) seen.add(slug);
  }
  return [...seen].slice(0, MAX_COMPARE);
}

/** Resolve slugs → facilities, preserving order, dropping unknown slugs. */
export function getCompareFacilities(slugs: string[]): Facility[] {
  const all = getFacilities();
  return slugs
    .map((slug) => all.find((f) => f.slug === slug))
    .filter((f): f is Facility => Boolean(f));
}

/**
 * Default selection shown when the page is opened bare (and the one crawlers
 * see): the largest built facility per operator, ranked by designed capacity,
 * capped at three. Keeps the page meaningful with JS disabled.
 */
export function pickDefaultCompare(): Facility[] {
  const operational = getFacilities().filter((f) => f.status === "Operational");
  const bestPerOperator = new Map<string, Facility>();
  for (const f of operational) {
    const incumbent = bestPerOperator.get(f.operatorId);
    if (!incumbent || (f.totalCapacityMw ?? 0) > (incumbent.totalCapacityMw ?? 0)) {
      bestPerOperator.set(f.operatorId, f);
    }
  }
  return [...bestPerOperator.values()]
    .sort((a, b) => (b.totalCapacityMw ?? 0) - (a.totalCapacityMw ?? 0))
    .slice(0, 3);
}

/** Lite facility shape handed to the client picker (keeps the payload small). */
export interface CompareCandidate {
  slug: string;
  name: string;
  operator: string;
  status: string;
  city: string;
  mw: number | null;
}

export function getCompareCandidates(): CompareCandidate[] {
  return getFacilities()
    .map((f) => ({
      slug: f.slug,
      name: f.name,
      operator: f.operator.name,
      status: f.status,
      city: f.city,
      mw: f.totalCapacityMw ?? f.itLoadMw ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Peer suggestions for a facility profile page: same city first (biggest
 * capacity), then anything else, excluding the facility itself. Used to
 * pre-fill "Compare with peers" deep links.
 */
export function pickPeers(facility: Facility, count = 2): Facility[] {
  const others = getFacilities().filter((f) => f.id !== facility.id);
  const sameCity = others
    .filter((f) => f.city === facility.city)
    .sort((a, b) => (b.totalCapacityMw ?? 0) - (a.totalCapacityMw ?? 0));
  const rest = others
    .filter((f) => f.city !== facility.city)
    .sort((a, b) => (b.totalCapacityMw ?? 0) - (a.totalCapacityMw ?? 0));
  return [...sameCity, ...rest].slice(0, count);
}
