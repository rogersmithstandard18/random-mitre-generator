import { ArrowRight, Activity } from 'lucide-react';
import type { ActiveThreat } from '@/types/GameState';
import { THREAT_TYPES, TOTAL_ROUNDS } from '@/constants/gameData';

const TIER_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.4)', text: '#14b8a6' },
  2: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#f59e0b' },
  3: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', text: '#8b5cf6' },
};

interface Props {
  threat: ActiveThreat;
  round: number;
  onBegin: () => void;
}

export default function ThreatAlert({ threat, round, onBegin }: Props) {
  const tc = TIER_COLORS[threat.tier];
  const stars = '★'.repeat(threat.tier) + '☆'.repeat(3 - threat.tier);

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        {/* Round badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
          <Activity size={12} color="#14b8a6" style={{ animation: 'cf-pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Round {round} of {TOTAL_ROUNDS}
          </span>
        </div>

        {/* Threat name */}
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 8 }}>
          {THREAT_TYPES[threat.type].name}
        </h1>

        {/* Tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
            {threat.label}
          </span>
          <span style={{ color: tc.text, fontSize: 16, letterSpacing: 2 }}>{stars}</span>
        </div>

        {/* Intro text */}
        <div style={{ padding: 20, borderRadius: 12, borderLeft: `3px solid ${tc.border}`, background: 'rgba(255,255,255,0.03)', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
            "{threat.intro}"
          </p>
        </div>

        {/* Scenario title */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>
          Case: <span style={{ color: '#14b8a6', fontWeight: 700 }}>{threat.scenarioTitle}</span>
        </p>

        {/* Threat stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          {[
            { label: 'Threat HP', value: threat.maxHp, color: '#ef4444' },
            { label: 'Attack Power', value: threat.attackDamage, color: '#f59e0b' },
            { label: 'Tier', value: threat.tier, color: tc.text },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{label}</p>
              <p style={{ fontSize: 20, fontWeight: 900, color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        <button onClick={onBegin}
          style={{
            padding: '16px 48px', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: '0.08em', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
            border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff',
          }}>
          Engage Threat <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
