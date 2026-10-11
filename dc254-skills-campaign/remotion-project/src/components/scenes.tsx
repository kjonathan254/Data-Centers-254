import React from "react";
import { AbsoluteFill, Sequence, interpolate } from "remotion";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SAFE } from "../theme";
import {
  Backdrop,
  Body,
  BrandMark,
  Bullets,
  EndCard,
  EvidenceFooter,
  Fonts,
  Headline,
  Kicker,
  ProgressBar,
  useFade,
  useRise,
} from "./kit";

/* ---------- Config types (content lives in src/configs, animation lives here) ---------- */

export type RoleCard = { title: string; roles: string };

export type Scene =
  | {
      kind: "hook";
      frames: number;
      kicker?: string;
      headline: string;
      sub?: string;
      evidence?: string;
      image?: string;
    }
  | {
      kind: "statement";
      frames: number;
      kicker: string;
      headline: string;
      body?: string;
      bullets?: string[];
      evidence?: string;
      image?: string;
    }
  | {
      kind: "cards";
      frames: number;
      kicker: string;
      headline: string;
      body?: string;
      cards: RoleCard[];
      evidence?: string;
      image?: string;
    }
  | {
      kind: "flow";
      frames: number;
      kicker: string;
      headline: string;
      steps: string[];
      note?: string;
      evidence?: string;
      image?: string;
    }
  | {
      kind: "cta";
      frames: number;
      headline: string;
      sub?: string;
      url?: string;
      email?: string;
      evidence?: string;
      image?: string;
      tagline: string;
    };

export type VideoConfig = {
  id: string;
  title: string;
  scenes: Scene[];
};

export const totalFrames = (c: VideoConfig) =>
  c.scenes.reduce((a, s) => a + s.frames, 0);

/* ---------- Scene bodies ---------- */

const Stage: React.FC<{ children: React.ReactNode; center?: boolean }> = ({
  children,
  center,
}) => {
  const fade = useFade();
  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        padding: `${SAFE.top}px ${SAFE.x}px ${SAFE.bottom}px`,
        justifyContent: center ? "center" : "flex-start",
        zIndex: 4,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const CardStack: React.FC<{ cards: RoleCard[] }> = ({ cards }) => {
  const compact = cards.length > 2;
  return (
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: compact ? 22 : 30 }}>
      {cards.map((c, i) => (
        <CardItem key={i} card={c} index={i} compact={compact} />
      ))}
    </div>
  );
};

const CardItem: React.FC<{ card: RoleCard; index: number; compact: boolean }> = ({
  card,
  index,
  compact,
}) => {
  const r = useRise(12 + index * 8, 22);
  return (
    <div
      style={{
        ...r,
        background: COLORS.bgPanel,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 22,
        padding: compact ? "26px 32px" : "34px 38px",
        borderLeft: `6px solid ${COLORS.cyan}`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: compact ? 40 : 46,
          color: COLORS.white,
          marginBottom: compact ? 8 : 12,
        }}
      >
        {card.title}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: compact ? 31 : 34,
          lineHeight: 1.45,
          color: "#B9C8DA",
        }}
      >
        {card.roles}
      </div>
    </div>
  );
};

const FlowDiagram: React.FC<{ steps: string[]; note?: string }> = ({ steps, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nodeDelay = (i: number) => 12 + i * 14;
  const lineGrow = interpolate(frame, [18, 18 + steps.length * 14 + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ marginTop: 44, position: "relative" }}>
      {/* connecting line */}
      <div
        style={{
          position: "absolute",
          left: 33,
          top: 40,
          bottom: note ? 150 : 40,
          width: 4,
          borderRadius: 2,
          background: `linear-gradient(180deg, ${COLORS.cyan}, rgba(90,200,226,0.25))`,
          transformOrigin: "top",
          transform: `scaleY(${lineGrow})`,
          opacity: 0.75,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {steps.map((s, i) => (
          <FlowNode key={i} text={s} index={i} delay={nodeDelay(i)} />
        ))}
      </div>
      {note ? <NoteBlock text={note} delay={12 + steps.length * 14} /> : null}
    </div>
  );
};

const NoteBlock: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const r = useRise(delay, 16);
  return (
    <div
      style={{
        ...r,
        marginTop: 34,
        padding: "22px 28px",
        borderLeft: `5px solid ${COLORS.cyan}`,
        background: COLORS.cyanSoft,
        borderRadius: "0 16px 16px 0",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 29,
        lineHeight: 1.45,
        color: "#CFE9F2",
      }}
    >
      {text}
    </div>
  );
};

const FlowNode: React.FC<{ text: string; index: number; delay: number }> = ({
  text,
  index,
  delay,
}) => {
  const r = useRise(delay, 20);
  return (
    <div style={{ ...r, display: "flex", alignItems: "center", gap: 22, position: "relative", zIndex: 2 }}>
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: COLORS.bg,
          border: `3px solid ${COLORS.cyan}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 30,
          color: COLORS.cyan,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          flex: 1,
          background: COLORS.bgPanel,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 18,
          padding: "24px 30px",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 36,
          color: COLORS.white,
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CtaChip: React.FC<{ url: string }> = ({ url }) => {
  const r = useRise(18, 14);
  return (
    <div style={{ ...r, marginTop: 44 }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 34,
          color: COLORS.cyan,
          border: `2px solid ${COLORS.cyan}`,
          borderRadius: 999,
          padding: "18px 38px",
          background: "rgba(90,200,226,0.08)",
        }}
      >
        {url}
      </span>
    </div>
  );
};

const CtaEmail: React.FC<{ email: string; withUrl: boolean }> = ({ email, withUrl }) => {
  const r = useRise(24, 14);
  return (
    <div
      style={{
        ...r,
        marginTop: withUrl ? 22 : 44,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 32,
        color: "#C9D6E5",
      }}
    >
      {email}
    </div>
  );
};

const HookScene: React.FC<{ scene: Extract<Scene, { kind: "hook" }> }> = ({ scene }) => (
  <Stage center>
    <div>
      {scene.kicker ? <Kicker>{scene.kicker}</Kicker> : null}
      <Headline size={82}>{scene.headline}</Headline>
      {scene.sub ? <Body size={42}>{scene.sub}</Body> : null}
    </div>
    {scene.evidence ? <EvidenceFooter text={scene.evidence} /> : null}
  </Stage>
);

const StatementScene: React.FC<{ scene: Extract<Scene, { kind: "statement" }> }> = ({
  scene,
}) => (
  <Stage>
    <div>
      <Kicker>{scene.kicker}</Kicker>
      <Headline size={64}>{scene.headline}</Headline>
      {scene.body ? <Body>{scene.body}</Body> : null}
      {scene.bullets ? <Bullets items={scene.bullets} /> : null}
    </div>
    {scene.evidence ? <EvidenceFooter text={scene.evidence} /> : null}
  </Stage>
);

const CardsScene: React.FC<{ scene: Extract<Scene, { kind: "cards" }> }> = ({ scene }) => (
  <Stage>
    <div>
      <Kicker>{scene.kicker}</Kicker>
      <Headline size={62}>{scene.headline}</Headline>
      {scene.body ? <Body size={36}>{scene.body}</Body> : null}
      <CardStack cards={scene.cards} />
    </div>
    {scene.evidence ? <EvidenceFooter text={scene.evidence} /> : null}
  </Stage>
);

const FlowScene: React.FC<{ scene: Extract<Scene, { kind: "flow" }> }> = ({ scene }) => (
  <Stage>
    <div>
      <Kicker>{scene.kicker}</Kicker>
      <Headline size={58}>{scene.headline}</Headline>
      <FlowDiagram steps={scene.steps} note={scene.note} />
    </div>
    {scene.evidence ? <EvidenceFooter text={scene.evidence} /> : null}
  </Stage>
);

const CtaScene: React.FC<{ scene: Extract<Scene, { kind: "cta" }>; tagline: string }> = ({
  scene,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const endProgress = interpolate(
    frame,
    [durationInFrames - 78, durationInFrames - 52],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <Stage center>
      <div>
        <Headline size={72}>{scene.headline}</Headline>
        {scene.sub ? <Body>{scene.sub}</Body> : null}
        {scene.url ? <CtaChip url={scene.url} /> : null}
        {scene.email ? <CtaEmail email={scene.email} withUrl={Boolean(scene.url)} /> : null}
      </div>
      {scene.evidence ? <EvidenceFooter text={scene.evidence} /> : null}
      <EndCard tagline={tagline} url={scene.url} email={scene.email} progress={endProgress} />
    </Stage>
  );
};

/* ---------- Shell: renders a full video from config ---------- */

const SceneRenderer: React.FC<{ scene: Scene; tagline: string }> = ({ scene, tagline }) => {
  switch (scene.kind) {
    case "hook":
      return <HookScene scene={scene} />;
    case "statement":
      return <StatementScene scene={scene} />;
    case "cards":
      return <CardsScene scene={scene} />;
    case "flow":
      return <FlowScene scene={scene} />;
    case "cta":
      return <CtaScene scene={scene} tagline={tagline} />;
    default:
      return null;
  }
};

export const VideoShell: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const sequences = config.scenes.map((scene, i) => ({
    scene,
    from: config.scenes
      .slice(0, i)
      .reduce((acc, s) => acc + s.frames, 0),
  }));
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT }}>
      <Fonts />
      {sequences.map(({ scene, from }, i) => (
        <Sequence
          key={i}
          from={from}
          durationInFrames={scene.frames}
          name={`s${i + 1}-${scene.kind}`}
        >
          <Backdrop image={scene.image} />
          <SceneRenderer scene={scene} tagline={"tagline" in scene ? scene.tagline : config.title} />
          <BrandMark />
        </Sequence>
      ))}
      <ProgressBar />
    </AbsoluteFill>
  );
};

/* ---------- Thursday static graphic (1080x1350) ---------- */

export const ThursdayGraphic: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const flow = config.scenes.find((s): s is Extract<Scene, { kind: "flow" }> => s.kind === "flow");
  const cta = config.scenes.find((s): s is Extract<Scene, { kind: "cta" }> => s.kind === "cta");
  if (!flow || !cta) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: FONT }}>
      <Backdrop image={flow.image} />
      <BrandMark />
      <AbsoluteFill
        style={{
          padding: "140px 84px 90px 84px",
          justifyContent: "center",
          zIndex: 4,
        }}
      >
        <Kicker>{flow.kicker}</Kicker>
        <Headline size={60}>{flow.headline}</Headline>
        <FlowDiagramStatic steps={flow.steps} note={flow.note} />
        <div style={{ marginTop: 46 }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 30,
              color: COLORS.cyan,
              border: `2px solid ${COLORS.cyan}`,
              borderRadius: 999,
              padding: "14px 30px",
              background: "rgba(90,200,226,0.08)",
            }}
          >
            {cta.url}
          </span>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 56,
          paddingTop: 16,
          borderTop: `1px solid ${COLORS.line}`,
          fontFamily: FONT,
          fontSize: 24,
          color: "rgba(159,178,200,0.92)",
          zIndex: 5,
        }}
      >
        {flow.evidence}
      </div>
    </AbsoluteFill>
  );
};

const FlowDiagramStatic: React.FC<{ steps: string[]; note?: string }> = ({ steps, note }) => (
  <div style={{ marginTop: 40, position: "relative" }}>
    <div
      style={{
        position: "absolute",
        left: 31,
        top: 36,
        bottom: note ? 130 : 36,
        width: 4,
        borderRadius: 2,
        background: `linear-gradient(180deg, ${COLORS.cyan}, rgba(90,200,226,0.25))`,
        opacity: 0.75,
      }}
    />
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 2 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: COLORS.bg,
              border: `3px solid ${COLORS.cyan}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.cyan,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              flex: 1,
              background: COLORS.bgPanel,
              border: `1px solid ${COLORS.line}`,
              borderRadius: 16,
              padding: "20px 26px",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 32,
              color: COLORS.white,
              lineHeight: 1.3,
            }}
          >
            {s}
          </div>
        </div>
      ))}
    </div>
    {note ? (
      <div
        style={{
          marginTop: 28,
          padding: "20px 26px",
          borderLeft: `5px solid ${COLORS.cyan}`,
          background: COLORS.cyanSoft,
          borderRadius: "0 14px 14px 0",
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 26,
          lineHeight: 1.4,
          color: "#CFE9F2",
        }}
      >
        {note}
      </div>
    ) : null}
  </div>
);
