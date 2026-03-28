import { Shield, Activity } from 'lucide-react';
import type { GameState } from '@/types/GameState';
import { TOTAL_ROUNDS, THREAT_TYPES } from '@/constants/gameData';

const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.4)', text: '#14b8a6' },
  2: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#f59e0b' },
  3: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', text: '#8b5cf6' },
};

export default function GameHeader({ state }: { state: GameState }) {
  const hpPct = Math.round((state.systemHp / state.maxHp) * 100);
  const hpColor = hpPct > 60 ? '#22c55e' : hpPct > 30 ? '#f59e0b' : '#ef4444';

  const threat = state.activeThreat;
  const threatPct = threat ? Math.round((threat.hp / threat.maxHp) * 100) : 0;
  const tierColors = LEVEL_COLORS[threat?.tier ?? 1];

  return (
    <header style={{ background: '#0d0f18', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(20,184,166,0.15)', padding: 8, borderRadius: 12, border: '1px solid rgba(20,184,166,0.3)' }}>
              <Shield size={20} color="#14b8a6" />
            </div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.01em', margin: 0, lineHeight: 1 }}>Cyber Defense</h1>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', margin: 0 }}>Case File Campaign</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* HP */}
            <div style={{ minWidth: 150 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System HP</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: hpColor, fontFamily: 'monospace' }}>{state.systemHp}/{state.maxHp}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${hpPct}%`, height: '100%', background: hpColor, borderRadius: 3, transition: 'all 0.3s' }} />
              </div>
            </div>

            {/* SP Pips */}
            <div>
              <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 3 }}>SP</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: state.maxSp }).map((_, i) => (
                  <div key={i} style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: i < state.sp ? '#14b8a6' : 'rgba(255,255,255,0.08)',
                    border: i < state.sp ? '1px solid rgba(20,184,166,0.6)' : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </div>

            {/* Round / Turn */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 3 }}>Round</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{state.round}/{TOTAL_ROUNDS}</span>
            </div>
            {state.turn > 0 && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 3 }}>Turn</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#14b8a6', fontFamily: 'monospace' }}>{state.turn}</span>
              </div>
            )}
          </div>
        </div>

        {/* Threat HP bar */}
        {threat && state.phase === 'playing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={14} color={tierColors.text} style={{ animation: 'cf-pulse 2s ease-in-out infinite' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{THREAT_TYPES[threat.type].name}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', background: tierColors.bg, color: tierColors.text, border: `1px solid ${tierColors.border}` }}>
                    {threat.label}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', fontFamily: 'monospace' }}>{threat.hp}/{threat.maxHp}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${threatPct}%`, height: '100%', background: '#ef4444', borderRadius: 3, transition: 'all 0.3s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
