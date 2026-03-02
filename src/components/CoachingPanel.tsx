'use client';

import { CoachingData } from '@/lib/types';

interface CoachingPanelProps {
  data: CoachingData;
}

interface SectionProps {
  title: string;
  items: string[];
  borderColor: string;
  bgColor: string;
  iconColor: string;
  dotColor: string;
  icon: React.ReactNode;
}

function Section({ title, items, borderColor, bgColor, iconColor, dotColor, icon }: SectionProps) {
  return (
    <div style={{
      borderLeft: `3px solid ${borderColor}`,
      background: bgColor,
      borderRadius: `0 var(--radius-md) var(--radius-md) 0`,
      padding: 'var(--space-4) var(--space-5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 'var(--radius-sm)',
          background: `${borderColor}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor,
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          {title}
        </h3>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: dotColor,
              flexShrink: 0, marginTop: 7,
            }} />
            <span
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: highlightBold(item) }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function highlightBold(text: string): string {
  // Make names (capitalized words) and numbers/percentages bold
  return text.replace(
    /(\b[A-Z][a-z]+ [A-Z][a-z]+\b|\b\d+%?\b(?:\.\d+)?)/g,
    '<strong style="color: var(--color-text); font-weight: 600;">$1</strong>'
  );
}

export default function CoachingPanel({ data }: CoachingPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
      <Section
        title="What we're doing well"
        items={data.doingWell}
        borderColor="var(--color-success)"
        bgColor="var(--color-success-highlight)"
        iconColor="var(--color-success)"
        dotColor="var(--color-success)"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        }
      />

      <Section
        title="Quick wins — almost there"
        items={data.quickWins.length > 0 ? data.quickWins : ['No quick wins identified — great work!']}
        borderColor="#3B82F6"
        bgColor="rgba(59, 130, 246, 0.06)"
        iconColor="#3B82F6"
        dotColor="#3B82F6"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />

      <Section
        title="Focus areas for the team"
        items={data.focusAreas}
        borderColor="var(--color-primary)"
        bgColor="var(--color-primary-highlight)"
        iconColor="var(--color-primary)"
        dotColor="var(--color-primary)"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      />

      <div style={{
        borderLeft: '3px solid var(--color-stage-pitching)',
        background: 'rgba(122, 57, 187, 0.06)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        padding: 'var(--space-4) var(--space-5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: 'rgba(122, 57, 187, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-stage-pitching)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            This week&apos;s challenge
          </h3>
        </div>
        <p
          style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: highlightBold(data.weeklyChallenge) }}
        />
      </div>
    </div>
  );
}
