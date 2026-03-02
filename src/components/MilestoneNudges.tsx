'use client';

import { MilestoneNudge } from '@/lib/types';

interface MilestoneNudgesProps {
  data: MilestoneNudge[];
}

export default function MilestoneNudges({ data }: MilestoneNudgesProps) {
  if (data.length === 0) return null;

  return (
    <section aria-label="Milestone Nudges" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Almost There...
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {data.map((nudge, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-surface-offset)',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition-base)',
              }}
            >
              <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{nudge.emoji}</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {renderBoldText(nudge.text, nudge.boldParts)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderBoldText(text: string, boldParts: string[]) {
  if (!boldParts.length) return text;

  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let keyIndex = 0;

  for (const bold of boldParts) {
    const idx = remaining.indexOf(bold);
    if (idx === -1) continue;

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }
    parts.push(
      <strong key={keyIndex++} style={{ color: 'var(--color-text)', fontWeight: 600 }}>
        {bold}
      </strong>
    );
    remaining = remaining.slice(idx + bold.length);
  }

  if (remaining) parts.push(remaining);
  return <>{parts}</>;
}
