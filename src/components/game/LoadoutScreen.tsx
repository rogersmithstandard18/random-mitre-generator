import { useState } from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ToolId } from '@/types/GameState';
import { TOOLS_DEF, ALL_TOOL_IDS } from '@/constants/gameData';

interface Props {
  onConfirm: (tools: ToolId[]) => void;
}

export default function LoadoutScreen({ onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<ToolId>>(new Set());

  const toggle = (id: ToolId) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else if (next.size < 2) next.add(id);
    setSelected(next);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', marginBottom: 16 }}>
          <Shield size={32} color="#14b8a6" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 4 }}>Select Your Loadout</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 0 }}>
          Choose <strong style={{ color: '#14b8a6' }}>2 security tools</strong> to start your 3-round campaign.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>
          You will unlock more tools by defeating threats.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, maxWidth: 760, width: '100%' }}>
        {ALL_TOOL_IDS.map(id => {
          const tool = TOOLS_DEF[id];
          const active = selected.has(id);
          const full = selected.size >= 2 && !active;
          return (
            <button
              key={id}
              onClick={() => !full && toggle(id)}
              style={{
                padding: 16, borderRadius: 12, textAlign: 'left',
                border: active ? '2px solid rgba(20,184,166,0.6)' : '2px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(20,184,166,0.08)' : '#0f1117',
                cursor: full ? 'not-allowed' : 'pointer',
                opacity: full ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: active ? '#14b8a6' : '#fff' }}>{tool.name}</span>
                {active && <CheckCircle2 size={16} color="#14b8a6" />}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>{tool.description}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                  CD: {tool.baseCooldown}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => selected.size === 2 && onConfirm([...selected])}
        disabled={selected.size !== 2}
        style={{
          padding: '16px 48px', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.08em', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          border: 'none', cursor: selected.size === 2 ? 'pointer' : 'not-allowed',
          background: selected.size === 2 ? 'linear-gradient(135deg, #0891b2, #2563eb)' : 'rgba(255,255,255,0.05)',
          color: selected.size === 2 ? '#fff' : 'rgba(255,255,255,0.2)',
          transition: 'all 0.2s',
        }}
      >
        Start Mission <ArrowRight size={16} />
      </button>
      {selected.size < 2 && (
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontWeight: 700 }}>
          Select {2 - selected.size} more tool{selected.size === 1 ? '' : 's'}
        </p>
      )}
    </div>
  );
}
