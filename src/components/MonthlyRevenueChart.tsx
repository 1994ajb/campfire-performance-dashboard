'use client';

import { MonthlyRevenue } from '@/lib/types';

interface MonthlyRevenueChartProps {
  data: MonthlyRevenue[];
}

export default function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const maxValue = Math.max(...data.map(d => d.total), 1);
  // Round up to nearest nice number
  const niceMax = Math.ceil(maxValue / 100000) * 100000 || 100000;

  const yLabels = [niceMax, niceMax * 0.75, niceMax * 0.5, niceMax * 0.25, 0];

  const formatValue = (v: number) => {
    if (v >= 1000000) return `£${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
    return `£${v}`;
  };

  return (
    <section aria-label="Monthly Closed Revenue" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
      }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Monthly Closed Revenue
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 var(--space-4)' }}>
          Jan 2026 — Present
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Y-axis labels */}
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

          {/* Chart area */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Grid lines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              bottom: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}>
              {yLabels.map((_, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--color-divider)' }} />
              ))}
            </div>

            {/* Bars */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 'var(--space-2)',
              height: 240,
              position: 'relative',
              zIndex: 1,
            }}
              className="chart-bars"
            >
              {data.map((month, i) => {
                const height = niceMax > 0 ? (month.total / niceMax) * 100 : 0;

                return (
                  <div key={month.month} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}>
                    {/* Value label */}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      whiteSpace: 'nowrap',
                    }}>
                      {month.total > 0 ? formatValue(month.total) : ''}
                    </span>

                    {/* Bar */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 48,
                        height: `${height}%`,
                        minHeight: month.total > 0 ? 4 : 0,
                        borderRadius: '4px 4px 0 0',
                        background: month.isCurrent
                          ? `repeating-linear-gradient(
                              45deg,
                              var(--color-primary),
                              var(--color-primary) 4px,
                              rgba(217, 119, 6, 0.5) 4px,
                              rgba(217, 119, 6, 0.5) 8px
                            )`
                          : 'var(--color-primary)',
                        opacity: month.isCurrent ? 0.7 : 0.85,
                        transition: 'height var(--transition-chart)',
                      }}
                    />

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
