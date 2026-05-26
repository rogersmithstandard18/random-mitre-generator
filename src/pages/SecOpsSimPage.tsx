import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  ROLES, INCIDENTS, DRILLS, KIND_META, ALTITUDE_LABELS,
  type SocRole, type SocIncident, type SocDrill, type DrillOption,
} from '@/constants/socSimData';

// ─── Nav pages per altitude ──────────────────────────────────────
const NAV_BY_ALTITUDE: Record<number, string[]> = {
  0: ['home', 'queue', 'training'],
  1: ['home', 'queue', 'training'],
  2: ['home', 'queue', 'training'],
  3: ['home', 'queue', 'training'],
  4: ['home', 'queue', 'training'],
  5: ['home', 'queue', 'training'],
  6: ['home', 'queue'],
};

const PAGE_LABELS: Record<string, { label: string; icon: string }> = {
  home:     { label: 'Dashboard',       icon: '⬛' },
  queue:    { label: 'Incident Queue',  icon: '📥' },
  training: { label: 'Training Drills', icon: '🎯' },
};

// ─── Tiny shared primitives ──────────────────────────────────────
const SEV_COLORS: Record<string, { bg: string; color: string }> = {
  Critical: { bg: '#FEF2F2', color: '#DC2626' },
  High:     { bg: '#FFF7ED', color: '#EA580C' },
  Medium:   { bg: '#FFFBEB', color: '#D97706' },
  Low:      { bg: '#F0FDF4', color: '#16A34A' },
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Containment:  { bg: '#EFF6FF', color: '#2563EB' },
  Eradicating:  { bg: '#FEF2F2', color: '#DC2626' },
  Hunting:      { bg: '#FAF5FF', color: '#7C3AED' },
  Mitigating:   { bg: '#FFF7ED', color: '#EA580C' },
  Triage:       { bg: '#FFFBEB', color: '#D97706' },
  Closed:       { bg: '#F9FAFB', color: '#6B7280' },
};

const SLA_DOT_COLOR: Record<string, string> = {
  ok: '#16A34A',
  'at-risk': '#D97706',
  breach: '#DC2626',
};

function Chip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 5,
      fontSize: 11, fontWeight: 500, ...style,
    }}>{children}</span>
  );
}

function SevChip({ sev }: { sev: string }) {
  const c = SEV_COLORS[sev] || { bg: '#F3F4F6', color: '#6B7280' };
  return <Chip style={{ background: c.bg, color: c.color }}>{sev}</Chip>;
}

function StatusChip({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return <Chip style={{ background: c.bg, color: c.color }}>{status}</Chip>;
}

function SlaRow({ sla }: { sla: { ack: string; contain: string; resolve: string } }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, fontFamily: 'monospace', fontSize: 11 }}>
      {(['ack', 'contain', 'resolve'] as const).map(k => (
        <span key={k} title={`${k}: ${sla[k]}`} style={{ color: SLA_DOT_COLOR[sla[k]] || '#ccc' }}>●</span>
      ))}
    </span>
  );
}

function KpiCard({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: 'good' | 'bad' | 'warn' }) {
  const toneColor = tone === 'good' ? '#16A34A' : tone === 'bad' ? '#DC2626' : tone === 'warn' ? '#D97706' : '#1A1A1A';
  return (
    <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 10, padding: '14px 18px' }}>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: toneColor, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
      {note && <div style={{ fontSize: 11.5, color: '#9A9A98', marginTop: 4 }}>{note}</div>}
    </div>
  );
}

function formatAge(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function formatDollars(n: number) {
  if (n === 0) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ─── Sidebar ─────────────────────────────────────────────────────
function SimSidebar({ role, page, setPage, onSwitchRole }: {
  role: SocRole; page: string; setPage: (p: string) => void; onSwitchRole: () => void;
}) {
  const navIds = NAV_BY_ALTITUDE[role.altitude] || ['home', 'queue'];
  const openCrits = INCIDENTS.filter(i => i.severity === 'Critical' && i.status !== 'Closed').length;
  const openTotal = INCIDENTS.filter(i => i.status !== 'Closed').length;

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: '#0F0F11', color: '#C8C7C3',
      display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #26262A',
    }}>
      {/* Brand */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #26262A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: '#1A1A1A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#F5F5F4', flexShrink: 0,
          }}>S</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F4' }}>Stratum</div>
            <div style={{ fontSize: 10.5, color: '#5A5957', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SecOps Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ fontSize: 10, color: '#5A5957', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 6px', fontWeight: 600 }}>Operate</div>
        <nav>
          {navIds.map(id => (
            <button key={id} onClick={() => setPage(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '8px 10px', borderRadius: 7, border: 0, cursor: 'pointer',
              background: page === id ? '#1C1C20' : 'transparent',
              color: page === id ? '#F5F5F4' : '#8E8D89',
              fontSize: 13, fontWeight: page === id ? 500 : 400,
              textAlign: 'left', marginBottom: 2,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 13 }}>
                {id === 'home' ? '⬡' : id === 'queue' ? '⊞' : '◎'}
              </span>
              <span style={{ flex: 1 }}>{PAGE_LABELS[id]?.label}</span>
              {id === 'queue' && openTotal > 0 && (
                <span style={{
                  background: '#DC2626', color: '#fff', borderRadius: 10,
                  fontSize: 10, fontWeight: 700, padding: '1px 6px',
                }}>{openTotal}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Status */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: '#5A5957', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 6px', fontWeight: 600 }}>Status</div>
          {[
            { label: 'Open Sev-1', value: openCrits, color: '#DC2626' },
            { label: 'Open total', value: openTotal, color: '#C8C7C3' },
            { label: 'Shift load', value: '87%', color: '#D97706' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', fontSize: 12 }}>
              <span style={{ color: '#5A5957' }}>{s.label}</span>
              <span style={{ color: s.color, fontFamily: 'monospace', fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User / Role switcher */}
      <button onClick={onSwitchRole} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderTop: '1px solid #26262A', border: 0, background: 'transparent',
        color: '#C8C7C3', cursor: 'pointer', width: '100%', textAlign: 'left',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#1B3A8B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>{role.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: '#F5F5F4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.name}</div>
          <div style={{ fontSize: 11, color: '#5A5957', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.short}</div>
        </div>
        <span style={{ color: '#5A5957', fontSize: 14 }}>⌄</span>
      </button>
    </aside>
  );
}

// ─── Role Switcher Modal ──────────────────────────────────────────
function RoleModal({ current, onPick, onClose }: {
  current: SocRole; onPick: (r: SocRole) => void; onClose: () => void;
}) {
  const grouped = useMemo(() => {
    const g: Record<string, SocRole[]> = {};
    ROLES.forEach(r => {
      const k = ALTITUDE_LABELS[r.altitude];
      (g[k] = g[k] || []).push(r);
    });
    return g;
  }, []);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 14, width: 460, maxHeight: '80vh',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E7E5E1' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Switch role</div>
          <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 3 }}>See the same incidents at a different altitude.</div>
        </div>
        <div style={{ overflowY: 'auto', padding: '8px 12px 12px' }}>
          {Object.entries(grouped).map(([alt, list]) => (
            <div key={alt}>
              <div style={{ fontSize: 10.5, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 8px 4px', fontWeight: 600 }}>{alt}</div>
              {list.map(r => (
                <div key={r.id} onClick={() => { onPick(r); onClose(); }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 8,
                  background: current.id === r.id ? '#EFF6FF' : 'transparent',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = current.id === r.id ? '#EFF6FF' : '#F4F4F2')}
                  onMouseLeave={e => (e.currentTarget.style.background = current.id === r.id ? '#EFF6FF' : 'transparent')}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: current.id === r.id ? '#2563EB' : '#E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: current.id === r.id ? '#fff' : '#374151', flexShrink: 0,
                  }}>{r.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{r.name} · Alt {r.altitude}</div>
                  </div>
                  {current.id === r.id && <span style={{ color: '#2563EB', fontSize: 16 }}>✓</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Home Dashboard ───────────────────────────────────────────────
function HomeView({ role, setPage }: { role: SocRole; setPage: (p: string) => void }) {
  const open = INCIDENTS.filter(i => i.status !== 'Closed');
  const crits = open.filter(i => i.severity === 'Critical');
  const totalRisk = open.reduce((s, i) => s + i.dollarsAtRisk, 0);
  const topInc = INCIDENTS.find(i => i.id === 'INC-9201');

  const altLabel = ALTITUDE_LABELS[role.altitude];

  const roleContext: Record<string, { headline: string; sub: string; decisions: string[] }> = {
    t1: {
      headline: 'Your active queue · 1 assigned',
      sub: 'Focus on the next SOP step. Escalate fast on exec assets.',
      decisions: ['Pull Sysmon EID 3 for EXEC-LAPTOP-07', 'Decode base64 payload in sandbox', 'Escalate to T3 if jitter confirmed', 'Log every action in the ticket'],
    },
    sr_analyst: {
      headline: 'T1059.001 + PrintNightmare chain · confirmed APT pattern',
      sub: 'Correlate across hosts, scope blast radius before containment.',
      decisions: ['Pivot on 94.130.88.12 — 2 other hosts contacted it', 'Pull memory before reboot', 'Recommend isolate + token revoke', 'Hand off to IR with the full chain'],
    },
    shift_lead: {
      headline: 'Critical exec incident — Devon on it, IR engaged',
      sub: 'Keep the floor moving. Reassign to free capacity.',
      decisions: ['Confirm IR engagement at +9m', 'Move INC-9176 to Marcus to free Maya', 'Page on-call CISO if scope expands', 'Log shift handoff to APAC at 19:00'],
    },
    soc_manager: {
      headline: '3 criticals in containment · MTTD 5m 11s · on target',
      sub: 'Capacity tight: 2 of 47 on PTO, weekend on-call gap Sat 02–06.',
      decisions: ['Approve overtime for IR weekend shift', 'Brief Director at 10:00 standup', 'Flag exec-laptop pattern to DetEng', 'Submit Q3 capacity ask for 2 T3s'],
    },
    dir_secops: {
      headline: 'Active critical in containment · zero customer impact',
      sub: '3rd PrintNightmare-derived incident in 90 days — rule R-2103 needs rebuild.',
      decisions: ['Greenlight rule R-2103 v2 sprint', 'Add PrintNightmare to next tabletop', 'Review exec-asset hardening posture', 'Budget ask: $1.2M EDR refresh'],
    },
    ciso: {
      headline: '$8.4M at risk, $0 realized · controls held',
      sub: 'Control C-117 (privileged session monitoring) prevented scope expansion.',
      decisions: ['Approve emergency comms to CEO', 'Confirm regulatory non-reportable', 'Sign off on $1.2M EDR refresh', 'Board talking points for Thursday'],
    },
    ceo: {
      headline: 'All systems operating. One critical security event, fully contained.',
      sub: 'An executive laptop was compromised this morning. Contained, no data exfiltrated, no customer impact.',
      decisions: ['Acknowledge briefing from Lena (CISO)', 'No external comms required', 'Continue scheduled programming'],
    },
  };

  const ctx = roleContext[role.id] || roleContext['soc_manager'];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          {altLabel} · {role.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.018em', margin: 0 }}>{ctx.headline}</h1>
            <p style={{ fontSize: 13.5, color: '#4B4B48', marginTop: 6 }}>{ctx.sub}</p>
          </div>
          <button onClick={() => setPage('queue')} style={{
            padding: '8px 16px', background: '#1A1A1A', color: '#fff', border: 0,
            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0,
          }}>View queue →</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard label="MTTD · 7d" value="5m 11s" note="Target ≤7m · ↓18% w/w" tone="good" />
        <KpiCard label="MTTR Sev-1 · 30d" value="47m" note="Target 60m · on track" tone="good" />
        <KpiCard label="Open criticals" value={String(crits.length)} note="0 customer impact" tone={crits.length >= 3 ? 'bad' : 'warn'} />
        <KpiCard label="$ at risk · open" value={formatDollars(totalRisk)} note="$0 realized today" tone="warn" />
      </div>

      {/* Active incident callout */}
      {topInc && (
        <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, background: '#DC2626', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px #FEF2F2' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active critical · {topInc.id}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{topInc.title}</div>
          <div style={{ fontSize: 13, color: '#4B4B48', lineHeight: 1.55, marginBottom: 12 }}>{topInc.summary}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {topInc.fintechTags.map(t => (
              <Chip key={t} style={{ background: '#FAF5FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>{t}</Chip>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #E7E5E1', paddingTop: 12 }}>
            <div style={{ fontSize: 11.5, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>
              Your next decisions at {altLabel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ctx.decisions.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.5 }}>
                  <span style={{ color: '#2563EB', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent queue snapshot */}
      <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E7E5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Open incidents snapshot</div>
          <button onClick={() => setPage('queue')} style={{ fontSize: 12.5, color: '#2563EB', background: 'transparent', border: 0, cursor: 'pointer' }}>View all →</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#FAFAF9' }}>
              {['', 'Incident', 'Status', 'Age', 'SLA'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, color: '#9A9A98', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E7E5E1' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {open.slice(0, 5).map(inc => (
              <tr key={inc.id} style={{ borderBottom: '1px solid #F4F4F2' }}>
                <td style={{ padding: '10px 14px', width: 60 }}><SevChip sev={inc.severity} /></td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>{inc.title}</div>
                  <div style={{ fontSize: 11.5, color: '#9A9A98', fontFamily: 'monospace' }}>{inc.id} · {inc.mitre}</div>
                </td>
                <td style={{ padding: '10px 14px' }}><StatusChip status={inc.status} /></td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{formatAge(inc.ageMin)}</td>
                <td style={{ padding: '10px 14px' }}><SlaRow sla={inc.sla} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Incident Queue ───────────────────────────────────────────────
function QueueView() {
  const [search, setSearch] = useState('');
  const [filterSev, setFilterSev] = useState('all');
  const [filterKind, setFilterKind] = useState('all');

  const filtered = useMemo(() => INCIDENTS.filter(i => {
    if (filterSev !== 'all' && i.severity !== filterSev) return false;
    if (filterKind !== 'all' && i.kind !== filterKind) return false;
    if (search && !`${i.id} ${i.title} ${i.asset}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, filterSev, filterKind]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: 6, border: '1px solid ' + (active ? '#1A1A1A' : '#E7E5E1'),
    background: active ? '#1A1A1A' : '#fff', color: active ? '#fff' : '#4B4B48',
    fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.018em' }}>Incident Queue</h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', marginTop: 4 }}>{filtered.length} of {INCIDENTS.length} incidents · filter to your scope</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, host, title…"
            style={{
              flex: '0 1 240px', padding: '7px 10px', border: '1px solid #E7E5E1',
              borderRadius: 7, fontSize: 13, background: '#FAFAF9', color: '#1A1A1A',
            }}
          />
          {['all', 'Critical', 'High', 'Medium', 'Low'].map(s => (
            <button key={s} style={btnStyle(filterSev === s)} onClick={() => setFilterSev(s)}>
              {s === 'all' ? 'All severities' : s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button style={btnStyle(filterKind === 'all')} onClick={() => setFilterKind('all')}>All types</button>
          {Object.entries(KIND_META).map(([k, m]) => (
            <button key={k} style={btnStyle(filterKind === k)} onClick={() => setFilterKind(filterKind === k ? 'all' : k)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E7E5E1', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#FAFAF9' }}>
              {['', 'Incident', 'Asset · Assignee', 'Status', 'Age', '$ at risk', 'SLA'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, color: '#9A9A98', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E7E5E1' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inc, idx) => (
              <tr key={inc.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F4F4F2' : undefined }}>
                <td style={{ padding: '10px 14px', width: 70 }}><SevChip sev={inc.severity} /></td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500 }}>{inc.title}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#9A9A98', fontFamily: 'monospace' }}>{inc.id} · {inc.mitre}</div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 12.5, color: '#4B4B48' }}>{inc.asset}</div>
                  <div style={{ fontSize: 11.5, color: '#9A9A98' }}>{inc.assignee}</div>
                </td>
                <td style={{ padding: '10px 14px' }}><StatusChip status={inc.status} /></td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{formatAge(inc.ageMin)}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: inc.dollarsAtRisk > 0 ? '#DC2626' : '#9A9A98', fontWeight: inc.dollarsAtRisk > 0 ? 600 : 400 }}>
                  {formatDollars(inc.dollarsAtRisk)}
                </td>
                <td style={{ padding: '10px 14px' }}><SlaRow sla={inc.sla} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#9A9A98', fontSize: 14 }}>No incidents match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Training Drills ──────────────────────────────────────────────
function TrainingView({ onStartDrill }: { onStartDrill: (d: SocDrill) => void }) {
  const sevColors = { Critical: '#DC2626', High: '#EA580C', Medium: '#D97706' };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.018em' }}>Training & Drills</h1>
        <p style={{ fontSize: 13.5, color: '#6B7280', marginTop: 4 }}>
          SOC interview-style scenarios. Review evidence, make the call, get the after-action.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {DRILLS.map(drill => (
          <div key={drill.id} style={{
            background: '#fff', border: '1px solid #E7E5E1', borderRadius: 12,
            padding: 20, display: 'flex', gap: 18, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: drill.severity === 'Critical' ? '#FEF2F2' : '#FFF7ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              {drill.category.includes('Network') ? '🛡️' : drill.category.includes('Kerberos') ? '🔑' : '🏛️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Chip style={{
                  background: drill.severity === 'Critical' ? '#FEF2F2' : '#FFF7ED',
                  color: sevColors[drill.severity as keyof typeof sevColors] || '#6B7280',
                }}>{drill.severity}</Chip>
                <span style={{ fontSize: 11.5, color: '#9A9A98', fontFamily: 'monospace' }}>{drill.incidentId}</span>
                <span style={{ fontSize: 11.5, color: '#9A9A98' }}>· ~{drill.estMin} min</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.012em', marginBottom: 4 }}>{drill.title}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{drill.category} · {drill.level}</div>
              <div style={{ fontSize: 12.5, color: '#4B4B48', lineHeight: 1.5, marginBottom: 10 }}>
                <span style={{ fontFamily: 'monospace', color: '#7C3AED' }}>{drill.mitre.split(' — ')[0]}</span>
                {' — '}{drill.fintechFraming}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {drill.expectedTerms.slice(0, 6).map(t => (
                  <Chip key={t} style={{ background: '#EFEEEA', color: '#4B4B48', fontSize: 10.5, fontFamily: 'monospace' }}>{t}</Chip>
                ))}
                {drill.expectedTerms.length > 6 && (
                  <Chip style={{ background: '#EFEEEA', color: '#9A9A98', fontSize: 10.5 }}>+{drill.expectedTerms.length - 6} more</Chip>
                )}
              </div>
            </div>
            <button onClick={() => onStartDrill(drill)} style={{
              padding: '9px 18px', background: '#1A1A1A', color: '#fff',
              border: 0, borderRadius: 8, fontSize: 13.5, fontWeight: 500,
              cursor: 'pointer', flexShrink: 0, alignSelf: 'center',
            }}>Run drill →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Drill Runner Modal ───────────────────────────────────────────
type DrillStage = 'brief' | 'evidence' | 'decide' | 'aar';

function DrillModal({ drill, onClose }: { drill: SocDrill; onClose: () => void }) {
  const [stage, setStage] = useState<DrillStage>('brief');
  const [pick, setPick] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const chosen = drill.options.find(o => o.id === pick);

  const tabs: [DrillStage, string][] = [
    ['brief', '1 · Brief'],
    ['evidence', '2 · Evidence'],
    ['decide', '3 · Decide'],
    ['aar', '4 · After-action'],
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 900,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E7E5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Chip style={{ background: '#1A1A1A', color: '#fff' }}>Drill</Chip>
            <SevChip sev={drill.severity} />
            <span style={{ fontSize: 12, color: '#9A9A98', fontFamily: 'monospace' }}>{drill.incidentId}</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 0, fontSize: 20, cursor: 'pointer', color: '#9A9A98', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        {/* Stage tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E7E5E1', padding: '0 20px' }}>
          {tabs.map(([k, l]) => {
            const locked = k === 'aar' && !revealed;
            return (
              <button key={k} onClick={() => { if (!locked) setStage(k); }} style={{
                padding: '10px 14px', background: 'transparent', border: 0,
                fontSize: 12.5, color: stage === k ? '#1A1A1A' : '#9A9A98',
                fontWeight: stage === k ? 600 : 400,
                borderBottom: stage === k ? '2px solid #1A1A1A' : '2px solid transparent',
                marginBottom: -1, cursor: locked ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.4 : 1, fontFamily: 'inherit',
              }}>{l}</button>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {stage === 'brief' && <DrillBrief drill={drill} onNext={() => setStage('evidence')} />}
          {stage === 'evidence' && <DrillEvidence drill={drill} onNext={() => setStage('decide')} onBack={() => setStage('brief')} />}
          {stage === 'decide' && (
            <DrillDecide
              drill={drill} pick={pick} setPick={setPick}
              revealed={revealed} setRevealed={setRevealed} chosen={chosen || null}
              onNext={() => setStage('aar')} onBack={() => setStage('evidence')}
            />
          )}
          {stage === 'aar' && <DrillAAR drill={drill} chosen={chosen || null} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function DrillBrief({ drill, onNext }: { drill: SocDrill; onNext: () => void }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{drill.category}</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.018em', margin: '0 0 6px' }}>{drill.title}</h2>
      <div style={{ fontSize: 13, color: '#9A9A98', marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace' }}>{drill.mitre}</span> · {drill.level} · ~{drill.estMin} min
      </div>

      <div style={{ padding: 14, borderRadius: 10, background: '#F4F4F2', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Fintech context</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{drill.fintechFraming}</div>
      </div>

      <div style={{ border: '1px solid #E7E5E1', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '10px 14px', background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 500, borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, background: '#DC2626', borderRadius: '50%', display: 'inline-block' }} />
          SIEM alert · just fired
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px 12px', fontSize: 13 }}>
            {[
              ['Rule', drill.alert.ruleName],
              ['Type', drill.alert.ruleType],
              ['Fired at', drill.alert.firedAt],
              ['Asset', drill.alert.asset],
              ['Summary', drill.alert.summary],
            ].map(([k, v]) => (
              <>
                <div key={k + '-k'} style={{ color: '#9A9A98' }}>{k}</div>
                <div key={k + '-v'} style={{ fontWeight: k === 'Rule' ? 500 : 400, fontFamily: ['Fired at', 'Asset'].includes(k) ? 'monospace' : 'inherit', fontSize: k === 'Fired at' || k === 'Asset' ? 12 : 13 }}>{v}</div>
              </>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#9A9A98' }}>Review evidence next, then make the call.</div>
        <button onClick={onNext} style={{ padding: '9px 18px', background: '#1A1A1A', color: '#fff', border: 0, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
          Pull the evidence →
        </button>
      </div>
    </div>
  );
}

function DrillEvidence({ drill, onNext, onBack }: { drill: SocDrill; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <Section title="Raw telemetry">
        <div style={{
          background: '#0B0B0C', color: '#C8C7C3', borderRadius: 8,
          padding: 14, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6,
          maxHeight: 240, overflowY: 'auto', whiteSpace: 'pre-wrap',
        }}>{drill.evidence.logs}</div>
      </Section>

      {drill.evidence.pacAnomaly && (
        <Section title="PAC inspection" style={{ marginTop: 16 }}>
          <div style={{ padding: 12, borderRadius: 8, background: '#FFFBEB', color: '#92400E', fontSize: 13, lineHeight: 1.55, border: '1px solid #FDE68A' }}>
            {drill.evidence.pacAnomaly}
          </div>
        </Section>
      )}

      {drill.evidence.replicationDetail && (
        <Section title="DRSUAPI call detail" style={{ marginTop: 16 }}>
          <div style={{ padding: 12, borderRadius: 8, background: '#FFFBEB', color: '#92400E', fontSize: 13, lineHeight: 1.55, border: '1px solid #FDE68A' }}>
            {drill.evidence.replicationDetail}
          </div>
        </Section>
      )}

      {drill.evidence.asnMix && (
        <Section title="Source ASN distribution" style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr>
              <th style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, color: '#9A9A98', fontWeight: 600, textTransform: 'uppercase' }}>ASN</th>
              <th style={{ textAlign: 'right', padding: '6px 8px', fontSize: 11, color: '#9A9A98', fontWeight: 600, textTransform: 'uppercase' }}>Volume</th>
            </tr></thead>
            <tbody>
              {drill.evidence.asnMix.map(([a, v]) => (
                <tr key={a} style={{ borderTop: '1px solid #F4F4F2' }}>
                  <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12 }}>{a}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      <Section title="Signals & alerts" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {drill.evidence.networkAlerts.map((a, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 8, border: '1px solid #E7E5E1' }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{a.name}</div>
              <div style={{ fontSize: 12.5, color: '#4B4B48', lineHeight: 1.5 }}>{a.detail}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Threat intel" style={{ marginTop: 16 }}>
        <div style={{ padding: 12, borderRadius: 8, background: '#F4F4F2' }}>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, marginBottom: 6 }}><b>Attribution.</b> {drill.threatIntel.attribution}</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55 }}><b>Reputation.</b> {drill.threatIntel.reputation}</div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button onClick={onBack} style={{ padding: '9px 18px', background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1', borderRadius: 8, fontSize: 13.5, cursor: 'pointer' }}>← Brief</button>
        <button onClick={onNext} style={{ padding: '9px 18px', background: '#1A1A1A', color: '#fff', border: 0, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>Make the call →</button>
      </div>
    </div>
  );
}

function DrillDecide({ drill, pick, setPick, revealed, setRevealed, chosen, onNext, onBack }: {
  drill: SocDrill; pick: string | null; setPick: (id: string) => void;
  revealed: boolean; setRevealed: (v: boolean) => void; chosen: DrillOption | null;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.012em', margin: '0 0 4px' }}>What do you do?</h3>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
        Pick one. You'll see why every option is right or wrong — that's where the muscle memory forms.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {drill.options.map(o => {
          const isPick = pick === o.id;
          const showCorrect = revealed && o.correct;
          const showWrong = revealed && isPick && !o.correct;
          const disabled = revealed && !isPick && !o.correct;

          return (
            <button key={o.id} onClick={() => !revealed && setPick(o.id)} disabled={revealed && !isPick && !o.correct}
              style={{
                textAlign: 'left', padding: 14, borderRadius: 10, cursor: disabled ? 'default' : revealed ? 'default' : 'pointer',
                border: '1px solid ' + (showCorrect ? '#16A34A' : showWrong ? '#DC2626' : isPick ? '#1A1A1A' : '#E7E5E1'),
                background: showCorrect ? '#F0FDF4' : showWrong ? '#FEF2F2' : isPick ? '#FAFAFA' : '#fff',
                opacity: disabled ? 0.5 : 1, fontFamily: 'inherit', color: '#1A1A1A', width: '100%',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: showCorrect ? '#16A34A' : showWrong ? '#DC2626' : isPick ? '#1A1A1A' : '#F4F4F2',
                  color: (showCorrect || showWrong || isPick) ? '#fff' : '#6B7280',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {revealed ? (o.correct ? '✓' : isPick ? '✗' : o.id.toUpperCase()) : o.id.toUpperCase()}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{o.label}</div>
                  <div style={{ fontSize: 12.5, color: '#6B7280', lineHeight: 1.5 }}>{o.action}</div>
                  {revealed && (isPick || o.correct) && (
                    <div style={{
                      marginTop: 10, padding: 10, borderRadius: 8,
                      background: '#fff', border: '1px solid ' + (o.correct ? '#16A34A' : '#DC2626'),
                      fontSize: 12.5, lineHeight: 1.55, color: '#4B4B48',
                    }}>
                      <span style={{ fontWeight: 600, color: o.correct ? '#16A34A' : '#DC2626' }}>
                        {o.correct ? 'Correct. ' : 'Why this fails. '}
                      </span>
                      {o.explanation}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: '#9A9A98', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 600 }}>Terms to use in your reasoning</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {drill.expectedTerms.map(t => (
            <Chip key={t} style={{ background: '#F4F4F2', color: '#4B4B48', fontSize: 10.5, fontFamily: 'monospace' }}>{t}</Chip>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ padding: '9px 18px', background: '#fff', color: '#1A1A1A', border: '1px solid #E7E5E1', borderRadius: 8, fontSize: 13.5, cursor: 'pointer' }}>← Evidence</button>
        {!revealed
          ? <button onClick={() => setRevealed(true)} disabled={!pick} style={{
              padding: '9px 18px', background: !pick ? '#E5E7EB' : '#1A1A1A',
              color: !pick ? '#9CA3AF' : '#fff', border: 0, borderRadius: 8,
              fontSize: 13.5, fontWeight: 500, cursor: !pick ? 'not-allowed' : 'pointer',
            }}>Reveal answer</button>
          : <button onClick={onNext} style={{ padding: '9px 18px', background: '#1A1A1A', color: '#fff', border: 0, borderRadius: 8, fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>After-action report →</button>
        }
      </div>
    </div>
  );
}

function DrillAAR({ drill, chosen, onClose }: { drill: SocDrill; chosen: DrillOption | null; onClose: () => void }) {
  const isCorrect = chosen?.correct;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 38, height: 38, borderRadius: 10,
          background: isCorrect ? '#16A34A' : '#D97706', color: '#fff', fontSize: 18, fontWeight: 700,
        }}>{isCorrect ? '✓' : '→'}</span>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>{isCorrect ? 'Strong call.' : 'Worth running again.'}</div>
          <div style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>{drill.title}</div>
        </div>
      </div>

      <Section title="What happened">
        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{drill.aar.whatHappened}</div>
      </Section>
      <Section title="Adversary TTP" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{drill.aar.ttp}</div>
      </Section>
      <Section title="Lesson" style={{ marginTop: 16 }}>
        <div style={{ padding: 14, borderRadius: 8, background: '#F4F4F2', fontSize: 13.5, lineHeight: 1.6 }}>{drill.aar.lesson}</div>
      </Section>
      <Section title="Key terms" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {drill.aar.keyTerms.map(t => (
            <Chip key={t} style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: 11 }}>{t}</Chip>
          ))}
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button onClick={onClose} style={{ padding: '9px 22px', background: '#1A1A1A', color: '#fff', border: 0, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Done</button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function SecOpsSimPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [role, setRole] = useState<SocRole>(() => ROLES.find(r => r.id === 'soc_manager')!);
  const [page, setPage] = useState('home');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeDrill, setActiveDrill] = useState<SocDrill | null>(null);

  if (!isAuthenticated) {
    navigate('/demo');
    return null;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden', background: '#FAFAF9' }}>
      <SimSidebar role={role} page={page} setPage={setPage} onSwitchRole={() => setShowRoleModal(true)} />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {page === 'home' && <HomeView role={role} setPage={setPage} />}
        {page === 'queue' && <QueueView />}
        {page === 'training' && <TrainingView onStartDrill={setActiveDrill} />}
      </main>

      {showRoleModal && (
        <RoleModal current={role} onPick={r => { setRole(r); setPage('home'); }} onClose={() => setShowRoleModal(false)} />
      )}

      {activeDrill && (
        <DrillModal drill={activeDrill} onClose={() => setActiveDrill(null)} />
      )}
    </div>
  );
}
