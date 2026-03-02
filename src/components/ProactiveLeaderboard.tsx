'use client';

import { useState } from 'react';
import { ProactiveEntry } from '@/lib/types';
import DealDetailDropdown from './DealDetailDropdown';

interface ProactiveLeaderboardProps {
  data: ProactiveEntry[];
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

export default function ProactiveLeaderboard({ data }: ProactiveLeaderboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section aria-label="Proactive Pitch Champions" className="section-animate">
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
          gap: 'var(--space-3)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Proactive Pitch Champions
              </h2>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-success-highlight)',
                color: 'var(--color-success)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Initiative
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              Deals tagged &ldquo;Proactive Proposal&rdquo; in HubSpot
            </p>
          </div>
        </div>

        <ol role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.map(entry => {
            const isExpanded = expandedId === entry.ownerId;

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
                    background: 'transparent',
                    borderLeft: 'none',
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
                  <span style={{
                    width: 32,
                    textAlign: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    flexShrink: 0,
                  }}>
                    {entry.rank}
                  </span>

                  {/* Avatar */}
                  <Avatar name={entry.ownerName} hue={entry.avatarHue} />

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>
                      {entry.ownerName}
                    </div>
                  </div>

                  {/* Pitch count */}
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.pitchCount} pitch{entry.pitchCount !== 1 ? 'es' : ''}
                  </span>

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
                <DealDetailDropdown deals={entry.deals} isOpen={isExpanded} showStage />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
