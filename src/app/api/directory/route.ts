import { NextRequest, NextResponse } from 'next/server';
import {
  getFacilities, getFilterMeta, getDirectoryStats,
  facilityCountry, STATUS_ORDER, type FacilityStatus,
} from '@/lib/directory-data';

const r1 = (n: number) => Math.round(n * 10) / 10;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').slice(0, 100);
  const status = searchParams.get('status') || '';
  const city = searchParams.get('city') || '';
  const country = searchParams.get('country') || '';
  const operator = searchParams.get('operator') || '';
  const facilityType = searchParams.get('type') || '';
  const aiReady = searchParams.get('aiReady') || '';
  const tab = searchParams.get('tab') || 'all';
  const sortBy = searchParams.get('sortBy') || 'itLoadMw';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  let results = getFacilities();

  // Tab scope first (audit: Kenya / East Africa / Pipeline views). The
  // pipeline scope is Kenya-only on purpose: it stays numerically
  // consistent with the canonical "Announced pipeline (MW)" label.
  if (tab === 'kenya') results = results.filter((f) => facilityCountry(f) === 'Kenya');
  if (tab === 'ea') results = results.filter((f) => facilityCountry(f) !== 'Kenya');
  if (tab === 'pipeline') {
    results = results.filter(
      (f) => facilityCountry(f) === 'Kenya' && f.status !== 'Operational'
    );
  }

  // Scope-level stats, computed before the narrower user filters so the
  // stat strip stays stable while someone searches or narrows a tab.
  const scopeStats = {
    count: results.length,
    operational: results.filter((f) => f.status === 'Operational').length,
    underConstruction: results.filter((f) => f.status === 'Under Construction').length,
    committed: results.filter((f) => f.status === 'Committed').length,
    earlyStage: results.filter((f) => f.status === 'Early Stage').length,
    publishedItLoadMw: r1(results.reduce((s, f) => s + (f.itLoadMw || 0), 0)),
    // Two distinct capacity sums, never blended (audit rule): designed =
    // built, operational facilities; announced = pipeline stages only.
    designedMw: r1(results.filter((f) => f.status === 'Operational').reduce((s, f) => s + (f.totalCapacityMw || 0), 0)),
    announcedMw: r1(results.filter((f) => f.status !== 'Operational').reduce((s, f) => s + (f.totalCapacityMw || 0), 0)),
    racks: results.reduce((s, f) => s + (f.rackCount || 0), 0),
    aiReady: results.filter((f) => f.aiReady).length,
    carrierNeutral: results.filter((f) => f.carrierNeutral === true).length,
    countries: [...new Set(results.map(facilityCountry))].sort(),
    operators: new Set(results.map((f) => f.operator.name)).size,
  };

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
  if (country && country !== 'all') results = results.filter((f) => (f.country || 'Kenya') === country);
  if (operator && operator !== 'all') results = results.filter((f) => f.operatorId === operator);
  if (facilityType && facilityType !== 'all') results = results.filter((f) => f.facilityType === facilityType);
  if (aiReady === 'true') results = results.filter((f) => f.aiReady);

  // Sort. "stage" orders by the investment-standard pipeline sequence
  // (Under Construction -> Committed -> Early Stage), then designed MW.
  results.sort((a, b) => {
    if (sortBy === 'stage') {
      const idx = (s: string) => STATUS_ORDER.indexOf(s as FacilityStatus);
      const d = idx(a.status) - idx(b.status);
      if (d !== 0) return d;
      return (b.totalCapacityMw || 0) - (a.totalCapacityMw || 0);
    }
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
    scopeStats,
    tab,
  });
}
