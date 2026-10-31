import React, { useMemo } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, spring } from "remotion";
import { COLORS, FONT, W, H } from "../theme";
import { BEATS, BEAT_IDS, BEAT_LABELS, CAPTIONS, beatOf, beatAlpha, TOTAL, BeatId } from "../beatmap";

// CSS-safe cyan (COLORS.coast is a three.js numeric, not valid CSS)
const CYAN = "#00d2d3";
const CYAN_SOFT = "rgba(0,133,133,0.5)";
import { SHOTS } from "../scenes/Map3D";
import { CABLES, RING, BACKBONE, MOMBASA, NAIROBI, CITIES } from "../geo/kenya";
import { STAGES, STAGE_BY_BEAT, worldAlpha } from "../scenes/worldShots";

/* ---------- font ---------- */

export const Fonts: React.FC = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @font-face {
          font-family: "Geist";
          src: url("${staticFile("fonts/geist-latin.woff2")}") format("woff2");
          font-weight: 100 900;
          font-style: normal;
          font-display: block;
        }
      `,
    }}
  />
);

/* ---------- 3D -> 2D projection (mirrors CameraRig math) ---------- */

const FOV = 38;
const TAN_H = Math.tan((FOV / 2) * (Math.PI / 180));
const ASPECT = W / H;

export const project = (
  p: [number, number, number],
  pos: [number, number, number],
  tgt: [number, number, number],
): { x: number; y: number; z: number } => {
  const f = norm3(sub3(tgt, pos));
  const r = norm3(cross3(f, [0, 1, 0]));
  const u = cross3(r, f);
  const d = sub3(p, pos);
  const zc = dot3(d, f);
  if (zc <= 0.1) return { x: 0, y: 0, z: -1 };
  const xc = dot3(d, r);
  const yc = dot3(d, u);
  const ndcX = xc / (zc * TAN_H * ASPECT);
  const ndcY = yc / (zc * TAN_H);
  return { x: ((ndcX + 1) / 2) * W, y: ((1 - (ndcY + 1) / 2) * H), z: zc };
};

const sub3 = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: number[], b: number[]): number[] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm3 = (a: number[]) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const useCam = () => {
  const frame = useCurrentFrame();
  const beat = beatOf(frame);
  const shot = SHOTS[beat.id];
  const l = (a: number, b: number) => a + (b - a) * beat.ease;
  return {
    pos: [
      l(shot.from.pos[0], shot.to.pos[0]),
      l(shot.from.pos[1], shot.to.pos[1]),
      l(shot.from.pos[2], shot.to.pos[2]),
    ] as [number, number, number],
    tgt: [
      l(shot.from.tgt[0], shot.to.tgt[0]),
      l(shot.from.tgt[1], shot.to.tgt[1]),
      l(shot.from.tgt[2], shot.to.tgt[2]),
    ] as [number, number, number],
  };
};

/* ---------- labels ---------- */

type LabelDef = {
  id: string;
  world: [number, number, number];
  beat: BeatId;
  title: string;
  sub?: string;
  kind: "cable" | "place" | "major";
  delay?: number;
  align?: "left" | "center";
};

const CABLE_LABEL_WORLDS: Record<string, [number, number, number]> = {
  TEAMS: [10.4, 0.15, -3.35],
  SEACOM: [10.7, 0.15, 0.55],
  EASSy: [8.15, 0.15, -5.0],
  LION2: [8.45, 0.15, 2.75],
  DARE1: [8.85, 0.15, -6.35],
  PEACE: [10.15, 0.15, -1.2],
  "2Africa": [9.35, 0.15, -6.9],
};

const LABELS: LabelDef[] = [
  ...CABLES.map((c, i) => ({
    id: `cable-${c.name}`,
    world: CABLE_LABEL_WORLDS[c.name],
    beat: "cables" as BeatId,
    title: c.name.toUpperCase(),
    sub: c.year,
    kind: "cable" as const,
    delay: 6 + i * 5,
  })),
  {
    id: "mombasa",
    world: [5.768, 0.42, -0.657],
    beat: "landing",
    title: "MOMBASA",
    sub: "cable landing station",
    kind: "major",
  },
  {
    id: "nairobi",
    world: [2.921, 0.78, -3.408],
    beat: "datacenter",
    title: "NAIROBI",
    sub: "data centres · internet exchange",
    kind: "major",
  },
  {
    id: "kisumu",
    world: [1.0 + (34.768 - 33.9), 0.24, -(-0.091 + 4.7)],
    beat: "lastmile",
    title: "KISUMU",
    kind: "place",
    delay: 0,
  },
  {
    id: "garissa",
    world: [39.646 - 33.9, 0.24, -(-0.453 + 4.7)],
    beat: "lastmile",
    title: "GARISSA",
    kind: "place",
    delay: 4,
  },
  {
    id: "eldoret",
    world: [35.269 - 33.9, 0.24, -(0.514 + 4.7)],
    beat: "lastmile",
    title: "ELDORET",
    kind: "place",
    delay: 8,
  },
  {
    id: "lodwar",
    world: [35.606 - 33.9, 0.24, -(3.119 + 4.7)],
    beat: "lastmile",
    title: "LODWAR",
    kind: "place",
    delay: 12,
  },
  {
    id: "malindi",
    world: [40.117 - 33.9, 0.24, -(-3.22 + 4.7)],
    beat: "lastmile",
    title: "MALINDI",
    kind: "place",
    delay: 16,
  },
  {
    id: "phone",
    world: [3.35, 1.38, -2.05],
    beat: "phone",
    title: "YOUR PHONE",
    sub: "every tap makes the round trip",
    kind: "major",
    align: "center",
  },
];

export const Labels3D: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  // labels are projected from the map camera — hide them during Marble world cuts
  const wa = worldAlpha(frame);
  return (
    <div style={{ opacity: 1 - wa }}>
      {LABELS.map((l) => {
        const a = beatAlpha(frame, l.beat, (l.delay ?? 0) + 10, 12);
        if (a <= 0.02) return null;
        const p = project(l.world, cam.pos, cam.tgt);
        if (p.z < 0.3 || p.x < -80 || p.x > W + 80 || p.y < -40 || p.y > H + 40) return null;
        const isMajor = l.kind === "major";
        const isCable = l.kind === "cable";
        const rise = (1 - a) * 6;
        return (
          <div
            key={l.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(${l.align === "center" ? "-50%" : "0"}, -100%) translateY(${-8 - rise}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: l.align === "center" ? "center" : "flex-start",
              gap: 1,
              opacity: a,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <span
                style={{
                  width: isMajor ? 8 : 6,
                  height: isMajor ? 8 : 6,
                  borderRadius: 99,
                  background: isCable ? CYAN : isMajor ? "#fff" : COLORS.muted,
                  boxShadow: `0 0 10px ${isCable ? CYAN : "#fff"}`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: isMajor ? 17 : isCable ? 12.5 : 11.5,
                  fontWeight: isMajor ? 700 : 600,
                  letterSpacing: isCable || isMajor ? "0.14em" : "0.1em",
                  color: isCable ? CYAN : isMajor ? "#fff" : "#c8d6e5",
                  textShadow: "0 1px 8px rgba(3,6,10,0.95), 0 0 2px rgba(3,6,10,0.9)",
                  whiteSpace: "nowrap",
                }}
              >
                {l.title}
              </span>
            </div>
            {l.sub && (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: COLORS.muted,
                  textShadow: "0 1px 6px rgba(3,6,10,0.95)",
                  marginLeft: isCable ? 13 : 15,
                  whiteSpace: "nowrap",
                }}
              >
                {l.sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- journey chip (you-are-here inset during world cuts) ---------- */

const MAP_SVG_W = 112;
const MAP_SVG_H = 132;
const mapPx = (x: number, z: number): [number, number] => [
  10 + x * 11.5,
  10 + (z + 10.13) * 11.0,
];

export const JourneyChip: React.FC = () => {
  const frame = useCurrentFrame();
  const a = worldAlpha(frame);
  if (a <= 0.01) return null;
  const beat = beatOf(frame);
  const stageId = STAGE_BY_BEAT[beat.id];
  const stage = STAGES.find((s) => s.id === stageId);
  const outline = RING.map(([x, z]) => mapPx(x, z).join(",")).join(" L");
  const route = BACKBONE.map(([x, z]) => mapPx(x, z).join(",")).join(" ");
  return (
    <div
      style={{
        position: "absolute",
        right: 44,
        bottom: 52,
        width: 178,
        opacity: a,
        transform: `translateY(${(1 - a) * 10}px)`,
        background: "rgba(6,10,17,0.78)",
        border: "1px solid rgba(0,210,211,0.28)",
        borderRadius: 14,
        padding: "13px 14px 12px",
        pointerEvents: "none",
        boxShadow: "0 8px 30px rgba(2,4,8,0.5)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: "0.24em",
          color: COLORS.muted,
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>THE JOURNEY</span>
        <span style={{ color: CYAN }}>{stage?.label}/06</span>
      </div>
      <svg width={MAP_SVG_W} height={MAP_SVG_H} style={{ display: "block" }}>
        <path
          d={`M${outline}`}
          fill="rgba(18,31,48,0.85)"
          stroke="rgba(0,210,211,0.45)"
          strokeWidth={1}
        />
        <polyline
          points={route}
          fill="none"
          stroke="rgba(0,210,211,0.55)"
          strokeWidth={1.4}
          strokeDasharray="3 2.4"
        />
        {STAGES.map((s) => {
          const [cx, cy] = mapPx(s.at[0], s.at[1]);
          const activePulse = s.id === stageId;
          const r = activePulse ? 4.6 : 2;
          const passed =
            STAGES.findIndex((x) => x.id === stageId) >
            STAGES.findIndex((x) => x.id === s.id);
          const pulseR = 7 + 2.5 * (0.5 + 0.5 * Math.sin(frame / 6));
          return (
            <g key={s.id}>
              {activePulse && (
                <circle cx={cx} cy={cy} r={pulseR} fill="rgba(0,210,211,0.18)" />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={activePulse ? CYAN : passed ? "rgba(0,210,211,0.75)" : "rgba(159,178,200,0.55)"}
              />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          marginTop: 9,
          fontFamily: FONT,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: CYAN,
        }}
      >
        {stage?.hint}
      </div>
    </div>
  );
};

/* ---------- hook title ---------- */

export const HookTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = BEATS.hook;
  const s = spring({ frame: frame - start - 4, fps: 30, config: { damping: 200, stiffness: 90, mass: 0.8 }, durationInFrames: 30 });
  const out = beatAlpha(frame, "hook", 1, 14);
  if (frame < start + 2) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity: Math.min(1, s) * out,
        transform: `translateY(${(1 - s) * 22}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.32em",
          color: CYAN,
          textShadow: "0 1px 10px rgba(3,6,10,0.9)",
        }}
      >
        KENYA'S DIGITAL INFRASTRUCTURE
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 62,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.08,
          maxWidth: 860,
          textShadow: "0 2px 24px rgba(3,6,10,0.95)",
        }}
      >
        How the internet
        <br />
        reaches your phone
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 500,
          color: COLORS.muted,
          textShadow: "0 1px 10px rgba(3,6,10,0.9)",
        }}
      >
        From the floor of the Indian Ocean to the screen in your hand
      </div>
    </div>
  );
};

/* ---------- caption card ---------- */

export const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = beatOf(frame);
  if (beat.id === "hook" || beat.id === "outro") return null;
  const s = spring({
    frame: beat.local - 2,
    fps: 30,
    config: { damping: 200, stiffness: 110, mass: 0.9 },
    durationInFrames: 24,
  });
  const clamped = Math.max(0, Math.min(1, s));
  const idx = String(beat.index).padStart(2, "0");
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        bottom: 46,
        opacity: clamped,
        transform: `translateY(${(1 - clamped) * 16}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: CYAN,
          }}
        >
          {idx} · {BEAT_LABELS[beat.id]}
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1.22,
          color: "#fff",
          maxWidth: 700,
          textShadow: "0 1px 14px rgba(3,6,10,0.95)",
        }}
      >
        {CAPTIONS[beat.id]}
      </div>
    </div>
  );
};

/* ---------- brand + progress ---------- */

export const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const a = Math.min(1, frame / 14);
  return (
    <div
      style={{
        position: "absolute",
        top: 34,
        right: 44,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: a,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          color: COLORS.muted,
          letterSpacing: "0.02em",
        }}
      >
        Inside Kenya's digital infrastructure
      </div>
      <div style={{ width: 1, height: 16, background: COLORS.line }} />
      <Img src={staticFile("brand/logo-icon.png")} style={{ width: 24, height: 24 }} />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: "#fff",
        }}
      >
        DC254
      </div>
    </div>
  );
};

export const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, display: "flex", gap: 3, padding: "0 0 3px 0" }}>
      {BEAT_IDS.map((id) => {
        const b = BEATS[id];
        const seg = b.end - b.start;
        const fill = interpolate(frame, [b.start, b.end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={id} style={{ flex: seg, position: "relative", background: "rgba(148,180,210,0.14)" }}>
            <div style={{ position: "absolute", inset: 0, width: `${fill * 100}%`, background: CYAN, opacity: 0.9 }} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- end card ---------- */

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { start } = BEATS.outro;
  if (frame < start + 8) return null;
  const t = Math.min(1, (frame - start - 8) / 26);
  const s = (d: number) => Math.min(1, Math.max(0, (frame - start - 8 - d) / 22));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 90% 75% at 50% 46%, rgba(5,8,14,0.62) 0%, rgba(5,8,14,0.94) 78%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: t,
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("brand/logo-icon.png")}
        style={{ width: 58, height: 58, opacity: s(0) }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "#fff",
          opacity: s(2),
        }}
      >
        DC254
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 500,
          color: COLORS.muted,
          letterSpacing: "0.01em",
          opacity: s(4),
        }}
      >
        Inside Kenya's digital infrastructure
      </div>
      <div
        style={{
          width: 340,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
          margin: "6px 0",
          opacity: s(6),
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: CYAN,
          opacity: s(8),
        }}
      >
        CABLE · COAST · CITY · CLOUD
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          background: "rgba(0,210,211,0.12)",
          border: `1px solid rgba(0,210,211,0.35)`,
          borderRadius: 99,
          padding: "9px 22px",
          marginTop: 4,
          opacity: s(10),
        }}
      >
        data-centers-254.vercel.app
      </div>
    </div>
  );
};

/* ---------- vignette ---------- */

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 120% 100% at 50% 45%, transparent 55%, rgba(3,5,9,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

export const Overlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Fonts />
    <Vignette />
    <Labels3D />
    <HookTitle />
    <Caption />
    <JourneyChip />
    <Brand />
    <EndCard />
    <Progress />
  </AbsoluteFill>
);
