-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Operational',
    "address" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Nairobi',
    "region" TEXT NOT NULL DEFAULT 'Nairobi County',
    "coordinates" TEXT,
    "itLoadMw" REAL,
    "totalCapacityMw" REAL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facility_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "hqCountry" TEXT NOT NULL DEFAULT 'Kenya',
    "parentCompany" TEXT,
    "website" TEXT,
    "type" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConnectivityProvider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ConnectivityProviderFacility" (
    "facilityId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,

    PRIMARY KEY ("facilityId", "providerId"),
    CONSTRAINT "ConnectivityProviderFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConnectivityProviderFacility_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ConnectivityProvider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FacilityCertification" (
    "facilityId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,

    PRIMARY KEY ("facilityId", "certificationId"),
    CONSTRAINT "FacilityCertification_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacilityCertification_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claim" TEXT NOT NULL,
    "source" TEXT,
    "sourceTitle" TEXT,
    "verifiedDate" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'Medium',
    "notes" TEXT,
    "articleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ArticleClaim_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricingData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "pricingType" TEXT NOT NULL,
    "serviceLevel" TEXT,
    "pricePerRackMw" REAL,
    "rackDensityKw" REAL,
    "minimumCommitmentKw" REAL,
    "pricePerSqM" REAL,
    "pricePerCabinet" REAL,
    "crossConnectPrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "validFrom" TEXT NOT NULL,
    "validUntil" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT,
    "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PricingData_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OutageReport" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OutageReport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnergyMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "measurementDate" TEXT NOT NULL,
    "reportingPeriod" TEXT,
    "totalPowerMwh" REAL,
    "itPowerMwh" REAL,
    "coolingPowerMwh" REAL,
    "pue" REAL,
    "wue" REAL,
    "cue" REAL,
    "renewablePercentage" REAL,
    "renewableSource" TEXT,
    "onSiteGenerationMwh" REAL,
    "carbonTonnesCO2" REAL,
    "carbonOffset" REAL,
    "isAudited" BOOLEAN NOT NULL DEFAULT false,
    "auditStandard" TEXT,
    "dataSource" TEXT,
    "dataConfidence" TEXT NOT NULL DEFAULT 'Medium',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnergyMetric_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "tenantName" TEXT,
    "tenantType" TEXT NOT NULL,
    "industry" TEXT,
    "presenceType" TEXT NOT NULL,
    "rackCount" INTEGER,
    "powerCommitmentKw" REAL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tenant_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobPosting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobPosting_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "executiveSummary" TEXT,
    "fullContent" TEXT,
    "pageCount" INTEGER,
    "reportType" TEXT NOT NULL DEFAULT 'Market Research',
    "topic" TEXT,
    "regions" TEXT,
    "priceUsd" REAL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ApiToken" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ApiToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");

-- CreateIndex
CREATE INDEX "Facility_city_idx" ON "Facility"("city");

-- CreateIndex
CREATE INDEX "Facility_status_idx" ON "Facility"("status");

-- CreateIndex
CREATE INDEX "Facility_operatorId_idx" ON "Facility"("operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_slug_key" ON "Operator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_cluster_idx" ON "Article"("cluster");

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex
CREATE INDEX "Article_cluster_sortOrder_idx" ON "Article"("cluster", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE INDEX "Subscriber_email_idx" ON "Subscriber"("email");

-- CreateIndex
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");

-- CreateIndex
CREATE INDEX "PricingData_facilityId_idx" ON "PricingData"("facilityId");

-- CreateIndex
CREATE INDEX "PricingData_pricingType_idx" ON "PricingData"("pricingType");

-- CreateIndex
CREATE INDEX "OutageReport_facilityId_idx" ON "OutageReport"("facilityId");

-- CreateIndex
CREATE INDEX "OutageReport_status_idx" ON "OutageReport"("status");

-- CreateIndex
CREATE INDEX "OutageReport_severity_idx" ON "OutageReport"("severity");

-- CreateIndex
CREATE INDEX "OutageReport_startedAt_idx" ON "OutageReport"("startedAt");

-- CreateIndex
CREATE INDEX "EnergyMetric_facilityId_idx" ON "EnergyMetric"("facilityId");

-- CreateIndex
CREATE INDEX "EnergyMetric_measurementDate_idx" ON "EnergyMetric"("measurementDate");

-- CreateIndex
CREATE INDEX "EnergyMetric_pue_idx" ON "EnergyMetric"("pue");

-- CreateIndex
CREATE INDEX "Tenant_facilityId_idx" ON "Tenant"("facilityId");

-- CreateIndex
CREATE INDEX "Tenant_tenantType_idx" ON "Tenant"("tenantType");

-- CreateIndex
CREATE INDEX "Tenant_isHyperscaler_idx" ON "Tenant"("isHyperscaler");

-- CreateIndex
CREATE UNIQUE INDEX "JobPosting_slug_key" ON "JobPosting"("slug");

-- CreateIndex
CREATE INDEX "JobPosting_status_idx" ON "JobPosting"("status");

-- CreateIndex
CREATE INDEX "JobPosting_jobType_idx" ON "JobPosting"("jobType");

-- CreateIndex
CREATE INDEX "JobPosting_experienceLevel_idx" ON "JobPosting"("experienceLevel");

-- CreateIndex
CREATE INDEX "JobPosting_postedDate_idx" ON "JobPosting"("postedDate");

-- CreateIndex
CREATE INDEX "JobPosting_facilityId_idx" ON "JobPosting"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "Report"("reportType");

-- CreateIndex
CREATE INDEX "Report_publishedDate_idx" ON "Report"("publishedDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_subscriptionTier_idx" ON "User"("subscriptionTier");

-- CreateIndex
CREATE INDEX "ApiToken_userId_idx" ON "ApiToken"("userId");

-- CreateIndex
CREATE INDEX "ApiToken_isActive_idx" ON "ApiToken"("isActive");
