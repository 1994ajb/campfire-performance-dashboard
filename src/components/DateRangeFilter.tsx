'use client';

export type DateRange = 'ytd' | 'q1' | 'q2' | 'q3' | 'q4' | 'last30' | 'last90';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'ytd', label: 'YTD' },
  { value: 'q1', label: 'Q1' },
  { value: 'q2', label: 'Q2' },
  { value: 'q3', label: 'Q3' },
  { value: 'q4', label: 'Q4' },
  { value: 'last30', label: 'Last 30d' },
  { value: 'last90', label: 'Last 90d' },
];

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Date range filter"
      style={{
        display: 'flex',
        gap: 2,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        flexWrap: 'wrap',
      }}
      className="no-print"
    >
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            background: value === opt.value ? 'var(--color-primary)' : 'transparent',
            color: value === opt.value ? 'white' : 'var(--color-text-muted)',
            transition: 'var(--transition-base)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
