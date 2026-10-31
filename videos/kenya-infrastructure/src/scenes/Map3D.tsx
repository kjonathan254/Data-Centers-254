import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import { COLORS } from "../theme";
import {
  RING,
  CITIES,
  MOMBASA,
  NAIROBI,
  BACKBONE,
  SPURS,
  CABLES,
  CABLE_Y,
} from "../geo/kenya";
import { beatAlpha, beatOf, BEATS, TOTAL } from "../beatmap";

/* ---------- shared textures (cached) ---------- */

let _glow: THREE.CanvasTexture | null = null;
export const glowTexture = () => {
  if (_glow) return _glow;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(140,240,245,0.9)");
  g.addColorStop(0.6, "rgba(0,210,211,0.35)");
  g.addColorStop(1, "rgba(0,210,211,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  _glow = new THREE.CanvasTexture(c);
  return _glow;
};

let _ring: THREE.CanvasTexture | null = null;
export const ringTexture = () => {
  if (_ring) return _ring;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "rgba(0,210,211,0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(32, 32, 26, 0, Math.PI * 2);
  ctx.stroke();
  _ring = new THREE.CanvasTexture(c);
  return _ring;
};

const fadeAll = (frame: number, inF: number, outF: number) =>
  Math.min(
    Math.min(1, Math.max(0, frame / inF)),
    Math.min(1, Math.max(0, (TOTAL - frame) / outF)),
  );

/* ---------- memoized tube ---------- */

const Tube: React.FC<{
  curve: THREE.CatmullRomCurve3;
  radius: number;
  color: number;
  opacity: number;
  additive?: boolean;
}> = ({ curve, radius, color, opacity, additive = true }) => {
  const geo = useMemo(
    () => new THREE.TubeGeometry(curve, 56, radius, 6, false),
    [curve, radius],
  );
  if (opacity <= 0.004) return null;
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </mesh>
  );
};

/* ---------- data pulse ---------- */

export const Pulse: React.FC<{
  curve: THREE.CatmullRomCurve3;
  speed: number;
  offset: number;
  size: number;
  opacity?: number;
}> = ({ curve, speed, offset, size, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const t = (((frame * speed + offset) % 1) + 1) % 1;
  const p = curve.getPointAt(Math.min(0.999, t));
  const vis = fadeAll(frame, 12, 12) * opacity;
  if (vis <= 0.004) return null;
  return (
    <sprite position={[p.x, p.y, p.z]} scale={[size, size, size]}>
      <spriteMaterial
        map={glowTexture()}
        transparent
        opacity={vis}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
};

/* ---------- land + ocean ---------- */

export const Land: React.FC = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    RING.forEach(([x, z], i) => {
      if (i === 0) s.moveTo(x, -z);
      else s.lineTo(x, -z);
    });
    s.closePath();
    return s;
  }, []);

  const side = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.16,
        bevelEnabled: false,
        curveSegments: 1,
      }),
    [shape],
  );
  const top = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  const coast = useMemo(() => {
    const pts = RING.map(([x, z]) => new THREE.Vector3(x, 0.02, z));
    pts.push(pts[0].clone());
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group>
      {/* land slab: top face sits at y=0 */}
      <mesh geometry={side} rotation-x={-Math.PI / 2} position-y={-0.16}>
        <meshBasicMaterial color={COLORS.landSide} />
      </mesh>
      <mesh geometry={top} rotation-x={-Math.PI / 2} position-y={0.004}>
        <meshBasicMaterial color={COLORS.landTop} side={THREE.DoubleSide} />
      </mesh>
      {/* coastline glow (y=0.02, closes the loop) */}
      <line>
        <primitive object={coast} attach="geometry" />
        <lineBasicMaterial color={COLORS.coast} transparent opacity={0.85} />
      </line>
    </group>
  );
};

export const Ocean: React.FC = () => (
  <mesh rotation-x={-Math.PI / 2} position={[4, -0.02, -4.5]}>
    <planeGeometry args={[54, 42]} />
    <meshBasicMaterial color={COLORS.ocean} />
  </mesh>
);

/* ---------- submarine cables (visible: cables, landing, outro) ---------- */

export const CablesGroup: React.FC = () => {
  const frame = useCurrentFrame();
  const alpha =
    beatAlpha(frame, "cables", 14, 16) * 0.95 +
    beatAlpha(frame, "landing", 12, 14) * 0.9 +
    beatAlpha(frame, "outro", 12, 14) * 0.85;

  const curves = useMemo(
    () =>
      CABLES.map((c) => {
        const pts = c.path.map(([x, z]) => new THREE.Vector3(x, CABLE_Y, z));
        pts.push(new THREE.Vector3(MOMBASA[0], CABLE_Y, MOMBASA[1]));
        return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.3);
      }),
    [],
  );

  return (
    <group>
      {CABLES.map((c, i) => (
        <group key={c.name}>
          <Tube curve={curves[i]} radius={0.006} color={COLORS.coast} opacity={alpha * 0.85} />
          <Tube curve={curves[i]} radius={0.026} color={COLORS.cyanSoft} opacity={alpha * 0.16} />
          <Pulse curve={curves[i]} speed={0.055} offset={i * 0.17} size={0.13} opacity={alpha} />
          <Pulse
            curve={curves[i]}
            speed={0.055}
            offset={i * 0.17 + 0.5}
            size={0.08}
            opacity={alpha * 0.7}
          />
        </group>
      ))}
    </group>
  );
};

/* ---------- Mombasa landing station ---------- */

export const LandingStation: React.FC = () => {
  const frame = useCurrentFrame();
  const alpha =
    beatAlpha(frame, "landing", 12, 14) * 0.9 +
    beatAlpha(frame, "cables", 16, 12) * 0.25 +
    beatAlpha(frame, "outro", 12, 14) * 0.7;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  if (alpha <= 0.01) return null;
  return (
    <group position={[MOMBASA[0], 0, MOMBASA[1]]}>
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[0.24, 0.11, 0.18]} />
        <meshBasicMaterial color={0x223247} />
      </mesh>
      <mesh position={[0, 0.135, 0]}>
        <boxGeometry args={[0.1, 0.05, 0.1]} />
        <meshBasicMaterial color={0x9fb2c8} />
      </mesh>
      <sprite position={[0, 0.22, 0]} scale={[0.3 + pulse * 0.14, 0.3 + pulse * 0.14, 1]}>
        <spriteMaterial
          map={glowTexture()}
          transparent
          opacity={alpha * (0.35 + pulse * 0.4)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
};

/* ---------- backbone: Mombasa -> Nairobi + NOFBI spurs ---------- */

export const BackboneGroup: React.FC = () => {
  const frame = useCurrentFrame();
  const mainAlpha =
    beatAlpha(frame, "backbone", 14, 14) * 0.95 +
    beatAlpha(frame, "datacenter", 12, 14) * 0.75 +
    beatAlpha(frame, "lastmile", 12, 14) * 0.5 +
    beatAlpha(frame, "phone", 12, 14) * 0.4 +
    beatAlpha(frame, "outro", 12, 14) * 0.9;
  const spurAlpha =
    beatAlpha(frame, "backbone", 16, 14) * 0.55 +
    beatAlpha(frame, "outro", 12, 14) * 0.5;

  const mainCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        BACKBONE.map(([x, z]) => new THREE.Vector3(x, 0.05, z)),
        false,
        "catmullrom",
        0.4,
      ),
    [],
  );
  const spurs = useMemo(
    () =>
      SPURS.map(
        (sp) =>
          new THREE.CatmullRomCurve3(
            sp.map(([x, z]) => new THREE.Vector3(x, 0.045, z)),
            false,
            "catmullrom",
            0.4,
          ),
      ),
    [],
  );

  return (
    <group>
      <Tube curve={mainCurve} radius={0.014} color={COLORS.coast} opacity={mainAlpha} />
      <Tube curve={mainCurve} radius={0.04} color={COLORS.cyanSoft} opacity={mainAlpha * 0.18} />
      <Pulse curve={mainCurve} speed={0.045} offset={0} size={0.17} opacity={mainAlpha} />
      <Pulse curve={mainCurve} speed={0.045} offset={0.34} size={0.13} opacity={mainAlpha * 0.85} />
      <Pulse curve={mainCurve} speed={0.045} offset={0.67} size={0.13} opacity={mainAlpha * 0.85} />
      {spurs.map((curve, i) => (
        <Tube
          key={i}
          curve={curve}
          radius={0.012}
          color={COLORS.cyanSoft}
          opacity={spurAlpha * 0.55}
          additive={false}
        />
      ))}
    </group>
  );
};

/* ---------- Nairobi data centre ---------- */

export const DataCentre: React.FC = () => {
  const frame = useCurrentFrame();
  const alpha =
    beatAlpha(frame, "datacenter", 12, 14) * 1 +
    beatAlpha(frame, "lastmile", 12, 14) * 0.75 +
    beatAlpha(frame, "phone", 12, 14) * 0.55 +
    beatAlpha(frame, "outro", 12, 14) * 0.85;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const racks = useMemo(() => {
    const arr: { pos: [number, number, number]; delay: number }[] = [];
    for (let r = 0; r < 2; r++)
      for (let i = 0; i < 6; i++)
        arr.push({ pos: [-0.13 + i * 0.052, 0.1, -0.06 + r * 0.12], delay: r * 6 + i * 2 });
    return arr;
  }, []);
  const shellEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.42, 0.05, 0.32)),
    [],
  );
  const beaconGeo = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8), []);

  if (alpha <= 0.01) return null;
  const litBase = frame - BEATS.datacenter.start - 8;

  return (
    <group position={[NAIROBI[0], 0, NAIROBI[1]]}>
      {/* podium (low, racks stand on it in the open) */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.42, 0.05, 0.32]} />
        <meshBasicMaterial color={0x182436} />
      </mesh>
      <lineSegments geometry={shellEdges} position={[0, 0.025, 0]}>
        <lineBasicMaterial color={COLORS.coast} transparent opacity={alpha * 0.8} />
      </lineSegments>
      {racks.map((r, i) => {
        const lit = Math.min(1, Math.max(0, (litBase - r.delay) / 10));
        const col = new THREE.Color(0x24354c).lerp(new THREE.Color(COLORS.green), lit * alpha);
        return (
          <mesh key={i} position={[r.pos[0], 0.105, r.pos[2]]}>
            <boxGeometry args={[0.028, 0.11, 0.05]} />
            <meshBasicMaterial color={col} />
          </mesh>
        );
      })}
      <mesh geometry={beaconGeo} position={[0, 0.5, 0]}>
        <meshBasicMaterial
          color={COLORS.coast}
          transparent
          opacity={alpha * (0.1 + pulse * 0.14)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <sprite position={[0, 0.3, 0]} scale={[0.5 + pulse * 0.16, 0.5 + pulse * 0.16, 1]}>
        <spriteMaterial
          map={glowTexture()}
          transparent
          opacity={alpha * (0.3 + pulse * 0.35)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
};

/* ---------- mobile towers ---------- */

const TOWER_POINTS: [number, number][] = [
  CITIES.kisumu, CITIES.garissa, CITIES.eldoret, CITIES.nakuru,
  CITIES.lodwar, CITIES.malindi, CITIES.lamu, CITIES.voi,
  [2.2, -2.3], [4.4, -5.2], [5.6, -2.6], [1.6, -4.6],
];

export const TowersGroup: React.FC = () => {
  const frame = useCurrentFrame();
  const alpha =
    beatAlpha(frame, "lastmile", 14, 14) * 1 +
    beatAlpha(frame, "phone", 12, 14) * 0.5 +
    beatAlpha(frame, "outro", 12, 14) * 0.7;
  const ringT = Math.max(0, frame - BEATS.lastmile.start - 6) / 30;
  if (alpha <= 0.01) return null;

  return (
    <group>
      {TOWER_POINTS.map(([x, z], i) => {
        const localRing = (((ringT - i * 0.09) % 1) + 1) % 1;
        const rs = 0.2 + localRing * 1.1;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.008, 0.014, 0.16, 5]} />
              <meshBasicMaterial color={0x7e93ad} />
            </mesh>
            <sprite position={[0, 0.19, 0]} scale={[0.16, 0.16, 1]}>
              <spriteMaterial
                map={glowTexture()}
                transparent
                opacity={alpha * 0.8}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            <sprite position={[0, 0.1, 0]} scale={[rs, rs, 1]}>
              <spriteMaterial
                map={ringTexture()}
                transparent
                opacity={alpha * 0.5 * (1 - localRing)}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
          </group>
        );
      })}
    </group>
  );
};

/* ---------- phone ---------- */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { start } = BEATS.phone;
  const alpha = beatAlpha(frame, "phone", 14, 12);
  const rise = Math.min(1, Math.max(0, (frame - start) / 24));
  const y = 0.25 + rise * 0.35;
  const tilt = -0.12 + rise * 0.1;

  const screenTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0a0f16";
    ctx.fillRect(0, 0, 256, 512);
    ctx.fillStyle = "#32d583";
    roundRect(ctx, 28, 70, 200, 96, 14);
    ctx.fill();
    ctx.fillStyle = "#04120b";
    ctx.font = "700 34px Geist, 'Noto Sans', sans-serif";
    ctx.fillText("M-PESA", 50, 132);
    ctx.fillStyle = "#00d2d3";
    roundRect(ctx, 28, 190, 200, 96, 14);
    ctx.fill();
    ctx.fillStyle = "#04121a";
    ctx.font = "700 30px Geist, 'Noto Sans', sans-serif";
    ctx.fillText("CALL", 80, 252);
    ctx.fillStyle = "#ffb454";
    roundRect(ctx, 28, 310, 200, 96, 14);
    ctx.fill();
    ctx.fillStyle = "#140c02";
    ctx.font = "700 30px Geist, 'Noto Sans', sans-serif";
    ctx.fillText("VIDEO", 72, 372);
    return new THREE.CanvasTexture(c);
  }, []);

  const bodyEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.34, 0.62, 0.035)),
    [],
  );

  if (frame < start - 5 || alpha <= 0.01) return null;

  return (
    <group position={[3.35, y, -2.05]} rotation={[0.1, tilt, 0]}>
      <sprite scale={[1.1, 1.1, 1]}>
        <spriteMaterial
          map={glowTexture()}
          transparent
          opacity={alpha * 0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh>
        <boxGeometry args={[0.34, 0.62, 0.035]} />
        <meshBasicMaterial color={0x0a0f16} />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[0.3, 0.58]} />
        <meshBasicMaterial map={screenTex} transparent opacity={alpha} toneMapped={false} />
      </mesh>
      <lineSegments geometry={bodyEdges} scale={[1.03, 1.03, 1.03]}>
        <lineBasicMaterial color={COLORS.coast} transparent opacity={alpha * 0.7} />
      </lineSegments>
    </group>
  );
};

/* ---------- camera rig ---------- */

type Shot = {
  from: { pos: [number, number, number]; tgt: [number, number, number] };
  to: { pos: [number, number, number]; tgt: [number, number, number] };
};

export const SHOTS: Record<string, Shot> = {
  hook: {
    from: { pos: [9.8, 5.8, 4.8], tgt: [5.2, 0, -3.4] },
    to: { pos: [8.4, 4.7, 3.5], tgt: [5.4, 0, -2.6] },
  },
  cables: {
    from: { pos: [11.5, 3.6, 5.2], tgt: [8.2, 0, -1.6] },
    to: { pos: [9.6, 2.2, 2.6], tgt: [7.4, 0.05, -1.2] },
  },
  landing: {
    from: { pos: [8.0, 1.9, 1.6], tgt: [5.85, 0.1, -0.75] },
    to: { pos: [7.3, 1.4, 1.0], tgt: [5.8, 0.1, -0.7] },
  },
  backbone: {
    from: { pos: [7.4, 3.4, 0.9], tgt: [5.5, 0, -1.9] },
    to: { pos: [3.9, 2.4, -2.8], tgt: [3.2, 0, -3.3] },
  },
  datacenter: {
    from: { pos: [4.15, 2.5, -2.0], tgt: [2.95, 0.2, -3.4] },
    to: { pos: [3.55, 1.05, -2.9], tgt: [2.92, 0.22, -3.41] },
  },
  lastmile: {
    from: { pos: [4.3, 4.6, 1.6], tgt: [3.9, 0, -4.3] },
    to: { pos: [4.0, 6.3, 0.7], tgt: [3.9, 0, -4.6] },
  },
  phone: {
    from: { pos: [4.95, 2.1, -0.25], tgt: [3.38, 0.5, -2.0] },
    to: { pos: [4.62, 1.8, -0.52], tgt: [3.36, 0.52, -2.06] },
  },
  outro: {
    from: { pos: [4.0, 8.5, 2.2], tgt: [4.0, 0, -4.4] },
    to: { pos: [4.0, 11.5, 1.2], tgt: [4.0, 0, -4.8] },
  },
};

export const CameraRig: React.FC<{ fov?: number }> = ({ fov = 38 }) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const beat = beatOf(frame);
  const shot = SHOTS[beat.id];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  camera.position.set(
    lerp(shot.from.pos[0], shot.to.pos[0], beat.ease),
    lerp(shot.from.pos[1], shot.to.pos[1], beat.ease),
    lerp(shot.from.pos[2], shot.to.pos[2], beat.ease),
  );
  camera.lookAt(
    lerp(shot.from.tgt[0], shot.to.tgt[0], beat.ease),
    lerp(shot.from.tgt[1], shot.to.tgt[1], beat.ease),
    lerp(shot.from.tgt[2], shot.to.tgt[2], beat.ease),
  );
  const cam = camera as THREE.PerspectiveCamera;
  if (cam.isPerspectiveCamera && cam.fov !== fov) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }
  return null;
};

export const Scene3D: React.FC = () => {
  return (
    <>
      <color attach="background" args={[COLORS.bgHex]} />
      <fog attach="fog" args={[COLORS.bgHex, 15, 36]} />
      <CameraRig />
      <Ocean />
      <Land />
      <CablesGroup />
      <LandingStation />
      <BackboneGroup />
      <DataCentre />
      <TowersGroup />
      <Phone />
    </>
  );
};
