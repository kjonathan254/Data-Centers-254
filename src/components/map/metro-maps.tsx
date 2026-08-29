"use client";

import { memo, useState } from "react";
import {
  NBO_FRAME, MSA_FRAME, metroProj, NBO_LAND, NBO_PROVINCE, MSA_LAND,
} from "@/lib/map-geo";
import { KENYA_FACILITIES, SUBSEA_CABLES, LANDING_STATION, type KenyaFacility } from "@/lib/map-data";
import { CYAN, NEON, AMBER, STATUS_COLOR, smoothPath } from "./shared";

// ─── NAIROBI METRO ──────────────────────────────────────────────────────────

const nboP = (lat: number, lng: number) => metroProj(NBO_FRAME, lat, lng);

function NairobiMapInner({ dimmed, onFacility }: {
  dimmed: Set<string>;
  onFacility: (f: KenyaFacility) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const items = KENYA_FACILITIES.filter((f) => f.city === "nairobi");
  const right = items.filter((f) => f.lng >= 36.83).sort((a, b) => b.lat - a.lat);
  const left = items.filter((f) => f.lng < 36.83).sort((a, b) => b.lat - a.lat);

  const RIGHT_X = 600;
  const LEFT_X = 158;
  const rowY = (i: number, start: number) => start + i * 44;

  const corridor = smoothPath([
    nboP(-1.362, 36.878), nboP(-1.335, 36.862), nboP(-1.308, 36.849),
    nboP(-1.29, 36.828), nboP(-1.278, 36.815), nboP(-1.262, 36.802), nboP(-1.245, 36.793),
  ]);

  const Row = ({ f, x, y, side }: { f: KenyaFacility; x: number; y: number; side: "l" | "r" }) => {
    const { x: mx, y: my } = nboP(f.lat, f.lng);
    const active = hover === f.id;
    const dim = dimmed.has(f.id);
    const color = STATUS_COLOR[f.status];
    const rectX = side === "r" ? x - 6 : x - 240;
    return (
      <g
        className="cursor-pointer"
        opacity={dim ? 0.18 : 1}
        onMouseEnter={() => setHover(f.id)}
        onMouseLeave={() => setHover(null)}
        onClick={() => onFacility(f)}
      >
        {/* hit area */}
        <rect x={rectX} y={y - 19} width={246} height={40} rx={8} fill={active ? "oklch(0.93 0.01 260 / 0.07)" : "transparent"} />
        {/* leader */}
        <polyline
          points={side === "r"
            ? `${mx + 11},${my} ${mx + 48},${y} ${x - 10},${y}`
            : `${mx - 11},${my} ${mx - 48},${y} ${x + 10},${y}`}
          fill="none"
          stroke={active ? CYAN : "oklch(0.93 0.01 260 / 0.22)"}
          strokeWidth={active ? 1.6 : 1}
        />
        {/* status dot */}
        {f.status === "Announced" ? (
          <circle cx={side === "r" ? x + 2 : x - 2} cy={y} r={5} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray="3 2.4" />
        ) : (
          <circle cx={side === "r" ? x + 2 : x - 2} cy={y} r={5} fill={color} />
        )}
        <text x={side === "r" ? x + 16 : x - 16} y={y - 2} textAnchor={side === "r" ? "start" : "end"} fontSize={15.5} fontWeight={650} fill="oklch(0.93 0.01 260)">{f.shortName}</text>
        <text x={side === "r" ? x + 16 : x - 16} y={y + 14} textAnchor={side === "r" ? "start" : "end"} fontSize={12.5} fill="oklch(0.93 0.01 260 / 0.55)">
          {f.status === "Announced" ? `${f.totalMW} MW · announced` : `${f.totalMW} MW · ${f.tier}`}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${NBO_FRAME.W} ${NBO_FRAME.H}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of the 13 data centres in Nairobi"
    >
      {/* land + province */}
      <path d={NBO_LAND} fill="oklch(0.78 0.14 195 / 0.05)" stroke="oklch(0.78 0.14 195 / 0.2)" strokeWidth={1.2} />
      <path d={NBO_PROVINCE} fill="oklch(0.78 0.14 195 / 0.07)" stroke={CYAN} strokeWidth={1.8} strokeOpacity={0.85} strokeDasharray="0" />
      <text x={NBO_FRAME.W - 20} y={NBO_FRAME.H - 18} textAnchor="end" fontSize={12.5} fill="oklch(0.93 0.01 260 / 0.35)">boundary: Nairobi province · positions schematic</text>

      {/* Mombasa Road corridor */}
      <path d={corridor} fill="none" stroke="oklch(0.93 0.01 260 / 0.16)" strokeWidth={10} strokeLinecap="round" />
      <path d={corridor} fill="none" stroke="oklch(0.93 0.01 260 / 0.3)" strokeWidth={1.4} strokeDasharray="6 5" />
      <text x={nboP(-1.34, 36.868).x + 10} y={nboP(-1.34, 36.868).y + 4} fontSize={13} fontStyle="italic" fill="oklch(0.93 0.01 260 / 0.45)">Mombasa Rd (A8)</text>

      {/* callout rows */}
      {left.map((f, i) => <Row key={f.id} f={f} x={LEFT_X} y={rowY(i, 128)} side="l" />)}
      {right.map((f, i) => <Row key={f.id} f={f} x={RIGHT_X} y={rowY(i, 148)} side="r" />)}

      {/* KIXP — Nairobi IXP */}
      <g>
        {(() => {
          const k = nboP(-1.283, 36.8245);
          return (
            <>
              <path d={`M${k.x},${k.y - 7} L${k.x + 7},${k.y} L${k.x},${k.y + 7} L${k.x - 7},${k.y} Z`} fill="oklch(0.93 0.01 260 / 0.85)" stroke="oklch(0.1 0.02 250)" strokeWidth={1.2} />
              <text x={k.x + 13} y={k.y + 4} fontSize={13} fontWeight={600} fill="oklch(0.93 0.01 260 / 0.7)">KIXP · 85 members</text>
            </>
          );
        })()}
      </g>

      {/* markers on top */}
      {items.map((f) => {
        const { x, y } = nboP(f.lat, f.lng);
        const active = hover === f.id;
        const dim = dimmed.has(f.id);
        return (
          <g key={f.id} className="cursor-pointer" opacity={dim ? 0.18 : 1}
            onMouseEnter={() => setHover(f.id)} onMouseLeave={() => setHover(null)}
            onClick={() => onFacility(f)}>
            {active && <circle cx={x} cy={y} r={13} fill={CYAN} fillOpacity={0.15} />}
            {f.status === "Announced" ? (
              <>
                <circle cx={x} cy={y} r={8} fill="oklch(0.2 0.05 250 / 0.9)" stroke={STATUS_COLOR.Announced} strokeWidth={1.8} strokeDasharray="4 3" />
                <circle cx={x} cy={y} r={2.6} fill={STATUS_COLOR.Announced} />
              </>
            ) : (
              <>
                <circle cx={x} cy={y} r={active ? 8 : 6.5} fill={STATUS_COLOR[f.status]} stroke="oklch(0.1 0.02 250)" strokeWidth={1.6} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export const NairobiMap = memo(NairobiMapInner);

// ─── MOMBASA METRO ──────────────────────────────────────────────────────────

const msaP = (lat: number, lng: number) => metroProj(MSA_FRAME, lat, lng);

function MombasaMapInner({ dimmed, onFacility }: {
  dimmed: Set<string>;
  onFacility: (f: KenyaFacility) => void;
}) {
  const [hoverCable, setHoverCable] = useState<string | null>(null);
  const adc = KENYA_FACILITIES.find((f) => f.city === "mombasa")!;
  const adcP = msaP(adc.lat, adc.lng);
  const ls = msaP(LANDING_STATION.lat, LANDING_STATION.lng);

  // fan endpoints in frame space
  const fanEnds = [58, 105, 152, 199, 246, 293, 340];

  return (
    <svg
      viewBox={`0 0 ${MSA_FRAME.W} ${MSA_FRAME.H}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of Mombasa's data centre and submarine cable landing stations"
    >
      <path d={MSA_LAND} fill="oklch(0.78 0.14 195 / 0.08)" stroke={CYAN} strokeWidth={1.8} strokeOpacity={0.8} />
      <text x={MSA_FRAME.W - 20} y={MSA_FRAME.H - 18} textAnchor="end" fontSize={12.5} fill="oklch(0.93 0.01 260 / 0.35)">coastline: Natural Earth · cable routes schematic</text>
      <text x={600} y={470} fontSize={24} fontStyle="italic" fill="oklch(0.78 0.06 230 / 0.5)">Indian Ocean</text>
      <text x={300} y={330} textAnchor="middle" fontSize={13.5} fontStyle="italic" fill="oklch(0.93 0.01 260 / 0.45)">Mombasa Island</text>

      {/* cable fan */}
      {SUBSEA_CABLES.map((c, i) => {
        const endY = fanEnds[i];
        const end = { x: 512, y: endY };
        const d = smoothPath([ls, { x: ls.x + 38, y: ls.y - 14 + endY * 0.08 }, { x: (ls.x + end.x) / 2 + 18, y: (ls.y + end.y) / 2 }, end]);
        const active = hoverCable === c.id;
        const dim = dimmed.has(c.live ? "cable-live" : "cable-dev");
        return (
          <g key={c.id} opacity={dim ? 0.2 : 1}
            onMouseEnter={() => setHoverCable(c.id)} onMouseLeave={() => setHoverCable(null)}>
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={active ? 0.25 : 0.12} strokeWidth={7} strokeLinecap="round" />
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={active ? 1 : 0.8} strokeWidth={2.2} strokeLinecap="round" strokeDasharray={c.live ? undefined : "7 5"} />
            <circle cx={end.x} cy={end.y} r={active ? 5 : 3.5} fill={c.live ? CYAN : AMBER} />
            <text x={end.x + 14} y={end.y + 4} fontSize={14.5} fontWeight={550} fill={c.live ? "oklch(0.93 0.01 260 / 0.92)" : AMBER}>{c.label}</text>
            <text x={end.x + 14} y={end.y + 20} fontSize={11.5} fill="oklch(0.93 0.01 260 / 0.45)">{c.year}{c.live ? " · live" : ""}</text>
          </g>
        );
      })}

      {/* landing station */}
      <g>
        <circle cx={ls.x} cy={ls.y} r={16} fill="none" stroke={CYAN} strokeOpacity={0.5} strokeWidth={1.2}>
          <animate attributeName="r" from="12" to="26" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={ls.x} cy={ls.y} r={7.5} fill={CYAN} stroke="oklch(0.1 0.02 250)" strokeWidth={1.6} />
        <text x={ls.x - 16} y={ls.y - 14} textAnchor="end" fontSize={14.5} fontWeight={650} fill="oklch(0.93 0.01 260)">Cable landing station</text>
        <text x={ls.x - 16} y={ls.y + 3} textAnchor="end" fontSize={12} fill="oklch(0.93 0.01 260 / 0.55)">Nyali · Mombasa</text>
      </g>

      {/* ADC Mombasa facility */}
      <g className="cursor-pointer" onClick={() => onFacility(adc)}
        onMouseEnter={() => setHoverCable("adc")} onMouseLeave={() => setHoverCable(null)}>
        <circle cx={adcP.x} cy={adcP.y} r={13} fill={NEON} fillOpacity={hoverCable === "adc" ? 0.22 : 0} />
        <circle cx={adcP.x} cy={adcP.y} r={7} fill={NEON} stroke="oklch(0.1 0.02 250)" strokeWidth={1.6} />
        <polyline points={`${adcP.x - 10},${adcP.y} ${adcP.x - 58},${adcP.y - 44} 168,${adcP.y - 44}`}
          fill="none" stroke="oklch(0.93 0.01 260 / 0.25)" strokeWidth={1} />
        <circle cx={160} cy={adcP.y - 44} r={5} fill={NEON} />
        <text x={148} y={adcP.y - 46} textAnchor="end" fontSize={15.5} fontWeight={650} fill="oklch(0.93 0.01 260)">ADC Mombasa</text>
        <text x={148} y={adcP.y - 30} textAnchor="end" fontSize={12.5} fill="oklch(0.93 0.01 260 / 0.55)">1 MW · Tier II</text>
      </g>
    </svg>
  );
}

export const MombasaMap = memo(MombasaMapInner);
