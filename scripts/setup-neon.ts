// Script to push Prisma schema and seed data to Neon DB
// Uses @neondatabase/serverless (WebSocket over port 443) — works from restricted networks

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_4chIwsRiSMx0@ep-hidden-recipe-ahrdhk58-pooler.c-3.us-east-1.aws.neon.tech/DC254%20?sslmode=require';

const sql = neon(DATABASE_URL);

async function setup() {
  console.log('Connecting to Neon...');

  // Test connection
  const result = await sql`SELECT current_database(), current_user, version()`;
  console.log('Connected to:', result[0].current_database, 'as', result[0].current_user);

  // Create tables from Prisma schema
  console.log('\nCreating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS "Operator" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "hqCountry" TEXT NOT NULL DEFAULT 'Kenya',
      "parentCompany" TEXT,
      "website" TEXT,
      "type" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ Operator');

  await sql`
    CREATE TABLE IF NOT EXISTS "Facility" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "status" TEXT NOT NULL DEFAULT 'Operational',
      "address" TEXT,
      "city" TEXT NOT NULL DEFAULT 'Nairobi',
      "region" TEXT NOT NULL DEFAULT 'Nairobi County',
      "coordinates" TEXT,
      "itLoadMw" DOUBLE PRECISION,
      "totalCapacityMw" DOUBLE PRECISION,
      "rackCount" INTEGER,
      "occupiedRacks" INTEGER,
      "floorSpaceSqM" INTEGER,
      "tierRating" TEXT,
      "facilityType" TEXT,
      "aiReady" BOOLEAN NOT NULL DEFAULT false,
      "openedDate" TEXT,
      "expansionDate" TEXT,
      "coolingType" TEXT,
      "powerSource" TEXT,
      "renewableClaim" TEXT,
      "notable" TEXT,
      "lastVerified" TEXT,
      "dataSource" TEXT,
      "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
      "operatorId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Facility_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ Facility');

  await sql`CREATE INDEX IF NOT EXISTS "Facility_city_idx" ON "Facility"("city")`;
  await sql`CREATE INDEX IF NOT EXISTS "Facility_status_idx" ON "Facility"("status")`;
  await sql`CREATE INDEX IF NOT EXISTS "Facility_operatorId_idx" ON "Facility"("operatorId")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "ConnectivityProvider" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "type" TEXT,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ ConnectivityProvider');

  await sql`
    CREATE TABLE IF NOT EXISTS "ConnectivityProviderFacility" (
      "facilityId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      CONSTRAINT "ConnectivityProviderFacility_pkey" PRIMARY KEY ("facilityId", "providerId"),
      CONSTRAINT "ConnectivityProviderFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "ConnectivityProviderFacility_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ConnectivityProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ ConnectivityProviderFacility');

  await sql`
    CREATE TABLE IF NOT EXISTS "Certification" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "type" TEXT,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ Certification');

  await sql`
    CREATE TABLE IF NOT EXISTS "FacilityCertification" (
      "facilityId" TEXT NOT NULL,
      "certificationId" TEXT NOT NULL,
      CONSTRAINT "FacilityCertification_pkey" PRIMARY KEY ("facilityId", "certificationId"),
      CONSTRAINT "FacilityCertification_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "FacilityCertification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ FacilityCertification');

  await sql`
    CREATE TABLE IF NOT EXISTS "Article" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "tlDr" TEXT,
      "description" TEXT,
      "cluster" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Draft',
      "content" TEXT NOT NULL,
      "readingTimeMin" INTEGER,
      "lastVerified" TEXT,
      "dataSource" TEXT,
      "metaTitle" TEXT,
      "metaDescription" TEXT,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "isFoundational" BOOLEAN NOT NULL DEFAULT false,
      "foundationalOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ Article');
  await sql`CREATE INDEX IF NOT EXISTS "Article_cluster_idx" ON "Article"("cluster")`;
  await sql`CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status")`;
  await sql`CREATE INDEX IF NOT EXISTS "Article_cluster_sortOrder_idx" ON "Article"("cluster", "sortOrder")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "Subscriber" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "source" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ Subscriber');
  await sql`CREATE INDEX IF NOT EXISTS "Subscriber_email_idx" ON "Subscriber"("email")`;
  await sql`CREATE INDEX IF NOT EXISTS "Subscriber_status_idx" ON "Subscriber"("status")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "ArticleClaim" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "claim" TEXT NOT NULL,
      "source" TEXT,
      "sourceTitle" TEXT,
      "verifiedDate" TEXT,
      "confidence" TEXT NOT NULL DEFAULT 'Medium',
      "notes" TEXT,
      "articleId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ArticleClaim_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ ArticleClaim');

  await sql`
    CREATE TABLE IF NOT EXISTS "PricingData" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "facilityId" TEXT NOT NULL,
      "pricingType" TEXT NOT NULL,
      "serviceLevel" TEXT,
      "pricePerRackMw" DOUBLE PRECISION,
      "rackDensityKw" DOUBLE PRECISION,
      "minimumCommitmentKw" DOUBLE PRECISION,
      "pricePerSqM" DOUBLE PRECISION,
      "pricePerCabinet" DOUBLE PRECISION,
      "crossConnectPrice" DOUBLE PRECISION,
      "currency" TEXT NOT NULL DEFAULT 'USD',
      "validFrom" TEXT NOT NULL,
      "validUntil" TEXT,
      "isPublic" BOOLEAN NOT NULL DEFAULT false,
      "dataSource" TEXT,
      "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PricingData_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ PricingData');
  await sql`CREATE INDEX IF NOT EXISTS "PricingData_facilityId_idx" ON "PricingData"("facilityId")`;
  await sql`CREATE INDEX IF NOT EXISTS "PricingData_pricingType_idx" ON "PricingData"("pricingType")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "OutageReport" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "facilityId" TEXT,
      "outageType" TEXT NOT NULL,
      "severity" TEXT NOT NULL DEFAULT 'Medium',
      "status" TEXT NOT NULL DEFAULT 'Investigating',
      "startedAt" TEXT NOT NULL,
      "resolvedAt" TEXT,
      "durationMinutes" INTEGER,
      "affectedServices" TEXT,
      "impactDescription" TEXT,
      "customersAffected" INTEGER,
      "rootCause" TEXT,
      "resolution" TEXT,
      "reportedBy" TEXT,
      "isVerified" BOOLEAN NOT NULL DEFAULT false,
      "verificationSource" TEXT,
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "OutageReport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ OutageReport');
  await sql`CREATE INDEX IF NOT EXISTS "OutageReport_facilityId_idx" ON "OutageReport"("facilityId")`;
  await sql`CREATE INDEX IF NOT EXISTS "OutageReport_status_idx" ON "OutageReport"("status")`;
  await sql`CREATE INDEX IF NOT EXISTS "OutageReport_severity_idx" ON "OutageReport"("severity")`;
  await sql`CREATE INDEX IF NOT EXISTS "OutageReport_startedAt_idx" ON "OutageReport"("startedAt")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "EnergyMetric" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "facilityId" TEXT NOT NULL,
      "measurementDate" TEXT NOT NULL,
      "reportingPeriod" TEXT,
      "totalPowerMwh" DOUBLE PRECISION,
      "itPowerMwh" DOUBLE PRECISION,
      "coolingPowerMwh" DOUBLE PRECISION,
      "pue" DOUBLE PRECISION,
      "wue" DOUBLE PRECISION,
      "cue" DOUBLE PRECISION,
      "renewablePercentage" DOUBLE PRECISION,
      "renewableSource" TEXT,
      "onSiteGenerationMwh" DOUBLE PRECISION,
      "carbonTonnesCO2" DOUBLE PRECISION,
      "carbonOffset" DOUBLE PRECISION,
      "isAudited" BOOLEAN NOT NULL DEFAULT false,
      "auditStandard" TEXT,
      "dataSource" TEXT,
      "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "EnergyMetric_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ EnergyMetric');
  await sql`CREATE INDEX IF NOT EXISTS "EnergyMetric_facilityId_idx" ON "EnergyMetric"("facilityId")`;
  await sql`CREATE INDEX IF NOT EXISTS "EnergyMetric_measurementDate_idx" ON "EnergyMetric"("measurementDate")`;
  await sql`CREATE INDEX IF NOT EXISTS "EnergyMetric_pue_idx" ON "EnergyMetric"("pue")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "Tenant" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "facilityId" TEXT NOT NULL,
      "tenantName" TEXT,
      "tenantType" TEXT NOT NULL,
      "industry" TEXT,
      "presenceType" TEXT NOT NULL,
      "rackCount" INTEGER,
      "powerCommitmentKw" DOUBLE PRECISION,
      "floorSpaceSqM" INTEGER,
      "moveInDate" TEXT,
      "contractLengthMonths" INTEGER,
      "expansionPlanned" BOOLEAN NOT NULL DEFAULT false,
      "isAnchorTenant" BOOLEAN NOT NULL DEFAULT false,
      "isHyperscaler" BOOLEAN NOT NULL DEFAULT false,
      "isPublic" BOOLEAN NOT NULL DEFAULT false,
      "dataSource" TEXT,
      "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Tenant_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ Tenant');
  await sql`CREATE INDEX IF NOT EXISTS "Tenant_facilityId_idx" ON "Tenant"("facilityId")`;
  await sql`CREATE INDEX IF NOT EXISTS "Tenant_tenantType_idx" ON "Tenant"("tenantType")`;
  await sql`CREATE INDEX IF NOT EXISTS "Tenant_isHyperscaler_idx" ON "Tenant"("isHyperscaler")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "JobPosting" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "company" TEXT NOT NULL,
      "companyId" TEXT,
      "location" TEXT NOT NULL,
      "locationType" TEXT NOT NULL DEFAULT 'On-site',
      "facilityId" TEXT,
      "jobType" TEXT NOT NULL DEFAULT 'Full-time',
      "experienceLevel" TEXT NOT NULL DEFAULT 'Mid-level',
      "department" TEXT,
      "salaryMin" INTEGER,
      "salaryMax" INTEGER,
      "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
      "salaryPeriod" TEXT NOT NULL DEFAULT 'yearly',
      "description" TEXT NOT NULL,
      "requirements" TEXT,
      "benefits" TEXT,
      "applicationUrl" TEXT,
      "applicationEmail" TEXT,
      "applicationDeadline" TEXT,
      "status" TEXT NOT NULL DEFAULT 'Active',
      "isFeatured" BOOLEAN NOT NULL DEFAULT false,
      "postedDate" TEXT NOT NULL,
      "expirationDate" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "JobPosting_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ JobPosting');
  await sql`CREATE INDEX IF NOT EXISTS "JobPosting_status_idx" ON "JobPosting"("status")`;
  await sql`CREATE INDEX IF NOT EXISTS "JobPosting_jobType_idx" ON "JobPosting"("jobType")`;
  await sql`CREATE INDEX IF NOT EXISTS "JobPosting_experienceLevel_idx" ON "JobPosting"("experienceLevel")`;
  await sql`CREATE INDEX IF NOT EXISTS "JobPosting_postedDate_idx" ON "JobPosting"("postedDate")`;
  await sql`CREATE INDEX IF NOT EXISTS "JobPosting_facilityId_idx" ON "JobPosting"("facilityId")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "Report" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "subtitle" TEXT,
      "executiveSummary" TEXT,
      "fullContent" TEXT,
      "pageCount" INTEGER,
      "reportType" TEXT NOT NULL DEFAULT 'Market Research',
      "topic" TEXT,
      "regions" TEXT,
      "priceUsd" DOUBLE PRECISION,
      "isFree" BOOLEAN NOT NULL DEFAULT false,
      "accessLevel" TEXT NOT NULL DEFAULT 'Premium',
      "publishedDate" TEXT NOT NULL,
      "updatedDate" TEXT,
      "version" TEXT NOT NULL DEFAULT '1.0',
      "authors" TEXT,
      "sponsor" TEXT,
      "downloadCount" INTEGER NOT NULL DEFAULT 0,
      "viewCount" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'Draft',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ Report');
  await sql`CREATE INDEX IF NOT EXISTS "Report_status_idx" ON "Report"("status")`;
  await sql`CREATE INDEX IF NOT EXISTS "Report_reportType_idx" ON "Report"("reportType")`;
  await sql`CREATE INDEX IF NOT EXISTS "Report_publishedDate_idx" ON "Report"("publishedDate")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT,
      "name" TEXT,
      "company" TEXT,
      "jobTitle" TEXT,
      "country" TEXT,
      "subscriptionTier" TEXT NOT NULL DEFAULT 'Free',
      "subscriptionStart" TEXT,
      "subscriptionEnd" TEXT,
      "isAdmin" BOOLEAN NOT NULL DEFAULT false,
      "isVerified" BOOLEAN NOT NULL DEFAULT false,
      "lastLoginAt" TEXT,
      "loginCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  console.log('  ✓ User');
  await sql`CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email")`;
  await sql`CREATE INDEX IF NOT EXISTS "User_subscriptionTier_idx" ON "User"("subscriptionTier")`;

  await sql`
    CREATE TABLE IF NOT EXISTS "ApiToken" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "tokenHash" TEXT NOT NULL,
      "tokenPrefix" TEXT NOT NULL,
      "scope" TEXT NOT NULL DEFAULT 'read',
      "rateLimitPerMinute" INTEGER NOT NULL DEFAULT 60,
      "lastUsedAt" TEXT,
      "requestCount" INTEGER NOT NULL DEFAULT 0,
      "expiresAt" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  console.log('  ✓ ApiToken');
  await sql`CREATE INDEX IF NOT EXISTS "ApiToken_userId_idx" ON "ApiToken"("userId")`;
  await sql`CREATE INDEX IF NOT EXISTS "ApiToken_isActive_idx" ON "ApiToken"("isActive")`;

  console.log('\nAll tables created successfully!');

  // Seed the Kenya article
  console.log('\nSeeding Kenya licensing article...');

  const ARTICLE_CONTENT = `## The Regulatory Shift

On 6 March 2026, Communications Authority of Kenya Director General **David Mugonyi** signed a notice in the Kenya Gazette that would fundamentally alter how data centres operate in the country. Gazette Notice No. 3335 gave formal effect to the **Revised Telecommunications Market Structure**, a document that, for the first time in Kenya's regulatory history, expressly brought commercial data centres within the telecommunications licensing framework. The revised structure took effect thirty days after publication, meaning that by early April 2026, every commercial data centre operator in Kenya needed to understand exactly where they fit within the new regime.

The change is not cosmetic. Under the previous Unified Licensing Framework (ULF), which had governed Kenya's telecoms sector since 2021, data centre operators occupied an ambiguous space. They were not explicitly categorised in any licence class, which meant that licensing was often determined on a case-by-case basis depending on how a given operator's activities mapped onto existing categories. This created uncertainty for investors, inconsistent treatment for operators, and a regulatory gap that the Authority has now moved decisively to close.

The implications are significant not just for the roughly nineteen operational data centres scattered across Nairobi and Mombasa, but for the billions of shillings in planned investment that Kenya's digital infrastructure sector is hoping to attract. Microsoft's stalled one-billion-dollar AI data centre project, the expansion of Africa Data Centres and iXAfrica facilities, and the government's own National Digital Superhighway Programme all exist within a regulatory environment that has now, for the first time, been explicitly defined.

## Why Data Centres Became Too Critical to Leave Unlicensed

The CA's decision did not emerge from a vacuum. It was the product of a formal public consultation process that began with a consultation paper published in December 2024. In that paper, the Authority articulated a clear rationale: data centres have evolved from simple server rooms into critical national infrastructure, and the regulatory framework needed to evolve accordingly.

The Authority wrote that *"given that the facility owner in the second type of data centre arrangement significantly influences data accessibility, it is necessary to bring these arrangements within the licensing framework to protect users' data access rights."* This language is telling. The CA was not merely tidying up its licence categories; it was asserting that data centres, by virtue of the role they play in mediating access to digital services, are functionally equivalent to communications infrastructure providers like tower companies and fibre operators.

The real-world urgency of this position was demonstrated just weeks later, in June 2026, when a power outage at the Huduma Kenya data centre in Nakuru brought government services to a halt nationwide. Huduma Centres across all forty-seven counties went offline simultaneously, affecting millions of citizens who rely on these centres for identity documents, business registrations, and a range of essential government services. The incident was a stark reminder that data centre failures are no longer theoretical risks confined to the technology sector; they are events with immediate, tangible consequences for public administration and economic activity.

The CA's reasoning drew a direct parallel with communications tower companies, which have long been regulated as Network Facilities Providers despite operating what is, in many respects, passive infrastructure. A data centre, the Authority effectively argued, is to the digital economy what a communications tower is to the mobile network: the physical layer without which everything above it ceases to function. The regulatory alignment, in the CA's view, was long overdue.

## NFP-T1 and NFP-T2: How the Licence Structure Works

The Revised Telecommunications Market Structure did not create a standalone "data centre licence." Instead, it placed data centre operations within the existing Network Facilities Provider licence framework, specifically under **NFP-Tier 2 (NFP-T2)** as the primary licensing route, with **NFP-Tier 1 (NFP-T1)** available for operators who also require nationwide infrastructure and spectrum rights. This modular approach is consistent with the CA's longstanding technology-neutral licensing philosophy, which avoids creating narrow, technology-specific licences in favour of broader, activity-based categories that can accommodate technological evolution without requiring constant regulatory revision.

The distinction between the two tiers is substantial and has direct financial implications for operators. NFP-T2 is the primary licence for pure-play data centre operators. It permits the establishment and operation of commercial data centres on a countrywide basis, with infrastructure deployed incrementally, county by county. The initial licence fee is KES 15 million for a fifteen-year term, with annual operating fees set at 0.4% of Annual Gross Turnover or KES 800,000, whichever is higher. For a new entrant building a single facility, this is the most cost-effective and operationally straightforward path to compliance.

NFP-T1, by contrast, is designed for large integrated operators with nationwide reach. It is the only licence tier that permits exclusive nationwide spectrum reservation from day one, making it suitable for operators who need both data centre capacity and their own transmission infrastructure. The licence fee is KES 15 million for a standard fifteen-year term, or KES 45 million for an optional twenty-five-year term that provides greater investment certainty for capital-intensive deployments. The annual operating fee is significantly higher: 0.4% of Annual Gross Turnover or KES 4 million, whichever is higher. This reflects the broader scope of infrastructure and spectrum rights that the licence confers.

It is worth noting that during the consultation process, the CA had initially proposed placing data centres under the NFP-T3 category, which covers limited geographic areas. Industry stakeholders pushed back, arguing that data centres inherently serve a national or regional function and that confining them to a county-level licence would be impractical. The Authority accepted this reasoning, and the final framework places data centres under the two highest infrastructure tiers. For entities that already hold an NFP-T2 licence, the updated structure grants the right to establish commercial data centres without needing any additional licence, which simplifies compliance for existing operators.

### NFP-T1 vs NFP-T2 for Data Centre Operators

| Aspect | NFP-T1 (Tier 1) | NFP-T2 (Tier 2) |
|---|---|---|
| Data Centre Right | Permitted without additional licence | Primary licence category for DCs |
| Geographic Scope | Countrywide with national spectrum | Countrywide, county-by-county build-out |
| Spectrum Fees | Reservation + utilisation fees (national stack) | Utilisation fees only (approved regions) |
| Licence Term | 15 years or 25 years (optional) | 15 years only |
| Application Fee | KES 5,000 | KES 5,000 |
| Initial Licence Fee | KES 15M (15yr) / KES 45M (25yr) | KES 15 million |
| Annual Operating Fee | 0.4% of AGT or KES 4M, whichever is higher | 0.4% of AGT or KES 800K, whichever is higher |

*Source: Communications Authority of Kenya, Revised Telecommunications Market Structure (June 2026)*

## Kenya's Data Centre Landscape: The Numbers

As of mid-2026, Kenya is home to **nineteen operational data centres**: fifteen in Nairobi and four in Mombasa. The coastal facilities are strategically positioned near submarine cable landing stations, which give Kenya its competitive advantage as an East African connectivity hub. Nairobi, meanwhile, serves as the primary market for domestic and regional enterprise demand, hosting the largest concentration of carrier-neutral colocation facilities in the region.

The market's total IT power capacity stood at approximately **15 megawatts in 2025**, a figure that is projected to reach **25 megawatts by 2030**, representing a compound annual growth rate of 10.76% according to Mordor Intelligence. In monetary terms, the Kenya data centre market was valued at **USD 266 million in 2025** and is forecast to reach **USD 805 million by 2031**, growing at 20.27% annually according to ResearchAndMarkets. These are not marginal numbers. They represent one of the fastest-growing data centre markets on the African continent, driven by a convergence of factors including submarine cable connectivity, a growing fintech ecosystem, government digitisation programmes, and increasing cloud adoption across East and Central Africa.

The key players operating in this space include Africa Data Centres (a Liquid Intelligent Technologies company), which operates multiple facilities including a significant presence along Mombasa Road; iXAfrica Data Centres, which has developed East Africa's first hyper-scale, AI-ready facility at NBOX1.1 with a 4.5 megawatt IT load; and various government-owned facilities that support public sector digital services. Safaricom and Telkom Kenya also operate data centre infrastructure to support their telecommunications and enterprise services businesses.

The regulatory clarification provided by the new licensing framework arrives at a critical inflection point. As hyperscale operators, cloud providers, and AI infrastructure investors evaluate African markets for expansion, the existence of a clear, predictable licensing regime is a material factor in investment decisions. The previous ambiguity, where operators could not be certain which licence applied to their activities, was a genuine barrier to entry, particularly for international operators accustomed to well-defined regulatory environments in markets like South Africa, Nigeria, and Egypt.

## The Power Constraint: Why Licensing Is Necessary but Not Sufficient

While the regulatory framework has taken a significant step forward, the single largest obstacle to data centre growth in Kenya remains the power supply. This is not a hypothetical concern. In May 2026, Microsoft and G42's planned one-billion-dollar AI data centre project — which would have been the largest single foreign direct investment in Kenya's digital infrastructure — stalled after it became clear that the national grid could not reliably deliver the power capacity the facility required. Government officials reportedly indicated that meeting the project's energy demands would require rationing power to other consumers, a politically untenable proposition.

The power challenge is multi-dimensional. Kenya's electricity generation capacity, while substantial relative to many African peers, is concentrated in geothermal and hydroelectric sources that are geographically fixed. Data centre demand, by contrast, is concentrated in Nairobi and its environs, creating transmission bottlenecks. The country's total installed generation capacity stands at approximately 3,500 megawatts, but the Microsoft project alone was reported to require several hundred megawatts — a demand that would represent a significant share of the national grid's firm capacity. The government's ambition to position Kenya as an AI and cloud computing hub for East Africa is, in this context, directly constrained by the pace at which generation and transmission capacity can be expanded.

The Huduma Kenya outage in June 2026 further illustrated the power reliability challenge. A single power supply failure at one data centre in Nakuru was sufficient to disrupt government services across the entire country. This is not a resilience problem that can be solved by licensing alone; it requires investment in backup power systems, redundant power feeds, and ultimately, the diversification and expansion of Kenya's electricity generation and distribution infrastructure. The CA's licensing framework addresses the regulatory dimension of data centre oversight, but the broader ecosystem challenges — power, cooling, skilled labour, and fibre connectivity in underserved areas — remain.

## Other Notable Changes in the Revised Structure

The revised market structure introduced changes beyond data centre licensing that are relevant to the broader digital infrastructure ecosystem. The CA created a new **Landing Rights Authorisation (LRA)**, a separate licence category for entities that transmit telecommunications signals into Kenya via submarine cables or satellite. Previously, landing rights were bundled within the International Gateway Systems and Services (IGSS) licence, which created a barrier for entities that wanted to land infrastructure in Kenya without taking on the full scope of an IGSS licence. The separation is a strategic move designed to make it easier for international submarine cable operators to establish a presence in Kenya and to position the country as a gateway for landlocked East African nations.

The Authority also expanded the scope of the NFP-T3 licence, which previously covered a single county, to cover up to three counties. This makes the licence more commercially viable for smaller infrastructure investors who want to build and interconnect towers, VSAT terminals, and other facilities across a small cluster of counties without committing to the full NFP-T2 framework. A new **Micro Network and Services Provider (MNSP)** licence was introduced for operators serving limited areas from residential estates up to county level, covering voice, data, and internet services. This category is partly aimed at curbing illegal service providers operating in residential areas while also promoting competition and lowering costs for consumers in underserved areas.

## What This Means for Operators and Investors

For existing data centre operators, the immediate practical impact is that they need to ensure they hold the appropriate NFP licence category. Operators already licensed under NFP-T2 can establish commercial data centres without additional authorisation. Those operating under other licence classes, or those without any licence, need to assess their activities against the new framework and take steps to comply. The CA has historically taken an enforcement approach that prioritises bringing operators into compliance over punitive action, but the existence of a clear framework means that operating without a licence is no longer a grey area; it is a regulatory violation.

For prospective investors, particularly international operators evaluating East African market entry, the framework provides a degree of predictability that was previously absent. The licence fees, while not trivial, are within the range that would be expected for a market of Kenya's size and strategic importance. The fifteen-year licence term provides sufficient runway for return on investment, and the optional twenty-five-year NFP-T1 term accommodates the longest infrastructure investment cycles. The annual operating fee structure, based on a percentage of gross turnover with a minimum floor, aligns the Authority's revenue with operator success rather than penalising operators during their growth phase.

The broader policy trajectory is encouraging. Kenya has progressively liberalised its ICT investment framework: the removal of the thirty percent local shareholding requirement for ICT licensees, the introduction of Special Economic Zones with customs and tax relief on ICT equipment, and now the formal licensing of data centres all signal a deliberate strategy to position the country as a premier destination for digital infrastructure investment in Africa. The question is no longer whether Kenya is open for data centre investment; it is whether the supporting infrastructure, particularly power supply, can scale fast enough to meet the demand that the regulatory clarity is designed to attract.

## Sources and References

| Source | Reference |
|---|---|
| Communications Authority of Kenya | Revised Telecommunications Market Structure (June 2026) |
| Kenya Gazette Notice No. 3335 | 6 March 2026, published by DG David Mugonyi |
| Bowmans (Law Firm) | Kenya: Revised Telecommunications Market Structure — Formal Recognition of Data Centres (2026) |
| McKay Advocates | Kenya Strengthens ICT Investment Appeal with Formal Data Centre Regulations (April 2026) |
| O'Bang Law | Communications Authority's Revised Telecommunications Market Structure 2026 (April 2026) |
| Mordor Intelligence | Kenya Data Center Market Size, Share & 2030 Growth Trends Report (2025) |
| ResearchAndMarkets | Kenya Data Center Investment and Growth Analysis Report 2026 (March 2026) |
| Techweez | Kenya's New KES 15 Million Data Center License: What NFP-T1 and NFP-T2 Mean (August 2026) |
| Tom's Hardware / Semafor | Microsoft $1B Kenya AI Data Centre Stalls Over Power Capacity (May 2026) |
| Techweez | Huduma Centre Services Halted After Data Center Loses Power (June 2026) |`;

  await sql`
    INSERT INTO "Article" ("id", "title", "slug", "tlDr", "description", "cluster", "status", "content", "readingTimeMin", "lastVerified", "metaTitle", "metaDescription", "sortOrder", "isFoundational", "foundationalOrder", "createdAt")
    VALUES (
      'art-kenya-licensing-001',
      'Kenya''s Data Centre Licensing Framework: What NFP-T1 and NFP-T2 Mean for the Industry',
      'kenya-data-centre-licensing-framework',
      'For the first time in Kenya''s regulatory history, commercial data centres are explicitly licensed. The CA''s NFP-T2 tier (KES 15M initial, 15-year term) is the primary route for data centre operators, while NFP-T1 covers integrated nationwide operators with spectrum rights.',
      'The Communications Authority has formally brought commercial data centres under telecoms licensing for the first time. Here is what operators, investors, and engineers need to know.',
      'Kenya',
      'Published',
      ${ARTICLE_CONTENT},
      12,
      '2026-08',
      'Kenya''s Data Centre Licensing Framework | Data Centre 254',
      'The CA has formally brought commercial data centres under telecoms licensing for the first time. NFP-T2 (KES 15M, 15-year term) is the primary route for operators.',
      0,
      false,
      0,
      '2026-08-21T00:00:00.000Z'
    )
    ON CONFLICT ("slug") DO NOTHING
  `;
  console.log('  ✓ Kenya licensing article seeded');

  // Seed article claims
  console.log('\nSeeding article claims...');
  const claims = [
    { claim: 'Commercial data centres are now explicitly licensed under NFP-T2 in Kenya', source: 'Kenya Gazette Notice No. 3335', sourceTitle: 'Gazette Notice No. 3335', verifiedDate: '2026-03', confidence: 'High' },
    { claim: 'NFP-T2 initial licence fee is KES 15 million for a 15-year term', source: 'CA Kenya Revised Market Structure', sourceTitle: 'Revised Telecommunications Market Structure (June 2026)', verifiedDate: '2026-06', confidence: 'High' },
    { claim: 'Kenya has 19 operational data centres: 15 in Nairobi, 4 in Mombasa', source: 'Industry reports', sourceTitle: 'Mordor Intelligence / ResearchAndMarkets', verifiedDate: '2025-12', confidence: 'Medium' },
    { claim: 'Kenya data centre market valued at USD 266M in 2025, forecast USD 805M by 2031', source: 'ResearchAndMarkets', sourceTitle: 'Kenya Data Center Investment and Growth Analysis Report 2026', verifiedDate: '2026-03', confidence: 'Medium' },
    { claim: 'Microsoft $1B AI data centre project stalled over power capacity concerns', source: 'Tom\'s Hardware / Semafor', sourceTitle: 'Microsoft $1B Kenya AI Data Centre Stalls', verifiedDate: '2026-05', confidence: 'High' },
    { claim: 'Huduma Kenya data centre outage in Nakuru halted government services nationwide in June 2026', source: 'Techweez', sourceTitle: 'Huduma Centre Services Halted After Data Center Loses Power', verifiedDate: '2026-06', confidence: 'High' },
  ];

  for (let i = 0; i < claims.length; i++) {
    const c = claims[i];
    await sql.query(
      `INSERT INTO "ArticleClaim" ("id", "claim", "source", "sourceTitle", "verifiedDate", "confidence", "articleId")
       VALUES ($1, $2, $3, $4, $5, $6::text, $7)`,
      [`claim-${i + 1}`, c.claim, c.source, c.sourceTitle, c.verifiedDate, c.confidence, 'art-kenya-licensing-001']
    );
  }
  console.log(`  ✓ ${claims.length} claims seeded`);

  // Verify
  const count = await sql`SELECT COUNT(*)::int as count FROM "Article" WHERE "status" = 'Published'`;
  const claimCount = await sql`SELECT COUNT(*)::int as count FROM "ArticleClaim"`;
  console.log(`\nVerification: ${count[0].count} published article(s), ${claimCount[0].count} claim(s)`);
  console.log('\nDone! Database is ready.');
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
