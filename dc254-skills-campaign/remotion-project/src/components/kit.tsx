import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT, SAFE } from "../theme";

/* ---------- Fonts (brand: Geist) ---------- */

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

/* ---------- Motion helpers ---------- */

export const useFade = (inFrames = 12, outFrames = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, inFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - outFrames, durationInFrames - 1],
    [1, 0.94],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return fadeIn * fadeOut;
};

export const useRise = (delay = 0, distance = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, stiffness: 110, mass: 0.9 },
    durationInFrames: 26,
  });
  const clamped = Math.max(0, Math.min(1, s));
  return { opacity: clamped, transform: `translateY(${(1 - clamped) * distance}px)` };
};

/* ---------- Backdrop: photo + overlay + grid motif ---------- */

const GridMotif: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, Math.max(durationInFrames, 1)], [0, 18]);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        opacity: 0.22,
        transform: `translateY(${drift}px)`,
      }}
    />
  );
};

const NetworkDots: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = (offset: number) =>
    0.35 + 0.25 * Math.sin((frame + offset) / 22);
  const dots = [
    { x: 830, y: 380, r: 7, o: 0 },
    { x: 950, y: 620, r: 5, o: 40 },
    { x: 180, y: 1180, r: 6, o: 80 },
    { x: 90, y: 520, r: 5, o: 120 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.r * 2,
            height: d.r * 2,
            borderRadius: "50%",
            background: COLORS.cyan,
            opacity: pulse(d.o),
            boxShadow: `0 0 18px 4px rgba(90,200,226,0.35)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Backdrop: React.FC<{ image?: string }> = ({ image }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(
    frame,
    [0, Math.max(durationInFrames, 1)],
    [1.04, 1.11],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {image ? (
        <AbsoluteFill>
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
            }}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,9,15,0.88) 0%, rgba(6,9,15,0.74) 42%, rgba(6,9,15,0.93) 100%)",
        }}
      />
      <GridMotif />
      {image ? null : <NetworkDots />}
    </AbsoluteFill>
  );
};

/* ---------- Brand ---------- */

export const BrandMark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 54,
      left: SAFE.x,
      display: "flex",
      alignItems: "center",
      gap: 16,
      zIndex: 5,
    }}
  >
    <Img
      src={staticFile("brand/logo-icon.png")}
      style={{ width: 50, height: 50, objectFit: "contain" }}
    />
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 33,
        color: COLORS.white,
        letterSpacing: 1.5,
      }}
    >
      DC254
    </span>
  </div>
);

/* ---------- Type primitives ---------- */

export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const r = useRise(2, 12);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 26,
      }}
    >
      <div
        style={{
          width: 34,
          height: 6,
          borderRadius: 3,
          background: COLORS.cyan,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: 4.5,
          textTransform: "uppercase",
          color: COLORS.cyan,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export const Headline: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 76,
  children,
}) => {
  const r = useRise(5);
  return (
    <h1
      style={{
        ...r,
        margin: 0,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.16,
        color: COLORS.white,
        letterSpacing: -0.5,
      }}
    >
      {children}
    </h1>
  );
};

export const Body: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 40,
  children,
}) => {
  const r = useRise(10);
  return (
    <p
      style={{
        ...r,
        margin: "26px 0 0 0",
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.5,
        color: "#C9D6E5",
      }}
    >
      {children}
    </p>
  );
};

const BulletItem: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const r = useRise(14 + index * 7);
  return (
    <div style={{ ...r, display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div
        style={{
          marginTop: 16,
          width: 12,
          height: 12,
          borderRadius: 3,
          background: COLORS.cyan,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.4,
          color: COLORS.white,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <div style={{ marginTop: 38, display: "flex", flexDirection: "column", gap: 24 }}>
    {items.map((t, i) => (
      <BulletItem key={i} text={t} index={i} />
    ))}
  </div>
);

/* ---------- Evidence + progress ---------- */

export const EvidenceFooter: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.x,
      right: SAFE.x,
      bottom: 128,
      paddingTop: 18,
      borderTop: `1px solid ${COLORS.line}`,
      fontFamily: FONT,
      fontWeight: 400,
      fontSize: 25,
      lineHeight: 1.4,
      color: "rgba(159,178,200,0.92)",
      zIndex: 5,
    }}
  >
    {text}
  </div>
);

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const width = (frame / Math.max(durationInFrames, 1)) * 100;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 9,
        width: `${width}%`,
        background: COLORS.cyan,
        boxShadow: "0 0 16px 2px rgba(90,200,226,0.45)",
        zIndex: 6,
      }}
    />
  );
};

/* ---------- End card ---------- */

export const EndCard: React.FC<{
  tagline: string;
  url?: string;
  email?: string;
  progress: number; // 0..1 crossfade in
}> = ({ tagline, url, email, progress }) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        opacity: p > 0 ? 1 : 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <div style={{ transform: `translateY(${(1 - p) * 24}px)`, textAlign: "center", padding: "0 90px", opacity: p }}>
        <Img
          src={staticFile("brand/logo-icon.png")}
          style={{ width: 120, height: 120, objectFit: "contain", margin: "0 auto 34px auto" }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 54,
            color: COLORS.white,
            letterSpacing: 2,
            marginBottom: 30,
          }}
        >
          DC254
        </div>
        <div style={{ width: 70, height: 6, borderRadius: 3, background: COLORS.cyan, margin: "0 auto 34px auto" }} />
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 38,
            lineHeight: 1.45,
            color: "#C9D6E5",
            marginBottom: 46,
          }}
        >
          {tagline}
        </div>
        {url ? (
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 32,
              color: COLORS.cyan,
              marginBottom: email ? 18 : 0,
            }}
          >
            {url}
          </div>
        ) : null}
        {email ? (
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: "#C9D6E5" }}>{email}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
