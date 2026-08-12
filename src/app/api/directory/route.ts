import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const city = searchParams.get('city') || '';
  const operator = searchParams.get('operator') || '';
  const facilityType = searchParams.get('type') || '';
  const aiReady = searchParams.get('aiReady') || '';
  const sortBy = searchParams.get('sortBy') || 'itLoadMw';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { city: { contains: search } },
      { notable: { contains: search } },
    ];
  }
  if (status && status !== 'all') {
    where.status = status;
  }
  if (city && city !== 'all') {
    where.city = city;
  }
  if (operator && operator !== 'all') {
    where.operatorId = operator;
  }
  if (facilityType && facilityType !== 'all') {
    where.facilityType = facilityType;
  }
  if (aiReady === 'true') {
    where.aiReady = true;
  }

  const orderBy: Record<string, string> = {};
  if (sortBy === 'name') {
    orderBy.name = sortOrder;
  } else if (sortBy === 'itLoadMw') {
    orderBy.itLoadMw = sortOrder;
  } else if (sortBy === 'rackCount') {
    orderBy.rackCount = sortOrder;
  } else if (sortBy === 'openedDate') {
    orderBy.openedDate = sortOrder;
  } else {
    orderBy.itLoadMw = sortOrder;
  }

  try {
    const facilities = await db.facility.findMany({
      where,
      orderBy,
      include: {
        operator: { select: { name: true, slug: true, type: true, parentCompany: true } },
        connectivityFacility: {
          include: {
            provider: { select: { name: true, type: true } },
          },
        },
        certifications: {
          include: {
            certification: { select: { name: true, type: true } },
          },
        },
      },
    });

    // Filter metadata for the UI
    const operators = await db.operator.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    const statuses = await db.facility.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const cities = await db.facility.groupBy({ by: ['city'] });

    const types = await db.facility.groupBy({ by: ['facilityType'] });

    // Summary stats
    const totalFacilities = await db.facility.count();
    const operationalCount = await db.facility.count({ where: { status: 'Operational' } });
    const totalMw = await db.facility.aggregate({
      where: { itLoadMw: { not: null } },
      _sum: { itLoadMw: true },
    });
    const totalRacks = await db.facility.aggregate({
      where: { rackCount: { not: null } },
      _sum: { rackCount: true },
    });
    const aiReadyCount = await db.facility.count({ where: { aiReady: true } });

    return NextResponse.json({
      facilities,
      filters: {
        operators,
        statuses: statuses.map((s) => ({ value: s.status, count: s._count.status })),
        cities: cities.map((c) => c.city),
        types: types.map((t) => t.facilityType).filter(Boolean),
      },
      stats: {
        totalFacilities,
        operationalCount,
        totalMw: totalMw._sum.itLoadMw || 0,
        totalRacks: totalRacks._sum.rackCount || 0,
        aiReadyCount,
      },
    });
  } catch (error) {
    console.error('Directory API error:', error);
    return NextResponse.json({ error: 'Failed to fetch directory data' }, { status: 500 });
  }
}
