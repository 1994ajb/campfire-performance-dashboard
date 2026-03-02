'use client';

import { BudgetProgress, FY_BUDGET } from '@/lib/types';

interface BudgetProgressBarProps {
  data: BudgetProgress;
}

export default function BudgetProgressBar({ data }: BudgetProgressBarProps) {
  const pct = Math.min(data.percentage, 100);
  const projectedPct = Math.min((data.projected / data.target) * 100, 120);

  return (
    <section aria-label="Budget Progress" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)',
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              FY 2026 Budget Progress
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              £{Math.round(data.current).toLocaleString('en-GB')} of £{Math.round(data.target).toLocaleString('en-GB')} target
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: data.onTrack ? 'var(--color-success)' : 'var(--color-error)',
            }} />
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: data.onTrack ? 'var(--color-success)' : 'var(--color-error)',
            }}>
              {data.onTrack ? 'On Track' : 'Behind Target'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'relative',
          height: 24,
          background: 'var(--color-surface-dynamic)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${pct}%`,
              background: data.onTrack ? 'var(--color-success)' : 'var(--color-error)',
              borderRadius: 'var(--radius-full)',
              transition: 'width var(--transition-chart)',
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: pct > 50 ? 'white' : 'var(--color-text)',
            }}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Run Rate</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
              £{Math.round(data.runRate).toLocaleString('en-GB')}/mo
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Projected</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: data.onTrack ? 'var(--color-success)' : 'var(--color-error)' }}>
              £{Math.round(data.projected).toLocaleString('en-GB')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Remaining</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
              £{Math.round(data.target - data.current).toLocaleString('en-GB')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Months Left</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
              {data.monthsRemaining}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
