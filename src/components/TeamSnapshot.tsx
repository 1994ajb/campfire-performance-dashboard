'use client';

import { TeamSnapshot as TeamSnapshotType } from '@/lib/types';

interface TeamSnapshotProps {
  data: TeamSnapshotType;
}

function DonutChart({ percentage, color }: { percentage: number; color: string }) {
  const circumference = 2 * Math.PI * 15.5;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="72" height="72" viewBox="0 0 36 36" aria-label={`${Math.round(percentage)}%`}>
      <circle
        cx="18" cy="18" r="15.5"
        fill="none"
        stroke="var(--color-surface-dynamic)"
        strokeWidth="3"
      />
      <circle
        cx="18" cy="18" r="15.5"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      <text x="18" y="18" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: '8px', fontWeight: 700, fill: 'var(--color-text)' }}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}

export default function TeamSnapshot({ data }: TeamSnapshotProps) {
  return (
    <section aria-label="Team Snapshot" className="section-animate">
      <div className="snapshot-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 'var(--space-4)',
      }}>
        {/* Biggest Win */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-highlight)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              Biggest Win
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
              £{Math.round(data.biggestWin.amount).toLocaleString('en-GB')}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              {data.biggestWin.dealName}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              {data.biggestWin.ownerName}
            </div>
          </div>
        </div>

        {/* Average Deal Size */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="8" rx="1" />
              <rect x="10" y="8" width="4" height="12" rx="1" />
              <rect x="17" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              Avg Deal Size
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
              £{Math.round(data.averageDealSize).toLocaleString('en-GB')}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              {data.totalDeals} deals closed
            </div>
          </div>
        </div>

        {/* Proactive Rate */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}>
          <DonutChart percentage={data.proactiveRate.percentage} color="var(--color-success)" />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              Proactive Rate
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
              {Math.round(data.proactiveRate.percentage)}%
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              {data.proactiveRate.proactive} of {data.proactiveRate.total} tagged
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
        }}>
          <DonutChart percentage={data.winRate.rate} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              Win Rate
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
              {Math.round(data.winRate.rate)}%
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              {data.winRate.won} won / {data.winRate.lost} lost
            </div>
          </div>
        </div>

        {/* Deal Velocity */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5) var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'rgba(8, 145, 178, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              Deal Velocity
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
              {Math.round(data.dealVelocity.averageDays)} days
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              avg across {data.dealVelocity.dealCount} deals
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 1200px) {
          .snapshot-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .snapshot-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
