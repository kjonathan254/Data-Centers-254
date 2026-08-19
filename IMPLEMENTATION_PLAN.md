# Data Centre 254: Strategic Implementation Plan
## Roadmap to Becoming East Africa's Definitive Data Centre Intelligence Platform

---

## Executive Summary

**Current State:** Educational website with 9 Kenyan facilities, basic directory, article clusters
**Target State:** Pan-African intelligence platform with 100+ facilities, comparison tools, premium research, API access, and industry partnerships

**Timeline:** 18 months across 4 phases
**Budget Estimate:** $50K-150K (mostly personnel + data acquisition)
**Team Required:** 1 Full-stack Dev, 1 Research Analyst, 1 Partnerships Lead (you = Strategy/Editorial)

---

## Phase 1: Foundation & Authority Building (Months 1-3)

### Goal: Complete the directory, establish credibility, launch core features

### Week 1-2: Database Schema Enhancement

#### 1.1 Expand Prisma Schema
Add critical models for intelligence products:

```prisma
// Pricing intelligence
model PricingData {
  id              String   @id @default(cuid())
  facilityId      String
  facility        Facility @relation(fields: [facilityId], references: [id])
  rackType        String   // Standard, High-Density, AI/GPU
  powerPerRackKw  Float?
  monthlyPriceUSD Float?
  currency        String   @default("USD")
  minimumCommitmentMonths Int?
  availableFrom   String?  // YYYY-MM
  source          String?
  collectedDate   String   // YYYY-MM-DD
  confidence      String   @default("Medium")
  createdAt       DateTime @default(now())
}

// Outage tracking
model OutageReport {
  id              String   @id @default(cuid())
  facilityId      String?
  facility        Facility? @relation(fields: [facilityId], references: [id])
  startDate       String   // YYYY-MM-DD HH:MM
  endDate         String?
  durationHours   Float?
  severity        String   // Minor, Major, Critical
  affectedServices String // Power, Cooling, Network
  rootCause       String?
  reportedBy      String?
  source          String?
  verified        Boolean  @default(false)
  createdAt       DateTime @default(now())
}

// Energy metrics (critical for ESG reporting)
model EnergyMetric {
  id              String   @id @default(cuid())
  facilityId      String
  facility        Facility @relation(fields: [facilityId], references: [id])
  reportingPeriod String   // YYYY-MM
  pue             Float?   // Power Usage Effectiveness
  wue             Float?   // Water Usage Effectiveness
  carbonIntensity Float?   // gCO2/kWh
  renewablePercent Float?
  totalEnergyMwh  Float?
  itEnergyMwh     Float?
  source          String?
  verified        Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  @@unique([facilityId, reportingPeriod])
}

// Tenants (for market intelligence)
model Tenant {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  type            String?  // Cloud Provider, Enterprise, Government, Financial, Telco
  hqCountry       String?
  description     String?
  website         String?
  
  facilities      TenantFacility[]
  createdAt       DateTime @default(now())
}

model TenantFacility {
  facilityId      String
  tenantId        String
  suite           String?  // Suite number or hall
  contractedKw    Float?
  moveInDate      String?
  
  facility        Facility @relation(fields: [facilityId], references: [id])
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
  
  @@id([facilityId, tenantId])
}

// Job board (revenue stream + community)
model JobPosting {
  id              String   @id @default(cuid())
  title           String
  company         String
  location        String
  jobType         String   // Full-time, Contract, Remote
  category        String   // Operations, Engineering, Sales, Security
  salaryRange     String?
  description     String
  requirements    String?
  applicationUrl  String
  featured        Boolean  @default(false)
  expiresAt       String   // YYYY-MM-DD
  postedAt        String   // YYYY-MM-DD
  status          String   @default("Active")
  
  createdAt       DateTime @default(now())
}

// Industry contacts (for partnerships)
model Contact {
  id              String   @id @default(cuid())
  name            String
  title           String
  organization    String
  email           String?
  linkedin        String?
  categories      String   // comma-separated: Operator,Regulator,Vendor
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Advisory board members
model Advisor {
  id              String   @id @default(cuid())
  name            String
  title           String
  organization    String
  bio             String?
  photoUrl        String?
  linkedin        String?
  expertise       String   // comma-separated
  joinedDate      String
  
  createdAt       DateTime @default(now())
}
```

**Action Items:**
- [ ] Update `prisma/schema.prisma` with new models
- [ ] Run `npx prisma migrate dev --name add_intelligence_models`
- [ ] Update seed scripts to populate initial data
- [ ] Create admin interface for data entry (use existing or build simple CRUD)

---

### Week 3-4: Data Acquisition Sprint

#### 2.1 Facility Data Expansion (Target: 50+ facilities)

**Kenya (25 facilities):**
- Research and add all known facilities:
  - Tier One Data Centre (various locations)
  - Africa Data Centres (NBO1, NBO2, etc.)
  - Liquid Intelligent Technologies facilities
  - Safaricom data centres
  - Jamii Telecommunications facilities
  - Access Kenya facilities
  - iWayAfrica facilities
  - WIOCC facilities
  - Seacom facilities
  - MTN facilities
  - Telkom Kenya facilities
  - Huawei cloud regions
  - AWS Local Zones
  - Microsoft Azure PoPs
  - Google Cloud PoPs

**East Africa Expansion (25+ facilities):**
- Uganda: 6-8 facilities (Liquid, Roke Telecom, Afsat, etc.)
- Tanzania: 6-8 facilities (TTCL, Vodacom, Liquid, etc.)
- Rwanda: 4-6 facilities (Liquid, MTN, Rwandatel)
- Ethiopia: 4-6 facilities (Ethio Telecom, new entrants)
- South Sudan: 2-3 facilities

**Data Points per Facility:**
- Basic info (name, operator, location, status)
- Capacity (IT load MW, rack count, floor space)
- Technical specs (tier rating, cooling type, power density)
- Connectivity (subsea cables, fibre operators, IXPs)
- Certifications (ISO, Uptime Institute, SOC 2)
- Sustainability (PUE, renewable energy %, water usage)
- Pricing (if available through surveys)

**Sources:**
- Operator websites
- Press releases
- Regulatory filings (CAK, UCC, TCRA, RURA)
- Industry reports (Data Center Dynamics, 451 Research)
- Direct outreach to operators

**Action Items:**
- [ ] Create Python scraping script for operator websites
- [ ] Build Airtable/Google Sheets template for data collection
- [ ] Hire virtual assistant for 40 hours @ $10/hr = $400 for initial research
- [ ] Set up verification workflow (claim → source → verify → publish)
- [ ] Add 41 new facilities to database

---

### Week 5-6: Comparison Tool Development

#### 3.1 Build Interactive Comparison Feature

**Features:**
- Select 2-4 facilities side-by-side
- Compare: capacity, pricing, connectivity, certifications, sustainability
- Visual charts (radar chart for multi-dimensional comparison)
- Export comparison as PDF
- Share via unique URL

**Technical Implementation:**
```typescript
// New component: src/components/sections/compare.tsx
// New route: /api/facilities/[id]/compare
// New page: /compare?ids=fac1,fac2,fac3
```

**UI Components:**
- Facility selector with search
- Comparison table (responsive)
- Radar chart using Recharts or Chart.js
- "Request Quote" CTA for each facility
- Print/PDF export button

**Action Items:**
- [ ] Design comparison UI mockup (Figma)
- [ ] Build comparison selection interface
- [ ] Implement side-by-side view
- [ ] Add visualization (radar chart)
- [ ] Enable PDF export (use react-pdf or html2pdf)
- [ ] Test on mobile devices

---

### Week 7-8: Interactive Map

#### 4.1 Geospatial Visualization

**Features:**
- Interactive map showing all facilities
- Filter by status, operator, capacity
- Click for quick info popup
- Heat map for capacity density
- Subsea cable landing stations overlay
- Fibre network routes (where available)

**Tech Stack:**
- Mapbox GL JS or Leaflet (free alternative)
- GeoJSON data for facilities
- Custom markers for different facility types

**Action Items:**
- [ ] Get coordinates for all facilities
- [ ] Choose mapping library (recommend Mapbox for polish)
- [ ] Build map component with clustering
- [ ] Add filter controls
- [ ] Create facility popup cards
- [ ] Add subsea cable layer (use existing GeoJSON from submarinecablemap.com)
- [ ] Embed on `/directory` page and create dedicated `/map` page

---

### Week 9-10: TCO Calculator

#### 5.1 Total Cost of Ownership Tool

**Purpose:** Help enterprises estimate true cost of colocation

**Inputs:**
- Rack space needed (number of racks or kW)
- Power density per rack (kW)
- Contract length (months)
- Location preference (country/city)
- Redundancy requirements (N, N+1, 2N)
- Compliance needs (ISO 27001, PCI DSS, etc.)

**Outputs:**
- Monthly cost estimate
- 3-year and 5-year TCO
- Comparison across facilities
- Breakdown: space, power, cooling, cross-connects, support

**Formula:**
```
Monthly Cost = (Rack Space × Price per Rack) + 
               (Power kW × Price per kW) + 
               Cross-connect Fees + 
               Support/Remote Hands
  
TCO (3 years) = Monthly Cost × 36 + 
                Installation Fees + 
                Estimated Price Escalation (3-5%/year)
```

**Action Items:**
- [ ] Research pricing benchmarks (industry reports, surveys)
- [ ] Build calculator UI with sliders and dropdowns
- [ ] Implement calculation logic
- [ ] Show results with breakdown chart
- [ ] Add "Request Detailed Quote" lead capture form
- [ ] Gate detailed results behind email signup (lead gen)

---

### Week 11-12: Premium Content Launch

#### 6.1 Market Intelligence Reports

**First Report: "East Africa Data Centre Market Outlook 2026"**

**Contents:**
- Executive summary (2 pages)
- Market sizing (current MW, projected growth)
- Facility inventory (complete list with specs)
- Pricing analysis ($/kW by market)
- Power cost comparison (by country, by source)
- Subsea cable capacity and landing points
- Regulatory environment by country
- Investment pipeline (announced projects)
- Risk assessment (political, currency, power reliability)
- Recommendations for investors/operators

**Format:**
- PDF (40-50 pages)
- Price: $499 individual, $1,499 corporate license
- Free sample: Executive summary (5 pages)

**Distribution:**
- Gumroad or Lemon Squeezy for payments
- Email delivery with watermarking
- Corporate license includes Excel data appendix

**Action Items:**
- [ ] Outline report structure
- [ ] Gather all data points (use expanded database)
- [ ] Write executive summary (publish free on site)
- [ ] Design report layout (Canva Pro or hire designer @ $500)
- [ ] Set up payment/delivery system
- [ ] Create sales page on website
- [ ] Launch with email campaign to subscribers

---

### Week 13: Newsletter 2.0

#### 7.1 Premium Newsletter Tier

**Free Tier (Weekly):**
- Top 3 news stories
- Facility updates (new builds, expansions)
- Job highlights (3-5 positions)

**Premium Tier ($15/month or $150/year):**
- All free content
- Exclusive statistics and charts
- Early access to reports (20% discount)
- Monthly deep-dive analysis (2,000 words)
- Q&A submissions (ask analysts questions)
- Downloadable data appendices

**Platform Options:**
- Substack (easiest, built-in discovery)
- Beehiiv (best for monetization, analytics)
- Ghost (most control, self-hosted)

**Recommendation:** Beehiiv for growth tools + monetization

**Action Items:**
- [ ] Choose platform and set up
- [ ] Design newsletter template (match DC254 branding)
- [ ] Write 3 preview issues (free tier)
- [ ] Write 1 premium sample issue
- [ ] Set up payment integration
- [ ] Create landing page with tier comparison
- [ ] Import existing subscribers (with consent)
- [ ] Launch with promotional offer (first month $5)

---

## Phase 2: Product Expansion (Months 4-6)

### Goal: Diversify revenue streams, deepen engagement

### Month 4: Job Board Launch

**Features:**
- Employer dashboard to post/manage jobs
- Candidate search (email alerts for new jobs)
- Featured listings ($99/job, 30 days)
- Standard listings ($49/job, 30 days)
- Free for non-profits/government
- Resume database access ($199/month for employers)

**Tech Implementation:**
- Use new `JobPosting` model
- Build employer portal (CRUD operations)
- Integrate Stripe for payments
- Email alerts for candidates

**Marketing:**
- Partner with local tech communities (Nairobi Tech Week, etc.)
- LinkedIn promotion
- University career centers (Nairobi, Mombasa, Kampala)

**Revenue Projection:**
- 20 jobs/month × $75 avg = $1,500/month
- 5 resume database subscriptions × $199 = $995/month
- **Total: ~$2,500/month**

**Action Items:**
- [ ] Build job posting form (employer-facing)
- [ ] Create job listing page (public)
- [ ] Build employer dashboard
- [ ] Integrate Stripe payments
- [ ] Set up email alert system
- [ ] Recruit 10 launch employers (offer 50% discount)
- [ ] Launch with 15-20 live jobs

---

### Month 5: API Launch

**Product:** Data Centre 254 API

**Endpoints:**
- `GET /api/v1/facilities` - List all facilities
- `GET /api/v1/facilities/:id` - Facility details
- `GET /api/v1/operators` - List operators
- `GET /api/v1/pricing` - Pricing data (premium tier)
- `GET /api/v1/outages` - Recent outages (premium tier)
- `POST /api/v1/webhooks` - Subscribe to updates

**Pricing Tiers:**
- **Free:** 100 requests/day, basic facility data
- **Startup ($99/month):** 10,000 requests/day, pricing data
- **Enterprise ($499/month):** Unlimited, all endpoints, webhook support, SLA

**Documentation:**
- OpenAPI/Swagger spec
- Code examples (Python, Node.js, Go)
- Postman collection
- Interactive API explorer

**Action Items:**
- [ ] Design API structure (RESTful, JSON:API standard)
- [ ] Implement rate limiting (use `rate-limiter-flexible`)
- [ ] Build API key management system
- [ ] Create developer portal (docs, examples, signup)
- [ ] Set up billing integration (Stripe)
- [ ] Write documentation
- [ ] Recruit 5 beta users (offer 3 months free)
- [ ] Public launch with blog post

**Revenue Projection:**
- 10 startup customers × $99 = $990
- 3 enterprise customers × $499 = $1,497
- **Total: ~$2,500/month** (by month 6)

---

### Month 6: Webinars & Events

**Format:**
- Monthly webinar (free + premium)
- Quarterly in-person roundtable (Nairobi)
- Annual summit (Year 2)

**Webinar Topics:**
- "Choosing the Right Data Centre in East Africa"
- "Understanding PUE and Sustainability Metrics"
- "Subsea Cables 101: How Internet Reaches Africa"
- "AI Workloads and Data Centre Requirements"

**Monetization:**
- Free webinars: Lead generation
- Premium webinars: $49/ticket or included in newsletter subscription
- Sponsorships: $2,000-5,000 per webinar (vendor booths, mentions)

**In-Person Roundtable:**
- 20-30 attendees (CIOs, IT Directors, Procurement)
- Chatham House Rule (off-record discussion)
- Sponsor covers venue/catering ($3,000)
- DC254 facilitates, captures insights for reports

**Action Items:**
- [ ] Set up Zoom Webinar account ($149/month)
- [ ] Create registration landing pages
- [ ] Design webinar slide template
- [ ] Schedule first 3 webinars
- [ ] Recruit speakers (industry experts, your advisors)
- [ ] Promote via newsletter + LinkedIn
- [ ] Record and repurpose as content (YouTube, clips)

**Revenue Projection:**
- 2 sponsored webinars × $3,000 = $6,000
- 1 roundtable × $3,000 sponsorship = $3,000
- **Total: $9,000/quarter** (~$3,000/month)

---

## Phase 3: Intelligence Platform (Months 7-12)

### Goal: Establish thought leadership, scale premium offerings

### Month 7-8: Advisory Board Recruitment

**Target Members (8-12 people):**
- 2 data centre operators (CTO/VP level)
- 1 hyperscaler representative (AWS/Azure/Google)
- 1 regulator (CAK or equivalent)
- 1 fibre/subsea cable expert
- 1 enterprise customer (CIO of major bank/telco)
- 1 investor/VC focused on infra
- 1 sustainability expert
- 1 legal/regulatory expert

**Value Proposition:**
- Shape industry standards
- Early access to research
- Networking with peers
- Speaking opportunities at events
- Visibility as thought leaders

**Compensation:**
- Unpaid (prestige + networking)
- Travel expenses for in-person meetings
- Annual dinner/event

**Action Items:**
- [ ] Create advisory board one-pager (PDF)
- [ ] Identify 20 potential candidates
- [ ] Warm introductions via LinkedIn/network
- [ ] Host virtual info session
- [ ] Onboard first 8 members
- [ ] Schedule quarterly meetings
- [ ] Feature on website with photos/bios

---

### Month 9-10: Original Research Program

**Quarterly Reports (Year 2 Pipeline):**

**Q3 2026:**
- "East Africa Data Centre Pricing Survey 2026" ($499)
- "Power Costs Across East Africa" ($299)

**Q4 2026:**
- "State of AI Infrastructure in East Africa" ($599)
- "Subsea Cable Capacity & Utilization Report" ($399)

**Q1 2027:**
- "East Africa Data Centre Market Outlook 2027" ($699)
- "Green Data Centres: Renewable Energy Adoption" ($399)

**Q2 2027:**
- "Enterprise Colocation Buyer's Guide" ($299)
- "Hyperscale vs. Colocation: TCO Analysis" ($499)

**Methodology:**
- Primary research (surveys, interviews)
- Secondary research (public filings, reports)
- Proprietary data (from API users, directory traffic)
- Expert validation (advisory board review)

**Action Items:**
- [ ] Create research calendar (12-month pipeline)
- [ ] Design survey templates
- [ ] Recruit survey participants (operators, enterprises)
- [ ] Hire freelance researcher ($50/hour, 20 hours/report)
- [ ] Establish peer review process
- [ ] Build report template (design system)
- [ ] Set up pre-order system for upcoming reports

**Revenue Projection:**
- 4 reports/year × 50 copies × $450 avg = $90,000/year
- **Total: ~$7,500/month** (recurring from new releases)

---

### Month 11-12: Certification Program (Pilot)

**Program:** "Data Centre 254 Verified" Badge

**Criteria:**
- Accurate public information (verified by DC254 team)
- Response to verification requests (< 7 days)
- Transparency score (public disclosure of key metrics)
- Customer references (optional, for higher tier)

**Tiers:**
- **Verified (Free):** Basic data accuracy
- **Verified Plus ($500/year):** Enhanced profile, priority placement, badge usage rights
- **Verified Premium ($2,000/year):** Full audit, case study feature, speaking opportunity

**Process:**
1. Operator submits data via portal
2. DC254 verifies against public sources
3. Site visit (for Premium tier)
4. Badge awarded, valid for 12 months
5. Annual re-verification

**Action Items:**
- [ ] Define verification criteria and checklist
- [ ] Build submission portal for operators
- [ ] Create badge graphics (SVG, PNG)
- [ ] Draft legal terms (badge usage rights)
- [ ] Pilot with 3 friendly operators
- [ ] Refine process based on feedback
- [ ] Public launch with press release

**Revenue Projection:**
- Year 1: 10 Plus × $500 + 3 Premium × $2,000 = $11,000
- **Total: ~$1,000/month** (builds slowly)

---

## Phase 4: Ecosystem Dominance (Year 2+)

### Goal: Become indispensable infrastructure for the industry

### Expansion Priorities:

**1. Geographic Expansion:**
- West Africa (Nigeria, Ghana, Côte d'Ivoire)
- Southern Africa (South Africa, Zambia, Zimbabwe)
- North Africa (Egypt, Morocco)
- Target: 200+ facilities across continent by end of Year 2

**2. Product Deepening:**
- Real-time monitoring dashboard (uptime, latency)
- RFP (Request for Proposal) platform
- M&A advisory (connect buyers/sellers)
- Training academy (certification courses)

**3. Community Building:**
- Annual summit (500+ attendees, $500K+ revenue)
- Regional meetups (monthly in Nairobi, quarterly elsewhere)
- Slack/Discord community (free + premium channels)
- Mentorship program (young professionals ↔ veterans)

**4. Strategic Partnerships:**
- Data Center Dynamics (co-host events, cross-promotion)
- Uptime Institute (certification reciprocity)
- African Union Digital Transformation Strategy
- Smart Africa Alliance
- GSMA (mobile operator association)

---

## Revenue Model Summary

| Revenue Stream | Month 6 | Month 12 | Month 18 | Notes |
|---------------|---------|----------|----------|-------|
| Premium Newsletter | $500 | $2,500 | $5,000 | 300 subs @ $15/mo by M18 |
| Market Reports | $0 | $7,500 | $10,000 | 4 reports/year + backlist |
| Job Board | $0 | $2,500 | $4,000 | 40-50 jobs/month |
| API Access | $0 | $2,500 | $5,000 | 20 startups, 10 enterprise |
| Webinars/Events | $0 | $3,000 | $6,000 | Sponsored webinars + summits |
| Verification Program | $0 | $1,000 | $3,000 | 30+ certified facilities |
| **Total Monthly** | **$500** | **$19,000** | **$33,000** | |
| **Annual Run Rate** | **$6K** | **$228K** | **$396K** | |

**Additional Upside:**
- Consulting engagements ($5K-20K/project)
- Custom research for institutional clients ($25K-100K/report)
- Affiliate commissions (vendor referrals, 5-15%)
- Grants (digital infrastructure development funds)

---

## Key Performance Indicators (KPIs)

### Traffic & Engagement
- Monthly unique visitors: 10K → 50K → 100K
- Directory searches: 1K → 5K → 15K/month
- Time on site: > 3 minutes average
- Returning visitors: > 40%

### Database Quality
- Facilities listed: 50 → 100 → 200+
- Data completeness: > 90% fields populated
- Verification rate: 100% within 90 days
- Countries covered: 5 → 10 → 20+

### Monetization
- Email subscribers: 500 → 2,500 → 10,000
- Premium conversion: 3% → 5% → 8%
- Customer LTV: $180 → $350 → $500
- Churn rate: < 5%/month

### Authority Signals
- Backlinks from .gov/.edu domains: 10 → 50 → 200
- Media mentions: 5 → 20 → 50/quarter
- Speaking invitations: 1 → 5 → 15/year
- Advisory board quality: Industry recognition

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Operators refuse data sharing | Medium | High | Start with public data; offer value first (free profiles); show traffic stats |
| Competitor launches similar platform | Low | Medium | First-mover advantage; network effects; proprietary data moat |
| Economic downturn reduces ad spend | Medium | Medium | Diversify revenue (subscriptions > ads); focus on essential intelligence |
| Data inaccuracies damage credibility | High | Critical | Rigorous verification process; clear confidence scores; rapid correction policy |
| Regulatory changes restrict data | Low | High | Engage regulators early; advisory board includes regulators; comply proactively |
| Key person dependency (you) | High | High | Document processes; hire analyst by Month 6; build advisory board |

---

## Immediate Next Steps (This Week)

### Day 1-2:
- [ ] Review and approve expanded database schema
- [ ] Run migration to add new models
- [ ] Create Airtable base for data collection

### Day 3-4:
- [ ] List top 50 facilities to research (prioritize by market share)
- [ ] Draft outreach email template for operators
- [ ] Post virtual assistant job on Upwork/Fiverr

### Day 5-7:
- [ ] Begin manual data collection (10 facilities as pilot)
- [ ] Sketch comparison tool wireframe
- [ ] Write outline for first market report
- [ ] Identify 10 potential advisory board members

---

## Success Criteria (18 Months)

✅ **Directory:** 200+ facilities across 15+ African countries
✅ **Traffic:** 100K monthly visitors, 50% returning
✅ **Revenue:** $30K+/month, 5+ revenue streams
✅ **Authority:** Cited by regulators, quoted in media, invited to speak
✅ **Community:** 10K email subscribers, 500 premium members
✅ **Team:** 3-5 full-time employees + contractors
✅ **Partnerships:** 10+ strategic partners (operators, regulators, vendors)

---

## Final Thought

The goal is not just to be a website—it's to become **the operating system for Africa's digital infrastructure ecosystem**. Every stakeholder (operators, customers, investors, regulators, job seekers) should need Data Centre 254 to make decisions.

**Your unfair advantages:**
1. First-mover in pan-African data centre intelligence
2. Existing technical foundation (solid codebase)
3. Verification rigor (trust moat)
4. Local knowledge (Kenya/East Africa expertise)

**Execute this plan with discipline, and you'll own this category.**

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Next Review: After Phase 1 completion (Month 3)*
