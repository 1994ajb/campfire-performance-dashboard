'use client';

import ThemeToggle from './ThemeToggle';
import RefreshButton from './RefreshButton';

interface HeaderProps {
  updatedAt: string;
  onRefresh: () => void;
}

export default function Header({ updatedAt, onRefresh }: HeaderProps) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: 'var(--space-3) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 2C16 2 10 10 10 18C10 21.3 12.7 24 16 24C19.3 24 22 21.3 22 18C22 10 16 2 16 2Z" fill="var(--color-primary)" opacity="0.9" />
            <path d="M16 10C16 10 13 14 13 19C13 20.7 14.3 22 16 22C17.7 22 19 20.7 19 19C19 14 16 10 16 10Z" fill="var(--color-primary)" opacity="0.5" />
            <circle cx="16" cy="28" rx="6" ry="2" fill="var(--color-primary)" opacity="0.15" />
          </svg>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>
            Campfire
          </span>
          <div
            style={{
              width: 1,
              height: 24,
              background: 'var(--color-divider)',
            }}
            className="header-divider"
          />
          <span
            className="header-subtitle"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            New Business &amp; Client Services Performance
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {formattedDate && (
            <span
              className="header-timestamp"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-faint)',
              }}
            >
              Updated {formattedDate}
            </span>
          )}
          <RefreshButton onRefresh={onRefresh} />
          <button
            onClick={() => window.print()}
            title="Export to PDF"
            className="no-print"
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              transition: 'var(--transition-base)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .header-subtitle,
          .header-timestamp {
            display: none;
          }
          .header-divider {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
