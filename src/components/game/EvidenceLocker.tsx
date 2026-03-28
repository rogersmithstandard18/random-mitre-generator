import { Eye, Lock } from 'lucide-react';
import type { GameState } from '@/types/GameState';
import { EVIDENCE_SP_COST } from '@/constants/gameData';

interface Props {
  state: GameState;
  onInvestigate: () => void;
}

export default function EvidenceLocker({ state, onInvestigate }: Props) {
  const hints = state.evidenceHintsRevealed;
  const canInvestigate = state.phase === 'playing' && state.sp >= EVIDENCE_SP_COST;
  const threat = state.activeThreat;

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
          <Eye size={12} color="#14b8a6" /> Evidence Locker
        </h3>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{hints.length} clues found</span>
      </div>

      {/* Investigate button */}
      <button
        onClick={canInvestigate ? onInvestigate : undefined}
        disabled={!canInvestigate}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 10, marginBottom: 10,
          border: canInvestigate ? '1px solid rgba(20,184,166,0.4)' : '1px solid rgba(255,255,255,0.08)',
          background: canInvestigate ? 'rgba(20,184,166,0.06)' : 'rgba(255,255,255,0.02)',
          cursor: canInvestigate ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.15s',
        }}
      >
        {canInvestigate ? (
          <>
            <Eye size={14} color="#14b8a6" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Investigate Evidence
            </span>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(20,184,166,0.15)', color: '#14b8a6', fontWeight: 900 }}>
              {EVIDENCE_SP_COST} SP
            </span>
          </>
        ) : (
          <>
            <Lock size={14} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              {state.sp < EVIDENCE_SP_COST ? 'Not enough SP' : 'Investigation unavailable'}
            </span>
          </>
        )}
      </button>

      {/* Revealed hints */}
      {hints.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {hints.map((hint, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 8,
              border: '1px solid rgba(20,184,166,0.2)',
              background: 'rgba(20,184,166,0.04)',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{hint}</span>
            </div>
          ))}
        </div>
      )}

      {hints.length === 0 && threat && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontStyle: 'italic', margin: '8px 0 0' }}>
          Spend SP to reveal clues about the threat type.
        </p>
      )}
    </section>
  );
}
