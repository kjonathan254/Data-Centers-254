const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, HeadingLevel,
  WidthType, BorderStyle, ShadingType, PageBreak, SectionType,
} = require("docx");
const fs = require("fs");

// ─── DM-1 Palette (Deep Cyan — tech/digital infrastructure) ───
const P = {
  bg: "162235", primary: "FFFFFF", accent: "37DCF2",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "1B6B7A", headerText: "FFFFFF", accentLine: "1B6B7A", innerLine: "C8DDE2", surface: "EDF3F5" },
};
const c = (hex) => hex.replace("#", "");

// ─── Border helpers ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine };
const headerBorderBottom = { style: BorderStyle.SINGLE, size: 6, color: P.table.accentLine };

// ─── calcTitleLayout (from design-system.md) ───
function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([
    ...' \t', '-', '_', '/', '(', ')', ':', ',', '.', ';',
  ]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 3) {
    const last = lines.pop(); lines[lines.length - 1] += " " + last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 38, minPt = 24) {
  const charWidth = (pt) => pt * 11; // English chars are ~half CJK width
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = splitTitleLines(title, charsPerLine(minPt));
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const { titleLineCount = 1, titlePt = 36, hasSubtitle = false,
    hasEnglishLabel = false, metaLineCount = 0, fixedHeight = 800,
    marginTop = 0, marginBottom = 0, pageHeight = 16838 } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight + metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

// ─── Build Cover (R1: Pure Paragraph Left) ───
function buildCoverR1(config) {
  const P = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 38, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length, fixedHeight: 800,
  });

  const children = [];
  // Top whitespace
  children.push(new Paragraph({ spacing: { before: spacing.topSpacing }, children: [] }));
  // English label with accent bottom border
  if (config.englishLabel) {
    children.push(new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: P.accent, space: 8 } },
      children: [new TextRun({ text: config.englishLabel, font: { ascii: "Calibri" }, size: 20, color: P.accent, characterSpacing: 120 })],
    }));
  }
  // Title lines
  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      spacing: { line: Math.ceil(titlePt * 23), lineRule: "atLeast", after: i === titleLines.length - 1 ? 200 : 60 },
      children: [new TextRun({ text: titleLines[i], font: { ascii: "Calibri" }, size: titleSize, bold: true, color: P.cover.titleColor })],
    }));
  }
  // Subtitle
  if (config.subtitle) {
    children.push(new Paragraph({
      spacing: { after: 300, line: 312 },
      children: [new TextRun({ text: config.subtitle, font: { ascii: "Calibri" }, size: 22, color: P.cover.subtitleColor })],
    }));
  }
  // Meta lines
  for (const ml of config.metaLines || []) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      border: { left: { style: BorderStyle.SINGLE, size: 6, color: P.accent, space: 10 } },
      indent: { left: 200 },
      children: [new TextRun({ text: ml, font: { ascii: "Calibri" }, size: 20, color: P.cover.metaColor })],
    }));
  }
  // Bottom spacer
  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing }, children: [] }));
  // Footer with top accent line
  children.push(new Paragraph({
    spacing: { before: 200, after: 100 },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: P.accent, space: 10 } },
    children: [
      new TextRun({ text: config.footerLeft || "Data Centre 254", font: { ascii: "Calibri" }, size: 18, color: P.cover.footerColor }),
      new TextRun({ text: "    " }),
      new TextRun({ text: config.footerRight || "August 2026", font: { ascii: "Calibri" }, size: 18, color: P.cover.footerColor }),
    ],
  }));

  // Wrap in full-page table
  return [new Table({
    borders: allNoBorders,
    width: { size: 11906, type: WidthType.DXA },
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      verticalAlign: "top",
      children: [new TableCell({
        borders: allNoBorders,
        shading: { fill: P.bg, type: ShadingType.CLEAR },
        width: { size: 11906, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: padL, right: padR },
        children,
      })],
    })],
  })];
}

// ─── Article Body Helpers ───
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, font: { ascii: "Calibri" }, color: c(P.table.accentLine) })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, font: { ascii: "Calibri" }, color: "1C2A3D" })],
  });
}

function bodyPara(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 180, line: 312 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Calibri" }, color: "1C2A3D" })],
  });
}

function bodyParaRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 180, line: 312 },
    children: runs,
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 24, font: { ascii: "Calibri" }, color: "1C2A3D" });
}

function normal(text) {
  return new TextRun({ text, size: 24, font: { ascii: "Calibri" }, color: "1C2A3D" });
}

function accent(text) {
  return new TextRun({ text, bold: true, size: 24, font: { ascii: "Calibri" }, color: c(P.table.accentLine) });
}

function captionPara(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 80, after: 240, line: 312 },
    children: [new TextRun({ text, size: 20, font: { ascii: "Calibri" }, italics: true, color: "5B6B7D" })],
  });
}

// ─── Build Comparison Table ───
function buildComparisonTable() {
  const headerRow = (cells) => new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: cells.map((text, i) => new TableCell({
      width: { size: i === 0 ? 35 : (i === 1 ? 32.5 : 32.5), type: WidthType.PERCENTAGE },
      shading: { fill: P.table.headerBg, type: ShadingType.CLEAR },
      borders: { top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine }, bottom: headerBorderBottom, left: thinBorder, right: thinBorder },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 22, font: { ascii: "Calibri" }, color: P.table.headerText })] })],
    })),
  });

  const dataRow = (cells, idx) => new TableRow({
    cantSplit: true,
    children: cells.map((text, i) => new TableCell({
      width: { size: i === 0 ? 35 : (i === 1 ? 32.5 : 32.5), type: WidthType.PERCENTAGE },
      shading: idx % 2 === 1 ? { fill: P.table.surface, type: ShadingType.CLEAR } : undefined,
      borders: { top: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.innerLine }, left: thinBorder, right: thinBorder },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [new TextRun({ text, size: 21, font: { ascii: "Calibri" }, color: i === 0 ? "1C2A3D" : "364860" })],
      })],
    })),
  });

  const rows = [
    ["Data Centre Right", "Permitted without additional licence", "Primary licence category for DCs"],
    ["Geographic Scope", "Countrywide with national spectrum", "Countrywide, county-by-county build-out"],
    ["Spectrum Fees", "Reservation + utilisation fees (national stack)", "Utilisation fees only (approved regions)"],
    ["Licence Term", "15 years or 25 years (optional)", "15 years only"],
    ["Application Fee", "KES 5,000", "KES 5,000"],
    ["Initial Licence Fee", "KES 15M (15yr) / KES 45M (25yr)", "KES 15 million"],
    ["Annual Operating Fee", "0.4% of AGT or KES 4M, whichever is higher", "0.4% of AGT or KES 800K, whichever is higher"],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine }, bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine }, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder },
    rows: [
      headerRow(["Aspect", "NFP-T1 (Tier 1)", "NFP-T2 (Tier 2)"]),
      ...rows.map((r, i) => dataRow(r, i)),
    ],
  });
}

// ─── Build Sources Table ───
function buildSourcesTable() {
  const sources = [
    ["Communications Authority of Kenya", "Revised Telecommunications Market Structure (June 2026)"],
    ["Kenya Gazette Notice No. 3335", "6 March 2026, published by DG David Mugonyi"],
    ["Bowmans (Law Firm)", "Kenya: Revised Telecommunications Market Structure — Formal Recognition of Data Centres (2026)"],
    ["McKay Advocates", "Kenya Strengthens ICT Investment Appeal with Formal Data Centre Regulations (April 2026)"],
    ["O'Bang Law", "Communications Authority's Revised Telecommunications Market Structure 2026 (April 2026)"],
    ["Mordor Intelligence", "Kenya Data Center Market Size, Share & 2030 Growth Trends Report (2025)"],
    ["GlobeNewswire / ResearchAndMarkets", "Kenya Data Center Investment and Growth Analysis Report 2026 (March 2026)"],
    ["Techweez", "Kenya's New KES 15 Million Data Center License: What NFP-T1 and NFP-T2 Mean (August 2026)"],
    ["Tom's Hardware / Semafor", "Microsoft $1B Kenya AI Data Centre Stalls Over Power Capacity (May 2026)"],
    ["Techweez", "Huduma Centre Services Halted After Data Center Loses Power (June 2026)"],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Source", "Reference"].map((text, i) => new TableCell({
          width: { size: i === 0 ? 30 : 70, type: WidthType.PERCENTAGE },
          shading: { fill: P.table.headerBg, type: ShadingType.CLEAR },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine }, bottom: headerBorderBottom, left: thinBorder, right: thinBorder },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 21, font: { ascii: "Calibri" }, color: P.table.headerText })] })],
        })),
      }),
      ...sources.map((r, i) => new TableRow({
        cantSplit: true,
        children: r.map((text, j) => new TableCell({
          width: { size: j === 0 ? 30 : 70, type: WidthType.PERCENTAGE },
          shading: i % 2 === 1 ? { fill: P.table.surface, type: ShadingType.CLEAR } : undefined,
          borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder },
          margins: { top: 50, bottom: 50, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: { ascii: "Calibri" }, color: "364860" })] })],
        })),
      })),
    ],
  });
}

// ─── Document Assembly ───
const doc = new Document({
  styles: {
    default: { document: {
      run: { font: { ascii: "Calibri" }, size: 24, color: "1C2A3D" },
      paragraph: { spacing: { line: 312 } },
    }},
  },
  sections: [
    // ── Cover Section ──
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCoverR1({
        title: "Kenya's Data Centre Licensing Framework: What NFP-T1 and NFP-T2 Mean for the Industry",
        englishLabel: "DC254 REGULATORY INTELLIGENCE",
        subtitle: "The Communications Authority has formally brought commercial data centres under telecoms licensing for the first time. Here is what operators, investors, and engineers need to know.",
        metaLines: ["Published: 21 August 2026", "Author: Data Centre 254 Editorial"],
        footerLeft: "Data Centre 254", footerRight: "datacentre254.com",
        palette: P,
      }),
    },
    // ── Body Section ──
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: "decimal" },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 0 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine, space: 6 } },
            children: [
              new TextRun({ text: "DC254 Regulatory Intelligence", font: { ascii: "Calibri" }, size: 18, color: "5B6B7D", italics: true }),
              new TextRun({ text: "  |  ", font: { ascii: "Calibri" }, size: 18, color: "90989F" }),
              new TextRun({ text: "August 2026", font: { ascii: "Calibri" }, size: 18, color: "90989F" }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Data Centre 254  •  ", font: { ascii: "Calibri" }, size: 18, color: "90989F" }),
              new TextRun({ children: [PageNumber.CURRENT], font: { ascii: "Calibri" }, size: 18, color: "90989F" }),
            ],
          })],
        }),
      },
      children: [
        // ── Introduction ──
        heading1("The Regulatory Shift"),
        bodyParaRuns([
          normal("On 6 March 2026, Communications Authority of Kenya Director General "),
          bold("David Mugonyi"),
          normal(" signed a notice in the Kenya Gazette that would fundamentally alter how data centres operate in the country. Gazette Notice No. 3335 gave formal effect to the "),
          bold("Revised Telecommunications Market Structure"),
          normal(", a document that, for the first time in Kenya's regulatory history, expressly brought commercial data centres within the telecommunications licensing framework. The revised structure took effect thirty days after publication, meaning that by early April 2026, every commercial data centre operator in Kenya needed to understand exactly where they fit within the new regime."),
        ]),
        bodyPara("The change is not cosmetic. Under the previous Unified Licensing Framework (ULF), which had governed Kenya's telecoms sector since 2021, data centre operators occupied an ambiguous space. They were not explicitly categorised in any licence class, which meant that licensing was often determined on a case-by-case basis depending on how a given operator's activities mapped onto existing categories. This created uncertainty for investors, inconsistent treatment for operators, and a regulatory gap that the Authority has now moved decisively to close."),
        bodyPara("The implications are significant not just for the roughly nineteen operational data centres scattered across Nairobi and Mombasa, but for the billions of shillings in planned investment that Kenya's digital infrastructure sector is hoping to attract. Microsoft's stalled one-billion-dollar AI data centre project, the expansion of Africa Data Centres and iXAfrica facilities, and the government's own National Digital Superhighway Programme all exist within a regulatory environment that has now, for the first time, been explicitly defined."),

        // ── Why Data Centres Matter Now ──
        heading1("Why Data Centres Became Too Critical to Leave Unlicensed"),
        bodyPara("The CA's decision did not emerge from a vacuum. It was the product of a formal public consultation process that began with a consultation paper published in December 2024. In that paper, the Authority articulated a clear rationale: data centres have evolved from simple server rooms into critical national infrastructure, and the regulatory framework needed to evolve accordingly."),
        bodyParaRuns([
          normal("The Authority wrote that "),
          accent("given that the facility owner in the second type of data centre arrangement significantly influences data accessibility, it is necessary to bring these arrangements within the licensing framework to protect users' data access rights."),
          normal(" This language is telling. The CA was not merely tidying up its licence categories; it was asserting that data centres, by virtue of the role they play in mediating access to digital services, are functionally equivalent to communications infrastructure providers like tower companies and fibre operators."),
        ]),
        bodyPara("The real-world urgency of this position was demonstrated just weeks later, in June 2026, when a power outage at the Huduma Kenya data centre in Nakuru brought government services to a halt nationwide. Huduma Centres across all forty-seven counties went offline simultaneously, affecting millions of citizens who rely on these centres for identity documents, business registrations, and a range of essential government services. The incident was a stark reminder that data centre failures are no longer theoretical risks confined to the technology sector; they are events with immediate, tangible consequences for public administration and economic activity."),
        bodyPara("The CA's reasoning drew a direct parallel with communications tower companies, which have long been regulated as Network Facilities Providers despite operating what is, in many respects, passive infrastructure. A data centre, the Authority effectively argued, is to the digital economy what a communications tower is to the mobile network: the physical layer without which everything above it ceases to function. The regulatory alignment, in the CA's view, was long overdue."),

        // ── The NFP Framework ──
        heading1("NFP-T1 and NFP-T2: How the Licence Structure Works"),
        bodyPara('The Revised Telecommunications Market Structure did not create a standalone “data centre licence.” Instead, it placed data centre operations within the existing Network Facilities Provider licence framework, specifically under '),
        bodyParaRuns([
          bold("NFP-Tier 2 (NFP-T2)"),
          normal(" as the primary licensing route, with "),
          bold("NFP-Tier 1 (NFP-T1)"),
          normal(" available for operators who also require nationwide infrastructure and spectrum rights. This modular approach is consistent with the CA's longstanding technology-neutral licensing philosophy, which avoids creating narrow, technology-specific licences in favour of broader, activity-based categories that can accommodate technological evolution without requiring constant regulatory revision."),
        ]),
        bodyPara("The distinction between the two tiers is substantial and has direct financial implications for operators. NFP-T2 is the primary licence for pure-play data centre operators. It permits the establishment and operation of commercial data centres on a countrywide basis, with infrastructure deployed incrementally, county by county. The initial licence fee is KES 15 million for a fifteen-year term, with annual operating fees set at zero-point-four percent of Annual Gross Turnover or KES 800,000, whichever is higher. For a new entrant building a single facility, this is the most cost-effective and operationally straightforward path to compliance."),
        bodyPara("NFP-T1, by contrast, is designed for large integrated operators with nationwide reach. It is the only licence tier that permits exclusive nationwide spectrum reservation from day one, making it suitable for operators who need both data centre capacity and their own transmission infrastructure. The licence fee is KES 15 million for a standard fifteen-year term, or KES 45 million for an optional twenty-five-year term that provides greater investment certainty for capital-intensive deployments. The annual operating fee is significantly higher: zero-point-four percent of Annual Gross Turnover or KES 4 million, whichever is higher. This reflects the broader scope of infrastructure and spectrum rights that the licence confers."),
        bodyPara("It is worth noting that during the consultation process, the CA had initially proposed placing data centres under the NFP-T3 category, which covers limited geographic areas. Industry stakeholders pushed back, arguing that data centres inherently serve a national or regional function and that confining them to a county-level licence would be impractical. The Authority accepted this reasoning, and the final framework places data centres under the two highest infrastructure tiers. For entities that already hold an NFP-T2 licence, the updated structure grants the right to establish commercial data centres without needing any additional licence, which simplifies compliance for existing operators."),

        // ── Comparison Table ──
        new Paragraph({
          keepNext: true,
          spacing: { before: 360, after: 160, line: 312 },
          children: [new TextRun({ text: "Table 1: NFP-T1 vs NFP-T2 for Data Centre Operators", bold: true, size: 21, font: { ascii: "Calibri" }, color: "5B6B7D" })],
        }),
        buildComparisonTable(),
        captionPara("Source: Communications Authority of Kenya, Revised Telecommunications Market Structure (June 2026)"),

        // ── Market Landscape ──
        heading1("Kenya's Data Centre Landscape: The Numbers"),
        bodyParaRuns([
          normal("As of mid-2026, Kenya is home to "),
          bold("nineteen operational data centres"),
          normal(": fifteen in Nairobi and four in Mombasa. The coastal facilities are strategically positioned near submarine cable landing stations, which give Kenya its competitive advantage as an East African connectivity hub. Nairobi, meanwhile, serves as the primary market for domestic and regional enterprise demand, hosting the largest concentration of carrier-neutral colocation facilities in the region."),
        ]),
        bodyParaRuns([
          normal("The market's total IT power capacity stood at approximately "),
          bold("15 megawatts in 2025"),
          normal(", a figure that is projected to reach "),
          bold("25 megawatts by 2030"),
          normal(", representing a compound annual growth rate of 10.76 percent according to Mordor Intelligence. In monetary terms, the Kenya data centre market was valued at "),
          bold("USD 266 million in 2025"),
          normal(" and is forecast to reach "),
          bold("USD 805 million by 2031"),
          normal(", growing at 20.27 percent annually according to ResearchAndMarkets. These are not marginal numbers. They represent one of the fastest-growing data centre markets on the African continent, driven by a convergence of factors including submarine cable connectivity, a growing fintech ecosystem, government digitisation programmes, and increasing cloud adoption across East and Central Africa."),
        ]),
        bodyPara("The key players operating in this space include Africa Data Centres (a Liquid Intelligent Technologies company), which operates multiple facilities including a significant presence along Mombasa Road; iXAfrica Data Centres, which has developed East Africa's first hyper-scale, AI-ready facility at NBOX1.1 with a 4.5 megawatt IT load; and various government-owned facilities that support public sector digital services. Safaricom and Telkom Kenya also operate data centre infrastructure to support their telecommunications and enterprise services businesses."),
        bodyPara("The regulatory clarification provided by the new licensing framework arrives at a critical inflection point. As hyperscale operators, cloud providers, and AI infrastructure investors evaluate African markets for expansion, the existence of a clear, predictable licensing regime is a material factor in investment decisions. The previous ambiguity, where operators could not be certain which licence applied to their activities, was a genuine barrier to entry, particularly for international operators accustomed to well-defined regulatory environments in markets like South Africa, Nigeria, and Egypt."),

        // ── The Power Problem ──
        heading1("The Power Constraint: Why Licensing Is Necessary but Not Sufficient"),
        bodyPara("While the regulatory framework has taken a significant step forward, the single largest obstacle to data centre growth in Kenya remains the power supply. This is not a hypothetical concern. In May 2026, Microsoft and G42's planned one-billion-dollar AI data centre project — which would have been the largest single foreign direct investment in Kenya's digital infrastructure — stalled after it became clear that the national grid could not reliably deliver the power capacity the facility required. Government officials reportedly indicated that meeting the project's energy demands would require rationing power to other consumers, an politically untenable proposition."),
        bodyPara("The power challenge is multi-dimensional. Kenya's electricity generation capacity, while substantial relative to many African peers, is concentrated in geothermal and hydroelectric sources that are geographically fixed. Data centre demand, by contrast, is concentrated in Nairobi and its environs, creating transmission bottlenecks. The country's total installed generation capacity stands at approximately 3,500 megawatts, but the Microsoft project alone was reported to require several hundred megawatts — a demand that would represent a significant share of the national grid's firm capacity. The government's ambition to position Kenya as an AI and cloud computing hub for East Africa is, in this context, directly constrained by the pace at which generation and transmission capacity can be expanded."),
        bodyPara("The Huduma Kenya outage in June 2026 further illustrated the power reliability challenge. A single power supply failure at one data centre in Nakuru was sufficient to disrupt government services across the entire country. This is not a resilience problem that can be solved by licensing alone; it requires investment in backup power systems, redundant power feeds, and ultimately, the diversification and expansion of Kenya's electricity generation and distribution infrastructure. The CA's licensing framework addresses the regulatory dimension of data centre oversight, but the broader ecosystem challenges — power, cooling, skilled labour, and fibre connectivity in underserved areas — remain."),

        // ── Broader Changes ──
        heading1("Other Notable Changes in the Revised Structure"),
        bodyPara("The revised market structure introduced changes beyond data centre licensing that are relevant to the broader digital infrastructure ecosystem. The CA created a new "),
        bodyParaRuns([
          bold("Landing Rights Authorisation (LRA)"),
          normal(", a separate licence category for entities that transmit telecommunications signals into Kenya via submarine cables or satellite. Previously, landing rights were bundled within the International Gateway Systems and Services (IGSS) licence, which created a barrier for entities that wanted to land infrastructure in Kenya without taking on the full scope of an IGSS licence. The separation is a strategic move designed to make it easier for international submarine cable operators to establish a presence in Kenya and to position the country as a gateway for landlocked East African nations."),
        ]),
        bodyPara("The Authority also expanded the scope of the NFP-T3 licence, which previously covered a single county, to cover up to three counties. This makes the licence more commercially viable for smaller infrastructure investors who want to build and interconnect towers, VSAT terminals, and other facilities across a small cluster of counties without committing to the full NFP-T2 framework. A new "),
        bodyParaRuns([
          bold("Micro Network and Services Provider (MNSP)"),
          normal(" licence was introduced for operators serving limited areas from residential estates up to county level, covering voice, data, and internet services. This category is partly aimed at curbing illegal service providers operating in residential areas while also promoting competition and lowering costs for consumers in underserved areas."),
        ]),

        // ── What This Means ──
        heading1("What This Means for Operators and Investors"),
        bodyPara("For existing data centre operators, the immediate practical impact is that they need to ensure they hold the appropriate NFP licence category. Operators already licensed under NFP-T2 can establish commercial data centres without additional authorisation. Those operating under other licence classes, or those without any licence, need to assess their activities against the new framework and take steps to comply. The CA has historically taken an enforcement approach that prioritises bringing operators into compliance over punitive action, but the existence of a clear framework means that operating without a licence is no longer a grey area; it is a regulatory violation."),
        bodyPara("For prospective investors, particularly international operators evaluating East African market entry, the framework provides a degree of predictability that was previously absent. The licence fees, while not trivial, are within the range that would be expected for a market of Kenya's size and strategic importance. The fifteen-year licence term provides sufficient runway for return on investment, and the optional twenty-five-year NFP-T1 term accommodates the longest infrastructure investment cycles. The annual operating fee structure, based on a percentage of gross turnover with a minimum floor, aligns the Authority's revenue with operator success rather than penalising operators during their growth phase."),
        bodyPara("The broader policy trajectory is encouraging. Kenya has progressively liberalised its ICT investment framework: the removal of the thirty percent local shareholding requirement for ICT licensees, the introduction of Special Economic Zones with customs and tax relief on ICT equipment, and now the formal licensing of data centres all signal a deliberate strategy to position the country as a premier destination for digital infrastructure investment in Africa. The question is no longer whether Kenya is open for data centre investment; it is whether the supporting infrastructure, particularly power supply, can scale fast enough to meet the demand that the regulatory clarity is designed to attract."),

        // ── Sources ──
        heading1("Sources and References"),
        new Paragraph({
          keepNext: true,
          spacing: { before: 200, after: 120, line: 312 },
          children: [new TextRun({ text: "Table 2: Source Materials Consulted", bold: true, size: 21, font: { ascii: "Calibri" }, color: "5B6B7D" })],
        }),
        buildSourcesTable(),
      ],
    },
  ],
});

// ── Generate ──
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/z/my-project/download/DC254-Kenya-Data-Centre-Licensing-Framework-August-2026.docx", buf);
  console.log("Document generated successfully.");
});
