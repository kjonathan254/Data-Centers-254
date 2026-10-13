/**
 * Single formatting rule for "verified" month stamps, added in Task 141:
 * "2026-10" -> "Oct 2026" (chips) / "October 2026" (prose).
 *
 * House rule after the September drift: a chip that describes a dataset's
 * verification month must be DERIVED from that dataset's constant or
 * record dates, never hardcoded next to it. Historical Septembers that
 * are evidence (capture dates, report periods, frozen snapshots) stay as
 * written; only current-state stamps flow through here.
 */

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10" -> "Oct 2026"; tolerates full ISO dates; falls back to the raw string. */
export function verifiedMonthShort(iso: string): string {
  const [y, m] = iso.split("-");
  const mi = parseInt(m ?? "", 10) - 1;
  if (!y || Number.isNaN(mi) || !SHORT[mi]) return iso;
  return `${SHORT[mi]} ${y}`;
}

/** "2026-10" -> "October 2026"; tolerates full ISO dates; falls back to the raw string. */
export function verifiedMonthLong(iso: string): string {
  const [y, m] = iso.split("-");
  const mi = parseInt(m ?? "", 10) - 1;
  if (!y || Number.isNaN(mi) || !LONG[mi]) return iso;
  return `${LONG[mi]} ${y}`;
}
