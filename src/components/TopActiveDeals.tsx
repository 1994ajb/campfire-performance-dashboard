'use client';

import { ActiveDeal } from '@/lib/types';

interface TopActiveDealsProps {
  data: ActiveDeal[];
}

function StageBadge({ stageName }: { stageName: string }) {
  const getColor = (name: string) => {
    if (name.includes('Prospecting')) return { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)' };
    if (name.includes('Investigating')) return { bg: 'rgba(0, 100, 148, 0.12)', text: 'var(--color-stage-investigating)' };
    if (name.includes('Penetrating')) return { bg: 'rgba(8, 145, 178, 0.12)', text: 'var(--color-stage-penetrating)' };
    if (name.includes('Creating')) return { bg: 'var(--color-success-highlight)', text: 'var(--color-success)' };
    if (name.includes('Preparing')) return { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)' };
    if (name.includes('Pitching') || name.includes('Scoro')) return { bg: 'rgba(122, 57, 187, 0.12)', text: 'var(--color-stage-pitching)' };
    return { bg: 'var(--color-surface-dynamic)', text: 'var(--color-text-muted)' };
  };

  const c = getColor(stageName);

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      background: c.bg,
      color: c.text,
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {stageName}
    </span>
  );
}

export default function TopActiveDeals({ data }: TopActiveDealsProps) {
  return (
    <section aria-label="Top Active Deals" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-3)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Top Active Deals
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
            Highest-value deals currently in pipeline
          </p>
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
              </tr>
            </thead>
            <tbody>
              {data.map((deal, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-divider)',
                    transition: 'background var(--transition-base)',
                  }}
                >
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 500 }}>
                    {deal.name}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                    £{deal.value.toLocaleString('en-GB')}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-muted)' }}>
                    {deal.ownerName}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <StageBadge stageName={deal.stageName} />
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
