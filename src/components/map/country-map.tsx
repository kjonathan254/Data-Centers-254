"use client";

import { memo } from "react";
import {
  FRAME, COUNTRY_SHAPES, COUNTRY_LABELS, LAKE_SHAPES, proj,
} from "@/lib/map-geo";
import {
  SUBSEA_CABLES, FIBRE_ROUTES, CONTEXT_CITIES, REGION_ITEMS,
  KENYA_FACILITIES,
} from "@/lib/map-data";
import { CYAN, AMBER, smoothPath, toPts } from "./shared";

const LW = 1000;
const LH = FRAME.H;

// hand-tuned label nudges to avoid collisions on small countries
const LABEL_NUDGE: Record<string, { dy?: number; size?: number }> = {
  Rwanda: { dy: -14, size: 23 },
  Burundi: { dy: 38, size: 23 },
  Uganda: { size: 26 },
  Ethiopia: { size: 30 },
  Tanzania: { size: 30 },
};

function CountryMapInner({
  dimmed,
  onOpenNairobi,
  onOpenMombasa,
  onOpenCity,
}: {
  dimmed: Set<string>;
  onOpenNairobi: () => void;
  onOpenMombasa: () => void;
  onOpenCity: (id: string) => void;
}) {
  const nbo = proj(-1.29, 36.828);
  const msa = proj(-4.0435, 39.6682);

  return (
    <svg
      viewBox={`0 0 ${LW} ${LH}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of data centres and connectivity infrastructure in Kenya and East Africa"
    >
      <defs>
        <radialGradient id="kenyaGlow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="oklch(0.78 0.14 195)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="oklch(0.78 0.14 195)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow over Kenya */}
      <rect x="0" y="0" width={LW} height={LH} fill="url(#kenyaGlow)" />

      {/* context countries */}
      {COUNTRY_SHAPES.filter((s) => !s.focus).map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.78 0.14 195 / 0.035)" stroke="oklch(0.78 0.14 195 / 0.16)" strokeWidth={1} />
      ))}

      {/* Kenya — hero */}
      {COUNTRY_SHAPES.filter((s) => s.focus).map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.78 0.14 195 / 0.10)" stroke={CYAN} strokeWidth={2.2} strokeLinejoin="round" />
      ))}

      {/* lakes */}
      {LAKE_SHAPES.map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.45 0.09 235 / 0.35)" stroke="oklch(0.78 0.14 195 / 0.22)" strokeWidth={0.8} />
      ))}

      {/* lake labels */}
      <text x={proj(-1.05, 33.15).x} y={proj(-1.05, 33.15).y} textAnchor="middle" fontSize={21} fontStyle="italic" fill="oklch(0.78 0.05 230 / 0.75)">Victoria</text>
      <text x={proj(3.1, 36.1).x} y={proj(3.1, 36.1).y} textAnchor="middle" fontSize={19} fontStyle="italic" fill="oklch(0.78 0.05 230 / 0.65)">Turkana</text>

      {/* country labels */}
      {COUNTRY_LABELS.filter((l) => l.name !== "Kenya").map((l) => {
        const nudge = LABEL_NUDGE[l.name] ?? {};
        return (
          <text
            key={l.name}
            x={l.x}
            y={l.y + (nudge.dy ?? 0)}
            textAnchor="middle"
            fontSize={nudge.size ?? 26}
            fontWeight={600}
            letterSpacing={3}
            fill="oklch(0.85 0.02 240 / 0.28)"
            className="select-none"
          >
            {l.name.toUpperCase()}
          </text>
        );
      })}
      <text x={proj(0.4, 37.5).x} y={proj(0.4, 37.5).y} textAnchor="middle" fontSize={38} fontWeight={700} letterSpacing={7} fill="oklch(0.93 0.03 200 / 0.55)" className="select-none">KENYA</text>
      <text x={proj(-6.5, 41.8).x} y={proj(-6.5, 41.8).y} textAnchor="middle" fontSize={26} fontStyle="italic" letterSpacing={2} fill="oklch(0.78 0.06 230 / 0.45)" className="select-none">Indian Ocean</text>

      {/* terrestrial fibre */}
      {FIBRE_ROUTES.map((r) => {
        const d = smoothPath(toPts(r.waypoints, proj));
        return (
          <g key={r.id} opacity={dimmed.has("cable") ? 0.18 : 1}>
            <path d={d} fill="none" stroke="oklch(0.93 0.01 260 / 0.35)" strokeWidth={1.8} strokeDasharray="1 7" strokeLinecap="round" />
          </g>
        );
      })}

      {/* subsea cables */}
      {SUBSEA_CABLES.map((c) => {
        const d = smoothPath(toPts(c.waypoints, proj));
        const dim = dimmed.has("datacenter") || dimmed.has("ixp");
        return (
          <g key={c.id} opacity={dim ? 0.18 : 1}>
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={0.14} strokeWidth={6} strokeLinecap="round" />
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={c.live ? 0.85 : 0.7} strokeWidth={2} strokeLinecap="round" strokeDasharray={c.live ? undefined : "7 5"} />
          </g>
        );
      })}

      {/* cable labels at offshore ends — rows pre-spaced to avoid collisions */}
      {SUBSEA_CABLES.map((c) => {
        const [lat, lng] = c.waypoints[c.waypoints.length - 1];
        const p = proj(lat, lng);
        const anchorEnd = c.id !== "eassy";
        return (
          <text
            key={`lbl-${c.id}`}
            x={p.x + (anchorEnd ? -10 : 10)}
            y={p.y + 4}
            textAnchor={anchorEnd ? "end" : "start"}
            fontSize={22}
            fontWeight={500}
            fill={c.live ? "oklch(0.78 0.14 195 / 0.8)" : "oklch(0.85 0.12 85 / 0.85)"}
            opacity={dimmed.has("datacenter") || dimmed.has("ixp") ? 0.18 : 1}
          >
            {c.label}
          </text>
        );
      })}

      {/* regional city clusters */}
      {CONTEXT_CITIES.map((city) => {
        const { x, y } = proj(city.lat, city.lng);
        const items = REGION_ITEMS.filter((i) => i.city === city.id);
        const dim = !items.some((i) => !dimmed.has(i.type)) || (dimmed.has("datacenter") && dimmed.has("ixp"));
        return (
          <g key={city.id} className="cursor-pointer" onClick={() => onOpenCity(city.id)} opacity={dim ? 0.25 : 1}>
            <circle cx={x} cy={y} r={10} fill="oklch(0.2 0.03 250 / 0.9)" stroke="oklch(0.93 0.01 260 / 0.55)" strokeWidth={1.4} />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={11.5} fontWeight={700} fill="oklch(0.93 0.01 260)">{items.length}</text>
            <text x={x} y={y + 26} textAnchor="middle" fontSize={20} fontWeight={500} fill="oklch(0.93 0.01 260 / 0.5)">{city.name}</text>
          </g>
        );
      })}

      {/* Mombasa cluster — click to zoom */}
      <g className="cursor-pointer" onClick={onOpenMombasa} opacity={dimmed.has("datacenter") ? 0.25 : 1}>
        <circle cx={msa.x} cy={msa.y} r={17} fill="oklch(0.2 0.05 250 / 0.95)" stroke={CYAN} strokeWidth={2} />
        <circle cx={msa.x} cy={msa.y} r={17} fill="none" stroke={CYAN} strokeOpacity={0.4} strokeWidth={1}>
          <animate attributeName="r" from="17" to="30" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <text x={msa.x} y={msa.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill={CYAN}>6</text>
        <text x={msa.x + 26} y={msa.y - 4} fontSize={22} fontWeight={700} fill="oklch(0.93 0.01 260 / 0.9)">Mombasa</text>
        <text x={msa.x + 26} y={msa.y + 18} fontSize={18} fill="oklch(0.93 0.01 260 / 0.55)">1 DC · 6 cables</text>
      </g>

      {/* Nairobi cluster — click to zoom */}
      <g className="cursor-pointer" onClick={onOpenNairobi} opacity={dimmed.has("datacenter") ? 0.25 : 1}>
        <circle cx={nbo.x} cy={nbo.y} r={21} fill="oklch(0.2 0.05 250 / 0.95)" stroke={CYAN} strokeWidth={2.4} />
        <circle cx={nbo.x} cy={nbo.y} r={21} fill="none" stroke={CYAN} strokeOpacity={0.45} strokeWidth={1.2}>
          <animate attributeName="r" from="21" to="38" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.55" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={nbo.x} y={nbo.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={700} fill={CYAN}>13</text>
        <text x={nbo.x} y={nbo.y + 46} textAnchor="middle" fontSize={24} fontWeight={700} fill="oklch(0.93 0.01 260 / 0.95)">Nairobi</text>
        <text x={nbo.x} y={nbo.y + 65} textAnchor="middle" fontSize={19} fill="oklch(0.93 0.01 260 / 0.6)">13 data centres</text>
      </g>
    </svg>
  );
}

export const CountryMap = memo(CountryMapInner);
