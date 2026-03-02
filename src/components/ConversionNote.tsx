'use client';

import { ConversionData } from '@/lib/types';

interface ConversionNoteProps {
  data: ConversionData;
}

export default function ConversionNote({ data }: ConversionNoteProps) {
  return (
    <section aria-label="Conversion Statistics" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Closed Won: <strong style={{ color: 'var(--color-text)' }}>{data.closedWonCount} deals</strong>
          {' · '}
          Conversion to Scoro stage: <strong style={{ color: 'var(--color-text)' }}>
            {data.scoroCount} of {data.totalPitchingAndWon} ({data.conversionRate}%)
          </strong>
        </span>
      </div>
    </section>
  );
}
