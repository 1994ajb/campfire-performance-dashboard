'use client';

import { useRef, useEffect, useState } from 'react';
import { DealDetail } from '@/lib/types';

interface DealDetailDropdownProps {
  deals: DealDetail[];
  isOpen: boolean;
  showStage?: boolean;
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Proactive: { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)' },
    Reactive: { bg: 'rgba(99, 102, 241, 0.12)', text: 'var(--color-reactive)' },
    Untagged: { bg: 'var(--color-surface-dynamic)', text: 'var(--color-text-faint)' },
  };

  const c = colors[type] || colors.Untagged;

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      background: c.bg,
      color: c.text,
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
    }}>
      {type}
    </span>
  );
}

function StageBadge({ stageName }: { stageName: string }) {
  const getColor = (name: string) => {
    if (name.includes('Prospecting')) return { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)' };
    if (name.includes('Investigating')) return { bg: 'rgba(0, 100, 148, 0.12)', text: 'var(--color-stage-investigating)' };
    if (name.includes('Penetrating')) return { bg: 'rgba(8, 145, 178, 0.12)', text: 'var(--color-stage-penetrating)' };
    if (name.includes('Creating')) return { bg: 'var(--color-success-highlight)', text: 'var(--color-success)' };
    if (name.includes('Preparing')) return { bg: 'var(--color-primary-highlight)', text: 'var(--color-primary)' };
    if (name.includes('Pitching') || name.includes('Scoro')) return { bg: 'rgba(122, 57, 187, 0.12)', text: 'var(--color-stage-pitching)' };
    if (name.includes('Closed Won')) return { bg: 'var(--color-success-highlight)', text: 'var(--color-success)' };
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
    }}>
      {stageName}
    </span>
  );
}

export default function DealDetailDropdown({ deals, isOpen, showStage }: DealDetailDropdownProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        maxHeight: isOpen ? maxHeight : 0,
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: `max-height var(--transition-dropdown), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div ref={contentRef} style={{ padding: 'var(--space-2) 0 var(--space-4) var(--space-12)' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'var(--text-xs)',
        }}>
          <thead>
            <tr style={{
              background: 'var(--color-surface-offset)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}>
              <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)' }}>Deal Name</th>
              <th scope="col" style={{ textAlign: 'right', padding: 'var(--space-2) var(--space-3)' }}>Amount</th>
              {!showStage && (
                <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)' }}>Close Date</th>
              )}
              <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)' }}>{showStage ? 'Stage' : 'Type'}</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid var(--color-divider)',
              }}>
                <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-text)' }}>{deal.name}</td>
                <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 600, color: 'var(--color-text)' }}>
                  £{Math.round(deal.amount).toLocaleString('en-GB')}
                </td>
                {!showStage && (
                  <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-text-muted)' }}>
                    {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                )}
                <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                  {showStage ? <StageBadge stageName={deal.stageName || 'Unknown'} /> : <TypeBadge type={deal.type} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
