import { Wrench } from 'lucide-react';
import type { GameState, ToolId } from '@/types/GameState';
import { TOOLS_DEF, ALL_TOOL_IDS, toolSpCost } from '@/constants/gameData';

interface Props {
  state: GameState;
  onDeploy: (id: ToolId) => void;
}

export default function ToolGrid({ state, onDeploy }: Props) {
  const available = new Set([...state.startingTools, ...state.unlockedTools]);
  const threat = state.activeThreat;
  const isPlaying = state.phase === 'playing';

  return (
    <div>
      <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Wrench size={10} color="#14b8a6" /> Security Tools
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {ALL_TOOL_IDS.map(id => {
          const tool = state.tools[id];
          const isAvailable = available.has(id);
          const onCooldown = tool.currentCooldown > 0;
          const eff = threat ? (state.unlockedTools.has(id) ? TOOLS_DEF[id].effectiveness[threat.type][1] : TOOLS_DEF[id].effectiveness[threat.type][0]) : 0;
          const cost = toolSpCost(eff);
          const canUse = isPlaying && isAvailable && !onCooldown && state.sp >= cost;

          let statusText = '';
          let statusColor = '';
          if (!isAvailable) {
            statusText = 'LOCKED';
            statusColor = 'rgba(255,255,255,0.2)';
          } else if (onCooldown) {
            statusText = `COOLDOWN ${tool.currentCooldown}`;
            statusColor = '#f59e0b';
          } else {
            statusText = state.startingTools.has(id) ? 'STARTING' : 'UNLOCKED';
            statusColor = '#22c55e';
          }

          return (
            <button
              key={id}
              onClick={() => canUse && onDeploy(id)}
              disabled={!canUse}
              style={{
                padding: 10,
                borderRadius: 10,
                border: canUse ? '1px solid rgba(20,184,166,0.4)' : '1px solid rgba(255,255,255,0.08)',
                background: canUse ? 'rgba(20,184,166,0.06)' : isAvailable ? '#151821' : 'rgba(255,255,255,0.02)',
                cursor: canUse ? 'pointer' : 'default',
                textAlign: 'left',
                transition: 'all 0.15s',
                opacity: !isAvailable ? 0.4 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: canUse ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {tool.name}
                </span>
                {isAvailable && isPlaying && (
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'rgba(20,184,166,0.15)', color: '#14b8a6', fontWeight: 900 }}>
                    {cost} SP
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: statusColor }}>
                  {statusText}
                </span>
                {isAvailable && threat && (
                  <span style={{ fontSize: 8, color: eff >= 0.8 ? '#22c55e' : eff > 0 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                    {Math.round(eff * 100)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
