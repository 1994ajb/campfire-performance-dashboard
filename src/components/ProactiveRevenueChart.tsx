'use client';

import { StackedMonthlyRevenue } from '@/lib/types';

interface ProactiveRevenueChartProps {
  data: StackedMonthlyRevenue[];
}

export default function ProactiveRevenueChart({ data }: ProactiveRevenueChartProps) {
  const maxValue = Math.max(...data.map(d => d.proactive + d.reactive + d.untagged), 1);
  const niceMax = Math.ceil(maxValue / 100000) * 100000 || 100000;

  const yLabels = [niceMax, niceMax * 0.75, niceMax * 0.5, niceMax * 0.25, 0];

  const formatValue = (v: number) => {
    if (v >= 1000000) return `£${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
    return `£${v}`;
  };

  return (
    <section aria-label="Proactive vs Reactive Revenue" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Proactive vs Reactive Revenue
              </h2>
              <span style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-highlight)',
                color: 'var(--color-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}>
                FY 2026
              </span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>Proactive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-reactive)' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>Reactive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-untagged)' }} />
              <span style={{ color: 'var(--color-text-muted)' }}>Untagged</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Y-axis */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 28,
            minWidth: 60,
          }}>
            {yLabels.map((v, i) => (
              <span key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', textAlign: 'right' }}>
                {formatValue(v)}
              </span>
            ))}
          </div>

          {/* Chart */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Grid */}
            <div style={{
              position: 'absolute', inset: 0, bottom: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              pointerEvents: 'none',
            }}>
              {yLabels.map((_, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--color-divider)' }} />
              ))}
            </div>

            {/* Stacked bars */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)',
              height: 240, position: 'relative', zIndex: 1,
            }}>
              {data.map(month => {
                const total = month.proactive + month.reactive + month.untagged;
                const totalHeight = niceMax > 0 ? (total / niceMax) * 100 : 0;
                const proH = total > 0 ? (month.proactive / total) * totalHeight : 0;
                const reactH = total > 0 ? (month.reactive / total) * totalHeight : 0;
                const untagH = total > 0 ? (month.untagged / total) * totalHeight : 0;

                return (
                  <div key={month.month} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}>
                    {/* Stacked bar */}
                    <div style={{
                      width: '100%',
                      maxWidth: 48,
                      height: `${totalHeight}%`,
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      borderRadius: '4px 4px 0 0',
                      overflow: 'hidden',
                      transition: 'height var(--transition-chart)',
                    }}>
                      {/* Proactive (bottom) */}
                      <div style={{
                        height: `${total > 0 ? (month.proactive / total) * 100 : 0}%`,
                        background: 'var(--color-primary)',
                        minHeight: month.proactive > 0 ? 2 : 0,
                      }} />
                      {/* Reactive (middle) */}
                      <div style={{
                        height: `${total > 0 ? (month.reactive / total) * 100 : 0}%`,
                        background: 'var(--color-reactive)',
                        minHeight: month.reactive > 0 ? 2 : 0,
                      }} />
                      {/* Untagged (top) */}
                      <div style={{
                        height: `${total > 0 ? (month.untagged / total) * 100 : 0}%`,
                        background: 'var(--color-untagged)',
                        minHeight: month.untagged > 0 ? 2 : 0,
                      }} />
                    </div>

                    {/* Month label */}
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      fontWeight: 500,
                    }}>
                      {month.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
