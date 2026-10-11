// DC254 motion system - brand tokens (matched to site CSS vars, oklch)
// Site: --background: oklch(0.08 0.005 260); --primary: oklch(0.78 0.14 195)

export const COLORS = {
  bg: "rgb(8 11 18)", // deep navy (matches site --background)
  bgPanel: "rgba(255,255,255,0.06)",
  cyan: "oklch(0.78 0.14 195)", // brand primary
  cyanSoft: "rgba(120, 214, 236, 0.16)",
  white: "#F2F7FB",
  muted: "#9FB2C8",
  line: "rgba(148,180,210,0.18)",
  overlay: "rgba(6,9,15,0.78)",
} as const;

export const FONT = "Geist, 'Noto Sans', sans-serif";

export const SPRING = { damping: 200, stiffness: 120, mass: 0.9 } as const;

// Safe margins for 1080x1920 (phone + LinkedIn/Reels UI clearance)
export const SAFE = {
  x: 96,
  top: 150,
  bottom: 220,
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
