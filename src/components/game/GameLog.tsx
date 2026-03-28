import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import type { LogEntry } from '@/types/GameState';

const LOG_COLORS: Record<string, string> = {
  success: '#22c55e',
  danger: '#ef4444',
  warn: '#f59e0b',
  info: '#60a5fa',
  system: '#8b5cf6',
};

export default function GameLog({ entries }: { entries: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div>
      <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Terminal size={10} color="#14b8a6" /> Action Log
      </h3>
      <div style={{
        background: '#0a0c10',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: 12,
        maxHeight: 220,
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: 11,
      }}>
        {entries.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', margin: 0 }}>Awaiting actions...</p>
        )}
        {entries.map((entry, i) => (
          <div key={i} style={{ color: LOG_COLORS[entry.type] || '#fff', marginBottom: 4, lineHeight: 1.5 }}>
            <span style={{ color: 'rgba(255,255,255,0.15)', marginRight: 6 }}>T{entry.turn}{'>'}</span>
            {entry.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
