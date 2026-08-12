import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('Seeding Kenya DC Directory...');

  // ── Operators ──────────────────────────────────────────────
  const ixAfrica = await db.operator.create({
    data: {
      name: 'iXAfrica Data Centres',
      slug: 'ixafrica',
      description:
        'East Africa\'s leading carrier-neutral data centre operator. First to achieve Uptime Institute Tier III design certification in the region. Partners with Oracle Cloud for Kenya\'s first public cloud region.',
      hqCountry: 'Kenya',
      website: 'https://ixafrica.com',
      type: 'DC Operator',
    },
  });

  const africaDC = await db.operator.create({
    data: {
      name: 'Africa Data Centres',
      slug: 'africa-data-centres',
      description:
        'Africa\'s largest network of interconnected, carrier-neutral, cloud-ready data centres. Subsidiary of Liquid Intelligent Technologies (Cassava Technologies). Operates facilities across 10+ African countries.',
      hqCountry: 'South Africa',
      parentCompany: 'Liquid Intelligent Technologies / Cassava Technologies',
      website: 'https://africadatacentres.com',
      type: 'DC Operator',
    },
  });

  const paix = await db.operator.create({
    data: {
      name: 'PAIX Data Centres',
      slug: 'paix',
      description:
        'Pan-African data centre operator owned by Teraco (Digital Realty). Operates carrier-neutral facilities in multiple African countries including Kenya.',
      hqCountry: 'South Africa',
      parentCompany: 'Teraco / Digital Realty',
      website: 'https://paix.cloud',
      type: 'DC Operator',
    },
  });

  const safaricom = await db.operator.create({
    data: {
      name: 'Safaricom',
      slug: 'safaricom',
      description:
        'Kenya\'s largest telecommunications operator. Owns and operates the M-Pesa mobile money platform. Building data centre infrastructure to support its network, enterprise services, and cloud ambitions.',
      hqCountry: 'Kenya',
      website: 'https://www.safaricom.co.ke',
      type: 'Telco',
    },
  });

  const seacom = await db.operator.create({
    data: {
      name: 'SEACOM',
      slug: 'seacom',
      description:
        'Pan-African connectivity and data centre provider. Owns and operates the SEACOM subsea cable system and offers data centre services in multiple East African markets.',
      hqCountry: 'Mauritius',
      website: 'https://seacom.com',
      type: 'DC Operator',
    },
  });

  // ── Connectivity Providers ─────────────────────────────────
  const teams = await db.connectivityProvider.create({
    data: { name: 'TEAMS', type: 'Subsea Cable', description: 'The East African Marine System. Kenya\'s first dedicated undersea cable, landing in Mombasa since 2009. Government-backed with private investors.' },
  });
  const eassy = await db.connectivityProvider.create({
    data: { name: 'EASSy', type: 'Subsea Cable', description: 'Eastern Africa Submarine Cable System. Runs along the East African coast from South Africa to Sudan via Mombasa.' },
  });
  const seamewe5 = await db.connectivityProvider.create({
    data: { name: 'SEA-ME-WE 5', type: 'Subsea Cable', description: 'South East Asia-Middle East-Western Europe 5. One of the world\'s longest submarine cable systems at 20,000km. Lands in Mombasa.' },
  });
  const dare1 = await db.connectivityProvider.create({
    data: { name: 'DARE1', type: 'Subsea Cable', description: 'Djibouti Africa Regional Express 1. Connects Djibouti to Mombasa and South Africa.' },
  });
  const liquidFibre = await db.connectivityProvider.create({
    data: { name: 'Liquid Intelligent Technologies', type: 'Fibre Operator', description: 'Africa\'s largest independent fibre network operator. Over 100,000km of fibre across 15+ African countries.' },
  });
  const safaricomFibre = await db.connectivityProvider.create({
    data: { name: 'Safaricom Fibre', type: 'Fibre Operator', description: 'Kenya\'s largest telecom operator with extensive fibre and microwave backhaul nationwide.' },
  });
  const kixp = await db.connectivityProvider.create({
    data: { name: 'KIXP', type: 'IXP', description: 'Kenya Internet Exchange Point. Operated by TESPOK. Allows local internet traffic to stay local, reducing latency and cost.' },
  });
  const oracle = await db.connectivityProvider.create({
    data: { name: 'Oracle Cloud', type: 'Cloud On-Ramp', description: 'Oracle Cloud Infrastructure (OCI). Kenya\'s first public cloud region, hosted at iXAfrica Nairobi as of January 2026.' },
  });
  const aws = await db.connectivityProvider.create({
    data: { name: 'AWS Direct Connect', type: 'Cloud On-Ramp', description: 'Amazon Web Services. Nearest regions: Cape Town (South Africa), Frankfurt (Germany). No local region in Kenya yet.' },
  });
  const azure = await db.connectivityProvider.create({
    data: { name: 'Microsoft Azure', type: 'Cloud On-Ramp', description: 'Microsoft Azure ExpressRoute. No local region in Kenya. Microsoft-G42 $1B project (stalled as of May 2026) was planned to deliver one.' },
  });
  const google = await db.connectivityProvider.create({
    data: { name: 'Google Cloud', type: 'Cloud On-Ramp', description: 'Google Cloud Interconnect. No local region in Kenya. Nearest region: Johannesburg (South Africa).' },
  });
  const cloudflare = await db.connectivityProvider.create({
    data: { name: 'Cloudflare', type: 'CDN', description: 'Content delivery network and security provider. Has a point of presence in Mombasa serving East Africa.' },
  });
  const jamii = await db.connectivityProvider.create({
    data: { name: 'Jamii Telecommunications', type: 'Fibre Operator', description: 'Kenyan fibre and internet service provider. Operates metro fibre networks in Nairobi and other towns.' },
  });

  // ── Certifications ─────────────────────────────────────────
  const tier3Design = await db.certification.create({
    data: { name: 'Tier III Design Certification', type: 'Design', description: 'Uptime Institute Tier III Design certification. The facility is designed for concurrently maintainable infrastructure.' },
  });
  const iso27001 = await db.certification.create({
    data: { name: 'ISO 27001', type: 'Security', description: 'International standard for information security management systems.' },
  });
  const iso9001 = await db.certification.create({
    data: { name: 'ISO 9001', type: 'Operational', description: 'International standard for quality management systems.' },
  });
  const iso22301 = await db.certification.create({
    data: { name: 'ISO 22301', type: 'Operational', description: 'International standard for business continuity management systems.' },
  });
  const soc2 = await db.certification.create({
    data: { name: 'SOC 2 Type II', type: 'Security', description: 'Service Organization Control Type II audit report. Demonstrates compliance with security, availability, processing integrity, confidentiality, and privacy.' },
  });

  // ── Facilities ─────────────────────────────────────────────

  // 1. iXAfrica NBOX1
  const nbox1 = await db.facility.create({
    data: {
      name: 'NBOX1',
      slug: 'ixafrica-nbox1',
      description: 'iXAfrica\'s flagship facility. East Africa\'s first Tier III design-certified data centre. Hosts Kenya\'s first public cloud region (Oracle OCI, January 2026). AI-ready infrastructure with high-density rack support.',
      status: 'Operational',
      address: 'Tilisi, Kiambu County (near Nairobi)',
      city: 'Nairobi',
      region: 'Kiambu County',
      itLoadMw: 4.5,
      totalCapacityMw: 4.5,
      rackCount: 780,
      occupiedRacks: null,
      tierRating: 'Tier III (Design Certified)',
      facilityType: 'Colocation',
      aiReady: true,
      openedDate: '2025-03',
      coolingType: 'Air',
      powerSource: 'Grid (Kenya\'s predominantly renewable grid)',
      renewableClaim: 'Powered by Kenya\'s predominantly renewable grid (~90% renewable energy mix including geothermal, hydro, wind, and solar)',
      notable: 'East Africa\'s first Uptime Institute Tier III Design certified facility. Hosts Oracle Cloud Infrastructure — Kenya\'s first public cloud region (January 2026).',
      lastVerified: '2026-08',
      dataSource: 'iXAfrica official website, Oracle press release (January 2026)',
      dataConfidence: 'High',
      operatorId: ixAfrica.id,
    },
  });

  // 2. iXAfrica NBOX1.2
  const nbox12 = await db.facility.create({
    data: {
      name: 'NBOX1.2',
      slug: 'ixafrica-nbox1-2',
      description: 'Major expansion adjacent to NBOX1. Designed for significantly higher capacity with AI-ready high-density rack infrastructure. Under construction as of 2026.',
      status: 'Under Construction',
      address: 'Tilisi, Kiambu County (adjacent to NBOX1)',
      city: 'Nairobi',
      region: 'Kiambu County',
      itLoadMw: 18,
      totalCapacityMw: 18,
      rackCount: 3744,
      occupiedRacks: null,
      tierRating: 'Tier III (Designed)',
      facilityType: 'Colocation',
      aiReady: true,
      expansionDate: '2027',
      coolingType: 'Air (AI-ready liquid cooling capable)',
      powerSource: 'Grid (Kenya\'s predominantly renewable grid)',
      renewableClaim: 'Designed to leverage Kenya\'s predominantly renewable grid',
      notable: '18MW IT load with 3,744 racks. Adjacent to NBOX1, creating a combined campus. Designed for AI and high-density workloads.',
      lastVerified: '2026-08',
      dataSource: 'iXAfrica official website, industry reports',
      dataConfidence: 'High',
      operatorId: ixAfrica.id,
    },
  });

  // 3. iXAfrica Tilisi Second Campus (Planned)
  const tilisi2 = await db.facility.create({
    data: {
      name: 'Tilisi Second Campus',
      slug: 'ixafrica-tilisi-second-campus',
      description: 'Planned mega-campus on 11 acres at Tilisi. Would be one of the largest data centre campuses in Africa when fully built. Designed for hyperscale and AI workloads.',
      status: 'Planned',
      address: 'Tilisi, Kiambu County (second site)',
      city: 'Nairobi',
      region: 'Kiambu County',
      itLoadMw: 53,
      totalCapacityMw: 53,
      rackCount: null,
      occupiedRacks: null,
      tierRating: 'Tier III (Planned)',
      facilityType: 'Colocation',
      aiReady: true,
      expansionDate: null,
      coolingType: 'Air + Liquid (Planned)',
      powerSource: 'Grid (Dedicated power infrastructure required)',
      renewableClaim: 'Intended to leverage Kenya\'s renewable grid. Will require dedicated power allocation.',
      notable: '53MW+ planned capacity on 11 acres. If built at full scale, would rank among Africa\'s largest data centre campuses.',
      lastVerified: '2026-08',
      dataSource: 'iXAfrica official website, press releases',
      dataConfidence: 'Medium',
      operatorId: ixAfrica.id,
    },
  });

  // 4. Africa Data Centres Nairobi (Garden City)
  const adcGardenCity = await db.facility.create({
    data: {
      name: 'ADC Nairobi (Garden City)',
      slug: 'africa-data-centres-nairobi-garden-city',
      description: 'Africa Data Centres\' flagship East African facility. One of the first Tier III data centres in the region. Located at Garden City Mall along Thika Road.',
      status: 'Operational',
      address: 'Garden City Mall, Thika Road, Nairobi',
      city: 'Nairobi',
      region: 'Nairobi County',
      itLoadMw: null,
      totalCapacityMw: null,
      rackCount: null,
      occupiedRacks: null,
      tierRating: 'Tier III',
      facilityType: 'Colocation',
      aiReady: false,
      openedDate: '2019',
      coolingType: 'Air',
      powerSource: 'Grid (Kenya\'s predominantly renewable grid)',
      renewableClaim: 'Part of Africa Data Centres\' sustainability strategy. Kenya\'s renewable grid provides green credentials.',
      notable: 'One of East Africa\'s first Tier III data centres. Strategically located along Thika Road corridor.',
      lastVerified: '2026-08',
      dataSource: 'Africa Data Centres website, industry reports',
      dataConfidence: 'Medium',
      operatorId: africaDC.id,
    },
  });

  // 5. Africa Data Centres Nairobi (Second Facility)
  const adcNairobi2 = await db.facility.create({
    data: {
      name: 'ADC Nairobi (Westlands)',
      slug: 'africa-data-centres-nairobi-westlands',
      description: 'Africa Data Centres\' second Nairobi facility, expanding capacity in the Westlands area.',
      status: 'Operational',
      address: 'Westlands, Nairobi',
      city: 'Nairobi',
      region: 'Nairobi County',
      itLoadMw: null,
      totalCapacityMw: null,
      rackCount: null,
      occupiedRacks: null,
      tierRating: null,
      facilityType: 'Colocation',
      aiReady: false,
      openedDate: null,
      coolingType: null,
      powerSource: 'Grid',
      renewableClaim: null,
      notable: 'Part of ADC\'s expansion strategy in Nairobi.',
      lastVerified: '2026-08',
      dataSource: 'Africa Data Centres website',
      dataConfidence: 'Low',
      operatorId: africaDC.id,
    },
  });

  // 6. PAIX Nairobi
  const paixNairobi = await db.facility.create({
    data: {
      name: 'PAIX Nairobi',
      slug: 'paix-nairobi',
      description: 'Carrier-neutral data centre operated by PAIX (Teraco/Digital Realty). Provides colocation and interconnection services in Nairobi.',
      status: 'Operational',
      address: 'Nairobi',
      city: 'Nairobi',
      region: 'Nairobi County',
      itLoadMw: null,
      totalCapacityMw: null,
      rackCount: null,
      occupiedRacks: null,
      tierRating: null,
      facilityType: 'Colocation',
      aiReady: false,
      openedDate: null,
      coolingType: null,
      powerSource: 'Grid',
      renewableClaim: null,
      notable: 'Operated by PAIX, a Teraco (Digital Realty) company. Carrier-neutral facility.',
      lastVerified: '2026-08',
      dataSource: 'PAIX website',
      dataConfidence: 'Low',
      operatorId: paix.id,
    },
  });

  // 7. Safaricom Limuru
  const safaricomLimuru = await db.facility.create({
    data: {
      name: 'Safaricom Limuru Data Centre',
      slug: 'safaricom-limuru',
      description: 'Safaricom\'s purpose-built data centre in Limuru. Phase 1 completed March 2025. Designed primarily to support Safaricom\'s own network and enterprise services, with plans for colocation.',
      status: 'Operational',
      address: 'Limuru, Kiambu County',
      city: 'Limuru',
      region: 'Kiambu County',
      itLoadMw: null,
      totalCapacityMw: null,
      rackCount: null,
      occupiedRacks: null,
      tierRating: null,
      facilityType: 'Telco',
      aiReady: false,
      openedDate: '2025-03',
      expansionDate: null,
      coolingType: null,
      powerSource: 'Grid',
      renewableClaim: null,
      notable: 'Phase 1 complete March 2025. Phase 2 planned with 2.8MW IT capacity. Safaricom also partnered with iXAfrica for East Africa\'s first AI-ready enterprise infrastructure (May 2025).',
      lastVerified: '2026-08',
      dataSource: 'Safaricom press releases, industry reports',
      dataConfidence: 'Medium',
      operatorId: safaricom.id,
    },
  });

  // 8. Microsoft-G42 (Announced/Stalled)
  const msG42 = await db.facility.create({
    data: {
      name: 'Microsoft-G42 AI Data Centre',
      slug: 'microsoft-g42-ai-data-centre',
      description: 'Announced $1 billion investment by Microsoft and G42 (May 2024). Planned as a 100MW AI-focused facility powered entirely by geothermal energy from Olkaria. As of May 2026, the project has stalled due to power allocation constraints and disagreements over payment terms.',
      status: 'Announced',
      address: 'Olkaria, Naivasha (planned location)',
      city: 'Naivasha',
      region: 'Nakuru County',
      itLoadMw: 100,
      totalCapacityMw: 100,
      rackCount: null,
      occupiedRacks: null,
      tierRating: null,
      facilityType: 'Hyperscale',
      aiReady: true,
      expansionDate: null,
      coolingType: 'Liquid (Planned)',
      powerSource: 'Geothermal (Olkaria) — planned, not secured',
      renewableClaim: 'Designed to be 100% geothermal-powered. Power allocation from Olkaria geothermal field was not secured as of May 2026.',
      notable: 'This project exposed Kenya\'s power infrastructure as the primary constraint on hyperscale data centre investment. Reuters (May 2026) reported difficulties over payment/capacity arrangements. Kenya\'s government stated discussions are ongoing.',
      lastVerified: '2026-08',
      dataSource: 'Reuters (May 2026), Kenya government statements, Microsoft/G42 press releases',
      dataConfidence: 'High',
      operatorId: safaricom.id,
    },
  });

  // ── Connectivity-Provider links ────────────────────────────
  // iXAfrica NBOX1 connectivity
  const nbox1Providers = [teams, eassy, seamewe5, dare1, liquidFibre, safaricomFibre, kixp, oracle, aws, azure, google, cloudflare, jamii];
  for (const p of nbox1Providers) {
    await db.connectivityProviderFacility.create({ data: { facilityId: nbox1.id, providerId: p.id } });
  }

  // NBOX1.2 same connectivity (same campus)
  for (const p of nbox1Providers) {
    await db.connectivityProviderFacility.create({ data: { facilityId: nbox12.id, providerId: p.id } });
  }

  // Tilisi planned campus
  for (const p of [teams, eassy, seamewe5, dare1, liquidFibre, safaricomFibre, kixp]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: tilisi2.id, providerId: p.id } });
  }

  // ADC Garden City
  for (const p of [teams, eassy, seamewe5, dare1, liquidFibre, safaricomFibre, kixp, aws, azure, google]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: adcGardenCity.id, providerId: p.id } });
  }

  // ADC Westlands
  for (const p of [teams, eassy, liquidFibre, safaricomFibre, kixp]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: adcNairobi2.id, providerId: p.id } });
  }

  // PAIX Nairobi
  for (const p of [teams, eassy, seamewe5, dare1, liquidFibre, safaricomFibre, kixp]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: paixNairobi.id, providerId: p.id } });
  }

  // Safaricom Limuru
  for (const p of [teams, eassy, liquidFibre, safaricomFibre, kixp]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: safaricomLimuru.id, providerId: p.id } });
  }

  // Microsoft-G42
  for (const p of [teams, eassy, seamewe5]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: msG42.id, providerId: p.id } });
  }

  // 9. SEACOM Mombasa
  const seacomMombasa = await db.facility.create({
    data: {
      name: 'SEACOM Mombasa Data Centre',
      slug: 'seacom-mombasa',
      description: 'SEACOM\'s data centre facility in Mombasa. Proximity to the subsea cable landing station provides low-latency international connectivity. Supports SEACOM\'s carrier and enterprise services across East Africa.',
      status: 'Operational',
      address: 'Mombasa',
      city: 'Mombasa',
      region: 'Mombasa County',
      itLoadMw: null,
      totalCapacityMw: null,
      rackCount: null,
      occupiedRacks: null,
      tierRating: null,
      facilityType: 'Telco',
      aiReady: false,
      openedDate: null,
      coolingType: null,
      powerSource: 'Grid',
      renewableClaim: null,
      notable: 'Located near SEACOM\'s subsea cable landing station in Mombasa, offering direct access to international bandwidth. Part of SEACOM\'s integrated connectivity and infrastructure offering in East Africa.',
      lastVerified: '2026-08',
      dataSource: 'SEACOM website, industry reports',
      dataConfidence: 'Low',
      operatorId: seacom.id,
    },
  });

  // SEACOM Mombasa connectivity
  for (const p of [teams, eassy, seamewe5, dare1, kixp]) {
    await db.connectivityProviderFacility.create({ data: { facilityId: seacomMombasa.id, providerId: p.id } });
  }

  // ── Certifications ─────────────────────────────────────────
  // NBOX1
  await db.facilityCertification.create({ data: { facilityId: nbox1.id, certificationId: tier3Design.id } });
  await db.facilityCertification.create({ data: { facilityId: nbox1.id, certificationId: iso27001.id } });
  await db.facilityCertification.create({ data: { facilityId: nbox1.id, certificationId: iso9001.id } });
  await db.facilityCertification.create({ data: { facilityId: nbox1.id, certificationId: iso22301.id } });
  await db.facilityCertification.create({ data: { facilityId: nbox1.id, certificationId: soc2.id } });

  // ADC Garden City
  await db.facilityCertification.create({ data: { facilityId: adcGardenCity.id, certificationId: tier3Design.id } });
  await db.facilityCertification.create({ data: { facilityId: adcGardenCity.id, certificationId: iso27001.id } });

  // ── Summary ────────────────────────────────────────────────
  const facilityCount = await db.facility.count();
  const operatorCount = await db.operator.count();
  const providerCount = await db.connectivityProvider.count();
  const certCount = await db.certification.count();

  console.log(`\nSeeded successfully:`);
  console.log(`  ${operatorCount} operators`);
  console.log(`  ${facilityCount} facilities (${await db.facility.count({ where: { status: 'Operational' } })} operational, ${await db.facility.count({ where: { status: 'Under Construction' } })} under construction, ${await db.facility.count({ where: { status: 'Planned' } })} planned, ${await db.facility.count({ where: { status: 'Announced' } })} announced)`);
  console.log(`  ${providerCount} connectivity providers`);
  console.log(`  ${certCount} certification types`);

  const totalMw = await db.facility.aggregate({ where: { itLoadMw: { not: null } }, _sum: { itLoadMw: true } });
  console.log(`  ${totalMw._sum.itLoadMw?.toFixed(1) || 0} MW total IT load (across all statuses)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
