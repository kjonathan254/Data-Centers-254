# Data Centre 254

**Inside Kenya's Digital Infrastructure.**

DC254 is an independent Kenyan educational and research platform explaining the physical infrastructure behind Kenya's digital economy — data centres, connectivity, power, AI, and the systems that make the digital world work.

Live at [datacentre254.com](https://datacentre254.com).

---

## What It Does

- **DC Directory** — Verified database of Kenya's data centre facilities, operators, and connectivity providers
- **DC254 Index** — Live infrastructure statistics pulled from the database
- **50 Articles** — Across 5 clusters: Beginner, Kenya, Internet, Energy, Careers
- **Search** — Unified search across articles and facilities
- **Newsletter** — DC254 Brief subscriber capture (email → database)
- **Foundations** — Editorial pipeline tracking 12 foundational articles
- **SEO** — Dynamic sitemap, robots.txt, JSON-LD structured data (Organization + WebSite + Article), Open Graph

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design system |
| Components | shadcn/ui + Framer Motion |
| Database | SQLite (local) / Turso (production) |
| ORM | Prisma |
| Fonts | Geist Sans + Geist Mono |
| Analytics | Google Analytics (optional) |
| Deployment | Vercel (standalone output) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx             # Homepage (9 narrative sections)
│   ├── articles/[slug]/     # Individual article pages
│   ├── foundations/         # Editorial pipeline (12 foundational articles)
│   ├── directory/           # DC Directory
│   ├── index/               # DC254 Index
│   ├── search/              # Unified search
│   ├── data-centres/        # Beginner cluster
│   ├── infrastructure/      # Internet cluster
│   ├── kenya/               # Kenya cluster
│   ├── ai/                  # AI articles
│   ├── energy/              # Energy cluster
│   ├── careers/             # Careers cluster
│   ├── research/            # Research page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   └── api/                 # API routes
│       ├── articles/        # Article CRUD + cluster queries
│       ├── directory/       # Facility directory API
│       ├── search/          # Unified search API
│       ├── subscribe/       # Newsletter subscription
│       └── contact/         # Contact form
├── components/
│   ├── sections/            # Homepage sections (hero, what-is-dc, etc.)
│   ├── article-cluster-page.tsx  # Cluster listing pages
│   ├── navbar.tsx           # Navigation with mobile sidebar
│   ├── footer.tsx           # Site footer
│   └── brand-logo.tsx       # DC254 logo (3 variants)
├── lib/
│   └── db.ts                # Prisma client singleton
└── app/globals.css          # Design system (custom utilities)

prisma/
├── schema.prisma            # Database schema
├── seed.ts                  # Facility/operator/connectivity seed
└── seed-{1-5}-*.py          # Article seed scripts (5 clusters × 10 articles)

db/
└── custom.db               # SQLite database (not committed)
```

## Database Schema

- **Facility** — Data centre facilities (9 seeded)
- **Operator** — Companies that own/operate facilities
- **ConnectivityProvider** — Subsea cables, fibre, IXPs
- **Certification** — Industry certifications (ISO, SOC, Tier)
- **Article** — 50 articles across 5 clusters, with verification metadata
- **ArticleClaim** — Verified factual claims with sources and confidence levels
- **Subscriber** — Newsletter email subscriptions

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Python 3 (for article seed scripts)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
mv .env.example .env

# 3. Push database schema
npx prisma db push

# 4. Seed facilities, operators, and connectivity
npx prisma db seed

# 5. Seed articles (run each script)
python prisma/seed-1-beginner.py
python prisma/seed-2-kenya.py
python prisma/seed-3-internet.py
python prisma/seed-4-energy.py
python prisma/seed-5-careers.py

# 6. Mark foundational articles
cd /path/to/project
node -e "const{PrismaClient}=require('@prisma/client');const db=new PrismaClient();const foundational=[{slug:'what-is-a-data-centre',order:1},{slug:'how-does-a-data-centre-work',order:2},{slug:'where-is-your-data-stored',order:3},{slug:'what-happens-to-your-m-pesa-data',order:4},{slug:'what-is-cloud-computing',order:5},{slug:'what-is-colocation',order:6},{slug:'kenya-data-centre-industry-explained',order:7},{slug:'where-are-kenyas-data-centres',order:8},{slug:'why-kenya-is-becoming-an-east-african-data-centre-hub',order:9},{slug:'how-the-internet-gets-to-kenya',order:10},{slug:'why-data-centres-need-so-much-power',order:11},{slug:'kenyas-submarine-cables-explained',order:12}];(async()=>{for(const a of foundational){await db.article.update({where:{slug:a.slug},data:{isFoundational:true,foundationalOrder:a.order}})}console.log('Done');await db.\$disconnect()})()"

# 7. Start development server
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
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:seed` | Seed facilities, operators, connectivity |

## Deploying to Production

### Vercel + Turso

DC254 uses SQLite, which requires a persistent filesystem. For serverless deployment (Vercel), use [Turso](https://turso.tech) as a hosted SQLite database.

1. Create a Turso account and database
2. Get your connection URL and auth token
3. Update Prisma provider to `***REMOVED***` in `schema.prisma`
4. Set `DATABASE_URL` in Vercel environment variables
5. Push schema and re-seed data to Turso
6. Deploy

## Design Decisions

- **"Don't design a website. Design a way of seeing."** — The homepage is an editorial narrative, not a dashboard.
- **Fact sourcing** — Every statistic is labeled (FACT / REPORTED / ESTIMATE / DC254 DATABASE) with source attribution.
- **Dark theme** — Cyan and neon accents on deep black, inspired by data centre server rooms.
- **Article verification** — Each article has claims with confidence levels (High / Medium / Low / Unverified) and source URLs.
- **No authentication** — DC254 is a read-only publication. Newsletter captures emails; no user accounts.

## License

All rights reserved. Content and data are the intellectual property of Data Centre 254.
