import React from "react";
import { Composition } from "remotion";
import { KeMapFlight } from "./KeMapFlight";
import { TOTAL, FPS } from "./beatmap";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KeMapFlight"
      component={KeMapFlight}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1280}
      height={720}
    />
  );
};
