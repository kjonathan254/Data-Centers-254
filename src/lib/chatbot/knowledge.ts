import { getAllArticles } from "@/lib/articles";
import { glossaryTerms } from "@/lib/glossary-data";
import {
  KENYA_FACILITIES, SUBSEA_CABLES, REGION_ITEMS, KIXP, LIVE_MW, PIPELINE_MW,
} from "@/lib/map-data";
import { SearchIndex, type IndexedChunk } from "@/lib/chatbot/retrieve";

/**
 * The bot's "training data" — actually a live retrieval index assembled from
 * everything DC254 publishes. No model, no retraining: publish an article and
 * Jibu can cite it on the next request. Cached per serverless instance.
 */

interface RawChunk {
  id: string;
  kind: IndexedChunk["kind"];
  title: string;
  heading?: string;
  slug?: string;
  href: string;
  text: string;
  boost: number;
}

function chunkArticle(content: string): { heading: string; text: string }[] {
  // Split on H2 headings; fall back to the whole body as one chunk.
  const sections = content.split(/\n(?=## )/);
  const out: { heading: string; text: string }[] = [];
  for (const section of sections) {
    const clean = section
      .replace(/^##\s*/, "")
      .replace(/###\s*/g, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
      .replace(/[#*_>`|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (clean.length < 120) continue;
    const firstLineBreak = clean.indexOf(". ");
    const heading = firstLineBreak > 8 ? clean.slice(0, firstLineBreak + 1) : clean.slice(0, 80);
    // Cap chunk length — BM25 prefers focused passages.
    const text = clean.length > 900 ? clean.slice(0, 900).replace(/\s\S*$/, "") + "…" : clean;
    out.push({ heading, text });
  }
  return out;
}

function buildRawChunks(): RawChunk[] {
  const chunks: RawChunk[] = [];

  // Articles — chunked by section so answers cite the right passage.
  for (const article of getAllArticles()) {
    const { frontmatter: fm } = article;
    for (const [i, chunk] of chunkArticle(article.content).entries()) {
      chunks.push({
        id: `article:${fm.slug}:${i}`,
        kind: "article",
        title: fm.title,
        heading: chunk.heading,
        slug: fm.slug,
        href: `/articles/${fm.slug}`,
        text: chunk.text,
        boost: 1,
      });
    }
  }

  // Glossary — high authority for definitions.
  for (const term of glossaryTerms) {
    chunks.push({
      id: `glossary:${term.term}`,
      kind: "glossary",
      title: term.term,
      href: "/glossary",
      text: `${term.term}: ${term.short} ${term.definition}`,
      boost: 1.3,
    });
  }

  // Submarine cables — one chunk each (connectivity questions are common).
  for (const cable of SUBSEA_CABLES) {
    chunks.push({
      id: `cable:${cable.id}`,
      kind: "fact",
      title: `${cable.name} submarine cable`,
      href: "/infrastructure/map",
      text: `${cable.name} submarine cable, live since ${cable.year}, design capacity ${cable.designTbps ?? "unknown"} Tbps. ${cable.note}. It lands at the Mombasa cable landing station.`,
      boost: 1.35,
    });
  }

  // Market facts — Microsoft-G42, KIXP, regional context.
  const g42 = KENYA_FACILITIES.find((f) => f.id === "msft");
  if (g42) {
    chunks.push({
      id: "fact:microsoft-g42",
      kind: "fact",
      title: "Microsoft–G42 AI data centre Kenya",
      href: "/ai",
      text: `The Microsoft–G42 AI data centre is a US$1 billion project announced for Nairobi, with around 100 MW of planned capacity, operated by ${g42.operator}. It is at an early stage: site to be confirmed and pending grid capacity. It is the single largest project in Kenya's data centre pipeline.`,
      boost: 1.4,
    });
  }
  chunks.push({
    id: "fact:kixp",
    kind: "fact",
    title: "KIXP Kenya Internet Exchange Point",
    href: "/infrastructure/map",
    text: `KIXP, the Kenya Internet Exchange Point in Nairobi, keeps local traffic local: ${KIXP.members} member networks, peak traffic around ${KIXP.peakGbps} Gbps, running since ${KIXP.year}.`,
    boost: 1.3,
  });
  // Kenya fixed broadband — headline numbers (CA sector statistics, June 2025;
  // FTTH subset per Point Topic via TelcoTitans). Common question, focused chunk.
  chunks.push({
    id: "fact:kenya-fixed-broadband",
    kind: "fact",
    title: "Kenya fixed broadband subscriptions",
    href: "/articles/africa-fibre-commercial-operating-model",
    text: `Kenya counted about 2.14 million fixed-internet subscriptions by June 2025 per the Communications Authority, led by Safaricom with roughly 678,000 lines (about 36.5 percent share), followed by Jamii Telecommunications and Wananchi Group's Zuku. The fibre-to-the-home subset is around 1.2 million lines; the rest rides on fixed-wireless access. Penetration remains low relative to population, making Kenya one of Africa's fastest-scaling fixed-broadband markets.`,
    boost: 1.35,
  });
  for (const item of REGION_ITEMS) {
    if (item.type !== "datacenter") continue;
    chunks.push({
      id: `region:${item.id}`,
      kind: "fact",
      title: `${item.name} — East Africa`,
      href: "/infrastructure/map",
      text: `${item.name} in ${item.city}: ${item.description}${item.powerMW ? `, around ${item.powerMW} MW` : ""}, ${item.year}. Part of the wider East African market that surrounds Kenya's hub.`,
      boost: 1.2,
    });
  }

  return chunks;
}

let cachedIndex: SearchIndex | null = null;

/** The searchable index over articles + glossary + curated facts. */
export function getKnowledgeIndex(): SearchIndex {
  if (!cachedIndex) cachedIndex = new SearchIndex(buildRawChunks());
  return cachedIndex;
}

/** Editorial FAQ answers (curated, highest-trust) for exact-question matching. */
export interface FaqPair {
  q: string;
  a: string;
  keywords: string[];
  links: { label: string; href: string }[];
}

export function getFaqPairs(): FaqPair[] {
  return [
    {
      q: "How many data centres does Kenya have?",
      a: "Kenya has 16 tracked data centre facilities, of which 12 are operational. The rest are under construction or announced — including some of the largest projects in the region. The count covers commercial colocation campuses, telecom-owned facilities and government installations in Nairobi, Mombasa and secondary cities.",
      keywords: ["how many data centres", "how many dc", "number of facilities", "how many facilities"],
      links: [{ label: "Browse the full directory", href: "/directory" }],
    },
    {
      q: "What is the largest data centre in Kenya or East Africa?",
      a: "By live capacity, iXAfrica NBOX1 in Nairobi leads the market with 4.5 MW of live IT load — East Africa's first hyperscale, AI-ready facility. The biggest number on the horizon is the Microsoft–G42 AI data centre project, a $1 billion commitment with around 100 MW of planned capacity announced for Nairobi.",
      keywords: ["largest", "biggest", "largest data centre", "biggest facility"],
      links: [
        { label: "See the facility record", href: "/directory/ixafrica-nbox1" },
        { label: "Read the AI cluster analysis", href: "/ai" },
      ],
    },
    {
      q: "How much new data centre capacity is coming to Kenya?",
      a: "Projects that are announced or under construction — outside today's operational fleet — represent roughly 171 MW of planned capacity. That includes iXAfrica's NBOX2 expansion, the Microsoft–G42 campus and other operator build-outs. Pipeline figures are developer-announced, not independently measured.",
      keywords: ["how much new capacity", "coming online", "new capacity", "pipeline capacity"],
      links: [{ label: "How we count capacity", href: "/methodology" }],
    },
    {
      q: "How many submarine cables connect Kenya to the global internet?",
      a: "Six international submarine cable systems are live in Kenya — SEACOM, TEAMS, EASSy, LION2, DARE1 and PEACE — all landing on the coast at Mombasa. A seventh, Meta's Daraja, is in development. This concentration is both Kenya's strength and its single point of failure.",
      keywords: ["submarine cables", "undersea cables", "internet cables", "cables connect"],
      links: [{ label: "The infrastructure map", href: "/infrastructure/map" }],
    },
    {
      q: "What powers Kenya's data centres — and are they green?",
      a: "Kenya's electricity grid is one of the greenest on Earth: roughly 90% of generation comes from renewables, anchored by geothermal baseload from the Rift Valley plus hydro and wind. For data centres, that means genuinely low-carbon power without relying on renewable-energy certificates — a structural advantage almost no other emerging market can match.",
      keywords: ["green", "renewable", "power source", "energy", "geothermal"],
      links: [
        { label: "The energy cluster", href: "/energy" },
        { label: "Kenya's green data centre edge", href: "/articles/kenya-renewables-industrial-power-data-centres" },
      ],
    },
    {
      q: "Which Kenyan data centres are AI-ready?",
      a: "12 of the 16 tracked facilities are flagged AI-ready on DC254, meaning they offer high-density racks, liquid-cooling readiness or GPU-capable power envelopes. AI workloads demand far more power per rack than conventional cloud hosting — not every existing facility can retrofit to meet them.",
      keywords: ["ai ready", "ai-ready", "artificial intelligence facilities", "gpu"],
      links: [{ label: "Filter AI-ready facilities", href: "/directory" }],
    },
    {
      q: "Who operates Kenya's data centres?",
      a: "The market runs on 12 tracked operators, spanning regional specialists (iXAfrica, Wingu Africa, Raxio), pan-African platforms (Africa Data Centres, Liquid Intelligent Technologies), national telecoms (Safaricom, Telkom Kenya) and government-backed players (Kenya Data Centres under the ICT Authority). No single operator controls the majority of live capacity.",
      keywords: ["who operates", "operators", "who owns", "companies running"],
      links: [{ label: "See all operators", href: "/directory" }],
    },
    {
      q: "Do you need a licence to run a data centre in Kenya?",
      a: "Kenya's data centre market is liberalised, and the regulatory picture has been moving quickly — from licensing frameworks under the Communications Authority to county-level approvals and the national digital economy agenda. DC254 maintains a dedicated explainer on the licensing and regulatory framework as it stands.",
      keywords: ["licence", "license", "regulation", "regulatory", "caa approval"],
      links: [{ label: "The licensing framework explainer", href: "/news/kenya-data-centre-licensing-framework" }],
    },
    {
      q: "How does DC254 verify its numbers?",
      a: "Every facility in the directory carries a named data source, a confidence rating and a last-verified date. We separate verified, in-service IT load from developer-announced pipeline figures, and we publish the method so you can check our work. When a claim cannot be verified, the directory says so instead of rounding up.",
      keywords: ["verify", "verification", "methodology", "how do you know", "trust", "sources"],
      links: [{ label: "Read the DC254 methodology", href: "/methodology" }],
    },
    {
      q: "Can I download or reuse DC254's data?",
      a: "Yes — the full directory is free to download and cite, with no signup wall. Grab the CSV dataset or query the JSON API directly; both carry the same source and verification fields you see on the site. Attribution to Data Centre 254 is appreciated.",
      keywords: ["download", "csv", "api", "reuse", "export", "dataset"],
      links: [
        { label: "Download the CSV", href: "/api/directory/csv" },
        { label: "Query the JSON API", href: "/api/directory" },
      ],
    },
  ];
}
