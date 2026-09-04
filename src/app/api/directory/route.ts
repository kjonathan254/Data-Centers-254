import { NextRequest, NextResponse } from 'next/server';
import { getFacilities, getFilterMeta, getDirectoryStats } from '@/lib/directory-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').slice(0, 100);
  const status = searchParams.get('status') || '';
  const city = searchParams.get('city') || '';
  const operator = searchParams.get('operator') || '';
  const facilityType = searchParams.get('type') || '';
  const aiReady = searchParams.get('aiReady') || '';
  const sortBy = searchParams.get('sortBy') || 'itLoadMw';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  let results = getFacilities();

  // Filter
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      (f.description || '').toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q) ||
      (f.notable || '').toLowerCase().includes(q) ||
      f.operator.name.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'all') results = results.filter((f) => f.status === status);
  if (city && city !== 'all') results = results.filter((f) => f.city === city);
  if (operator && operator !== 'all') results = results.filter((f) => f.operatorId === operator);
  if (facilityType && facilityType !== 'all') results = results.filter((f) => f.facilityType === facilityType);
  if (aiReady === 'true') results = results.filter((f) => f.aiReady);

  // Sort
  results.sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'name') return dir * a.name.localeCompare(b.name);
    const aVal = a[sortBy as keyof typeof a] as number | null;
    const bVal = b[sortBy as keyof typeof b] as number | null;
    return dir * ((aVal || 0) - (bVal || 0));
  });

  return NextResponse.json({
    facilities: results,
    filters: getFilterMeta(),
    stats: getDirectoryStats(),
  });
}
