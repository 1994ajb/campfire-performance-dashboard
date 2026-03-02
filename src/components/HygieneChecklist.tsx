'use client';

import { HygieneRow } from '@/lib/types';

interface HygieneChecklistProps {
  data: HygieneRow[];
}

function Avatar({ name, hue }: { name: string; hue: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: `oklch(0.55 0.14 ${hue})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '10px',
        fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function FieldCell({ filled, total }: { filled: number; total: number }) {
  const isComplete = filled === total && total > 0;

  if (isComplete) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--color-success-highlight)',
        }}
        aria-label="Complete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface-dynamic)',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
    }}>
      {filled}/{total}
    </span>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  let gradient: string;
  if (percentage >= 75) {
    gradient = 'linear-gradient(90deg, #437a22, #22c55e)';
  } else if (percentage >= 50) {
    gradient = 'linear-gradient(90deg, var(--color-primary), #F59E0B)';
  } else {
    gradient = 'linear-gradient(90deg, #EF4444, #F97316)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', alignItems: 'center' }}>
      <div style={{
        width: 60,
        height: 6,
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-surface-dynamic)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          borderRadius: 'var(--radius-full)',
          background: gradient,
          transition: 'width var(--transition-chart)',
        }} />
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
      }}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default function HygieneChecklist({ data }: HygieneChecklistProps) {
  return (
    <section aria-label="HubSpot Hygiene Checklist" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              HubSpot Hygiene Checklist
            </h2>
            <span style={{
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--color-reactive)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}>
              Data Quality
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
            Every deal needs all 7 fields completed — a checkmark means 100% of that person&apos;s deals have the field filled
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-xs)',
          }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-offset)' }}>
                <th scope="col" style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Team Member</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Deal Type</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Services</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Project Length</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Pro/Reactive</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Emails</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Contact</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Company</th>
                <th scope="col" style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Overall</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.ownerId} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Avatar name={row.ownerName} hue={row.avatarHue} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{row.ownerName}</div>
                        <div style={{ color: 'var(--color-text-faint)' }}>{row.totalDeals} deals</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.dealType.filled} total={row.dealType.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.services.filled} total={row.services.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.projectLength.filled} total={row.projectLength.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.proactiveReactive.filled} total={row.proactiveReactive.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.syncedEmails.filled} total={row.syncedEmails.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.linkedContact.filled} total={row.linkedContact.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><FieldCell filled={row.linkedCompany.filled} total={row.linkedCompany.total} /></td>
                  <td style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)' }}><ProgressBar percentage={row.overallPercentage} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
