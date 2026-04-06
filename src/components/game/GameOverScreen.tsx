import { Link } from 'react-router-dom';
import { ArrowRight, Shield, XCircle, Zap } from 'lucide-react';
import type { GameState, Grade } from '@/types/GameState';
import { THREAT_TYPES } from '@/constants/gameData';

const GRADE_STYLES: Record<Grade, { color: string; label: string }> = {
  OUTSTANDING: { color: '#22c55e', label: 'Outstanding' },
  GOOD: { color: '#14b8a6', label: 'Good' },
  PARTIAL: { color: '#f59e0b', label: 'Partial Success' },
  COMPROMISED: { color: '#ef4444', label: 'Compromised' },
};

interface Props {
  state: GameState;
  isGameOver: boolean; // true = HP hit 0, false = completed all rounds
  onPlayAgain: () => void;
  isWeeklyFree?: boolean;
}

export default function GameOverScreen({ state, isGameOver, onPlayAgain, isWeeklyFree = false }: Props) {
  const score = state.score;
  const grade = score?.grade ?? 'COMPROMISED';
  const gs = GRADE_STYLES[grade];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 24 }}>
      {/* Icon */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 72, height: 72, borderRadius: 18,
        background: isGameOver ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
        border: isGameOver ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(34,197,94,0.4)',
      }}>
        {isGameOver
          ? <XCircle size={36} color="#ef4444" />
          : <Shield size={36} color="#22c55e" />
        }
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: isGameOver ? '#ef4444' : gs.color, textTransform: 'uppercase', marginBottom: 4 }}>
          {isGameOver ? 'System Compromised' : 'Campaign Complete'}
        </h1>
        {score && (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Grade: <span style={{ color: gs.color, fontWeight: 900, fontSize: 16 }}>{gs.label}</span>
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Threats Defeated', value: score?.threatsDefeated ?? state.roundResults.filter(r => r.defeated).length, color: '#22c55e' },
          { label: 'HP Remaining', value: state.systemHp, color: state.systemHp > 60 ? '#22c55e' : state.systemHp > 30 ? '#f59e0b' : '#ef4444' },
          { label: 'Total Turns', value: score?.totalTurns ?? state.roundResults.reduce((s, r) => s + r.turnsUsed, 0), color: '#14b8a6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', minWidth: 100 }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 900, color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Round breakdown */}
      {state.roundResults.length > 0 && (
        <div style={{ maxWidth: 480, width: '100%' }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, textAlign: 'center' }}>
            Round Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {state.roundResults.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#0f1117', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: r.defeated ? '#22c55e' : '#ef4444', fontWeight: 900 }}>
                    R{r.round}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                    {r.threatLabel}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{r.turnsUsed} turns</span>
                  {r.verdictCorrect !== null && (
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: r.verdictCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r.verdictCorrect ? '#22c55e' : '#ef4444' }}>
                      {r.verdictCorrect ? 'Correct' : 'Wrong'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debrief text */}
      {state.roundResults.length > 0 && (
        <div style={{ maxWidth: 480, width: '100%', background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Debrief
          </h3>
          {[...new Set(state.roundResults.map(r => r.threatType))].map(type => (
            <div key={type} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{THREAT_TYPES[type].name}</p>
              {THREAT_TYPES[type].debrief.map((d, i) => (
                <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: '0 0 4px' }}>{d}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Upgrade prompt for free users */}
      {isWeeklyFree && (
        <div style={{ maxWidth: 480, width: '100%', background: 'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(37,99,235,0.08))', borderRadius: 12, border: '1px solid rgba(20,184,166,0.2)', padding: 20, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
            <Zap size={14} color="#f59e0b" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>You just completed a real SOC investigation.</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
            Get unlimited case files, AI-powered debriefs, and progress tracking with Professional.
          </p>
          <Link to="/#pricing" style={{ display: 'inline-block', padding: '10px 28px', background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
            Unlock Unlimited Access
          </Link>
        </div>
      )}

      <button onClick={onPlayAgain}
        style={{
          padding: '16px 48px', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.08em', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          border: 'none', cursor: 'pointer',
          background: isWeeklyFree ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff',
          ...(isWeeklyFree ? { border: '1px solid rgba(255,255,255,0.1)' } : {}),
        }}>
        {isWeeklyFree ? 'Back to Case Files' : 'Play Again'} <ArrowRight size={16} />
      </button>
    </div>
  );
}
