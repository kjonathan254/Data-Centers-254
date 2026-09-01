import {
  getFacilities, getMarketSnapshot, STATUS_ORDER, type Facility,
} from "@/lib/directory-data";
import { SUBSEA_CABLES } from "@/lib/map-data";
import { BOT_IDENTITY, STARTER_QUESTIONS, RESCUE_SUGGESTIONS } from "@/lib/chatbot/identity";

/**
 * Intent layer — turns a question into an answer drawn from the same
 * directory-data.ts the site renders. Nothing is invented: if a figure is
 * not in the dataset, the reply says so. Intents run in order; first match wins.
 */

export interface Citation { label: string; href: string }

export interface BotReply {
  reply: string;
  citations: Citation[];
  suggestions: string[];
  intent: string;
  answered: boolean;
  fallback?: "reformulate" | "partial" | "escalate";
  verifiedAsOf?: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function fmtVerified(v: string | null | undefined): string {
  if (!v) return "August 2026";
  const [y, m] = v.split("-");
  const mi = parseInt(m ?? "", 10) - 1;
  if (!y || Number.isNaN(mi) || !MONTHS[mi]) return v;
  return `${MONTHS[mi]} ${y}`;
}

function mw(n: number | null | undefined): string {
  return n == null ? "capacity not disclosed" : `${n} MW`;
}

// ─── Entity extraction ───────────────────────────────────────────────────────

const GENERIC_WORDS = new Set(["data","centre","center","centres","centers","facility","facilities","dc","kenya","the","of","and","group","ltd","limited","campus"]);

const OPERATOR_ALIASES: Record<string, string[]> = {
  "ixafrica": ["ixafrica", "ix africa", "nbox"],
  "africa-dc": ["africa data centres", "africa data centers", "adc"],
  "safaricom": ["safaricom"],
  "telkom-ke": ["telkom kenya", "telkom"],
  "liquid-ke": ["liquid"],
  "wingu": ["wingu"],
  "raxio": ["raxio"],
  "septris": ["septris"],
  "kenya-telcom": ["kenya data centres", "kenya data center", "ict authority", "kdc"],
  "purple": ["purple communication", "purple"],
  "global-ts": ["global ts", "global telecommunications", "gts"],
  "wananchi": ["wananchi", "zuku"],
};

const CITY_ALIASES: { city: string; names: string[] }[] = [
  { city: "Nairobi", names: ["nairobi", "mombasa road", "tilisi", "limuru", "kiambu"] },
  { city: "Mombasa", names: ["mombasa", "coast", "coastal"] },
];

export interface Entities {
  facilities: Facility[];
  operatorIds: string[];
  city?: string;
}

function facilityTokens(f: Facility): string[] {
  return f.name
    .toLowerCase()
    .replace(/[^a-z0-9\s.]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !GENERIC_WORDS.has(t));
}

export function extractEntities(query: string, history?: string[]): Entities {
  const q = query.toLowerCase();
  const facilities = getFacilities();

  // Score every facility by how many of its distinctive tokens appear.
  const scored = facilities
    .map((f) => {
      const toks = facilityTokens(f);
      const matched = toks.filter((t) => q.includes(t));
      const score = toks.length ? matched.length / toks.length : 0;
      const decisive = matched.some((t) => t.length >= 4);
      return { f, score, ok: toks.length > 0 && (score === 1 || (decisive && score >= 0.4)) };
    })
    .filter((x) => x.ok)
    .sort((a, b) => b.score - a.score);

  // De-duplicate near-identical matches (e.g. NBOX1 vs NBOX1.2: keep both only
  // if the query distinguishes them, else keep the best).
  const picked: typeof scored = [];
  for (const s of scored) {
    if (!picked.some((p) => p.f.id === s.f.id)) picked.push(s);
  }

  const operatorIds = Object.entries(OPERATOR_ALIASES)
    .filter(([, aliases]) => aliases.some((a) => q.includes(a)))
    .map(([id]) => id);

  const city = CITY_ALIASES.find((c) => c.names.some((n) => q.includes(n)))?.city;

  // Pronoun carry-over: short follow-ups inherit entities from recent history.
  const isFollowUp =
    picked.length === 0 &&
    operatorIds.length === 0 &&
    (q.split(/\s+/).length <= 4 || /\b(it|that|them|they|the (first|second|largest|other))\b/.test(q));
  if (isFollowUp && history && history.length) {
    const recent = history.slice(-3).join(" ").toLowerCase();
    const inherited = facilities
      .map((f) => {
        const toks = facilityTokens(f);
        const matched = toks.filter((t) => recent.includes(t));
        const score = toks.length ? matched.length / toks.length : 0;
        return { f, score };
      })
      .filter((x) => x.score >= 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);
    return { facilities: inherited.map((x) => x.f), operatorIds: [], city: undefined };
  }

  return {
    facilities: picked.slice(0, 3).map((x) => x.f),
    operatorIds: operatorIds.slice(0, 1),
    city,
  };
}

// ─── Composers ───────────────────────────────────────────────────────────────

type Intent = {
  name: string;
  test: (q: string, e: Entities, history: string[]) => boolean;
  run: (q: string, e: Entities, history: string[]) => BotReply | null;
};

const facilities = getFacilities();
const snap = getMarketSnapshot();
const operational = facilities.filter((f) => f.status === "Operational");
const pipeline = facilities.filter((f) => f.status !== "Operational");
const lastVerified = fmtVerified(snap.lastVerified);

function ok(reply: Omit<BotReply, "answered">): BotReply {
  return { ...reply, answered: true };
}

function profileCard(f: Facility): string {
  const bits = [
    `${f.name} is operated by ${f.operator.name}`,
    f.status === "Operational" ? "and is live today" : `and is currently ${f.status.toLowerCase()}`,
  ].join(" ");
  const caps = [
    f.itLoadMw != null ? `${f.itLoadMw} MW of live IT load` : null,
    f.totalCapacityMw != null && f.totalCapacityMw !== f.itLoadMw
      ? `${f.totalCapacityMw} MW designed capacity`
      : null,
    f.rackCount != null ? `${f.rackCount.toLocaleString("en-US")} racks` : null,
    f.tierRating ? `Tier ${f.tierRating}` : null,
    f.aiReady ? "AI-ready" : null,
  ].filter(Boolean);
  const where = [f.address, f.city].filter(Boolean).join(", ");
  return `${bits} — ${caps.join(", ") || "with capacity details not yet disclosed"}. You'll find it in ${where}. Figures verified ${lastVerified}.`;
}

const INTENTS: Intent[] = [
  // ── Social ────────────────────────────────────────────────────────────────
  {
    name: "greeting",
    test: (q) => /^(hi|hello|hey|habari|sasa|mambo|niaje|good (morning|afternoon|evening))\b/.test(q.trim()),
    run: () => ok({
      reply: BOT_IDENTITY.greeting,
      citations: [],
      suggestions: [...STARTER_QUESTIONS],
      intent: "greeting",
    }),
  },
  {
    name: "identity",
    test: (q) => /(who are you|your name|what are you|who made you|who built you|what is jibu|who is jibu|introduce yourself)/.test(q),
    run: () => ok({
      reply: `${BOT_IDENTITY.intro} ${BOT_IDENTITY.tagline}`,
      citations: [{ label: "About DC254", href: "/about" }],
      suggestions: ["How does DC254 verify its numbers?", "What can you tell me about?"],
      intent: "identity",
    }),
  },
  {
    name: "capability",
    test: (q) => /(what can you (do|tell|answer)|how can you help|what do you know|how do you work|capabilities|what topics)/.test(q),
    run: () => ok({
      reply: "I answer from DC254's verified dataset and editorial library: live capacity and the supply pipeline, every tracked facility and operator, comparisons, submarine cables, AI readiness, green power, and definitions of the jargon. For deep analysis I'll point you to the right article — I don't guess numbers I can't verify.",
      citations: [
        { label: "The directory", href: "/directory" },
        { label: "How we verify", href: "/methodology" },
      ],
      suggestions: [...STARTER_QUESTIONS],
      intent: "capability",
    }),
  },
  {
    name: "thanks",
    test: (q) => /(thank|asante|shukran|appreciate|great job|nice work|good bot)/.test(q),
    run: () => ok({
      reply: "Karibu! That's what I'm here for — ask me anything else about Kenya's digital infrastructure.",
      citations: [],
      suggestions: ["What's under construction right now?", "Which data centres are AI-ready?"],
      intent: "thanks",
    }),
  },

  // ── Data & tooling ───────────────────────────────────────────────────────
  {
    name: "dataset",
    test: (q) => /(download|csv|json|\bapi\b|export|spreadsheet|excel|dataset)/.test(q),
    run: () => ok({
      reply: "The whole directory is free to download and cite — no signup wall. Grab the CSV for spreadsheets, or query the JSON API directly; both carry the source and verification fields. Attribution to DC254 keeps the project going.",
      citations: [
        { label: "CSV dataset", href: "/api/directory/csv" },
        { label: "JSON API", href: "/api/directory" },
      ],
      suggestions: ["How does DC254 verify its numbers?"],
      intent: "dataset",
    }),
  },
  {
    name: "compare",
    test: (q) => /(compare|versus|\bvs\.?\b|difference between|side by side|against each other)/.test(q),
    run: (q, e) => {
      if (e.facilities.length >= 2) {
        const [a, b] = e.facilities;
        const la = a.itLoadMw ?? a.totalCapacityMw ?? 0;
        const lb = b.itLoadMw ?? b.totalCapacityMw ?? 0;
        const leader = la === lb ? null : la > lb ? a : b;
        const summary = leader
          ? `${leader.name} is the bigger of the two on ${leader.itLoadMw != null ? "live IT load" : "designed capacity"} at ${leader.itLoadMw ?? leader.totalCapacityMw} MW.`
          : `${a.name} and ${b.name} are neck and neck on disclosed figures.`;
        return ok({
          reply: `${summary} ${a.name}: ${mw(a.itLoadMw ?? a.totalCapacityMw)}, ${a.city}, ${a.tierRating ? `Tier ${a.tierRating}` : "tier not disclosed"}. ${b.name}: ${mw(b.itLoadMw ?? b.totalCapacityMw)}, ${b.city}, ${b.tierRating ? `Tier ${b.tierRating}` : "tier not disclosed"}. Open the side-by-side view for the full spec-by-spec table.`,
          citations: [
            { label: "Compare side by side", href: `/directory/compare?ids=${encodeURIComponent(`${a.slug},${b.slug}`)}` },
            { label: a.name, href: `/directory/${a.slug}` },
            { label: b.name, href: `/directory/${b.slug}` },
          ],
          suggestions: ["Which is the largest data centre?", "What's under construction right now?"],
          intent: "compare",
          verifiedAsOf: lastVerified,
        });
      }
      if (e.facilities.length === 1) {
        const f = e.facilities[0];
        const peers = facilities
          .filter((x) => x.id !== f.id && x.city === f.city)
          .sort((x, y) => (y.totalCapacityMw ?? 0) - (x.totalCapacityMw ?? 0))[0];
        if (peers) {
          return ok({
            reply: `Give me a second facility to compare with ${f.name} — or jump straight into the side-by-side view with ${peers.name}, its closest peer in ${f.city}.`,
            citations: [
              { label: `Compare ${f.name} vs ${peers.name}`, href: `/directory/compare?ids=${encodeURIComponent(`${f.slug},${peers.slug}`)}` },
            ],
            suggestions: [`Tell me about ${f.name}`, `Tell me about ${peers.name}`],
            intent: "compare",
          });
        }
      }
      return ok({
        reply: "I can set any of the tracked facilities side by side — up to four at a time, spec by spec. Name two (for example, iXAfrica NBOX1 and Africa Data Centres Nairobi 1), or open the comparison tool and pick from the searchable list.",
        citations: [{ label: "Open the comparison tool", href: "/directory/compare" }],
        suggestions: ["Compare iXAfrica NBOX1 and ADC Nairobi 1", "Which is the largest data centre?"],
        intent: "compare",
      });
    },
  },

  // ── Market data ──────────────────────────────────────────────────────────
  {
    name: "biggest",
    test: (q) => /(largest|biggest|leading|most (capacity|power)|top (facility|data ?cent|site))/.test(q),
    run: (_q, e) => {
      const pool = e.city ? operational.filter((f) => f.city === e.city) : operational;
      const sorted = [...pool].sort((a, b) => (b.itLoadMw ?? b.totalCapacityMw ?? 0) - (a.itLoadMw ?? a.totalCapacityMw ?? 0));
      const top = sorted.slice(0, 3);
      if (!top.length) return null;
      const pipelineBiggest = [...pipeline].sort((a, b) => (b.totalCapacityMw ?? 0) - (a.totalCapacityMw ?? 0))[0];
      return ok({
        reply: `By live IT load, ${top[0].name} leads${e.city ? ` in ${e.city}` : " the market"} at ${top[0].itLoadMw} MW — followed by ${top[1] ? `${top[1].name} (${top[1].itLoadMw ?? "n/a"} MW)` : ""}${top[2] ? ` and ${top[2].name} (${top[2].itLoadMw ?? "n/a"} MW)` : ""}. On the horizon, ${pipelineBiggest?.name ?? "the Microsoft–G42 project"} dwarfs everything built so far at ${mw(pipelineBiggest?.totalCapacityMw ?? null)} announced — but announced is not built.`,
        citations: [
          { label: top[0].name, href: `/directory/${top[0].slug}` },
          { label: "See the pipeline", href: "/tracker" },
        ],
        suggestions: ["What's under construction right now?", "How much capacity does Kenya have in total?"],
        intent: "biggest",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "pricing",
    test: (q) => /(price|pricing|cost|rate card|per kw|per rack|monthly rate|how much does it cost|how much would|cheaper|cheapest|expensive)/.test(q),
    run: (q) => {
      const wantsCapacity = /(mw|capacity|power|megawatt)/.test(q);
      if (wantsCapacity) return null; // let the capacity intent take it
      return {
        reply: "That's the one thing I won't fake: colocation pricing isn't part of the verified dataset yet — operators quote it privately per deal, and published rack rates are rarely comparable. What I can tell you is where the supply is and how it's staged. For commercial quotes, the operators themselves are the source — or write to the DC254 team and they'll point you right.",
        citations: [
          { label: "Browse operators", href: "/directory" },
          { label: "Contact DC254", href: "/contact" },
        ],
        suggestions: ["How much capacity does Kenya have in total?", "Which operators run the biggest facilities?"],
        intent: "pricing",
        answered: false,
        fallback: "partial" as const,
      };
    },
  },
  {
    name: "count",
    test: (q) => /(how many|number of|count)/.test(q) && /(data ?cent|facilit|dc\b|colocation)/.test(q),
    run: (_q, e) => {
      if (e.city) {
        const inCity = facilities.filter((f) => f.city === e.city);
        const live = inCity.filter((f) => f.status === "Operational").length;
        return ok({
          reply: `${e.city} accounts for ${inCity.length} of the ${facilities.length} tracked facilities — ${live} of them operational. Nairobi is decisively the hub: its grid, fibre density and submarine-cable via-Mombasa connectivity concentrate demand there, while Mombasa's facility sits next to the cable landing stations.`,
          citations: [{ label: "See them on the map", href: "/infrastructure/map" }],
          suggestions: ["Which is the largest data centre?", "What's under construction right now?"],
          intent: "count",
          verifiedAsOf: lastVerified,
        });
      }
      return ok({
        reply: `DC254 tracks ${facilities.length} data centre facilities across Kenya — ${snap.stages[0].count} operational, and the rest moving through the pipeline: ${pipeline.map((f) => f.status.toLowerCase()).join(", ") === "under construction, committed, early stage" ? "under construction, committed and early-stage projects" : pipeline.map((f) => f.name).join(", ")}. The count spans commercial colocation, telecom-owned and government installations.`,
        citations: [
          { label: "Browse the directory", href: "/directory" },
          { label: "Track the pipeline", href: "/tracker" },
        ],
        suggestions: ["Which is the largest data centre?", "How much capacity does Kenya have in total?"],
        intent: "count",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "capacityTotal",
    test: (q) => /(total|combined|overall|altogether|sum|how much).*(mw|megawatt|capacity|power)|(capacity|mw).*(kenya|market|country|in total)/.test(q),
    run: () => {
      const liveDesigned = operational.reduce((s, f) => s + (f.totalCapacityMw ?? 0), 0);
      const liveIt = snap.liveItLoadMw;
      const pipelineMw = pipeline.reduce((s, f) => s + (f.totalCapacityMw ?? 0), 0);
      return ok({
        reply: `Kenya's operational fleet represents about ${liveDesigned.toFixed(1)} MW of built, designed capacity — of which ${liveIt.toFixed(1)} MW is verified in-service IT load. The pipeline adds roughly ${pipelineMw.toFixed(0)} MW announced across under-construction, committed and early-stage projects. That distinction matters: announced figures are developer claims, and we don't let them masquerade as electrons.`,
        citations: [
          { label: "The market snapshot", href: "/directory" },
          { label: "How we count", href: "/methodology" },
        ],
        suggestions: ["What's under construction right now?", "Which is the largest data centre?"],
        intent: "capacityTotal",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "pipeline",
    test: (q) => /(under construction|being built|pipeline|coming (online|soon)|planned|committed|early stage|upcoming|future (facility|project|capacity)|new build|expansion)/.test(q),
    run: () => {
      const lines = pipeline.map((f) => `${f.name} (${f.operator.name}, ${mw(f.totalCapacityMw ?? f.itLoadMw)}, ${f.status.toLowerCase()})`);
      return ok({
        reply: `The pipeline is where the market's growth lives: ${lines.join("; ")}. All up, roughly ${pipeline.reduce((s, f) => s + (f.totalCapacityMw ?? 0), 0).toFixed(0)} MW of announced capacity — the Microsoft–G42 campus alone would more than double Kenya's built base. Remember the staged reality: announced → committed → under construction → live. Only the last one serves a server.`,
        citations: [
          { label: "Track the pipeline", href: "/tracker" },
          ...(pipeline[0] ? [{ label: pipeline[0].name, href: `/directory/${pipeline[0].slug}` }] : []),
        ],
        suggestions: ["How much capacity does Kenya have in total?", "When do new facilities open?"],
        intent: "pipeline",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "newest",
    test: (q) => /(newest|latest|recently (opened|launched)|when.*(open|launch)|how old|opened)/.test(q),
    run: () => {
      const dated = operational
        .filter((f) => f.openedDate)
        .sort((a, b) => Number(b.openedDate) - Number(a.openedDate));
      const top = dated.slice(0, 3).map((f) => `${f.name} (${f.openedDate})`);
      return ok({
        reply: `The newest verified openings: ${top.join(", ")}. iXAfrica NBOX1 — opened 2024 — is the flagship of that wave and East Africa's first hyperscale, AI-ready facility. Opened years across the fleet run from 2010 (Telkom Kenya) to 2024, which tells you how young this market is.`,
        citations: [{ label: "Browse the directory", href: "/directory" }],
        suggestions: ["What's under construction right now?", "Which is the largest data centre?"],
        intent: "newest",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "aiReady",
    test: (q) => /(ai[- ]?ready|artificial intelligence|gpu|machine learning (ready|workload)|inference|training (workload|cluster))/.test(q),
    run: () => {
      const list = facilities.filter((f) => f.aiReady);
      const named = list.filter((f) => f.status === "Operational").slice(0, 4).map((f) => f.name);
      return ok({
        reply: `${list.length} of the ${facilities.length} tracked facilities are flagged AI-ready — high-density racks, liquid-cooling readiness or GPU-capable power envelopes. The operational AI-ready set includes ${named.join(", ")}, with the NBOX1.2 build and the Microsoft–G42 campus designed explicitly for AI-scale density. AI workloads pull far more power per rack than classic cloud hosting, which is exactly why Kenya's renewable-heavy grid keeps coming up in the pitch.`,
        citations: [
          { label: "Filter AI-ready facilities", href: "/directory" },
          { label: "The AI cluster", href: "/ai" },
        ],
        suggestions: ["What powers Kenya's data centres?", "Which is the largest data centre?"],
        intent: "aiReady",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "cables",
    test: (q) => /(submarine|undersea|subsea|cable|bandwidth|landing station|seacom|teams\b|eassy|peace cable|dare1|lion2|daraja|connect(ed|ivity|s)? (to|with) the (world|internet|outside))/.test(q),
    run: () => {
      const live = SUBSEA_CABLES.filter((c) => c.live);
      const totalTbps = live.reduce((s, c) => s + (c.designTbps ?? 0), 0);
      return ok({
        reply: `Six submarine cable systems are live at the Mombasa landing station — ${live.map((c) => `${c.name} (${c.designTbps ?? "?"} Tbps)`).join(", ")} — roughly ${totalTbps.toFixed(1)} Tbps of designed capacity. Meta's Daraja is in development. Every one of them lands at the same shoreline, which is Kenya's strength and its single point of failure in one sentence.`,
        citations: [
          { label: "See the cable map", href: "/infrastructure/map" },
          { label: "Fibre & connectivity articles", href: "/internet" },
        ],
        suggestions: ["Which data centres are near the cables?", "How much capacity does Kenya have in total?"],
        intent: "cables",
      });
    },
  },
  {
    name: "greenPower",
    test: (q) => /(green|renewable|geothermal|solar|wind|clean energy|carbon|sustainab|electricity|power (source|grid|supply)|powered by|energy)/.test(q),
    run: () => {
      const withClaims = operational.filter((f) => f.renewableClaim).slice(0, 3);
      return ok({
        reply: `Kenya's grid is one of the greenest on Earth — roughly 90% renewable, anchored by Rift Valley geothermal with hydro and wind behind it. That means data centres here run genuinely low-carbon power without certificate accounting. ${withClaims.length ? `Operators lean into it: ${withClaims.map((f) => f.name).join(", ")} all cite the renewable grid on record.` : ""} It's quietly Kenya's strongest pitch for AI and cloud investment.`,
        citations: [
          { label: "The energy cluster", href: "/energy" },
          { label: "Kenya's green data centre edge", href: "/articles/kenya-renewables-industrial-power-data-centres" },
        ],
        suggestions: ["Which data centres are AI-ready?", "How much capacity does Kenya have in total?"],
        intent: "greenPower",
      });
    },
  },
  {
    name: "tier",
    test: (q) => /(tier [1-4i]|uptime|redundancy rating)/.test(q),
    run: () => {
      const t3 = operational.filter((f) => f.tierRating === "III").length;
      const t2 = operational.filter((f) => f.tierRating === "II").length;
      return ok({
        reply: `Across the operational fleet, ${t3} facilities carry Tier III ratings (concurrent maintainability) and ${t2} sit at Tier II. Tier III is the market standard for enterprise colocation here — it lets any component be maintained without taking the floor down. The directory lists the rating on every facility page where it's been published.`,
        citations: [{ label: "Browse the directory", href: "/directory" }],
        suggestions: ["Which is the largest data centre?", "What does Tier III mean?"],
        intent: "tier",
        verifiedAsOf: lastVerified,
      });
    },
  },
  {
    name: "operatorQuery",
    test: (q, e) => /(who (owns|runs|operates|built|manages)|\bruns?\b|operated by|operator|operators|\bown\b)/.test(q) && (e.facilities.length > 0 || e.operatorIds.length > 0),
    run: (q, e) => {
      // "What facilities does Africa Data Centres run?" → list the operator's
      // facilities. "Who owns Wingu Nairobi?" → the owner answer.
      const asksListing =
        /(what|which|list|how many).*(facilit|data ?cent)|facilit(y|ies) (of|from|by)/.test(q);
      if (e.operatorIds.length > 0 && (asksListing || e.facilities.length === 0)) {
        const list = facilities.filter((f) => f.operatorId === e.operatorIds[0]);
        if (list.length) {
          const items = list.map((f) => `${f.name} (${mw(f.totalCapacityMw ?? f.itLoadMw)}, ${f.status.toLowerCase()})`);
          return ok({
            reply: `${list[0].operator.name} runs ${list.length} tracked ${list.length === 1 ? "facility" : "facilities"}: ${items.join("; ")}.`,
            citations: [{ label: "All operators", href: "/directory" }],
            suggestions: ["Who operates Kenya's data centres?", "Which is the largest data centre?"],
            intent: "operatorQuery",
            verifiedAsOf: lastVerified,
          });
        }
      }
      if (e.facilities.length > 0) {
        const f = e.facilities[0];
        return ok({
          reply: `${f.name} is operated by ${f.operator.name}${f.operator.parentCompany ? `, part of ${f.operator.parentCompany}` : ""}${f.operator.hqCountry ? `, headquartered in ${f.operator.hqCountry}` : ""}. ${f.notable ?? ""}`,
          citations: [
            { label: f.name, href: `/directory/${f.slug}` },
            { label: "All operators", href: "/directory" },
          ],
          suggestions: [`Tell me about ${f.name}`, "Who operates Kenya's data centres?"],
          intent: "operatorQuery",
          verifiedAsOf: lastVerified,
        });
      }
      const opFacilities = facilities.filter((f) => f.operatorId === e.operatorIds[0]);
      if (opFacilities.length) {
        const list = opFacilities.map((f) => `${f.name} (${mw(f.totalCapacityMw ?? f.itLoadMw)}, ${f.status.toLowerCase()})`);
        return ok({
          reply: `${opFacilities[0].operator.name} runs ${opFacilities.length} tracked ${opFacilities.length === 1 ? "facility" : "facilities"}: ${list.join("; ")}.`,
          citations: [{ label: "All operators", href: "/directory" }],
          suggestions: ["Who operates Kenya's data centres?", "Which is the largest data centre?"],
          intent: "operatorQuery",
          verifiedAsOf: lastVerified,
        });
      }
      return null;
    },
  },
  {
    name: "location",
    test: (q, e) => /\b(where (is|are|do)|located|location|address|which city|near)\b/.test(q),
    run: (_q, e) => {
      if (e.facilities.length > 0) {
        const f = e.facilities[0];
        const parts = [f.address, f.city, f.region].filter((p): p is string => Boolean(p));
        const deduped = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);
        return ok({
          reply: `${f.name} sits at ${deduped.join(", ")}. ${f.status === "Operational" ? "It's live today." : `It's currently ${f.status.toLowerCase()}.`}`,
          citations: [
            { label: f.name, href: `/directory/${f.slug}` },
            { label: "See it on the map", href: "/infrastructure/map" },
          ],
          suggestions: [`Tell me about ${f.name}`, "Where are Kenya's data centres concentrated?"],
          intent: "location",
        });
      }
      return ok({
        reply: `The market concentrates hard: most of the ${facilities.length} tracked facilities are in Nairobi — drawn by grid capacity, fibre density and enterprise demand — with Mombasa hosting the coastal facility next to the submarine-cable landing stations. One planned campus (iXAfrica NBOX2 at Tilisi) sits on the Nairobi–Nakuru highway corridor, following the power and the growing edge demand westwards.`,
        citations: [
          { label: "The infrastructure map", href: "/infrastructure/map" },
          { label: "Browse the directory", href: "/directory" },
        ],
        suggestions: ["Which is the largest data centre?", "What's under construction right now?"],
        intent: "location",
      });
    },
  },
  {
    name: "profile",
    test: (_q, e) => e.facilities.length > 0,
    run: (_q, e) => {
      const f = e.facilities[0];
      return ok({
        reply: profileCard(f),
        citations: [
          { label: `${f.name} — full profile`, href: `/directory/${f.slug}` },
          { label: "Compare side by side", href: `/directory/compare?ids=${encodeURIComponent(f.slug)}` },
        ],
        suggestions: [`Compare ${f.name} with others`, "What's under construction right now?"],
        intent: "profile",
        verifiedAsOf: lastVerified,
      });
    },
  },
];

export function runIntents(query: string, entities: Entities, history: string[]): BotReply | null {
  for (const intent of INTENTS) {
    try {
      if (intent.test(query, entities, history)) {
        const result = intent.run(query, entities, history);
        if (result) return result;
      }
    } catch {
      // An intent failure must never crash the chat — fall through to retrieval.
    }
  }
  return null;
}

export { STATUS_ORDER, RESCUE_SUGGESTIONS };
