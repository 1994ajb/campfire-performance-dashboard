'use client';

import { StaleDeal } from '@/lib/types';

interface StaleDealAlertsProps {
  data: StaleDeal[];
}

export default function StaleDealAlerts({ data }: StaleDealAlertsProps) {
  if (data.length === 0) return null;

  return (
    <section aria-label="Stale Deal Alerts" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: 'var(--space-5) var(--space-6) var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(161, 53, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Stale Deal Alerts
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              {data.length} deal{data.length !== 1 ? 's' : ''} with no activity in 30+ days
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
          }}>
            <thead>
              <tr style={{
                background: 'var(--color-surface-offset)',
              }}>
                <th scope="col" style={{
                  textAlign: 'left',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>Deal</th>
                <th scope="col" style={{
                  textAlign: 'right',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>Value</th>
                <th scope="col" style={{
                  textAlign: 'left',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>Owner</th>
                <th scope="col" style={{
                  textAlign: 'left',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>Stage</th>
                <th scope="col" style={{
                  textAlign: 'right',
                  padding: 'var(--space-2) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                }}>Days Stale</th>
              </tr>
            </thead>
            <tbody>
              {data.map((deal, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-divider)',
                  }}
                >
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 500 }}>
                    {deal.name}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                    £{Math.round(deal.value).toLocaleString('en-GB')}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-muted)' }}>
                    {deal.ownerName}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-muted)' }}>
                    {deal.stageName}
                  </td>
                  <td style={{
                    padding: 'var(--space-3) var(--space-4)',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: deal.daysSinceActivity > 60 ? 'var(--color-error)' : 'var(--color-primary)',
                  }}>
                    {deal.daysSinceActivity}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
