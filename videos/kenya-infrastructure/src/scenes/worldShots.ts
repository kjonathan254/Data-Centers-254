// Marble (Worldlabs) world inserts — timeline windows + virtual camera moves.
// Windows are frame ranges inside the audio-driven beats (see beatmap.ts).
// The map flight stays the connective spine; these are the ground-level cuts.

export type WorldId =
  | "underwater"
  | "landing"
  | "datacenter"
  | "lastmile"
  | "phone";

export type WorldWindow = {
  world: WorldId;
  start: number;
  end: number;
};

// Cables beat (179-522): underwater world first half, 7-cable map second half.
// Landing (522-688) + data centre (919-1108) + phone (1331-1574): full Marble cut.
// Last mile (1108-1331): tower world first half, towers-ring map second half.
export const WORLD_WINDOWS: WorldWindow[] = [
  { world: "underwater", start: 179, end: 402 },
  { world: "landing", start: 522, end: 688 },
  { world: "datacenter", start: 919, end: 1108 },
  { world: "lastmile", start: 1108, end: 1240 },
  { world: "phone", start: 1331, end: 1574 },
];

export type PanoShot = {
  /** camera yaw (rad) at window start / end — calibrated against each pano */
  yaw0: number;
  yaw1: number;
  pitch0: number;
  pitch1: number;
  fov0: number;
  fov1: number;
};

// Calibrated against the actual panos (yaw centers subject at u: (0.75-u)*2PI).
export const PANO_SHOTS: Record<WorldId, PanoShot> = {
  // cable arcs across u 0.08-0.25, light column at u~0.37: pan right, tilt down to cable
  underwater: { yaw0: 3.64, yaw1: 3.09, pitch0: -0.26, pitch1: -0.18, fov0: 62, fov1: 57 },
  // dhow beach u~0.30 -> landing hut u~0.55, golden sun high, horizon v~0.44
  landing: { yaw0: 2.36, yaw1: 1.86, pitch0: 0.12, pitch1: 0.04, fov0: 60, fov1: 55 },
  // aisle vanishing point u~0.40, rack LEDs arc overhead
  datacenter: { yaw0: 2.2, yaw1: 1.75, pitch0: 0.02, pitch1: -0.04, fov0: 64, fov1: 58 },
  // tower dead-centre u~0.40 over a sea of city lights
  lastmile: { yaw0: 2.2, yaw1: 1.7, pitch0: 0.05, pitch1: -0.02, fov0: 58, fov1: 54 },
  // phone screen actually sits at u~0.465 v~0.32 (high in frame, hands below)
  phone: { yaw0: 1.82, yaw1: 1.72, pitch0: 0.5, pitch1: 0.44, fov0: 52, fov1: 49 },
  // (spare) glowing fibre line sweeping the savanna under the milky way
  backbone: { yaw0: 1.89, yaw1: 1.55, pitch0: 0.1, pitch1: 0.02, fov0: 58, fov1: 54 },
};

// Journey chip — "you are here" stages in map coordinates (1 unit = 1 degree)
export type Stage = {
  id: string;
  label: string;
  hint: string;
  at: [number, number]; // map x, z
};

export const STAGES: Stage[] = [
  { id: "cable", label: "01", hint: "UNDER THE INDIAN OCEAN", at: [7.3, -1.3] },
  { id: "landing", label: "02", hint: "MOMBASA · THE COAST", at: [5.768, -0.657] },
  { id: "backbone", label: "03", hint: "FIBRE TO NAIROBI", at: [4.35, -2.0] },
  { id: "datacenter", label: "04", hint: "NAIROBI · DATA CENTRES", at: [2.921, -3.408] },
  { id: "lastmile", label: "05", hint: "TOWERS ACROSS KENYA", at: [1.868, -4.609] },
  { id: "phone", label: "06", hint: "IN YOUR HAND", at: [3.35, -2.55] },
];

export const STAGE_BY_BEAT: Record<string, string> = {
  cables: "cable",
  landing: "landing",
  backbone: "backbone",
  datacenter: "datacenter",
  lastmile: "lastmile",
  phone: "phone",
};

/** world alpha (0..1) at frame — 10-frame fades at both ends of each window */
export const worldAlpha = (frame: number): number => {
  let a = 0;
  for (const w of WORLD_WINDOWS) {
    if (frame < w.start - 10 || frame > w.end + 10) continue;
    const ain = Math.min(1, Math.max(0, (frame - (w.start - 10)) / 10));
    const aout = Math.min(1, Math.max(0, ((w.end + 10) - frame) / 10));
    a = Math.max(a, Math.min(ain, aout));
  }
  return a;
};

/** active window at frame (or null) */
export const windowAt = (frame: number): WorldWindow | null => {
  for (const w of WORLD_WINDOWS) {
    if (frame >= w.start - 5 && frame <= w.end + 5) return w;
  }
  return null;
};
