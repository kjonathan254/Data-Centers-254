import type { VideoConfig } from "../components/scenes";

// THURSDAY — Practical exposure (supporting day, concise explainer)
// Flow labelled as a PROPOSED learning pathway, not an established national programme.

export const thursdayConfig: VideoConfig = {
  id: "thursday-exposure",
  title: "What should students experience before entering a data centre?",
  scenes: [
    {
      kind: "flow",
      frames: 300,
      kicker: "Classroom to site",
      headline: "What should students experience before entering a data centre?",
      steps: [
        "Classroom foundations",
        "Practical exercises",
        "Supervised exposure",
        "Skills assessment",
        "Career preparation",
      ],
      note: "A proposed learning pathway — not an established national programme.",
      image: "img/classroom-ict-training-kenya.webp",
      evidence: "Proposed pathway · DC254 workforce investigation, October 2026.",
    },
    {
      kind: "cta",
      frames: 180,
      headline: "What practical learning opportunities exist today?",
      sub: "Training institutions and employers: share examples — and where collaboration could help.",
      url: "data-centers-254.vercel.app/careers",
      image: "img/dc-power-technicians-training.webp",
      tagline: "Evidence. Education. Industry dialogue.",
    },
  ],
};
