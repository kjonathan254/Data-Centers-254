import React from "react";
import { Composition } from "remotion";
import { VideoShell, ThursdayGraphic, totalFrames } from "./components/scenes";
import { tuesdayConfig } from "./configs/tuesday";
import { wednesdayConfig } from "./configs/wednesday";
import { thursdayConfig } from "./configs/thursday";
import { fridayConfig } from "./configs/friday";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={tuesdayConfig.id}
        component={VideoShell}
        defaultProps={{ config: tuesdayConfig }}
        durationInFrames={totalFrames(tuesdayConfig)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id={wednesdayConfig.id}
        component={VideoShell}
        defaultProps={{ config: wednesdayConfig }}
        durationInFrames={totalFrames(wednesdayConfig)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id={thursdayConfig.id}
        component={VideoShell}
        defaultProps={{ config: thursdayConfig }}
        durationInFrames={totalFrames(thursdayConfig)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id={fridayConfig.id}
        component={VideoShell}
        defaultProps={{ config: fridayConfig }}
        durationInFrames={totalFrames(fridayConfig)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="thursday-graphic"
        component={ThursdayGraphic}
        defaultProps={{ config: thursdayConfig }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
      />
    </>
  );
};
