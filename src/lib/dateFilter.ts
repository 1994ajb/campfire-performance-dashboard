import { Deal, DashboardData, LeaderboardEntry, MonthlyRevenue, StackedMonthlyRevenue, DealDetail, AVATAR_HUES } from './types';
import type { DateRange } from '@/components/DateRangeFilter';

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();

  switch (range) {
    case 'ytd':
      return { start: new Date(year, 0, 1), end: now };
    case 'q1':
      return { start: new Date(year, 0, 1), end: new Date(year, 2, 31) };
    case 'q2':
      return { start: new Date(year, 3, 1), end: new Date(year, 5, 30) };
    case 'q3':
      return { start: new Date(year, 6, 1), end: new Date(year, 8, 30) };
    case 'q4':
      return { start: new Date(year, 9, 1), end: new Date(year, 11, 31) };
    case 'last30': {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      return { start, end: now };
    }
    case 'last90': {
      const start = new Date(now);
      start.setDate(start.getDate() - 90);
      return { start, end: now };
    }
  }
}

function filterDeals(deals: Deal[], range: DateRange): Deal[] {
  const { start, end } = getDateRange(range);
  return deals.filter(d => {
    const close = new Date(d.closeDate);
    return close >= start && close <= end;
  });
}

function rebuildLeaderboard(deals: Deal[]): LeaderboardEntry[] {
  const grouped = new Map<string, Deal[]>();
  for (const deal of deals) {
    const arr = grouped.get(deal.ownerId) || [];
    arr.push(deal);
    grouped.set(deal.ownerId, arr);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const entries: LeaderboardEntry[] = [];
  for (const [ownerId, ownerDeals] of grouped) {
    const total = ownerDeals.reduce((s, d) => s + d.amount, 0);
    const monthlyTotals = Array(12).fill(0);
    for (const d of ownerDeals) {
      const month = new Date(d.closeDate).getMonth();
      monthlyTotals[month] += d.amount;
    }

    entries.push({
      ownerId,
      ownerName: ownerDeals[0].ownerName,
      total,
      dealCount: ownerDeals.length,
      recentDeal: ownerDeals.some(d => new Date(d.closeDate) >= thirtyDaysAgo),
      deals: ownerDeals.map(d => ({
        name: d.name,
        amount: d.amount,
        closeDate: d.closeDate,
        type: d.type,
      })),
      monthlyTotals,
      rank: 0,
      avatarHue: AVATAR_HUES[ownerDeals[0].ownerName] || 0,
    });
  }

  entries.sort((a, b) => b.total - a.total);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

function rebuildMonthlyRevenue(deals: Deal[]): MonthlyRevenue[] {
  const months: MonthlyRevenue[] = [];
  const currentMonth = new Date().getMonth();
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 12; i++) {
    const monthDeals = deals.filter(d => new Date(d.closeDate).getMonth() === i);
    months.push({
      month: `2026-${String(i + 1).padStart(2, '0')}`,
      label: labels[i],
      total: monthDeals.reduce((s, d) => s + d.amount, 0),
      isCurrent: i === currentMonth,
    });
  }
  return months;
}

function rebuildStackedRevenue(deals: Deal[]): StackedMonthlyRevenue[] {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months: StackedMonthlyRevenue[] = [];

  for (let i = 0; i < 12; i++) {
    const monthDeals = deals.filter(d => new Date(d.closeDate).getMonth() === i);
    months.push({
      month: `2026-${String(i + 1).padStart(2, '0')}`,
      label: labels[i],
      proactive: monthDeals.filter(d => d.type === 'Proactive').reduce((s, d) => s + d.amount, 0),
      reactive: monthDeals.filter(d => d.type === 'Reactive').reduce((s, d) => s + d.amount, 0),
      untagged: monthDeals.filter(d => d.type === 'Untagged').reduce((s, d) => s + d.amount, 0),
    });
  }
  return months;
}

export function filterDashboardData(data: DashboardData, range: DateRange): DashboardData {
  if (range === 'ytd') return data;

  const filtered = filterDeals(data.closedWonRaw, range);
  const totalRevenue = filtered.reduce((s, d) => s + d.amount, 0);

  return {
    ...data,
    kpis: {
      ...data.kpis,
      totalClosedRevenue: totalRevenue,
      closedWonDeals: filtered.length,
    },
    revenueLeaderboard: rebuildLeaderboard(filtered),
    monthlyRevenue: rebuildMonthlyRevenue(filtered),
    stackedRevenue: rebuildStackedRevenue(filtered),
    snapshot: {
      ...data.snapshot,
      biggestWin: filtered.length > 0
        ? (() => {
            const biggest = filtered.reduce((max, d) => (d.amount > max.amount ? d : max), filtered[0]);
            return { dealName: biggest.name, amount: biggest.amount, ownerName: biggest.ownerName };
          })()
        : data.snapshot.biggestWin,
      averageDealSize: filtered.length > 0 ? totalRevenue / filtered.length : 0,
      totalDeals: filtered.length,
    },
  };
}
