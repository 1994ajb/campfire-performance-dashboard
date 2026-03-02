'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardData } from '@/lib/types';
import { filterDashboardData } from '@/lib/dateFilter';
import Header from './Header';
import KPICards from './KPICards';
import BudgetProgressBar from './BudgetProgressBar';
import TeamSnapshot from './TeamSnapshot';
import DateRangeFilter, { DateRange } from './DateRangeFilter';
import RevenueLeaderboard from './RevenueLeaderboard';
import ProactiveLeaderboard from './ProactiveLeaderboard';
import MilestoneNudges from './MilestoneNudges';
import MonthlyRevenueChart from './MonthlyRevenueChart';
import ProactiveRevenueChart from './ProactiveRevenueChart';
import ConversionNote from './ConversionNote';
import PipelineFlow from './PipelineFlow';
import TopActiveDeals from './TopActiveDeals';
import StaleDealAlerts from './StaleDealAlerts';
import HygieneChecklist from './HygieneChecklist';
import CoachingPanel from './CoachingPanel';

interface DashboardProps {
  initialData: DashboardData | null;
}

export default function Dashboard({ initialData }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('ytd');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/deals');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [initialData, fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const filtered = useMemo(() => {
    if (!data) return null;
    return filterDashboardData(data, dateRange);
  }, [data, dateRange]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--text-base)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 'var(--space-4)' }}>
            <path d="M16 2C16 2 10 10 10 18C10 21.3 12.7 24 16 24C19.3 24 22 21.3 22 18C22 10 16 2 16 2Z" fill="var(--color-primary)" opacity="0.9" />
            <path d="M16 10C16 10 13 14 13 19C13 20.7 14.3 22 16 22C17.7 22 19 20.7 19 19C19 14 16 10 16 10Z" fill="var(--color-primary)" opacity="0.5" />
          </svg>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !filtered) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--color-error)',
        fontSize: 'var(--text-base)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>{error || 'No data available'}</p>
          <button
            onClick={fetchData}
            style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-2) var(--space-6)',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Header updatedAt={filtered.updatedAt} onRefresh={handleRefresh} />

      <main id="main-content" style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        {/* Date Range Filter */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        {/* KPI Cards */}
        <KPICards data={filtered.kpis} />

        {/* Budget Progress */}
        <BudgetProgressBar data={filtered.budgetProgress} />

        {/* Team Snapshot */}
        <TeamSnapshot data={filtered.snapshot} />

        {/* Leaderboards — 2 column */}
        <div className="leaderboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 'var(--space-6)',
        }}>
          <RevenueLeaderboard data={filtered.revenueLeaderboard} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <ProactiveLeaderboard data={filtered.proactiveLeaderboard} />
            <MilestoneNudges data={filtered.milestoneNudges} />
          </div>
        </div>

        {/* Charts — 2 column */}
        <div className="charts-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
        }}>
          <MonthlyRevenueChart data={filtered.monthlyRevenue} />
          <ProactiveRevenueChart data={filtered.stackedRevenue} />
        </div>

        {/* Conversion Note */}
        <ConversionNote data={filtered.conversion} />

        {/* Pipeline Flow */}
        <PipelineFlow data={filtered.pipelineStages} />

        {/* Top Active Deals */}
        <TopActiveDeals data={filtered.topActiveDeals} />

        {/* Stale Deal Alerts */}
        <StaleDealAlerts data={filtered.staleDeals} />

        {/* Hygiene Section */}
        <div>
          <HygieneChecklist data={filtered.hygiene} />
          <CoachingPanel data={filtered.coaching} />
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1024px) {
          .leaderboard-grid {
            grid-template-columns: 1fr !important;
          }
          .charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
