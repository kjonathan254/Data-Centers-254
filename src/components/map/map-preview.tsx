import {
  COUNTRY_SHAPES, COUNTRY_LABELS, LAKE_SHAPES, proj,
} from "@/lib/map-geo";
import {
  SUBSEA_CABLES, FIBRE_ROUTES, CONTEXT_CITIES, REGION_ITEMS, KENYA_FACILITIES,
} from "@/lib/map-data";
import { PIDA_PROJECTS } from "@/lib/pida-data";
import { CYAN, AMBER, smoothPath, toPts } from "./shared";

const PIDA_VIOLET = "oklch(0.72 0.15 305)";

// Hand-tuned label nudges, mirrored from country-map.tsx (+2px for the
// smaller preview render).
const LABEL_NUDGE: Record<string, { dy?: number; size?: number }> = {
  Rwanda: { dy: -14, size: 25 },
  Burundi: { dy: 38, size: 25 },
  Uganda: { size: 28 },
  Ethiopia: { size: 32 },
  Tanzania: { size: 32 },
};

/**
 * Static, server-rendered preview of the DC254 infrastructure map.
 *
 * Same geo shapes, same datasets and same visual language as the
 * interactive map (country-map.tsx) — the homepage preview IS the
 * product, not a stock illustration. Pure SVG + CSS/SMIL animations,
 * zero client JavaScript, so it costs nothing to render on the
 * homepage while always staying in sync with the verified data.
 */
export default function MapPreview() {
  const nbo = proj(-1.29, 36.828);
  const msa = proj(-4.0435, 39.6682);
  const nboCount = KENYA_FACILITIES.filter((f) => f.metro === "nairobi").length;
  const msaCount = KENYA_FACILITIES.filter((f) => f.metro === "mombasa").length;
  const liveCables = SUBSEA_CABLES.filter((c) => c.live).length;
  const pidaMapped = PIDA_PROJECTS.filter((p) => p.lat !== null && p.lng !== null);

  return (
    <svg
      viewBox="0 0 1000 1570"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Preview of the DC254 infrastructure map: ${nboCount} data centres around Nairobi, ${msaCount} in Mombasa, ${liveCables} in-service submarine cables landing on the Kenyan coast`}
    >
      <defs>
        <radialGradient id="mpGlow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="oklch(0.78 0.14 195)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="oklch(0.78 0.14 195)" stopOpacity="0" />
        </radialGradient>
        <filter id="mpClusterGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="mpSweep" gradientUnits="userSpaceOnUse"
          x1={nbo.x} y1={nbo.y} x2={nbo.x + 64} y2={nbo.y - 14}>
          <stop offset="0%" stopColor={CYAN} stopOpacity="0.22" />
          <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ambient glow over Kenya */}
      <rect x="0" y="0" width="1000" height="1570" fill="url(#mpGlow)" />

      {/* subtle graticule */}
      <g stroke="oklch(0.78 0.14 195 / 0.06)" strokeWidth={0.8}>
        {[30, 32, 34, 36, 38, 40, 42].map((lng) => {
          const x = proj(0, lng).x;
          return <line key={`gx${lng}`} x1={x} y1={0} x2={x} y2={1570} />;
        })}
        {[-6, -4, -2, 0, 2, 4].map((lat) => {
          const y = proj(lat, 0).y;
          return <line key={`gy${lat}`} x1={0} y1={y} x2={1000} y2={y} />;
        })}
      </g>

      {/* context countries */}
      {COUNTRY_SHAPES.filter((s) => !s.focus).map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.78 0.14 195 / 0.035)" stroke="oklch(0.78 0.14 195 / 0.16)" strokeWidth={1} />
      ))}

      {/* Kenya, hero */}
      {COUNTRY_SHAPES.filter((s) => s.focus).map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.78 0.14 195 / 0.10)" stroke={CYAN} strokeWidth={2.2} strokeLinejoin="round" />
      ))}

      {/* lakes */}
      {LAKE_SHAPES.map((s) => (
        <path key={s.id} d={s.d} fill="oklch(0.45 0.09 235 / 0.35)" stroke="oklch(0.78 0.14 195 / 0.22)" strokeWidth={0.8} />
      ))}

      <text x={proj(-1.05, 33.15).x} y={proj(-1.05, 33.15).y} textAnchor="middle" fontSize={23} fontStyle="italic" fill="oklch(0.78 0.05 230 / 0.75)">Victoria</text>
      <text x={proj(3.1, 36.1).x} y={proj(3.1, 36.1).y} textAnchor="middle" fontSize={21} fontStyle="italic" fill="oklch(0.78 0.05 230 / 0.65)">Turkana</text>

      {/* country labels */}
      {COUNTRY_LABELS.filter((l) => l.name !== "Kenya").map((l) => {
        const nudge = LABEL_NUDGE[l.name] ?? {};
        return (
          <text
            key={l.name}
            x={l.x}
            y={l.y + (nudge.dy ?? 0)}
            textAnchor="middle"
            fontSize={nudge.size ?? 28}
            fontWeight={600}
            letterSpacing={3}
            fill="oklch(0.85 0.02 240 / 0.28)"
            className="select-none"
          >
            {l.name.toUpperCase()}
          </text>
        );
      })}
      <text x={proj(0.4, 37.5).x} y={proj(0.4, 37.5).y} textAnchor="middle" fontSize={44} fontWeight={700} letterSpacing={7} fill="oklch(0.93 0.03 200 / 0.55)" className="select-none">KENYA</text>
      <text x={proj(-6.5, 41.8).x} y={proj(-6.5, 41.8).y} textAnchor="middle" fontSize={27} fontStyle="italic" letterSpacing={2} fill="oklch(0.78 0.06 230 / 0.45)" className="select-none">Indian Ocean</text>

      {/* terrestrial fibre */}
      {FIBRE_ROUTES.map((r) => {
        const d = smoothPath(toPts(r.waypoints, proj));
        return (
          <path key={r.id} d={d} fill="none" stroke="oklch(0.93 0.01 260 / 0.35)" strokeWidth={1.8} strokeDasharray="1 7" strokeLinecap="round" />
        );
      })}

      {/* subsea cables, live ones carry the flowing pulse */}
      {SUBSEA_CABLES.map((c) => {
        const d = smoothPath(toPts(c.waypoints, proj));
        return (
          <g key={c.id}>
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={0.14} strokeWidth={6} strokeLinecap="round" />
            <path d={d} fill="none" stroke={c.live ? CYAN : AMBER} strokeOpacity={c.live ? 0.85 : 0.7} strokeWidth={2} strokeLinecap="round" strokeDasharray={c.live ? undefined : "7 5"} />
            {c.live && (
              <path d={d} fill="none" stroke="oklch(0.95 0.06 195)" strokeOpacity={0.9}
                strokeWidth={2.6} strokeLinecap="round" pathLength={100}
                className="dc254-flow" />
            )}
          </g>
        );
      })}

      {/* cable labels at offshore ends, rows pre-spaced to avoid collisions */}
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
            fontSize={26}
            fontWeight={500}
            fill={c.live ? "oklch(0.78 0.14 195 / 0.8)" : "oklch(0.85 0.12 85 / 0.85)"}
          >
            {c.label}
          </text>
        );
      })}

      {/* landing station, Nyali, Mombasa */}
      {(() => {
        const ls = proj(-4.04, 39.715);
        return (
          <g>
            <path d={`M${ls.x},${ls.y - 7} L${ls.x + 7},${ls.y} L${ls.x},${ls.y + 7} L${ls.x - 7},${ls.y} Z`}
              fill={CYAN} fillOpacity={0.9} stroke="oklch(0.1 0.02 250)" strokeWidth={1.1} />
            <text x={ls.x} y={ls.y + 26} textAnchor="middle" fontSize={18} fill="oklch(0.93 0.01 260 / 0.6)">Nyali landing station</text>
          </g>
        );
      })()}

      {/* PIDA / African Infrastructure Database diamonds */}
      {pidaMapped.map((p) => {
        const { x, y } = proj(p.lat as number, p.lng as number);
        const isHub = p.sector === "ICT";
        const s = isHub ? 8 : 5.5;
        return (
          <path key={`pida-${p.id}`}
            d={`M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`}
            fill={PIDA_VIOLET} fillOpacity={isHub ? 0.9 : 0.55}
            stroke="oklch(0.1 0.02 250)" strokeWidth={1}>
            <title>{`${p.name}, PIDA registry`}</title>
          </path>
        );
      })}

      {/* regional city clusters */}
      {CONTEXT_CITIES.map((city) => {
        const { x, y } = proj(city.lat, city.lng);
        const items = REGION_ITEMS.filter((i) => i.city === city.id);
        return (
          <g key={city.id}>
            <title>{`${city.name}, ${city.country}`}</title>
            <circle cx={x} cy={y} r={10} fill="oklch(0.2 0.03 250 / 0.9)" stroke="oklch(0.93 0.01 260 / 0.55)" strokeWidth={1.4} />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={12.5} fontWeight={700} fill="oklch(0.93 0.01 260)">{items.length}</text>
            <text x={x} y={y + 28} textAnchor="middle" fontSize={23} fontWeight={500} fill="oklch(0.93 0.01 260 / 0.5)">{city.name}</text>
          </g>
        );
      })}

      {/* radar sweep behind Nairobi */}
      <g opacity={0.85}>
        <path
          d={`M${nbo.x},${nbo.y} L${nbo.x + 66},${nbo.y} A66,66 0 0 0 ${nbo.x + 46},${nbo.y - 47} Z`}
          fill="url(#mpSweep)">
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${nbo.x} ${nbo.y}`} to={`360 ${nbo.x} ${nbo.y}`}
            dur="11s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Mombasa cluster */}
      <g>
        <circle cx={msa.x} cy={msa.y} r={17} fill="oklch(0.2 0.05 250 / 0.95)" stroke={CYAN} strokeWidth={2} filter="url(#mpClusterGlow)" />
        <circle cx={msa.x} cy={msa.y} r={17} fill="none" stroke={CYAN} strokeOpacity={0.4} strokeWidth={1}>
          <animate attributeName="r" from="17" to="30" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <text x={msa.x} y={msa.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight={700} fill={CYAN}>{msaCount}</text>
        <text x={msa.x + 26} y={msa.y - 4} fontSize={25} fontWeight={700} fill="oklch(0.93 0.01 260 / 0.9)">Mombasa</text>
        <text x={msa.x + 26} y={msa.y + 19} fontSize={20} fill="oklch(0.93 0.01 260 / 0.55)">{msaCount} DC · {liveCables} cables</text>
      </g>

      {/* Nairobi cluster */}
      <g>
        <circle cx={nbo.x} cy={nbo.y} r={21} fill="oklch(0.2 0.05 250 / 0.95)" stroke={CYAN} strokeWidth={2.4} filter="url(#mpClusterGlow)" />
        <circle cx={nbo.x} cy={nbo.y} r={21} fill="none" stroke={CYAN} strokeOpacity={0.45} strokeWidth={1.2}>
          <animate attributeName="r" from="21" to="38" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.55" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={nbo.x} y={nbo.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight={700} fill={CYAN}>{nboCount}</text>
        <text x={nbo.x} y={nbo.y + 48} textAnchor="middle" fontSize={27} fontWeight={700} fill="oklch(0.93 0.01 260 / 0.95)">Nairobi</text>
        <text x={nbo.x} y={nbo.y + 69} textAnchor="middle" fontSize={21} fill="oklch(0.93 0.01 260 / 0.6)">{nboCount} data centres</text>
      </g>

      {/* compass */}
      <g opacity={0.55} transform="translate(954, 52)">
        <circle r={17} fill="none" stroke="oklch(0.93 0.01 260 / 0.35)" strokeWidth={1} />
        <path d="M0,-13 L4.5,4 L0,1.5 L-4.5,4 Z" fill={CYAN} />
        <text y={-22} textAnchor="middle" fontSize={13} fontWeight={700} fill="oklch(0.93 0.01 260 / 0.7)">N</text>
      </g>
    </svg>
  );
}
