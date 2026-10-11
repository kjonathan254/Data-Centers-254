import type { VideoConfig } from "../components/scenes";

// FRIDAY — Part 3: Build the talent pipeline
// Collaboration mechanisms are PROPOSED, not commitments. No partnership claims.

export const fridayConfig: VideoConfig = {
  id: "friday-partnership",
  title: "Universities and industry must build Kenya's data-centre talent pipeline together.",
  scenes: [
    {
      kind: "hook",
      frames: 150,
      kicker: "Workforce · Part 3",
      headline: "Kenya's data-centre talent pipeline needs collaboration.",
      image: "img/nairobi-skyline-night.webp",
    },
    {
      kind: "statement",
      frames: 210,
      kicker: "Education",
      headline: "Education builds technical foundations.",
      body: "Universities, TVETs and technical academies teach the fundamentals that infrastructure runs on.",
      image: "img/classroom-ict-training-kenya.webp",
    },
    {
      kind: "statement",
      frames: 210,
      kicker: "Industry",
      headline: "Industry contributes practical requirements and experience.",
      body: "Operators know which skills matter on the floor — from power rooms to network operations.",
      image: "img/ups-switchgear-power-room.webp",
    },
    {
      kind: "flow",
      frames: 300,
      kicker: "Together",
      headline: "Where collaboration could happen:",
      steps: [
        "Curriculum alignment",
        "Practical exposure",
        "Mentorship",
        "Certification guidance",
        "Internships & entry-level pathways",
      ],
      note: "Proposed collaboration mechanisms — not commitments secured.",
      image: "img/dc-power-technicians-training.webp",
      evidence: "Proposed mechanisms · DC254 workforce investigation, October 2026.",
    },
    {
      kind: "statement",
      frames: 210,
      kicker: "DC254's role",
      headline: "Making workforce needs more visible.",
      body: "Evidence. Education. Industry dialogue.",
    },
    {
      kind: "cta",
      frames: 270,
      headline: "Are you working on digital-infrastructure skills in Kenya?",
      sub: "Operators, universities, TVETs and technical academies: let's start a conversation.",
      url: "data-centers-254.vercel.app/careers",
      email: "elmaccommunicationslimited@gmail.com",
      image: "img/dc-women-engineers-corridor.webp",
      tagline: "Evidence. Education. Industry dialogue.",
    },
  ],
};
