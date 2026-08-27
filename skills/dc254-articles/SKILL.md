# DC254 File-Based Article System

## Overview
DC254 uses a **file-based content system** where all articles live as Markdown files in `content/articles/`. No database required. The site reads frontmatter and markdown at build time to generate article pages, JSON-LD schema, OG tags, and cluster listings automatically.

## Architecture

```
content/articles/
  {slug}.md          ← every article is one markdown file

src/lib/
  articles.ts        ← reads + parses all .md files, exports typed helpers

src/components/
  article-template.tsx  ← the shared render component

src/app/
  articles/[slug]/page.tsx  ← dynamic route, reads from file system
```

## Article Front Matter Schema

Every `.md` file MUST start with this YAML block:

```yaml
---
title: ""                      # 50-60 chars. Primary keyword near front.
slug: ""                       # kebab-case, matches filename, no stop words
meta_description: ""           # 150-160 chars, includes keyword + reason to click
primary_keyword: ""            # the single phrase this article ranks for
secondary_keywords: []         # 3-6 related terms to weave in naturally
author: "Kevin Jonathan Onyango Otieno"
author_bio_link: "/about"      # E-E-A-T: links to author bio
published_date: ""             # YYYY-MM-DD
updated_date: ""               # update on every meaningful revision
category: ""                   # e.g. Data Centres, Connectivity, Power, Policy, AI, Careers
cluster: ""                    # page group: Kenya, Internet, Energy, Infrastructure, AI, Careers, Beginners
og_image: ""                   # 1200x630, relative to /public/
reading_time: ""               # estimated minutes
images: []                      # 4-5 image objects (see below)
internal_links: []              # 2-3 internal links to other DC254 articles
external_sources: []           # 1-2 authoritative external sources with titles
faq: []                        # 3-5 Q&A pairs for FAQ schema
canonical_url: ""              # if cross-posted, the one true URL
---
```

### Images Array Format

Each article MUST include 4-5 images/infographics placed at strategic points:

```yaml
images:
  - src: "/images/hero-dc-nairobi.png"
    alt: "Nairobi data centre exterior along Mombasa Road"
    caption: "iXAfrica NBOX1.1, East Africa's first hyperscale AI-ready facility"
    position: "hero"          # hero | section-break | inline | infographic | comparison
  - src: "/images/dc-power-systems.webp"
    alt: "Data centre power distribution and backup systems"
    caption: "Kenya's grid connectivity and backup power for data centres"
    position: "section-break"
  - src: "/images/africa-dc-map.webp"
    alt: "Map of East Africa data centre locations"
    caption: "DC254 infrastructure map showing 5 countries"
    position: "infographic"
  - src: "/images/dc-servers-racks.png"
    alt: "Server racks inside a modern data centre"
    caption: "Typical rack layout in a Tier III facility"
    position: "inline"
  - src: "/images/dc-cooling.webp"
    alt: "Data centre cooling systems"
    caption: "CRAC units and precision cooling in Nairobi DC"
    position: "inline"
```

### Image Position Types
- **hero**: Full-width banner at top of article
- **section-break**: Large image between major sections
- **inline**: Medium image within a section, text wraps around
- **infographic**: Data visualization, diagram, or comparison chart
- **comparison**: Side-by-side or table-style image

### FAQ Array Format

```yaml
faq:
  - question: "Does a colocation data centre need a licence in Kenya?"
    answer: "Yes. Any facility hosting third-party servers requires at minimum an NFP-T1 Network Facilities Provider licence from CA."
  - question: "What is the penalty for operating without a licence?"
    answer: "CA can issue fines up to KES 300,000 or direct you to cease operations."
```

### Internal Links Format

```yaml
internal_links:
  - text: "submarine cables landing in Mombasa"
    href: "/infrastructure"
  - text: "Kenya data centre directory"
    href: "/directory"
  - text: "internet exchange points"
    href: "/internet"
```

### External Sources Format

```yaml
external_sources:
  - title: "Communications Authority of Kenya"
    url: "https://www.ca.go.ke/"
  - title: "GSMA Mobile Connectivity Index 2025"
    url: "https://www.gsma.com/r/spectrum/mobile-connectivity-index/"
```

## Markdown Body Rules

1. **First 100 words** must directly answer the headline's implied question (AEO/Google AI Overviews pull from here)
2. **No throat-clearing** — no "in this article we will discuss" openings
3. **H2s phrased as questions or clear statements** — not vague labels like "Overview" or "Background"
4. **Define jargon on first use** — helps new readers and AI extraction
5. **Include concrete examples/data** — Kenya-specific where possible
6. **Address misconceptions** — "people assume X, but actually Y"
7. **No filler** — every sentence must add information
8. **Insert images** using the syntax `![alt](src)` at strategic points (matching the images array positions)
9. **Include at least one table or list** — AI extracts structured data more reliably
10. **Logical order**: definition → how it works → why it matters → how to apply it

## What the Template Generates Automatically

From the single `.md` file, the article page includes:

1. **JSON-LD Article schema** — from front matter fields
2. **JSON-LD FAQPage schema** — from the faq array
3. **OG/Twitter meta tags** — title, description, image, type=article
4. **Author byline** — links to /about for E-E-A-T
5. **Published/Updated dates** — visible + in schema
6. **Table of Contents** — auto-generated from H2 headings
7. **Reading progress bar** — top of page
8. **Share buttons** — X/Twitter, LinkedIn, copy link
9. **4-5 images/infographics** — hero, section breaks, inline, infographics
10. **FAQ section** — rendered from front matter, with schema
11. **Internal links** — woven into article body for SEO backlinking
12. **Related articles** — same cluster, auto-suggested
13. **Breadcrumb** — Home > Cluster > Article Title

## DC254 Design System Tokens

The article template uses these existing design tokens:
- Background: `bg-background` (oklch(0.08 0.005 260))
- Text: `text-foreground`, `text-muted-foreground`
- Accent: `text-cyan`, `border-cyan/20`
- Cards: `glass-card`, `glass-card-hover`
- Section labels: `text-section-label` (uppercase mono)
- Prose: `prose-max` (40rem max-width)
- Pull quotes: `pull-quote` (cyan left border, italic)
- Headings: `text-display-sm`, `text-subtitle`
- Spacing: `section-y`, `section-y-lg`

## SEO Rules (Enforced by Template)

- **Title**: 50-60 chars, primary keyword in first half
- **Meta description**: 150-160 chars, keyword + click reason
- **URL slug**: kebab-case, matches primary keyword, no dates
- **Canonical URL**: set if cross-posted
- **H1**: one per page, matches front matter title
- **H2s**: questions or clear statements, not vague labels
- **Images**: all have descriptive alt text
- **Internal links**: 2-3 per article to other DC254 pages
- **External links**: 1-2 to authoritative sources
- **FAQ**: 3-5 questions, each answer works standalone
- **Structured data**: Article + FAQPage JSON-LD auto-generated

## File Naming Convention

```
content/articles/
  kenya-data-centre-licensing-framework.md
  eassy-submarine-cable-east-africa.md
  kixp-internet-exchange-point-kenya.md
  ixp-nairobi-internet-traffic.md
  what-is-a-data-centre.md
  submarine-cables-landing-mombasa.md
  data-centre-tier-ratings-explained.md
  kenya-power-infrastructure-data-centres.md
  ai-data-centres-east-africa.md
  data-centre-careers-kenya.md
```

## Adding a New Article

1. Copy the template (see `references/article-template.md`)
2. Fill every front matter field
3. Write the article body following the markdown rules
4. Include 4-5 images with proper alt text and captions
5. Add 3-5 FAQ entries
6. Add 2-3 internal links and 1-2 external sources
7. Save as `content/articles/{slug}.md`
8. Push to GitHub — site builds and publishes automatically

## Cluster Mapping

The `cluster` field determines which page lists the article:

| cluster | Page | OG Image |
|---|---|---|
| Kenya | /kenya | nairobi-skyline.webp |
| Internet | /internet | africa-dc-map.webp |
| Energy | /energy | dc-power-systems.webp |
| Infrastructure | /infrastructure | dc-networking.webp |
| AI | /ai | ai-gpu-servers.png |
| Careers | /careers | dc-careers-tech.png |
| Beginners | /beginners | dc-servers-racks.png |
| Policy | /kenya | dc-policy-regulation.png |
