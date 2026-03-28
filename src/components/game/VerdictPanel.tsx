import { ArrowRight } from 'lucide-react';
import type { GameState } from '@/types/GameState';

interface Props {
  state: GameState;
  onSetVerdict: (v: 'likely_real' | 'likely_noise' | 'unsure') => void;
  onSetSummary: (s: string) => void;
  onSetSeverity: (s: 'low' | 'medium' | 'high') => void;
  onSubmit: () => void;
}

export default function VerdictPanel({ state, onSetVerdict, onSetSummary, onSetSeverity, onSubmit }: Props) {
  const canSubmit = state.verdictChoice && state.verdictSummary.trim().length > 10 && state.verdictSeverity;

  return (
    <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
      <div style={{ background: 'rgba(34,197,94,0.08)', padding: '16px 20px', borderBottom: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
        <p style={{ fontSize: 20, fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', margin: 0 }}>Threat Neutralized!</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>File your incident verdict.</p>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Verdict */}
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Incident Verdict
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {([['likely_real', '#ef4444', 'Real Threat'], ['likely_noise', '#22c55e', 'Likely Noise'], ['unsure', '#f59e0b', 'Unsure']] as const).map(([v, c, label]) => (
              <button key={v} onClick={() => onSetVerdict(v)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 10, fontWeight: 900,
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
                  border: state.verdictChoice === v ? `1.5px solid ${c}` : '1.5px solid rgba(255,255,255,0.08)',
                  background: state.verdictChoice === v ? c : 'rgba(255,255,255,0.03)',
                  color: state.verdictChoice === v ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Alert Summary
          </label>
          <textarea
            value={state.verdictSummary}
            onChange={e => onSetSummary(e.target.value)}
            placeholder="Briefly describe what you believe happened..."
            style={{
              width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)',
              resize: 'vertical', height: 72, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Severity */}
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, textAlign: 'center' }}>
            Severity
          </label>
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 36 }}>
            {(['low', 'medium', 'high'] as const).map((o, i) => {
              const colors = ['#22c55e', '#f59e0b', '#ef4444'];
              return (
                <button key={o} onClick={() => onSetSeverity(o)}
                  style={{
                    flex: 1, fontSize: 10, textTransform: 'uppercase', fontWeight: 900,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    background: state.verdictSeverity === o ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: state.verdictSeverity === o ? colors[i] : 'rgba(255,255,255,0.3)',
                  }}>
                  {o}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button onClick={canSubmit ? onSubmit : undefined} disabled={!canSubmit}
          style={{
            width: '100%', padding: 14, borderRadius: 10, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.08em', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
            background: canSubmit ? 'linear-gradient(135deg, #059669, #0d9488)' : 'rgba(255,255,255,0.03)',
            color: canSubmit ? '#fff' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s',
          }}>
          Submit Verdict <ArrowRight size={14} />
        </button>
        {!canSubmit && (
          <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
            {!state.verdictChoice ? 'Select a verdict' : state.verdictSummary.trim().length <= 10 ? 'Write a summary (10+ chars)' : 'Set severity'}
          </p>
        )}
      </div>
    </div>
  );
}
