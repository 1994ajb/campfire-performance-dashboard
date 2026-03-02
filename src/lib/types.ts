export interface Deal {
  id: string;
  name: string;
  amount: number;
  ownerId: string;
  ownerName: string;
  closeDate: string;
  createDate: string;
  lastModifiedDate: string;
  stage: string;
  stageName: string;
  dealType: string;
  services: string;
  projectLength: string;
  proactiveReactive: string;
  syncedEmails: number;
  linkedContacts: number;
  hasLinkedCompany: boolean;
  type: 'Proactive' | 'Reactive' | 'Untagged';
}

export interface OwnerMap {
  [id: string]: string;
}

export interface LeaderboardEntry {
  ownerId: string;
  ownerName: string;
  total: number;
  dealCount: number;
  recentDeal: boolean;
  deals: DealDetail[];
  monthlyTotals: number[];
  rank: number;
  avatarHue: number;
}

export interface DealDetail {
  name: string;
  amount: number;
  closeDate: string;
  type: 'Proactive' | 'Reactive' | 'Untagged';
  stage?: string;
  stageName?: string;
}

export interface ProactiveEntry {
  ownerId: string;
  ownerName: string;
  pitchCount: number;
  deals: DealDetail[];
  rank: number;
  avatarHue: number;
}

export interface KPIData {
  totalClosedRevenue: number;
  activeDeals: number;
  weightedPipeline: number;
  closedWonDeals: number;
}

export interface MonthlyRevenue {
  month: string;
  label: string;
  total: number;
  isCurrent: boolean;
}

export interface StackedMonthlyRevenue {
  month: string;
  label: string;
  proactive: number;
  reactive: number;
  untagged: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  count: number;
  value: number;
  probability: number;
}

export interface ActiveDeal {
  name: string;
  value: number;
  ownerName: string;
  stage: string;
  stageName: string;
}

export interface TeamSnapshot {
  biggestWin: {
    dealName: string;
    amount: number;
    ownerName: string;
  };
  averageDealSize: number;
  totalDeals: number;
  proactiveRate: {
    proactive: number;
    total: number;
    percentage: number;
  };
  winRate: {
    won: number;
    lost: number;
    rate: number;
  };
  dealVelocity: {
    averageDays: number;
    dealCount: number;
  };
}

export interface HygieneRow {
  ownerId: string;
  ownerName: string;
  avatarHue: number;
  totalDeals: number;
  dealType: { filled: number; total: number };
  services: { filled: number; total: number };
  projectLength: { filled: number; total: number };
  proactiveReactive: { filled: number; total: number };
  syncedEmails: { filled: number; total: number };
  linkedContact: { filled: number; total: number };
  linkedCompany: { filled: number; total: number };
  overallPercentage: number;
}

export interface MilestoneNudge {
  emoji: string;
  text: string;
  boldParts: string[];
}

export interface CoachingData {
  doingWell: string[];
  quickWins: string[];
  focusAreas: string[];
  weeklyChallenge: string;
}

export interface ConversionData {
  closedWonCount: number;
  scoroCount: number;
  totalActiveDeals: number;
  conversionRate: number;
}

export interface BudgetProgress {
  target: number;
  current: number;
  percentage: number;
  runRate: number;
  projected: number;
  onTrack: boolean;
  monthsRemaining: number;
  monthsElapsed: number;
}

export interface StaleDeal {
  name: string;
  value: number;
  ownerName: string;
  stageName: string;
  daysSinceActivity: number;
  lastModified: string;
}

export interface DashboardData {
  kpis: KPIData;
  snapshot: TeamSnapshot;
  revenueLeaderboard: LeaderboardEntry[];
  proactiveLeaderboard: ProactiveEntry[];
  milestoneNudges: MilestoneNudge[];
  monthlyRevenue: MonthlyRevenue[];
  stackedRevenue: StackedMonthlyRevenue[];
  conversion: ConversionData;
  pipelineStages: PipelineStage[];
  topActiveDeals: ActiveDeal[];
  hygiene: HygieneRow[];
  coaching: CoachingData;
  budgetProgress: BudgetProgress;
  staleDeals: StaleDeal[];
  closedWonRaw: Deal[];
  updatedAt: string;
}

export const FY_BUDGET = 5300000;

export const OWNER_MAP: OwnerMap = {
  '31267663': 'Claire Banks',
  '31267665': 'Lucy Warren',
  '31267667': 'Francesca Denny',
  '31267668': 'Rebecca Nuttall',
  '31267669': 'Olivia Lavelle',
  '31267671': 'Ellie Ghee',
  '31267673': 'Lucy McHugh',
  '78295904': 'Leah Powell',
  '229794769': 'Alex Brown',
  '1089678893': 'Joseph Gradwell',
};

export const EXCLUDED_OWNER_ID = '1843945639';

export const AVATAR_HUES: Record<string, number> = {
  'Ellie Ghee': 180,
  'Lucy McHugh': 260,
  'Lucy Warren': 200,
  'Claire Banks': 80,
  'Rebecca Nuttall': 350,
  'Francesca Denny': 50,
  'Olivia Lavelle': 140,
  'Leah Powell': 230,
  'Alex Brown': 30,
  'Joseph Gradwell': 110,
};

export const STAGE_MAP: Record<string, string> = {
  '879430867': 'Prospecting',
  'appointmentscheduled': 'Investigating',
  'qualifiedtobuy': 'Penetrating',
  'presentationscheduled': 'Creating Value',
  'decisionmakerboughtin': 'Preparing',
  'contractsent': 'Pitching (Scoro)',
  'closedwon': 'Closed Won',
  'closedlost': 'Closed Lost',
};

export const STAGE_PROBABILITIES: Record<string, number> = {
  '879430867': 0.10,
  'appointmentscheduled': 0.25,
  'qualifiedtobuy': 0.40,
  'presentationscheduled': 0.60,
  'decisionmakerboughtin': 0.80,
  'contractsent': 0.90,
};

export const ACTIVE_STAGES = [
  '879430867',
  'appointmentscheduled',
  'qualifiedtobuy',
  'presentationscheduled',
  'decisionmakerboughtin',
  'contractsent',
];
