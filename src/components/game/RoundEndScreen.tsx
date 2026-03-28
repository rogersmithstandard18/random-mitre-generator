import { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import type { ToolId, GameState } from '@/types/GameState';
import { TOOLS_DEF, TOTAL_ROUNDS } from '@/constants/gameData';

interface Props {
  state: GameState;
  onPickTool: (id: ToolId) => void;
  onNext: () => void;
}

export default function RoundEndScreen({ state, onPickTool, onNext }: Props) {
  const [picked, setPicked] = useState<ToolId | null>(null);
  const lastResult = state.roundResults[state.roundResults.length - 1];
  const locked = state.toolPickOptions;

  const handlePick = (id: ToolId) => {
    setPicked(id);
    onPickTool(id);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 28 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 14, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', marginBottom: 16 }}>
          <Shield size={28} color="#22c55e" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', marginBottom: 4 }}>
          Round {state.round} Complete
        </h1>
        {lastResult && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {lastResult.threatLabel} neutralized in {lastResult.turnsUsed} turns
            {lastResult.verdictCorrect !== null && (
              <> — Verdict: <span style={{ color: lastResult.verdictCorrect ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{lastResult.verdictCorrect ? 'Correct' : 'Incorrect'}</span></>
            )}
          </p>
        )}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { label: 'System HP', value: `${state.systemHp}/${state.maxHp}`, color: state.systemHp > 60 ? '#22c55e' : state.systemHp > 30 ? '#f59e0b' : '#ef4444' },
          { label: 'Rounds Left', value: TOTAL_ROUNDS - state.round, color: '#14b8a6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 18, fontWeight: 900, color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tool unlock picker */}
      {locked.length > 0 && (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <h2 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 12 }}>
            Unlock a Security Tool
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {locked.map(id => {
              const tool = TOOLS_DEF[id];
              const isPicked = picked === id;
              return (
                <button key={id} onClick={() => !picked && handlePick(id)}
                  disabled={!!picked && !isPicked}
                  style={{
                    padding: 14, borderRadius: 10, textAlign: 'left',
                    border: isPicked ? '2px solid rgba(34,197,94,0.6)' : '2px solid rgba(255,255,255,0.08)',
                    background: isPicked ? 'rgba(34,197,94,0.08)' : '#0f1117',
                    cursor: picked ? 'default' : 'pointer',
                    opacity: picked && !isPicked ? 0.3 : 1,
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isPicked ? '#22c55e' : '#fff' }}>{tool.name}</span>
                    {isPicked && <CheckCircle2 size={14} color="#22c55e" />}
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, margin: 0 }}>{tool.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={picked || locked.length === 0 ? onNext : undefined}
        disabled={!picked && locked.length > 0}
        style={{
          padding: '14px 40px', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.08em', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
          border: 'none',
          cursor: picked || locked.length === 0 ? 'pointer' : 'not-allowed',
          background: picked || locked.length === 0 ? 'linear-gradient(135deg, #0891b2, #2563eb)' : 'rgba(255,255,255,0.05)',
          color: picked || locked.length === 0 ? '#fff' : 'rgba(255,255,255,0.2)',
          transition: 'all 0.2s',
        }}>
        Next Round <ArrowRight size={14} />
      </button>
    </div>
  );
}
