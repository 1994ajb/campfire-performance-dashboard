import { format, subDays, parseISO, startOfMonth, isAfter } from 'date-fns';
import {
  Deal,
  DashboardData,
  LeaderboardEntry,
  ProactiveEntry,
  KPIData,
  MonthlyRevenue,
  StackedMonthlyRevenue,
  PipelineStage,
  ActiveDeal,
  TeamSnapshot,
  HygieneRow,
  MilestoneNudge,
  CoachingData,
  ConversionData,
  DealDetail,
  AVATAR_HUES,
  STAGE_MAP,
  STAGE_PROBABILITIES,
  ACTIVE_STAGES,
} from './types';

function getAvatarHue(name: string): number {
  return AVATAR_HUES[name] || 0;
}

function buildRevenueLeaderboard(closedWon: Deal[]): LeaderboardEntry[] {
  const byOwner = new Map<string, Deal[]>();
  for (const deal of closedWon) {
    const existing = byOwner.get(deal.ownerId) || [];
    existing.push(deal);
    byOwner.set(deal.ownerId, existing);
  }

  const thirtyDaysAgo = subDays(new Date(), 30);

  const entries: LeaderboardEntry[] = [];
  for (const [ownerId, deals] of byOwner) {
    const total = deals.reduce((sum, d) => sum + d.amount, 0);
    const recentDeal = deals.some(d => {
      const cd = parseISO(d.closeDate);
      return isAfter(cd, thirtyDaysAgo);
    });

    entries.push({
      ownerId,
      ownerName: deals[0].ownerName,
      total,
      dealCount: deals.length,
      recentDeal,
      deals: deals.map(d => ({
        name: d.name,
        amount: d.amount,
        closeDate: d.closeDate,
        type: d.type,
      })),
      rank: 0,
      avatarHue: getAvatarHue(deals[0].ownerName),
    });
  }

  entries.sort((a, b) => b.total - a.total);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

function buildProactiveLeaderboard(closedWon: Deal[], active: Deal[]): ProactiveEntry[] {
  const allDeals = [...closedWon, ...active];
  const proactiveDeals = allDeals.filter(d => d.type === 'Proactive');

  const byOwner = new Map<string, Deal[]>();
  for (const deal of proactiveDeals) {
    const existing = byOwner.get(deal.ownerId) || [];
    existing.push(deal);
    byOwner.set(deal.ownerId, existing);
  }

  const entries: ProactiveEntry[] = [];
  for (const [ownerId, deals] of byOwner) {
    entries.push({
      ownerId,
      ownerName: deals[0].ownerName,
      pitchCount: deals.length,
      deals: deals.map(d => ({
        name: d.name,
        amount: d.amount,
        closeDate: d.closeDate,
        type: d.type,
        stage: d.stage,
        stageName: d.stageName,
      })),
      rank: 0,
      avatarHue: getAvatarHue(deals[0].ownerName),
    });
  }

  entries.sort((a, b) => b.pitchCount - a.pitchCount);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

function calculateKPIs(closedWon: Deal[], active: Deal[]): KPIData {
  const totalClosedRevenue = closedWon.reduce((sum, d) => sum + d.amount, 0);
  const activeDeals = active.length;
  const weightedPipeline = active.reduce((sum, d) => {
    const prob = STAGE_PROBABILITIES[d.stage] || 0;
    return sum + d.amount * prob;
  }, 0);
  const closedWonDeals = closedWon.length;

  return { totalClosedRevenue, activeDeals, weightedPipeline, closedWonDeals };
}

function buildMonthlyRevenue(closedWon: Deal[]): MonthlyRevenue[] {
  const byMonth = new Map<string, number>();
  const now = new Date();
  const currentMonthKey = format(now, 'yyyy-MM');

  for (const deal of closedWon) {
    if (!deal.closeDate) continue;
    const date = parseISO(deal.closeDate);
    const key = format(date, 'yyyy-MM');
    byMonth.set(key, (byMonth.get(key) || 0) + deal.amount);
  }

  // Generate all months from Jan 2026 to current month
  const months: MonthlyRevenue[] = [];
  const start = new Date(2026, 0, 1);
  let current = start;
  while (current <= now) {
    const key = format(current, 'yyyy-MM');
    months.push({
      month: key,
      label: format(current, 'MMM'),
      total: byMonth.get(key) || 0,
      isCurrent: key === currentMonthKey,
    });
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return months;
}

function buildStackedRevenue(closedWon: Deal[]): StackedMonthlyRevenue[] {
  const byMonth = new Map<string, { proactive: number; reactive: number; untagged: number }>();
  const now = new Date();

  for (const deal of closedWon) {
    if (!deal.closeDate) continue;
    const date = parseISO(deal.closeDate);
    const key = format(date, 'yyyy-MM');
    const existing = byMonth.get(key) || { proactive: 0, reactive: 0, untagged: 0 };
    if (deal.type === 'Proactive') existing.proactive += deal.amount;
    else if (deal.type === 'Reactive') existing.reactive += deal.amount;
    else existing.untagged += deal.amount;
    byMonth.set(key, existing);
  }

  const months: StackedMonthlyRevenue[] = [];
  const start = new Date(2026, 0, 1);
  let current = start;
  while (current <= now) {
    const key = format(current, 'yyyy-MM');
    const data = byMonth.get(key) || { proactive: 0, reactive: 0, untagged: 0 };
    months.push({
      month: key,
      label: format(current, 'MMM'),
      ...data,
    });
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return months;
}

function buildPipelineStages(active: Deal[]): PipelineStage[] {
  const stages: PipelineStage[] = [];

  for (const stageId of ACTIVE_STAGES) {
    const stageDeals = active.filter(d => d.stage === stageId);
    stages.push({
      id: stageId,
      name: STAGE_MAP[stageId] || stageId,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.amount, 0),
      probability: STAGE_PROBABILITIES[stageId] || 0,
    });
  }

  return stages;
}

function getTopActiveDeals(active: Deal[]): ActiveDeal[] {
  return active
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)
    .map(d => ({
      name: d.name,
      value: d.amount,
      ownerName: d.ownerName,
      stage: d.stage,
      stageName: d.stageName,
    }));
}

function buildTeamSnapshot(closedWon: Deal[]): TeamSnapshot {
  const biggestDeal = closedWon.reduce(
    (max, d) => (d.amount > max.amount ? d : max),
    closedWon[0] || { name: 'N/A', amount: 0, ownerName: 'N/A' }
  );

  const totalRevenue = closedWon.reduce((sum, d) => sum + d.amount, 0);
  const avgDealSize = closedWon.length > 0 ? totalRevenue / closedWon.length : 0;

  const taggedDeals = closedWon.filter(d => d.type !== 'Untagged');
  const proactiveDeals = taggedDeals.filter(d => d.type === 'Proactive');

  return {
    biggestWin: {
      dealName: biggestDeal.name,
      amount: biggestDeal.amount,
      ownerName: biggestDeal.ownerName,
    },
    averageDealSize: avgDealSize,
    totalDeals: closedWon.length,
    proactiveRate: {
      proactive: proactiveDeals.length,
      total: taggedDeals.length,
      percentage: taggedDeals.length > 0 ? (proactiveDeals.length / taggedDeals.length) * 100 : 0,
    },
  };
}

function buildHygieneData(closedWon: Deal[]): HygieneRow[] {
  const byOwner = new Map<string, Deal[]>();
  for (const deal of closedWon) {
    const existing = byOwner.get(deal.ownerId) || [];
    existing.push(deal);
    byOwner.set(deal.ownerId, existing);
  }

  const rows: HygieneRow[] = [];
  for (const [ownerId, deals] of byOwner) {
    const total = deals.length;
    const filled = {
      dealType: deals.filter(d => d.dealType).length,
      services: deals.filter(d => d.services).length,
      projectLength: deals.filter(d => d.projectLength).length,
      proactiveReactive: deals.filter(d => d.proactiveReactive).length,
      syncedEmails: deals.filter(d => d.syncedEmails > 0).length,
      linkedContact: deals.filter(d => d.linkedContacts > 0).length,
      linkedCompany: deals.filter(d => d.hasLinkedCompany).length,
    };

    const totalFilled = Object.values(filled).reduce((sum, v) => sum + v, 0);
    const overallPercentage = total > 0 ? (totalFilled / (total * 7)) * 100 : 0;

    rows.push({
      ownerId,
      ownerName: deals[0].ownerName,
      avatarHue: getAvatarHue(deals[0].ownerName),
      totalDeals: total,
      dealType: { filled: filled.dealType, total },
      services: { filled: filled.services, total },
      projectLength: { filled: filled.projectLength, total },
      proactiveReactive: { filled: filled.proactiveReactive, total },
      syncedEmails: { filled: filled.syncedEmails, total },
      linkedContact: { filled: filled.linkedContact, total },
      linkedCompany: { filled: filled.linkedCompany, total },
      overallPercentage,
    });
  }

  rows.sort((a, b) => b.overallPercentage - a.overallPercentage);
  return rows;
}

function buildMilestoneNudges(leaderboard: LeaderboardEntry[]): MilestoneNudge[] {
  const nudges: MilestoneNudge[] = [];

  // Find person closest to a round number milestone
  for (const entry of leaderboard) {
    const milestones = [25000, 30000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 500000, 750000, 1000000];
    for (const milestone of milestones) {
      const diff = milestone - entry.total;
      if (diff > 0 && diff < milestone * 0.15) {
        const formattedDiff = `£${Math.round(diff).toLocaleString('en-GB')}`;
        const formattedMilestone = milestone >= 1000000
          ? `£${(milestone / 1000000).toFixed(0)}M`
          : `£${(milestone / 1000).toFixed(0)}K`;
        nudges.push({
          emoji: '🎯',
          text: `${entry.ownerName} is just ${formattedDiff} away from ${formattedMilestone}!`,
          boldParts: [entry.ownerName, formattedDiff, formattedMilestone],
        });
        break;
      }
    }
    if (nudges.length >= 1) break;
  }

  // Person leading by deal count
  const byDealCount = [...leaderboard].sort((a, b) => b.dealCount - a.dealCount);
  if (byDealCount.length >= 1) {
    const leader = byDealCount[0];
    nudges.push({
      emoji: '🏆',
      text: `${leader.ownerName} leads with ${leader.dealCount} deals closed this year!`,
      boldParts: [leader.ownerName, `${leader.dealCount} deals`],
    });
  }

  // Person who needs one more deal to catch someone
  if (byDealCount.length >= 2) {
    for (let i = 1; i < byDealCount.length; i++) {
      if (byDealCount[i - 1].dealCount - byDealCount[i].dealCount === 1) {
        nudges.push({
          emoji: '🔥',
          text: `${byDealCount[i].ownerName} needs just 1 more deal to match ${byDealCount[i - 1].ownerName}!`,
          boldParts: [byDealCount[i].ownerName, '1 more deal', byDealCount[i - 1].ownerName],
        });
        break;
      }
    }
  }

  return nudges.slice(0, 3);
}

function buildCoachingData(hygiene: HygieneRow[]): CoachingData {
  const fieldNames = ['dealType', 'services', 'projectLength', 'proactiveReactive', 'syncedEmails', 'linkedContact', 'linkedCompany'] as const;
  const fieldLabels: Record<string, string> = {
    dealType: 'Deal Type',
    services: 'Services',
    projectLength: 'Project Length',
    proactiveReactive: 'Proactive/Reactive',
    syncedEmails: 'Synced Emails',
    linkedContact: 'Linked Contact',
    linkedCompany: 'Linked Company',
  };

  // Calculate team-wide stats per field
  const fieldStats = fieldNames.map(field => {
    const totalFilled = hygiene.reduce((sum, r) => sum + r[field].filled, 0);
    const totalDeals = hygiene.reduce((sum, r) => sum + r[field].total, 0);
    const pct = totalDeals > 0 ? (totalFilled / totalDeals) * 100 : 0;
    return { field, label: fieldLabels[field], pct, totalFilled, totalDeals };
  });

  // Doing well: fields at or near 100%
  const doingWell: string[] = [];
  const highFields = fieldStats.filter(f => f.pct >= 85);
  if (highFields.length > 0) {
    doingWell.push(`The team is strong on ${highFields.map(f => f.label).join(', ')} — keep it up!`);
  }
  const perfectPeople = hygiene.filter(r => r.overallPercentage >= 95);
  for (const person of perfectPeople) {
    doingWell.push(`${person.ownerName} is at ${Math.round(person.overallPercentage)}% — setting the standard.`);
  }
  if (doingWell.length === 0) {
    doingWell.push('Great effort from the whole team — every improvement counts!');
  }

  // Quick wins: people 1-2 deals away from a green tick
  const quickWins: string[] = [];
  for (const row of hygiene) {
    for (const field of fieldNames) {
      const diff = row[field].total - row[field].filled;
      if (diff > 0 && diff <= 2) {
        quickWins.push(`${row.ownerName} is just ${diff} deal${diff === 1 ? '' : 's'} away from a green tick in ${fieldLabels[field]}.`);
      }
    }
  }

  // Focus areas: lowest performing fields
  const sortedFields = [...fieldStats].sort((a, b) => a.pct - b.pct);
  const focusAreas = sortedFields
    .filter(f => f.pct < 80)
    .slice(0, 3)
    .map(f => `${f.label} is at ${Math.round(f.pct)}% across the team — let's build this habit together.`);
  if (focusAreas.length === 0) {
    focusAreas.push('All fields are above 80% — amazing work! Let\'s push for 100% across the board.');
  }

  // Weekly challenge
  const lowestField = sortedFields[0];
  const teamAvg = hygiene.length > 0
    ? hygiene.reduce((sum, r) => sum + r.overallPercentage, 0) / hygiene.length
    : 0;
  const weeklyChallenge = teamAvg < 70
    ? `This week's goal: get the team average above 70%. Currently at ${Math.round(teamAvg)}% — we can do this!`
    : teamAvg < 90
    ? `This week's goal: push the team average past 90%. We're at ${Math.round(teamAvg)}% — almost there!`
    : `Incredible work! Team average is ${Math.round(teamAvg)}%. Challenge: get everyone to 100% on ${lowestField.label}.`;

  return { doingWell, quickWins: quickWins.slice(0, 5), focusAreas, weeklyChallenge };
}

function buildConversionData(closedWon: Deal[], active: Deal[]): ConversionData {
  const scoroDeals = active.filter(d => d.stage === '879430868');
  const totalPitchingAndWon = scoroDeals.length + closedWon.length;
  const conversionRate = totalPitchingAndWon > 0 ? (closedWon.length / totalPitchingAndWon) * 100 : 0;

  return {
    closedWonCount: closedWon.length,
    scoroCount: scoroDeals.length,
    totalPitchingAndWon,
    conversionRate: Math.round(conversionRate),
  };
}

export function transformData(closedWon: Deal[], active: Deal[]): DashboardData {
  const revenueLeaderboard = buildRevenueLeaderboard(closedWon);
  const proactiveLeaderboard = buildProactiveLeaderboard(closedWon, active);
  const kpis = calculateKPIs(closedWon, active);
  const monthlyRevenue = buildMonthlyRevenue(closedWon);
  const stackedRevenue = buildStackedRevenue(closedWon);
  const pipelineStages = buildPipelineStages(active);
  const topActiveDeals = getTopActiveDeals(active);
  const snapshot = buildTeamSnapshot(closedWon);
  const hygiene = buildHygieneData(closedWon);
  const milestoneNudges = buildMilestoneNudges(revenueLeaderboard);
  const coaching = buildCoachingData(hygiene);
  const conversion = buildConversionData(closedWon, active);

  return {
    kpis,
    snapshot,
    revenueLeaderboard,
    proactiveLeaderboard,
    milestoneNudges,
    monthlyRevenue,
    stackedRevenue,
    conversion,
    pipelineStages,
    topActiveDeals,
    hygiene,
    coaching,
    updatedAt: new Date().toISOString(),
  };
}
