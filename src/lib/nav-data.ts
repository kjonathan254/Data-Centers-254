// Single source of truth for navigation links (backlog: nav link arrays were
// copy-pasted across navbar / mobile-nav-sheet / footer, so a route or label
// change had to be remembered in three places). Every link's label + href is
// declared exactly once in `navLinks`; the composed arrays below define each
// surface's selection and order. Pure data — no React, no client directive.
//
// Deliberate per-surface differences preserved verbatim from the pre-module
// markup — do not "unify" them without a product decision:
// - Desktop navbar's Explore dropdown omits FAQ (dropdown height); the mobile
//   sheet and the footer both include it.
// - Footer labels the policy page "Policy & Regulation" (roomier columns);
//   navbar and mobile sheet use the short "Policy". Same /policy route.
// - "Knowledge Base" and "Data Centres" share the /data-centres route but are
//   distinct links: the navbar Explore head entry vs the topics/footer entry.
// - Footer-only resources: Data Exports, Methodology, Corrections, Kiswahili
//   Glossary.

export interface NavLink {
  label: string;
  href: string;
}

const navLinks = {
  dataCentres: { label: "Data Centres", href: "/data-centres" },
  knowledgeBase: { label: "Knowledge Base", href: "/data-centres" },
  infrastructure: { label: "Infrastructure", href: "/infrastructure" },
  map: { label: "Map", href: "/infrastructure/map" },
  ai: { label: "AI", href: "/ai" },
  energy: { label: "Energy", href: "/energy" },
  policyShort: { label: "Policy", href: "/policy" },
  policyLong: { label: "Policy & Regulation", href: "/policy" },
  careers: { label: "Careers", href: "/careers" },
  research: { label: "Research", href: "/research" },
  dcDirectory: { label: "DC Directory", href: "/directory" },
  tracker: { label: "Tracker", href: "/tracker" },
  compare: { label: "Compare", href: "/directory/compare" },
  dataExports: { label: "Data Exports", href: "/data-exports" },
  opportunityBrief: { label: "Opportunity Brief", href: "/opportunity-brief" },
  askJibu: { label: "Ask Jibu", href: "/chat" },
  methodology: { label: "Methodology", href: "/methodology" },
  corrections: { label: "Corrections", href: "/corrections" },
  glossary: { label: "Glossary", href: "/glossary" },
  kiswahiliGlossary: { label: "Kiswahili Glossary", href: "/glossary/kiswahili" },
  faq: { label: "FAQ", href: "/faq" },
  foundations: { label: "Foundations", href: "/foundations" },
  search: { label: "Search", href: "/search" },
  about: { label: "About", href: "/about" },
  contact: { label: "Contact", href: "/contact" },
} as const satisfies Record<string, NavLink>;

/** Topics row — desktop navbar dropdown + mobile sheet (identical). */
export const TOPIC_LINKS: NavLink[] = [
  navLinks.dataCentres,
  navLinks.infrastructure,
  navLinks.map,
  navLinks.ai,
  navLinks.energy,
  navLinks.policyShort,
  navLinks.careers,
  navLinks.research,
];

/** Platform links — desktop navbar Explore dropdown (no FAQ, by design). */
export const PLATFORM_LINKS: NavLink[] = [
  navLinks.dcDirectory,
  navLinks.tracker,
  navLinks.compare,
  navLinks.askJibu,
  navLinks.glossary,
  navLinks.foundations,
  navLinks.search,
  navLinks.about,
  navLinks.contact,
];

/** Mobile sheet platform list — desktop list plus FAQ after Glossary. */
export const MOBILE_PLATFORM_LINKS: NavLink[] = [
  navLinks.dcDirectory,
  navLinks.tracker,
  navLinks.compare,
  navLinks.askJibu,
  navLinks.glossary,
  navLinks.faq,
  navLinks.foundations,
  navLinks.search,
  navLinks.about,
  navLinks.contact,
];

/** Desktop navbar Explore dropdown: Knowledge Base head entry + platform links. */
export const EXPLORE_LINKS: NavLink[] = [navLinks.knowledgeBase, ...PLATFORM_LINKS];

/** Footer "Explore" column. */
export const FOOTER_TOPIC_LINKS: NavLink[] = [
  navLinks.dataCentres,
  navLinks.infrastructure,
  navLinks.map,
  navLinks.policyLong,
  navLinks.ai,
  navLinks.energy,
  navLinks.careers,
  navLinks.research,
];

/** Footer "Resources" column. */
export const FOOTER_PLATFORM_LINKS: NavLink[] = [
  navLinks.dcDirectory,
  navLinks.tracker,
  navLinks.compare,
  navLinks.dataExports,
  navLinks.opportunityBrief,
  navLinks.askJibu,
  navLinks.methodology,
  navLinks.corrections,
  navLinks.glossary,
  navLinks.kiswahiliGlossary,
  navLinks.faq,
  navLinks.foundations,
  navLinks.search,
  navLinks.about,
  navLinks.contact,
];
