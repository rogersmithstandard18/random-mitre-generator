import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { CaseFileScenario, TicketDraft } from '@/types/CaseFile';

const BLANK_TICKET: TicketDraft = {
  alert_summary: '',
  evidence_collected: '',
  scope_notes: '',
  actions_taken: '',
  containment_decision: '',
  escalation_notes: '',
  open_questions: '',
  severity: '',
  confidence: '',
  real_or_noise: '',
  escalated: false,
};

function levelColor(level: number) {
  if (level === 1) return '#14b8a6';
  if (level === 2) return '#f59e0b';
  return '#8b5cf6';
}

export default function CaseFilesPage() {
  const token = useAuthStore((s) => s.token);
  const features = useAuthStore((s) => s.getTierFeatures());

  const [scenarios, setScenarios] = useState<CaseFileScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<CaseFileScenario | null>(null);

  // Drill state
  const [missionChecked, setMissionChecked] = useState<Set<number>>(new Set());
  const [evidenceChecked, setEvidenceChecked] = useState<Set<number>>(new Set());
  const [scopeSelections, setScopeSelections] = useState<Set<string>>(new Set());
  const [escalationSelections, setEscalationSelections] = useState<Set<string>>(new Set());
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [bridgeTab, setBridgeTab] = useState<'ladder' | 'rules' | 'patterns' | 'close'>('ladder');

  // Ticket state
  const [ticket, setTicket] = useState<TicketDraft>(BLANK_TICKET);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetDrillState = useCallback(() => {
    setMissionChecked(new Set());
    setEvidenceChecked(new Set());
    setScopeSelections(new Set());
    setEscalationSelections(new Set());
    setSelectedDecision(null);
    setBridgeOpen(false);
    setBridgeTab('ladder');
    setTicket(BLANK_TICKET);
    setSubmitted(false);
    setSubmitError(null);
  }, []);

  const selectScenario = useCallback((scenario: CaseFileScenario) => {
    setActiveScenario(scenario);
    resetDrillState();
  }, [resetDrillState]);

  useEffect(() => {
    if (!features.canAccessCaseFiles || !token) {
      setLoading(false);
      return;
    }
    fetch('/api/case-files/scenarios', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setScenarios(data.scenarios || []);
        if (data.scenarios?.length) setActiveScenario(data.scenarios[0]);
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [features.canAccessCaseFiles, token]);

  const handleSubmit = async () => {
    if (!activeScenario || !token) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/case-files/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          onetsocCode: activeScenario.onetsoc_code,
          caseTitle: activeScenario.title,
          ticketDraft: ticket,
          missionChecked: Array.from(missionChecked),
          scopeSelections: Array.from(scopeSelections),
          escalationSelections: Array.from(escalationSelections),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Tier gate ---
  if (!features.canAccessCaseFiles) {
    return (
      <div className="empty-state" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <Lock size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h2 style={{ marginBottom: '0.5rem' }}>Pro Feature</h2>
        <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
          Case File Workbooks are available on the Professional and Team plans.
        </p>
        <Link
          to="/#pricing"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: '#14b8a6',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View Pricing
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="empty-state"><p>Loading scenarios...</p></div>;
  }

  if (fetchError) {
    return <div className="empty-state"><p>Error: {fetchError}</p></div>;
  }

  const missionTotal = activeScenario?.mission_steps.length ?? 0;
  const missionDone = missionChecked.size;
  const progressPct = missionTotal > 0 ? Math.round((missionDone / missionTotal) * 100) : 0;
  const bridge = activeScenario?.learning_bridge;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', minHeight: '60vh' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, marginBottom: '0.75rem' }}>
          Scenarios
        </h3>
        {scenarios.map((s) => {
          const active = activeScenario?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectScenario(s)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.4rem',
                borderRadius: '6px',
                border: active ? `2px solid ${levelColor(s.level)}` : '2px solid transparent',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: levelColor(s.level),
                  color: '#fff',
                  marginBottom: '0.25rem',
                }}
              >
                {s.level_label.split(' - ')[0]}
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.3 }}>{s.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main pane */}
      {activeScenario && (
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: levelColor(activeScenario.level),
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              {activeScenario.level_label}
            </span>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{activeScenario.title}</h1>
            {activeScenario.subtitle && (
              <p style={{ opacity: 0.6, fontSize: '0.9rem', margin: 0 }}>{activeScenario.subtitle}</p>
            )}
          </div>

          {/* Scenario text */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1rem',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {activeScenario.scenario_text}
          </div>

          {/* Pause prompt */}
          {activeScenario.pause_prompt && (
            <div
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '6px',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                marginBottom: '1.25rem',
                opacity: 0.85,
              }}
            >
              {activeScenario.pause_prompt}
            </div>
          )}

          {/* Two-column: mission + evidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Mission checklist */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, margin: 0 }}>
                  Mission Steps
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: progressPct === 100 ? '#14b8a6' : undefined,
                  }}
                >
                  {missionDone}/{missionTotal}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '0.75rem' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: '#14b8a6',
                    borderRadius: '2px',
                    transition: 'width 0.2s',
                  }}
                />
              </div>
              {activeScenario.mission_steps.map((step, i) => (
                <label
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    opacity: missionChecked.has(i) ? 0.5 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={missionChecked.has(i)}
                    onChange={() => {
                      const next = new Set(missionChecked);
                      if (next.has(i)) next.delete(i); else next.add(i);
                      setMissionChecked(next);
                    }}
                    style={{ marginTop: '2px', accentColor: '#14b8a6', flexShrink: 0 }}
                  />
                  <span style={{ textDecoration: missionChecked.has(i) ? 'line-through' : 'none' }}>
                    {step}
                  </span>
                </label>
              ))}
            </div>

            {/* Evidence locker */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '0.75rem' }}>
                Evidence Locker
              </h3>
              {activeScenario.evidence_locker.map((ev, i) => (
                <label
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    opacity: evidenceChecked.has(i) ? 0.5 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={evidenceChecked.has(i)}
                    onChange={() => {
                      const next = new Set(evidenceChecked);
                      if (next.has(i)) next.delete(i); else next.add(i);
                      setEvidenceChecked(next);
                    }}
                    style={{ marginTop: '2px', accentColor: '#14b8a6', flexShrink: 0 }}
                  />
                  <span>
                    {ev.item}
                    <span
                      style={{
                        marginLeft: '0.4rem',
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.08)',
                        opacity: 0.7,
                      }}
                    >
                      {ev.category}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Scope + Escalation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '0.75rem' }}>
                Scope Assessment
              </h3>
              {activeScenario.scope_options.map((opt) => (
                <label
                  key={opt}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  <input
                    type="checkbox"
                    checked={scopeSelections.has(opt)}
                    onChange={() => {
                      const next = new Set(scopeSelections);
                      if (next.has(opt)) next.delete(opt); else next.add(opt);
                      setScopeSelections(next);
                    }}
                    style={{ accentColor: '#14b8a6' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '0.75rem' }}>
                Escalation Paths
              </h3>
              {activeScenario.escalation_options.map((opt) => (
                <label
                  key={opt}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  <input
                    type="checkbox"
                    checked={escalationSelections.has(opt)}
                    onChange={() => {
                      const next = new Set(escalationSelections);
                      if (next.has(opt)) next.delete(opt); else next.add(opt);
                      setEscalationSelections(next);
                    }}
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Decision guide */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '0.75rem' }}>
              Decision Guide
            </h3>
            {activeScenario.decision_options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedDecision(selectedDecision === i ? null : i)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.75rem',
                  marginBottom: '0.4rem',
                  borderRadius: '6px',
                  border: selectedDecision === i ? '1.5px solid #14b8a6' : '1.5px solid rgba(255,255,255,0.1)',
                  background: selectedDecision === i ? 'rgba(20,184,166,0.08)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ opacity: 0.55, fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>
                  IF: {opt.condition}
                </span>
                <span style={{ fontWeight: 500 }}>THEN: {opt.action}</span>
              </button>
            ))}
          </div>

          {/* Learning bridge (collapsible) */}
          {bridge && (
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                onClick={() => setBridgeOpen(!bridgeOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.7rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textAlign: 'left',
                }}
              >
                {bridgeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Learning Bridge
              </button>
              {bridgeOpen && (
                <div
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { key: 'ladder', label: 'Investigation Ladder' },
                      { key: 'rules', label: 'Beginner Rules' },
                      { key: 'patterns', label: 'Evidence Patterns' },
                      { key: 'close', label: 'Close Loop' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setBridgeTab(key as typeof bridgeTab)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: bridgeTab === key ? 700 : 400,
                          background: bridgeTab === key ? '#14b8a6' : 'rgba(255,255,255,0.08)',
                          color: bridgeTab === key ? '#fff' : undefined,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {bridgeTab === 'ladder' && bridge.investigation_ladder && (
                    <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {bridge.investigation_ladder.map((s) => (
                        <li key={s.step} style={{ marginBottom: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
                          <strong>{s.label}</strong> — {s.description}
                        </li>
                      ))}
                    </ol>
                  )}

                  {bridgeTab === 'rules' && bridge.beginner_rules && (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {bridge.beginner_rules.map((r, i) => (
                        <li key={i} style={{ marginBottom: '0.4rem', fontSize: '0.875rem', lineHeight: 1.5 }}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {bridgeTab === 'patterns' && bridge.evidence_patterns && (
                    <div>
                      {bridge.evidence_patterns.map((p, i) => (
                        <div
                          key={i}
                          style={{
                            marginBottom: '0.75rem',
                            padding: '0.6rem 0.75rem',
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                          }}
                        >
                          <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.25rem' }}>Pattern:</div>
                          <div style={{ marginBottom: '0.4rem' }}>{p.pattern}</div>
                          <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.25rem' }}>Response:</div>
                          <div style={{ color: '#14b8a6' }}>{p.response}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {bridgeTab === 'close' && bridge.close_loop_questions && (
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {bridge.close_loop_questions.map((q, i) => (
                        <li key={i} style={{ marginBottom: '0.4rem', fontSize: '0.875rem', lineHeight: 1.5 }}>{q}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Ticket form */}
          {submitted ? (
            <div
              style={{
                background: 'rgba(20,184,166,0.1)',
                border: '1px solid rgba(20,184,166,0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Ticket submitted!</p>
              <p style={{ opacity: 0.7, fontSize: '0.875rem', marginBottom: '1rem' }}>
                Your completed case file has been saved.
              </p>
              <button
                onClick={() => {
                  resetDrillState();
                  const next = scenarios.find((s) => s.scenario_number > activeScenario.scenario_number);
                  if (next) selectScenario(next);
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  background: '#14b8a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Next Scenario
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Incident Ticket</h3>

              {/* Real or noise */}
              <div style={{ marginBottom: '0.875rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>
                  Real or Noise?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['likely_real', 'likely_noise', 'unsure'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setTicket((t) => ({ ...t, real_or_noise: v }))}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: ticket.real_or_noise === v ? 700 : 400,
                        background:
                          ticket.real_or_noise === v
                            ? v === 'likely_real' ? '#ef4444' : v === 'likely_noise' ? '#14b8a6' : '#f59e0b'
                            : 'rgba(255,255,255,0.08)',
                        color: ticket.real_or_noise === v ? '#fff' : undefined,
                      }}
                    >
                      {v.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { key: 'alert_summary', label: 'Alert Summary' },
                { key: 'evidence_collected', label: 'Evidence Collected' },
                { key: 'scope_notes', label: 'Scope Notes' },
                { key: 'actions_taken', label: 'Actions Taken' },
                { key: 'containment_decision', label: 'Containment Decision' },
                { key: 'escalation_notes', label: 'Escalation Notes' },
                { key: 'open_questions', label: 'Open Questions' },
              ].map(({ key, label }) => (
                <div key={key} style={{ marginBottom: '0.875rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>
                    {label}
                  </label>
                  <textarea
                    value={(ticket as any)[key]}
                    onChange={(e) => setTicket((t) => ({ ...t, [key]: e.target.value }))}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'inherit',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              {/* Severity + Confidence */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.875rem' }}>
                {[
                  { field: 'severity', label: 'Severity' },
                  { field: 'confidence', label: 'Confidence' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem' }}>
                      {label}
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {(['low', 'medium', 'high'] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setTicket((t) => ({ ...t, [field]: v }))}
                          style={{
                            flex: 1,
                            padding: '0.3rem 0',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: (ticket as any)[field] === v ? 700 : 400,
                            background:
                              (ticket as any)[field] === v
                                ? v === 'high' ? '#ef4444' : v === 'medium' ? '#f59e0b' : '#14b8a6'
                                : 'rgba(255,255,255,0.08)',
                            color: (ticket as any)[field] === v ? '#fff' : undefined,
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Escalated toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={ticket.escalated}
                  onChange={(e) => setTicket((t) => ({ ...t, escalated: e.target.checked }))}
                  style={{ accentColor: '#8b5cf6' }}
                />
                Escalated
              </label>

              {submitError && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{submitError}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '0.6rem 1.5rem',
                  background: submitting ? 'rgba(20,184,166,0.5)' : '#14b8a6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
