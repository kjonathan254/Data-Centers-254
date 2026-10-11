import type { VideoConfig } from "../components/scenes";

// TUESDAY — Part 1: Investigate the gap
// "Kenya is building data centres. Who will run them?"
// Editorial rule: the skills gap is presented as an OPEN QUESTION, never an asserted finding.

export const tuesdayConfig: VideoConfig = {
  id: "tuesday-gap",
  title: "Kenya is building data centres. Who will run them?",
  scenes: [
    {
      kind: "hook",
      frames: 120,
      kicker: "Workforce · Part 1",
      headline: "Kenya is building data centres. Who will run them?",
      sub: "27 facilities tracked in Kenya — 20 operational, 7 in development.",
      image: "img/junior-technician-server-aisle.webp",
      evidence: "Source: DC254 facilities dataset, 2026-Q3 · data-centers-254.vercel.app",
    },
    {
      kind: "statement",
      frames: 180,
      kicker: "The systems",
      headline: "A data centre depends on more than servers.",
      bullets: [
        "Power — grid supply, UPS, generators",
        "Cooling — chillers, CRAC units, airflow",
        "Networks — fibre, interconnection, carriers",
        "Operations — monitoring, maintenance, safety",
      ],
      image: "img/ups-switchgear-power-room.webp",
      evidence: "Illustrative imagery from the DC254 published library.",
    },
    {
      kind: "cards",
      frames: 240,
      kicker: "The workforce",
      headline: "Different systems require different skills.",
      cards: [
        { title: "Power & electrical", roles: "Electrical technicians · UPS & generator specialists" },
        { title: "Cooling & mechanical", roles: "HVAC technicians · mechanical engineers" },
        { title: "Networks & connectivity", roles: "Fibre technicians · network engineers" },
        { title: "IT & operations", roles: "Data-centre technicians · monitoring & ops" },
      ],
      image: "img/technician-rack-cabling-kenya.webp",
      evidence: "Representative role families — exact titles vary by employer.",
    },
    {
      kind: "flow",
      frames: 270,
      kicker: "The question",
      headline: "Do training pathways match real operating requirements?",
      steps: ["Education & curricula", "Practical training", "Industry requirements"],
      note: "DC254 is investigating — no answer is assumed.",
      image: "img/nairobi-skyline.webp",
      evidence: "Open question · DC254 workforce investigation, October 2026.",
    },
    {
      kind: "statement",
      frames: 240,
      kicker: "The evidence we need",
      headline: "Which practical skills should new entrants already have?",
      bullets: [
        "Technical foundations",
        "Practical experience",
        "Operational & safety procedures",
      ],
      image: "img/dc-power-technicians-training.webp",
      evidence: "Open question · DC254 workforce investigation, October 2026.",
    },
    {
      kind: "cta",
      frames: 210,
      headline: "Operators and educators: share what you see.",
      sub: "DC254 is investigating Kenya's data-centre workforce and training pathways.",
      url: "data-centers-254.vercel.app/careers",
      image: "img/dc-careers-tech.webp",
      tagline: "Evidence. Education. Industry dialogue.",
    },
  ],
};
