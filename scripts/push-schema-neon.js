var { Pool } = require('@neondatabase/serverless');
var pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_4chIwsRiSMx0@ep-hidden-recipe-ahrdhk58-pooler.c-3.us-east-1.aws.neon.tech/DC254%20?sslmode=require' });

var S = [];

// Drop all
S.push("DROP TABLE IF EXISTS \"ApiToken\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Tenant\" CASCADE");
S.push("DROP TABLE IF EXISTS \"EnergyMetric\" CASCADE");
S.push("DROP TABLE IF EXISTS \"OutageReport\" CASCADE");
S.push("DROP TABLE IF EXISTS \"PricingData\" CASCADE");
S.push("DROP TABLE IF EXISTS \"ArticleClaim\" CASCADE");
S.push("DROP TABLE IF EXISTS \"FacilityCertification\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Certification\" CASCADE");
S.push("DROP TABLE IF EXISTS \"ConnectivityProviderFacility\" CASCADE");
S.push("DROP TABLE IF EXISTS \"ConnectivityProvider\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Facility\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Operator\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Article\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Subscriber\" CASCADE");
S.push("DROP TABLE IF EXISTS \"JobPosting\" CASCADE");
S.push("DROP TABLE IF EXISTS \"Report\" CASCADE");
S.push("DROP TABLE IF EXISTS \"User\" CASCADE");
S.push("DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE");

S.push('CREATE TABLE "Operator" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "description" TEXT, "hqCountry" TEXT NOT NULL DEFAULT ' + "'Kenya'" + ', "parentCompany" TEXT, "website" TEXT, "type" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');

S.push('CREATE TABLE "Facility" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "description" TEXT, "status" TEXT NOT NULL DEFAULT ' + "'Operational'" + ', "address" TEXT, "city" TEXT NOT NULL DEFAULT ' + "'Nairobi'" + ', "region" TEXT NOT NULL DEFAULT ' + "'Nairobi County'" + ', "coordinates" TEXT, "itLoadMw" DOUBLE PRECISION, "totalCapacityMw" DOUBLE PRECISION, "rackCount" INTEGER, "occupiedRacks" INTEGER, "floorSpaceSqM" INTEGER, "tierRating" TEXT, "facilityType" TEXT, "aiReady" BOOLEAN NOT NULL DEFAULT false, "openedDate" TEXT, "expansionDate" TEXT, "coolingType" TEXT, "powerSource" TEXT, "renewableClaim" TEXT, "notable" TEXT, "lastVerified" TEXT, "dataSource" TEXT, "dataConfidence" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "operatorId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Facility_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)');
S.push('CREATE INDEX "Facility_city_idx" ON "Facility"("city")');
S.push('CREATE INDEX "Facility_status_idx" ON "Facility"("status")');
S.push('CREATE INDEX "Facility_operatorId_idx" ON "Facility"("operatorId")');

S.push('CREATE TABLE "ConnectivityProvider" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "type" TEXT, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');

S.push('CREATE TABLE "ConnectivityProviderFacility" ("facilityId" TEXT NOT NULL, "providerId" TEXT NOT NULL, CONSTRAINT "ConnectivityProviderFacility_pkey" PRIMARY KEY ("facilityId", "providerId"), CONSTRAINT "ConnectivityProviderFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "ConnectivityProviderFacility_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ConnectivityProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)');

S.push('CREATE TABLE "Certification" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "type" TEXT, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');

S.push('CREATE TABLE "FacilityCertification" ("facilityId" TEXT NOT NULL, "certificationId" TEXT NOT NULL, CONSTRAINT "FacilityCertification_pkey" PRIMARY KEY ("facilityId", "certificationId"), CONSTRAINT "FacilityCertification_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "FacilityCertification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)');

S.push('CREATE TABLE "Article" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "tlDr" TEXT, "description" TEXT, "cluster" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT ' + "'Draft'" + ', "content" TEXT NOT NULL DEFAULT ' + "''" + ', "readingTimeMin" INTEGER, "lastVerified" TEXT, "dataSource" TEXT, "metaTitle" TEXT, "metaDescription" TEXT, "sortOrder" INTEGER NOT NULL DEFAULT 0, "isFoundational" BOOLEAN NOT NULL DEFAULT false, "foundationalOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');
S.push('CREATE INDEX "Article_cluster_idx" ON "Article"("cluster")');
S.push('CREATE INDEX "Article_status_idx" ON "Article"("status")');
S.push('CREATE INDEX "Article_cluster_sortOrder_idx" ON "Article"("cluster", "sortOrder")');

S.push('CREATE TABLE "Subscriber" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "status" TEXT NOT NULL DEFAULT ' + "'Active'" + ', "source" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');
S.push('CREATE INDEX "Subscriber_email_idx" ON "Subscriber"("email")');
S.push('CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status")');

S.push('CREATE TABLE "ArticleClaim" ("id" TEXT NOT NULL PRIMARY KEY, "claim" TEXT NOT NULL, "source" TEXT, "sourceTitle" TEXT, "verifiedDate" TEXT, "confidence" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "notes" TEXT, "articleId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ArticleClaim_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE)');

S.push('CREATE TABLE "PricingData" ("id" TEXT NOT NULL PRIMARY KEY, "facilityId" TEXT NOT NULL, "pricingType" TEXT NOT NULL, "serviceLevel" TEXT, "pricePerRackMw" DOUBLE PRECISION, "rackDensityKw" DOUBLE PRECISION, "minimumCommitmentKw" DOUBLE PRECISION, "pricePerSqM" DOUBLE PRECISION, "pricePerCabinet" DOUBLE PRECISION, "crossConnectPrice" DOUBLE PRECISION, "currency" TEXT NOT NULL DEFAULT ' + "'USD'" + ', "validFrom" TEXT NOT NULL, "validUntil" TEXT, "isPublic" BOOLEAN NOT NULL DEFAULT false, "dataSource" TEXT, "dataConfidence" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PricingData_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE)');
S.push('CREATE INDEX "PricingData_facilityId_idx" ON "PricingData"("facilityId")');
S.push('CREATE INDEX "PricingData_pricingType_idx" ON "PricingData"("pricingType")');

S.push('CREATE TABLE "OutageReport" ("id" TEXT NOT NULL PRIMARY KEY, "facilityId" TEXT, "outageType" TEXT NOT NULL, "severity" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "status" TEXT NOT NULL DEFAULT ' + "'Investigating'" + ', "startedAt" TEXT NOT NULL, "resolvedAt" TEXT, "durationMinutes" INTEGER, "affectedServices" TEXT, "impactDescription" TEXT, "customersAffected" INTEGER, "rootCause" TEXT, "resolution" TEXT, "reportedBy" TEXT, "isVerified" BOOLEAN NOT NULL DEFAULT false, "verificationSource" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "OutageReport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE)');
S.push('CREATE INDEX "OutageReport_facilityId_idx" ON "OutageReport"("facilityId")');
S.push('CREATE INDEX "OutageReport_status_idx" ON "OutageReport"("status")');
S.push('CREATE INDEX "OutageReport_severity_idx" ON "OutageReport"("severity")');
S.push('CREATE INDEX "OutageReport_startedAt_idx" ON "OutageReport"("startedAt")');

S.push('CREATE TABLE "EnergyMetric" ("id" TEXT NOT NULL PRIMARY KEY, "facilityId" TEXT NOT NULL, "measurementDate" TEXT NOT NULL, "reportingPeriod" TEXT, "totalPowerMwh" DOUBLE PRECISION, "itPowerMwh" DOUBLE PRECISION, "coolingPowerMwh" DOUBLE PRECISION, "pue" DOUBLE PRECISION, "wue" DOUBLE PRECISION, "cue" DOUBLE PRECISION, "renewablePercentage" DOUBLE PRECISION, "renewableSource" TEXT, "onSiteGenerationMwh" DOUBLE PRECISION, "carbonTonnesCO2" DOUBLE PRECISION, "carbonOffset" DOUBLE PRECISION, "isAudited" BOOLEAN NOT NULL DEFAULT false, "auditStandard" TEXT, "dataSource" TEXT, "dataConfidence" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "EnergyMetric_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE)');
S.push('CREATE INDEX "EnergyMetric_facilityId_idx" ON "EnergyMetric"("facilityId")');
S.push('CREATE INDEX "EnergyMetric_measurementDate_idx" ON "EnergyMetric"("measurementDate")');
S.push('CREATE INDEX "EnergyMetric_pue_idx" ON "EnergyMetric"("pue")');

S.push('CREATE TABLE "Tenant" ("id" TEXT NOT NULL PRIMARY KEY, "facilityId" TEXT NOT NULL, "tenantName" TEXT, "tenantType" TEXT NOT NULL, "industry" TEXT, "presenceType" TEXT NOT NULL, "rackCount" INTEGER, "powerCommitmentKw" DOUBLE PRECISION, "floorSpaceSqM" INTEGER, "moveInDate" TEXT, "contractLengthMonths" INTEGER, "expansionPlanned" BOOLEAN NOT NULL DEFAULT false, "isAnchorTenant" BOOLEAN NOT NULL DEFAULT false, "isHyperscaler" BOOLEAN NOT NULL DEFAULT false, "isPublic" BOOLEAN NOT NULL DEFAULT false, "dataSource" TEXT, "dataConfidence" TEXT NOT NULL DEFAULT ' + "'Medium'" + ', "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Tenant_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE)');
S.push('CREATE INDEX "Tenant_facilityId_idx" ON "Tenant"("facilityId")');
S.push('CREATE INDEX "Tenant_tenantType_idx" ON "Tenant"("tenantType")');
S.push('CREATE INDEX "Tenant_isHyperscaler_idx" ON "Tenant"("isHyperscaler")');

S.push('CREATE TABLE "JobPosting" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "company" TEXT NOT NULL, "companyId" TEXT, "location" TEXT NOT NULL, "locationType" TEXT NOT NULL DEFAULT ' + "'On-site'" + ', "facilityId" TEXT, "jobType" TEXT NOT NULL DEFAULT ' + "'Full-time'" + ', "experienceLevel" TEXT NOT NULL DEFAULT ' + "'Mid-level'" + ', "department" TEXT, "salaryMin" INTEGER, "salaryMax" INTEGER, "salaryCurrency" TEXT NOT NULL DEFAULT ' + "'USD'" + ', "salaryPeriod" TEXT NOT NULL DEFAULT ' + "'yearly'" + ', "description" TEXT NOT NULL DEFAULT ' + "''" + ', "requirements" TEXT, "benefits" TEXT, "applicationUrl" TEXT, "applicationEmail" TEXT, "applicationDeadline" TEXT, "status" TEXT NOT NULL DEFAULT ' + "'Active'" + ', "isFeatured" BOOLEAN NOT NULL DEFAULT false, "postedDate" TEXT NOT NULL, "expirationDate" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "JobPosting_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE)');
S.push('CREATE INDEX "JobPosting_status_idx" ON "JobPosting"("status")');
S.push('CREATE INDEX "JobPosting_jobType_idx" ON "JobPosting"("jobType")');
S.push('CREATE INDEX "JobPosting_experienceLevel_idx" ON "JobPosting"("experienceLevel")');
S.push('CREATE INDEX "JobPosting_postedDate_idx" ON "JobPosting"("postedDate")');
S.push('CREATE INDEX "JobPosting_facilityId_idx" ON "JobPosting"("facilityId")');

S.push('CREATE TABLE "Report" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "subtitle" TEXT, "executiveSummary" TEXT, "fullContent" TEXT, "pageCount" INTEGER, "reportType" TEXT NOT NULL DEFAULT ' + "'Market Research'" + ', "topic" TEXT, "regions" TEXT, "priceUsd" DOUBLE PRECISION, "isFree" BOOLEAN NOT NULL DEFAULT false, "accessLevel" TEXT NOT NULL DEFAULT ' + "'Premium'" + ', "publishedDate" TEXT NOT NULL, "updatedDate" TEXT, "version" TEXT NOT NULL DEFAULT ' + "'1.0'" + ', "authors" TEXT, "sponsor" TEXT, "downloadCount" INTEGER NOT NULL DEFAULT 0, "viewCount" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT ' + "'Draft'" + ', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');
S.push('CREATE INDEX "Report_status_idx" ON "Report"("status")');
S.push('CREATE INDEX "Report_reportType_idx" ON "Report"("reportType")');
S.push('CREATE INDEX "Report_publishedDate_idx" ON "Report"("publishedDate")');

S.push('CREATE TABLE "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT, "name" TEXT, "company" TEXT, "jobTitle" TEXT, "country" TEXT, "subscriptionTier" TEXT NOT NULL DEFAULT ' + "'Free'" + ', "subscriptionStart" TEXT, "subscriptionEnd" TEXT, "isAdmin" BOOLEAN NOT NULL DEFAULT false, "isVerified" BOOLEAN NOT NULL DEFAULT false, "lastLoginAt" TEXT, "loginCount" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)');
S.push('CREATE INDEX "User_email_idx" ON "User"("email")');
S.push('CREATE INDEX "User_subscriptionTier_idx" ON "User"("subscriptionTier")');

S.push('CREATE TABLE "ApiToken" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "name" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "tokenPrefix" TEXT NOT NULL, "scope" TEXT NOT NULL DEFAULT ' + "'read'" + ', "rateLimitPerMinute" INTEGER NOT NULL DEFAULT 60, "lastUsedAt" TEXT, "requestCount" INTEGER NOT NULL DEFAULT 0, "expiresAt" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)');
S.push('CREATE INDEX "ApiToken_userId_idx" ON "ApiToken"("userId")');
S.push('CREATE INDEX "ApiToken_isActive_idx" ON "ApiToken"("isActive")');

S.push('CREATE TABLE "_prisma_migrations" ("id" VARCHAR(36) NOT NULL PRIMARY KEY, "checksum" VARCHAR(64) NOT NULL, "finished_at" TIMESTAMP(3), "migration_name" VARCHAR(255) NOT NULL, "logs" TEXT, "rolled_back_at" TIMESTAMP(3), "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "applied_steps_count" INTEGER NOT NULL DEFAULT 0)');

async function main() {
  console.log('Pushing ' + S.length + ' statements...');
  var ok = 0, fail = 0;
  for (var i = 0; i < S.length; i++) {
    try { await pool.query(S[i]); ok++; }
    catch (e) {
      var msg = e && e.message ? e.message : String(e);
      if (msg.indexOf('already exists') >= 0) { ok++; }
      else { console.error('FAIL [' + i + ']: ' + msg.slice(0, 200)); fail++; }
    }
  }
  console.log('\nDone: ' + ok + ' ok, ' + fail + ' failed');
  var r = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
  console.log('Tables (' + r.rows.length + '):');
  r.rows.forEach(function(t) { console.log('  - ' + t.tablename); });
  await pool.end();
}
main().catch(function(e) { console.error('Fatal:', e.message || e); });
