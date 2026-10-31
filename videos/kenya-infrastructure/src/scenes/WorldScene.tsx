import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import { beatOf } from "../beatmap";
import {
  PANO_SHOTS,
  WORLD_WINDOWS,
  windowAt,
  worldAlpha,
  WorldId,
} from "./worldShots";

/* ---------- pano sphere ----------
   The texture is assigned imperatively to the material (no React state in the
   render path): onLoad mutates the material BEFORE continueRender, so the
   screenshot after the handle clears is guaranteed to see the texture. */

const PanoSphere: React.FC<{ world: WorldId; visible: boolean }> = ({
  world,
  visible,
}) => {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(50, 72, 48);
    g.scale(-1, 1, 1); // equirect convention
    return g;
  }, []);

  useEffect(() => {
    let alive = true;
    const handle = delayRender(`pano:${world}`);
    new THREE.TextureLoader().load(
      staticFile(`worlds/${world}-pano.jpg`),
      (t) => {
        if (!alive || !matRef.current) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        t.generateMipmaps = false;
        t.minFilter = THREE.LinearFilter;
        matRef.current.map = t;
        matRef.current.needsUpdate = true;
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle),
    );
    return () => {
      alive = false;
      continueRender(handle);
    };
  }, [world]);

  return (
    <mesh geometry={geo} visible={visible}>
      {/* scale(-1,1,1) flips winding: front faces point inward, so default
          FrontSide renders the inside of the sphere (official equirect pattern) */}
      <meshBasicMaterial ref={matRef} color={0xffffff} fog={false} toneMapped={false} />
    </mesh>
  );
};

/* ---------- camera rig (rotation-only, camera sits inside the sphere) ---------- */

export const WorldCameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const win = windowAt(frame);
  const beat = beatOf(frame);
  const cam = camera as THREE.PerspectiveCamera;
  const shot = win ? PANO_SHOTS[win.world] : null;
  if (shot && win) {
    const local = Math.min(
      1,
      Math.max(0, (frame - win.start) / Math.max(1, win.end - win.start)),
    );
    const e = local * local * (3 - 2 * local) * 0.85 + beat.ease * 0.15;
    const drift = Math.sin(frame / 31) * 0.006;
    const yaw = shot.yaw0 + (shot.yaw1 - shot.yaw0) * e + drift;
    const pitch = shot.pitch0 + (shot.pitch1 - shot.pitch0) * e;
    const fov = shot.fov0 + (shot.fov1 - shot.fov0) * e;
    cam.rotation.order = "YXZ";
    cam.rotation.set(pitch, yaw, 0);
    cam.position.set(0, 0, 0);
    if (cam.isPerspectiveCamera && Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  }
  return null;
};

/* ---------- the world layer (mounted above the map canvas) ---------- */

export const WorldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const active = windowAt(frame);
  return (
    <>
      <WorldCameraRig />
      {WORLD_WINDOWS.map((w) => (
        <PanoSphere
          key={w.world}
          world={w.world}
          visible={active?.world === w.world}
        />
      ))}
    </>
  );
};

/** DOM-side opacity for the world canvas layer */
export const WorldLayerOpacity: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const a = worldAlpha(frame);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: a, pointerEvents: "none" }}>
      {children}
    </div>
  );
};

/** dip-to-dark overlay at every cut between map and world (and back) */
export const Dip: React.FC = () => {
  const frame = useCurrentFrame();
  const boundaries = WORLD_WINDOWS.flatMap((w) => [w.start, w.end]);
  let dip = 0;
  for (const b of boundaries) {
    const d = 1 - Math.abs(frame - b) / 8;
    if (d > 0) dip = Math.max(dip, d * 0.85);
  }
  if (dip <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#04060b",
        opacity: dip,
        pointerEvents: "none",
      }}
    />
  );
};
