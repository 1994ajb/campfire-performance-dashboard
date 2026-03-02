'use client';

import { useState, useMemo } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import DealDetailDropdown from './DealDetailDropdown';

interface RevenueLeaderboardProps {
  data: LeaderboardEntry[];
}

function MedalIcon({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: 'var(--color-gold)',
    2: 'var(--color-silver)',
    3: 'var(--color-bronze)',
  };

  if (rank > 3) return null;

  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: colors[rank],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-label={`${rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'} medal`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(0,0,0,0.5)" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </div>
  );
}

function Avatar({ name, hue }: { name: string; hue: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `oklch(0.55 0.14 ${hue})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const currentMonth = new Date().getMonth();
  const visible = data.slice(0, currentMonth + 1);
  if (visible.length < 2 || visible.every(v => v === 0)) return null;

  const max = Math.max(...visible);
  const w = 60;
  const h = 20;
  const points = visible
    .map((v, i) => {
      const x = (i / (visible.length - 1)) * w;
      const y = max > 0 ? h - (v / max) * (h - 2) - 1 : h - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RevenueLeaderboard({ data }: RevenueLeaderboardProps) {
  const [sortBy, setSortBy] = useState<'revenue' | 'deals'>('revenue');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const arr = [...data];
    if (sortBy === 'deals') {
      arr.sort((a, b) => b.dealCount - a.dealCount || b.total - a.total);
    } else {
      arr.sort((a, b) => b.total - a.total);
    }
    return arr.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [data, sortBy]);

  return (
    <section aria-label="Revenue Leaderboard" className="section-animate">
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
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Revenue Leaderboard
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              Total closed revenue — FY 2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: 2, borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            {(['revenue', 'deals'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                style={{
                  padding: 'var(--space-1) var(--space-4)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: sortBy === opt ? 'var(--color-primary)' : 'transparent',
                  color: sortBy === opt ? 'white' : 'var(--color-text-muted)',
                  transition: 'var(--transition-base)',
                }}
              >
                {opt === 'revenue' ? 'By Revenue' : 'By Deal Count'}
              </button>
            ))}
          </div>
        </div>

        <ol role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sorted.map(entry => {
            const isExpanded = expandedId === entry.ownerId;
            const isTop3 = entry.rank <= 3;
            const medalBorders: Record<number, string> = {
              1: 'var(--color-gold)',
              2: 'var(--color-silver)',
              3: 'var(--color-bronze)',
            };

            return (
              <li key={entry.ownerId}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.ownerId)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-6)',
                    background: isTop3 ? `${medalBorders[entry.rank]}08` : 'transparent',
                    borderLeft: isTop3 ? `3px solid ${medalBorders[entry.rank]}` : '3px solid transparent',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid var(--color-divider)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'inherit',
                    font: 'inherit',
                    transition: 'var(--transition-base)',
                  }}
                  aria-expanded={isExpanded}
                >
                  {/* Rank */}
                  <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                    {isTop3 ? (
                      <MedalIcon rank={entry.rank} />
                    ) : (
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar name={entry.ownerName} hue={entry.avatarHue} />

                  {/* Name + deals */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                      {entry.ownerName}
                      {entry.recentDeal && (
                        <span title="Closed a deal in the last 30 days" style={{ marginLeft: 'var(--space-1)' }}>
                          🔥
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {entry.dealCount} deal{entry.dealCount !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Revenue */}
                  {/* Sparkline */}
                  <Sparkline data={entry.monthlyTotals} />

                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                    £{Math.round(entry.total).toLocaleString('en-GB')}
                  </div>

                  {/* Chevron */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-text-faint)" strokeWidth="2"
                    style={{
                      transition: 'transform var(--transition-base)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <DealDetailDropdown deals={entry.deals} isOpen={isExpanded} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
