import type { VideoConfig } from "../components/scenes";

// WEDNESDAY — Part 2: Career pathways
// "There is no single data-centre career."
// Educational, practical. No invented vacancies, salaries or certification requirements.

export const wednesdayConfig: VideoConfig = {
  id: "wednesday-pathways",
  title: "There is no single data-centre career.",
  scenes: [
    {
      kind: "hook",
      frames: 120,
      kicker: "Workforce · Part 2",
      headline: "Think data centres are only for software engineers?",
      image: "img/dc-servers-racks.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 1",
      headline: "Power and electrical systems.",
      cards: [
        { title: "Example roles", roles: "Electrical technician · Electrical engineer · UPS specialist" },
      ],
      image: "img/ups-switchgear-power-room.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 2",
      headline: "Cooling and mechanical systems.",
      cards: [
        { title: "Example roles", roles: "HVAC technician · Mechanical engineer · Facilities engineer" },
      ],
      image: "img/dc-chillers-roof.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 3",
      headline: "Networks and connectivity.",
      cards: [
        { title: "Example roles", roles: "Fibre technician · Network engineer · Network operations analyst" },
      ],
      image: "img/woman-network-engineer-patch-panel.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 4",
      headline: "IT and cloud operations.",
      cards: [
        { title: "Example roles", roles: "Data-centre technician · Systems administrator · Cloud engineer" },
      ],
      image: "img/server-rack-patch-cabling.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 5",
      headline: "Security, safety and compliance.",
      body: "Related disciplines — different skills.",
      cards: [
        { title: "Physical security", roles: "Access control · CCTV · site guarding" },
        { title: "Cybersecurity", roles: "Networks · systems · data protection" },
      ],
      image: "img/dc-biometric-access.webp",
    },
    {
      kind: "cards",
      frames: 150,
      kicker: "Pathway 6",
      headline: "Projects, testing and commissioning.",
      cards: [
        { title: "Example roles", roles: "Project manager · Commissioning specialist · MEP engineer" },
      ],
      image: "img/construction-crane-scaffolding.webp",
      evidence: "Role titles follow common industry usage — they vary by employer.",
    },
    {
      kind: "cta",
      frames: 240,
      headline: "Which pathway do you want to understand?",
      sub: "Explore DC254's careers coverage.",
      url: "data-centers-254.vercel.app/careers",
      image: "img/dc-careers-tech.webp",
      tagline: "Evidence. Education. Industry dialogue.",
    },
  ],
};
