// DC254 motion system — Kenya infrastructure video (16:9, 1280x720)
// Brand tokens matched to site CSS vars (oklch converted to sRGB for three.js)

export const COLORS = {
  bg: "#080b12",
  bgHex: 0x080b12,
  ocean: 0x070d16,
  landTop: 0x121f30,
  landSide: 0x0b121c,
  coast: 0x00d2d3, // DC254 cyan: oklch(0.78 0.14 195) -> sRGB (0,210,211)
  cyanSoft: 0x008585, // oklch(0.55 0.11 195) -> sRGB (0,133,133)
  white: "#F2F7FB",
  muted: "#9FB2C8",
  amber: "#ffb454",
  green: "#32d583",
  red: "#ff6b6b",
  line: "rgba(148,180,210,0.18)",
  panel: "rgba(255,255,255,0.06)",
  overlay: "rgba(6,9,15,0.78)",
} as const;

export const FONT = "Geist, 'Noto Sans', sans-serif";

export const FPS = 30;
export const W = 1280;
export const H = 720;

// Scene units: 1 unit = 1 degree. Kenya spans lon 33.9-41.9 (x), lat -4.7-5.5 (z, north = -z)
export const MAP = {
  x0: 0,
  x1: 8,
  z0: 0, // southern edge
  z1: -10.13, // northern edge
};

export const SPRING = { damping: 200, stiffness: 120, mass: 0.9 } as const;
