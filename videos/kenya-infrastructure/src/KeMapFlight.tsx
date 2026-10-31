import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Scene3D } from "./scenes/Map3D";
import { Overlay } from "./ui/Overlay";
import { COLORS, W, H } from "./theme";

export const KeMapFlight: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <ThreeCanvas
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0 }}
        camera={{
          fov: 38,
          near: 0.05,
          far: 90,
          position: [9.8, 5.8, 4.8],
          up: [0, 1, 0],
        }}
      >
        <Scene3D />
      </ThreeCanvas>
      <Overlay />
      <Audio src={staticFile("audio/mix.mp3")} />
    </AbsoluteFill>
  );
};
