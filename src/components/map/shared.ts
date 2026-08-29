// Shared bits for the DC254 infrastructure map views.

export const CYAN = "oklch(0.78 0.14 195)";   // brand cyan  (var(--cyan))
export const NEON = "oklch(0.75 0.18 155)";   // operational (var(--neon))
export const AMBER = "oklch(0.85 0.12 85)";   // under construction
export const RED = "oklch(0.65 0.22 25)";

import type { DcStatus } from "@/lib/map-data";

export const STATUS_COLOR: Record<DcStatus, string> = {
  Operational: NEON,
  "Under Construction": AMBER,
  Announced: CYAN,
};

/** Catmull-Rom → cubic bezier smoothing for cable / fibre paths. */
export function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) {
    return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} L${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}`;
  }
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export function toPts(waypoints: [number, number][], projFn: (lat: number, lng: number) => { x: number; y: number }) {
  return waypoints.map(([lat, lng]) => projFn(lat, lng));
}
