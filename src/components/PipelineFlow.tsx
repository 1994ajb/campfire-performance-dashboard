'use client';

import { PipelineStage } from '@/lib/types';

interface PipelineFlowProps {
  data: PipelineStage[];
}

export default function PipelineFlow({ data }: PipelineFlowProps) {
  const formatValue = (v: number) => {
    if (v >= 1000000) return `£${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `£${(v / 1000).toFixed(0)}K`;
    return `£${v}`;
  };

  const lastIndex = data.length - 1;

  return (
    <section aria-label="Pipeline Flow" className="section-animate">
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
      }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 var(--space-4)' }}>
          Pipeline Flow
        </h2>

        <div className="pipeline-flow" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
        }}>
          {data.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: i === lastIndex ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: i === lastIndex ? 'var(--color-primary-highlight)' : 'var(--color-surface-2)',
                textAlign: 'center',
                minWidth: 110,
                flexShrink: 0,
              }}>
                <div style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  lineHeight: 1.2,
                }}>
                  {stage.count}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginTop: 'var(--space-1)',
                }}>
                  {stage.name}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-1)',
                }}>
                  {formatValue(stage.value)}
                </div>
              </div>

              {/* Chevron arrow */}
              {i < lastIndex && (
                <svg
                  className="pipeline-chevron"
                  width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="var(--color-text-faint)" strokeWidth="2"
                  style={{ flexShrink: 0, margin: '0 var(--space-1)' }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .pipeline-flow {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: var(--space-2) !important;
          }
          .pipeline-chevron {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .pipeline-flow {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
