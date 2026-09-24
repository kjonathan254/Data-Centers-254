# Data Centre 254

**Inside Kenya's Digital Infrastructure.**

DC254 is an independent Kenyan educational and research platform explaining the physical infrastructure behind Kenya's digital economy — data centres, connectivity, power, AI, and the systems that make the digital world work.

Live at [data-centers-254.vercel.app](https://data-centers-254.vercel.app).

---

## What It Does

- **DC Directory** — Verified directory of Kenya's data centre facilities plus the first East Africa regional records (Tanzania, Uganda, Rwanda), from a versioned, quarterly-snapshotted dataset (`src/data/directory/`)
- **100 Articles** — Researched explainers across 8 clusters: Beginner, Kenya, Internet, Energy, AI, Careers, Infrastructure, Policy
- **Market Trackers** — Capacity pipeline (`/tracker`), subsea cables (`/tracker/cables`), power tariffs (`/tracker/power`) and licensing (`/tracker/licensing`), every row sourced and dated
- **State of the Market** — Quarterly report with a frozen dataset snapshot and a free CC BY dataset bundle (`/research/state-of-the-market-2026-q3`)
- **Search** — Unified search across articles and facilities
- **Newsletter** — DC254 Brief subscriber capture (email → Resend Contacts)
- **Contact Form** — Email delivery via Resend
- **SEO** — Dynamic sitemap, robots.txt, RSS feed (`/feed.xml`), `llms.txt`, JSON-LD structured data (Organization + WebSite + Article + FAQPage + BreadcrumbList), Open Graph

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design system |
| Components | shadcn/ui + Framer Motion |
| Content | Markdown articles (`content/articles/`) + TypeScript data modules (`src/lib/`) |
| Email | Resend (contact form + newsletter subscribers) |
| Fonts | Geist Sans + Geist Mono |
| Analytics | Google Analytics (optional) |
| Deployment | Vercel |

There is **no database** — articles are markdown files, the directory dataset is a versioned JSON file (`src/data/directory/current.json`, with frozen quarterly snapshots under `snapshots/` and quarterly CSV bundles in `public/datasets/`), and newsletter subscribers are stored as contacts in [Resend](https://resend.com). Everything is statically rendered where possible, so it deploys cleanly to serverless.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx             # Homepage (10 narrative sections)
│   ├── articles/[slug]/     # Individual article pages
│   ├── directory/           # DC Directory (facilities, operators, connectivity)
│   ├── infrastructure/      # Infrastructure hub + map
│   ├── beginners|kenya|internet|energy|ai|careers/  # Topic clusters
│   ├── glossary/            # Infrastructure glossary
│   ├── search/              # Unified search
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── feed.xml/            # RSS 2.0 feed (generated from articles)
│   ├── sitemap.ts           # Dynamic sitemap
│   ├── robots.ts            # robots.txt
│   └── api/                 # API routes
│       ├── articles/        # Article queries (cluster, latest)
│       ├── directory/       # Facility directory API (filter/sort)
│       ├── search/          # Unified search API
│       ├── subscribe/       # Newsletter subscription (→ Resend Contacts)
│       └── contact/         # Contact form (→ Resend email)
├── components/
│   ├── sections/            # Homepage sections (hero, what-is-dc, etc.)
│   ├── article-cluster-page.tsx  # Cluster listing pages
│   ├── navbar.tsx           # Navigation with mobile sidebar
│   ├── footer.tsx           # Site footer
│   └── brand-logo.tsx       # DC254 logo (3 variants)
├── lib/
│   ├── articles.ts          # Markdown article loader (gray-matter)
│   ├── directory-data.ts    # Typed loader over the versioned directory JSON
│   ├── market-trackers.ts   # Subsea cables, power tariffs, licensing trackers
│   ├── glossary-data.ts     # Glossary terms
│   └── site.ts              # Canonical site URL utility
├── data/
│   └── directory/           # Versioned dataset source of truth
│       ├── current.json     #   live dataset (31 facilities, 18 operators)
│       └── snapshots/       #   frozen quarterly snapshots (2026-Q3.json)
content/
└── articles/                # 100 markdown articles with YAML frontmatter
```

## Newsletter & Contact (Resend)

Both `/api/subscribe` and `/api/contact` use [Resend](https://resend.com) — no database required.

| Environment Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | API key for contact emails and storing newsletter subscribers |
| `RESEND_FROM_EMAIL` | No | Verified sender address for contact emails (defaults to `onboarding@resend.dev`) |
| `RESEND_SEGMENT_ID` | No | Segment/Audience ID to group newsletter subscribers (Dashboard → Contacts → Segments) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for sitemap/OG/RSS (defaults to the Vercel URL) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

Newsletter subscribers appear in the Resend dashboard under **Contacts** (optionally grouped in your Segment). Contact form submissions are emailed to the address configured in `src/app/api/contact/route.ts`.

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and add your Resend API key
cp .env.example .env

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run validate:content` | Validate article frontmatter, links, images, FAQs |

## CI

GitHub Actions workflow lives at `.github/workflows/ci.yml` (required location for Actions to pick it up). It runs on every push/PR to `main`:

1. **Content validation** — `scripts/article_validator.py` (frontmatter, internal links, images, FAQ coverage, word depth)
2. **Lint + build** — `npm ci`, `npm run lint`, `npm run build`
3. **Dependency audit** — `npm audit` (report-only)

## Deploying to Vercel

1. Import the repository into Vercel
2. Add `RESEND_API_KEY` (plus optional `RESEND_SEGMENT_ID` and `NEXT_PUBLIC_SITE_URL`) in **Project → Settings → Environment Variables**
3. Deploy — no database or persistent filesystem needed

## Design Decisions

- **"Don't design a website. Design a way of seeing."** — The homepage is an editorial narrative, not a dashboard.
- **Fact sourcing** — Every statistic is labeled (FACT / REPORTED / ESTIMATE / DC254 DATABASE) with source attribution.
- **Dark theme** — Cyan and neon accents on deep black, inspired by data centre server rooms.
- **No authentication** — DC254 is a read-only publication. Newsletter captures emails; no user accounts.

## License

All rights reserved. Content and data are the intellectual property of Data Centre 254.
