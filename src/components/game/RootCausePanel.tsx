import { Search, CheckCircle2, XCircle } from 'lucide-react';
import type { RootCauseOption } from '@/types/GameState';

interface Props {
  options: RootCauseOption[];
  onGuess: (index: number) => void;
  disabled: boolean;
}

export default function RootCausePanel({ options, onGuess, disabled }: Props) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Search size={12} color="#14b8a6" /> Root Cause Analysis
        </h3>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase' }}>Free action</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map((opt, i) => {
          const wasSelected = opt.selected;
          const isCorrect = opt.correct;

          let borderColor = 'rgba(255,255,255,0.08)';
          let bgColor = '#151821';
          let textColor = 'rgba(255,255,255,0.75)';

          if (wasSelected && isCorrect) {
            borderColor = 'rgba(34,197,94,0.5)';
            bgColor = 'rgba(34,197,94,0.1)';
            textColor = '#22c55e';
          } else if (wasSelected && isCorrect === false) {
            borderColor = 'rgba(239,68,68,0.5)';
            bgColor = 'rgba(239,68,68,0.1)';
            textColor = '#ef4444';
          }

          return (
            <button
              key={i}
              onClick={() => !wasSelected && !disabled && onGuess(i)}
              disabled={wasSelected || disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                cursor: wasSelected || disabled ? 'default' : 'pointer',
                transition: 'all 0.15s',
                opacity: wasSelected ? 0.7 : 1,
              }}
            >
              {wasSelected ? (
                isCorrect
                  ? <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                  : <XCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 13, color: textColor, lineHeight: 1.4 }}>{opt.text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
