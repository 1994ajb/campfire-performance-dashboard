'use client';

import { KPIData } from '@/lib/types';
import { useCountUp } from '@/hooks/useCountUp';

interface KPICardsProps {
  data: KPIData;
}

function KPICard({ label, value, prefix, suffix, sublabel }: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sublabel: string;
}) {
  const animatedValue = useCountUp(value);

  const formatted = (prefix || '') + animatedValue.toLocaleString('en-GB') + (suffix || '');

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
      }}
    >
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--color-text-muted)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-text)',
        lineHeight: 1.2,
      }}>
        {formatted}
      </span>
      <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-faint)',
      }}>
        {sublabel}
      </span>
    </div>
  );
}

export default function KPICards({ data }: KPICardsProps) {
  return (
    <section aria-label="Key Performance Indicators" className="section-animate">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-4)',
        }}
        className="kpi-grid"
      >
        <KPICard
          label="Total Closed Revenue"
          value={Math.round(data.totalClosedRevenue)}
          prefix="£"
          sublabel="FY 2026 year to date"
        />
        <KPICard
          label="Active Deals"
          value={data.activeDeals}
          sublabel="Currently in pipeline"
        />
        <KPICard
          label="Weighted Pipeline"
          value={Math.round(data.weightedPipeline)}
          prefix="£"
          sublabel="Probability-weighted value"
        />
        <KPICard
          label="Closed Won Deals"
          value={data.closedWonDeals}
          sublabel="FY 2026 year to date"
        />
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--space-3) !important;
          }
        }
      `}</style>
    </section>
  );
}
