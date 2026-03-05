import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, User, Search, Briefcase, Info, FileText, Activity,
  CheckCircle2, Terminal, ArrowRight, Lock, Eye, Cpu, Globe,
  Server, Clock, X, ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { CaseFileScenario, TicketDraft } from '@/types/CaseFile';

/* ═══════════════════════════════════════════════════════════
   SOUNDS
═══════════════════════════════════════════════════════════ */
function useSounds() {
  const ctx = useRef<AudioContext | null>(null);
  const get = () => {
    if (!ctx.current) ctx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.current.state === 'suspended') ctx.current.resume();
    return ctx.current;
  };
  const tone = (f: number, d: number, v = 0.15, t: OscillatorType = 'sine', delay = 0) => {
    try {
      const c = get(), now = c.currentTime + delay;
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = t; o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(v, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + d);
      o.start(now); o.stop(now + d);
    } catch (_) { /* silent fallback */ }
  };
  return {
    incoming: () => { tone(880, .08, .25, 'square'); tone(1100, .08, .25, 'square', .13); tone(880, .15, .25, 'square', .27); },
    click: () => tone(600, .04, .07, 'square'),
    reveal: () => { tone(660, .08, .12, 'sine'); tone(880, .12, .12, 'sine', .09); },
    step: () => { tone(523, .06, .1, 'sine'); tone(659, .08, .1, 'sine', .07); },
    success: () => { tone(523, .08, .18, 'sine'); tone(659, .08, .18, 'sine', .1); tone(784, .22, .18, 'sine', .21); },
    fail: () => { tone(350, .14, .22, 'sawtooth'); tone(260, .22, .22, 'sawtooth', .17); },
  };
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const BLANK_TICKET: TicketDraft = {
  alert_summary: '', evidence_collected: '', scope_notes: '',
  actions_taken: '', containment_decision: '', escalation_notes: '',
  open_questions: '', severity: '', confidence: '',
  real_or_noise: '', escalated: false,
};

const BOOT_LINES = [
  'SENTINEL INVESTIGATION v4.2 — INITIALIZING...',
  'Loading threat intelligence feeds............. OK',
  'Connecting to SIEM cluster................... OK',
  'Fetching active case files................... OK',
  'Calibrating analyst workstation.............. OK',
  'SYSTEM READY — Case files loaded.',
];

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  identity: User, endpoint: Cpu, network: Globe,
  cloud: Server, email: FileText, context: Eye, forensics: Terminal,
};

const ROLE_LABELS: Record<string, string> = {
  '15-1212.00': 'Information Security Analyst',
  '15-1232.00': 'IT Help Desk / Support Specialist',
  '15-1231.00': 'Network Support Specialist',
  '15-1244.00': 'Network & Systems Administrator',
  '15-1211.00': 'Computer Systems Analyst',
  '15-1299.09': 'Information Technology Project Manager',
};

const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string; bar: string }> = {
  1: { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.4)', text: '#14b8a6', bar: '#14b8a6' },
  2: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#f59e0b', bar: '#f59e0b' },
  3: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', text: '#8b5cf6', bar: '#8b5cf6' },
};

function levelColor(level: number) {
  return LEVEL_COLORS[level] || LEVEL_COLORS[3];
}

const TICKET_TEXT_FIELDS: { key: keyof TicketDraft; label: string; ph: string }[] = [
  { key: 'alert_summary', label: 'Alert Summary', ph: 'What do you believe is happening...' },
  { key: 'evidence_collected', label: 'Evidence Referenced', ph: 'Which logs or data points support this?' },
  { key: 'actions_taken', label: 'Actions Taken', ph: 'What containment or response steps...' },
  { key: 'escalation_notes', label: 'Escalation Notes', ph: 'Who needs to know and why...' },
  { key: 'open_questions', label: 'Open Questions', ph: 'What still needs one validating check?' },
];

const TICKET_LEVEL_FIELDS: { field: 'severity' | 'confidence'; label: string; colors: string[] }[] = [
  { field: 'severity', label: 'Severity', colors: ['#22c55e', '#f59e0b', '#ef4444'] },
  { field: 'confidence', label: 'Confidence', colors: ['rgba(255,255,255,0.5)', '#14b8a6', '#f59e0b'] },
];

/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
function LoadingScreen({ caseLabel }: { caseLabel: string }) {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < BOOT_LINES.length) { setLines(p => [...p, BOOT_LINES[i]]); i++; }
      else clearInterval(t);
    }, 280);
    return () => clearInterval(t);
  }, [caseLabel]);
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', marginBottom: 16, position: 'relative' }}>
          <Shield size={32} color="#14b8a6" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: 4 }}>Sentinel Investigation</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'cf-pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading — {caseLabel}</p>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 440, background: '#0d0f18', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginLeft: 8 }}>sentinel://case-files</span>
        </div>
        <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 11, minHeight: 140 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ color: '#22c55e', opacity: 0, animation: 'cf-fadeIn 0.2s ease-out forwards' }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>$</span>{l}
            </div>
          ))}
          <span style={{ display: 'inline-block', width: 8, height: 16, background: '#22c55e', animation: 'cf-pulse 1s ease-in-out infinite', marginLeft: 16, marginTop: 4 }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EVIDENCE MODAL
═══════════════════════════════════════════════════════════ */
interface EvidenceModalProps {
  item: { item: string; category: string; content?: string };
  investigation: { check: string; where: string; confirm: string } | null;
  onClose: () => void;
}
function EvidenceModal({ item, investigation, onClose }: EvidenceModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const Icon = CATEGORY_ICONS[item.category] || FileText;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0d0f18', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 16, width: '100%', maxWidth: 620, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'cf-slideUp 0.22s ease-out' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, background: 'rgba(20,184,166,0.1)', borderRadius: 8, border: '1px solid rgba(20,184,166,0.2)' }}>
              <Icon size={16} color="#14b8a6" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{item.item}</p>
              <span style={{ fontSize: 9, color: 'rgba(20,184,166,0.6)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.12em' }}>{item.category}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
            <X size={14} />
          </button>
        </div>
        {/* Scrollable body */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          {/* Evidence artifact terminal block */}
          {item.content && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={10} color="#f59e0b" /> Evidence Artifact
              </div>
              <pre style={{ background: '#040608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', fontSize: 11, fontFamily: '"Courier New", Courier, monospace', color: '#86efac', lineHeight: 1.65, overflowX: 'auto', maxHeight: 260, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {item.content}
              </pre>
            </div>
          )}
          {/* Investigation guide */}
          {investigation ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'cf-pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Investigation Guide</span>
              </div>
              {[
                { label: 'What to check', value: investigation.check, color: '#60a5fa' },
                { label: 'Where to look', value: investigation.where, color: '#f59e0b' },
                { label: 'What to confirm', value: investigation.confirm, color: '#14b8a6' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.4)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 9, color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}>{value}</p>
                </div>
              ))}
            </>
          ) : !item.content ? (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Review this evidence source during your investigation.</p>
            </div>
          ) : null}
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={12} /> Evidence reviewed
            </span>
            <button onClick={onClose} style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700 }}>ESC to close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EVIDENCE CARD
═══════════════════════════════════════════════════════════ */
function EvidenceCard({ item, opened, onClick }: { item: { item: string; category: string }; opened: boolean; onClick: () => void }) {
  const Icon = CATEGORY_ICONS[item.category] || FileText;
  return (
    <div onClick={onClick} style={{
      padding: 12, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
      border: opened ? '1px solid rgba(20,184,166,0.5)' : '1px solid rgba(255,255,255,0.08)',
      background: opened ? 'rgba(20,184,166,0.05)' : '#151821',
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ padding: 6, borderRadius: 8, background: opened ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
          <Icon size={14} color={opened ? '#14b8a6' : 'rgba(255,255,255,0.35)'} />
        </div>
        <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', textTransform: 'uppercase', fontWeight: 700 }}>{item.category}</span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.4, margin: 0 }}>{item.item}</p>
      {opened
        ? <p style={{ fontSize: 9, color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}><CheckCircle2 size={10} /> Reviewed — re-read</p>
        : <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Click to open</p>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function CaseFilesPage() {
  const snd = useSounds();
  const token = useAuthStore(s => s.token);
  const features = useAuthStore(s => s.getTierFeatures());
  const userName = useAuthStore(s => s.user?.name || 'Analyst');

  const [scenarios, setScenarios] = useState<CaseFileScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<CaseFileScenario | null>(null);
  const [phase, setPhase] = useState<'loading' | 'investigate' | 'result'>('loading');
  const [tab, setTab] = useState<'brief' | 'investigate' | 'ticket'>('brief');

  // Drill state
  const [missionChecked, setMissionChecked] = useState<Set<number>>(new Set());
  const [evidenceReviewed, setEvidenceReviewed] = useState<Set<number>>(new Set());
  const [scopeSelections, setScopeSelections] = useState<Set<string>>(new Set());
  const [escalationSelections, setEscalationSelections] = useState<Set<string>>(new Set());
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [modalItem, setModalItem] = useState<{ item: { item: string; category: string }; investigation: { check: string; where: string; confirm: string } | null } | null>(null);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [bridgeTab, setBridgeTab] = useState<'ladder' | 'rules' | 'patterns' | 'close'>('ladder');

  // Ticket state
  const [ticket, setTicket] = useState<TicketDraft>(BLANK_TICKET);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Result
  const [resultCorrect, setResultCorrect] = useState<boolean | null>(null);
  const [history, setHistory] = useState<{ title: string; correct: boolean | null }[]>([]);
  const [casesSolved, setCasesSolved] = useState(0);

  // AI Debrief
  const [debriefFeedback, setDebriefFeedback] = useState<{
    verdict_line: string;
    strengths: string[];
    gaps: string[];
    key_insight: string;
    next_focus: string;
  } | null>(null);
  const [debriefLoading, setDebriefLoading] = useState(false);

  const resetDrillState = useCallback(() => {
    setMissionChecked(new Set());
    setEvidenceReviewed(new Set());
    setScopeSelections(new Set());
    setEscalationSelections(new Set());
    setSelectedDecision(null);
    setModalItem(null);
    setBridgeOpen(false);
    setBridgeTab('ladder');
    setTicket(BLANK_TICKET);
    setSubmitError(null);
    setResultCorrect(null);
    setDebriefFeedback(null);
    setDebriefLoading(false);
    setTab('brief');
  }, []);

  const selectScenario = useCallback((scenario: CaseFileScenario) => {
    setActiveScenario(scenario);
    resetDrillState();
    setPhase('investigate');
    setTimeout(() => snd.incoming(), 120);
  }, [resetDrillState, snd]);

  // Fetch scenarios on mount
  useEffect(() => {
    if (!features.canAccessCaseFiles || !token) { setLoading(false); return; }
    fetch('/api/case-files/scenarios', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch scenarios');
        return data;
      })
      .then(data => {
        const s = data.scenarios || [];
        setScenarios(s);
        if (s.length) { setActiveScenario(s[0]); setPhase('investigate'); }
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [features.canAccessCaseFiles, token]);

  const handleSubmit = async () => {
    if (!activeScenario || !token) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/case-files/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

      // Score the verdict
      const expected = activeScenario.real_or_noise_default;
      const correct = expected && ticket.real_or_noise ? ticket.real_or_noise === expected : null;
      setResultCorrect(correct);
      if (correct) snd.success(); else snd.fail();
      setCasesSolved(p => p + 1);
      setHistory(p => [...p.slice(-4), { title: activeScenario.title, correct }]);
      setPhase('result');

      // Fire AI debrief (non-blocking — failure is silent)
      setDebriefLoading(true);
      fetch('/api/case-files/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          scenario: {
            title: activeScenario.title,
            subtitle: activeScenario.subtitle,
            scenario_text: activeScenario.scenario_text,
            real_or_noise_default: activeScenario.real_or_noise_default,
            mission_steps: activeScenario.mission_steps,
            evidence_locker: activeScenario.evidence_locker,
          },
          submission: {
            verdict: ticket.real_or_noise,
            alert_summary: ticket.alert_summary,
            evidence_collected: ticket.evidence_collected,
            actions_taken: ticket.actions_taken,
            escalation_notes: ticket.escalation_notes,
            open_questions: ticket.open_questions,
            severity: ticket.severity,
            confidence: ticket.confidence,
            escalated: ticket.escalated,
          },
          progress: {
            missionChecked: Array.from(missionChecked),
            evidenceReviewed: Array.from(evidenceReviewed),
            scopeSelections: Array.from(scopeSelections),
            escalationSelections: Array.from(escalationSelections),
          },
        }),
      })
        .then(r => r.json())
        .then(d => { if (d.feedback) setDebriefFeedback(d.feedback); })
        .catch(() => {})
        .finally(() => setDebriefLoading(false));
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!activeScenario) return;
    const next = scenarios.find(s => s.scenario_number > activeScenario.scenario_number);
    if (next) selectScenario(next);
    else { selectScenario(scenarios[0]); } // loop back
  };

  const openEvidence = (item: { item: string; category: string }, idx: number) => {
    snd.reveal();
    setEvidenceReviewed(p => new Set(p).add(idx));
    const invMap = activeScenario?.learning_bridge?.investigation_map;
    const investigation = invMap && invMap[idx] ? invMap[idx] : null;
    setModalItem({ item, investigation });
  };

  // ── Tier gate ──
  if (!features.canAccessCaseFiles) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ display: 'inline-flex', padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
            <Lock size={32} color="rgba(255,255,255,0.3)" />
          </div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Pro Feature</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Case File Workbooks are available on the Professional and Team plans.
          </p>
          <Link to="/#pricing" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            View Pricing
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingScreen caseLabel="Case Files" />;
  if (fetchError) return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
      <p>Error: {fetchError}</p>
    </div>
  );
  if (!activeScenario) return null;

  const colors = levelColor(activeScenario.level);
  const missionTotal = activeScenario.mission_steps.length;
  const missionDone = missionChecked.size;
  const bridge = activeScenario.learning_bridge;
  const canSubmit = ticket.real_or_noise && ticket.alert_summary.trim().length > 10 && ticket.severity && ticket.confidence;
  const investigateStarted = missionChecked.size > 0 || evidenceReviewed.size > 0;
  const currentStep = phase === 'result' ? 3 : investigateStarted ? 2 : 1;

  /* ── Brief Panel (left) ── */
  const BriefPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Scenario selector */}
      <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ padding: '4px 10px', background: colors.bg, color: colors.text, fontSize: 10, fontWeight: 900, borderRadius: 8, border: `1px solid ${colors.border}`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Case {activeScenario.scenario_number}
          </span>
          <Activity size={16} color={colors.text} style={{ animation: 'cf-pulse 2s ease-in-out infinite' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>{activeScenario.title}</h2>
        {activeScenario.subtitle && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2, margin: 0 }}>{activeScenario.subtitle}</p>}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 16, marginTop: 2 }}>{activeScenario.level_label}</p>
        <div style={{ padding: 16, borderRadius: 12, borderLeft: `2px solid ${colors.border}`, background: 'rgba(255,255,255,0.03)', marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>"{activeScenario.scenario_text}"</p>
        </div>
        {activeScenario.pause_prompt && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: 12, borderRadius: 10, display: 'flex', gap: 10 }}>
            <Info size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.8)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>{activeScenario.pause_prompt}</p>
          </div>
        )}
      </div>
      {/* Scenario list */}
      <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
        <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>All Cases</h3>
        {scenarios.map(s => {
          const sc = levelColor(s.level);
          const active = activeScenario.id === s.id;
          return (
            <button key={s.id} onClick={() => { snd.click(); selectScenario(s); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 4, borderRadius: 8, border: active ? `1.5px solid ${sc.border}` : '1.5px solid transparent', background: active ? 'rgba(255,255,255,0.04)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.bar, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>{s.title}</span>
            </button>
          );
        })}
      </div>
      {/* History */}
      {history.length > 0 && (
        <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Session History</h3>
          {[...history].reverse().map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
              <span>{h.correct === true ? '✅' : h.correct === false ? '❌' : '⚪'}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</span>
            </div>
          ))}
        </div>
      )}
      {/* Next step CTA */}
      {phase !== 'result' && (
        <button onClick={() => { snd.click(); setTab('investigate'); }}
          style={{ width: '100%', padding: 14, background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.22)', borderRadius: 10, color: '#14b8a6', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Step 2: Begin Investigation <ArrowRight size={13} />
        </button>
      )}
    </div>
  );

  /* ── Investigate Panel (center) ── */
  const InvestigatePanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Mission Steps */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Search size={12} color="#14b8a6" /> Mission Steps
          </h3>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{missionDone}/{missionTotal}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeScenario.mission_steps.map((step, i) => {
            const done = missionChecked.has(i);
            return (
              <div key={i} onClick={() => { snd.step(); const next = new Set(missionChecked); if (done) next.delete(i); else next.add(i); setMissionChecked(next); }}
                style={{ padding: 16, borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', transition: 'all 0.15s', border: done ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(255,255,255,0.05)', background: done ? 'rgba(22,163,74,0.08)' : '#151821' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, border: done ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.15)', background: done ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                  {done && <CheckCircle2 size={12} color="#fff" />}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.75)', textDecoration: done ? 'line-through' : 'none', transition: 'all 0.15s' }}>{step}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Evidence Locker */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Briefcase size={12} color="#14b8a6" /> Evidence Locker
          </h3>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{evidenceReviewed.size}/{activeScenario.evidence_locker.length} reviewed</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {activeScenario.evidence_locker.map((ev, i) => (
            <EvidenceCard key={i} item={ev} opened={evidenceReviewed.has(i)} onClick={() => openEvidence(ev, i)} />
          ))}
        </div>
      </section>

      {/* Scope + Escalation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px 0' }}>Scope</h3>
          {activeScenario.scope_options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13, color: scopeSelections.has(opt) ? '#14b8a6' : 'rgba(255,255,255,0.5)' }}>
              <input type="checkbox" checked={scopeSelections.has(opt)} onChange={() => { snd.click(); const n = new Set(scopeSelections); if (n.has(opt)) n.delete(opt); else n.add(opt); setScopeSelections(n); }} style={{ accentColor: '#14b8a6' }} />
              {opt}
            </label>
          ))}
        </div>
        <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px 0' }}>Escalation</h3>
          {activeScenario.escalation_options.map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13, color: escalationSelections.has(opt) ? '#8b5cf6' : 'rgba(255,255,255,0.5)' }}>
              <input type="checkbox" checked={escalationSelections.has(opt)} onChange={() => { snd.click(); const n = new Set(escalationSelections); if (n.has(opt)) n.delete(opt); else n.add(opt); setEscalationSelections(n); }} style={{ accentColor: '#8b5cf6' }} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Decision Guide */}
      <section>
        <h3 style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={12} color="#14b8a6" /> Decision Guide
        </h3>
        {activeScenario.decision_options.map((opt, i) => {
          const sel = selectedDecision === i;
          return (
            <button key={i} onClick={() => { snd.click(); setSelectedDecision(sel ? null : i); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', marginBottom: 8, borderRadius: 10, border: sel ? '1.5px solid rgba(20,184,166,0.5)' : '1.5px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(20,184,166,0.08)' : '#151821', cursor: 'pointer', transition: 'all 0.15s' }}>
              <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>IF: {opt.condition}</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: sel ? '#14b8a6' : 'rgba(255,255,255,0.7)' }}>THEN: {opt.action}</span>
            </button>
          );
        })}
      </section>

      {/* Learning Bridge */}
      {bridge && (
        <section>
          <button onClick={() => setBridgeOpen(!bridgeOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '14px 16px', background: bridgeOpen ? 'rgba(20,184,166,0.08)' : '#0f1117', border: bridgeOpen ? '1px solid rgba(20,184,166,0.3)' : '1px solid rgba(255,255,255,0.1)', borderRadius: bridgeOpen ? '12px 12px 0 0' : 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
            <ChevronDown size={14} color="#14b8a6" style={{ transform: bridgeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#14b8a6' }}>Learning Bridge</span>
          </button>
          {bridgeOpen && (
            <div style={{ border: '1px solid rgba(20,184,166,0.3)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 16, background: 'rgba(20,184,166,0.02)' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {([
                  { key: 'ladder' as const, label: 'Investigation Ladder' },
                  { key: 'rules' as const, label: 'Beginner Rules' },
                  { key: 'patterns' as const, label: 'Evidence Patterns' },
                  { key: 'close' as const, label: 'Close Loop' },
                ]).map(({ key, label }) => (
                  <button key={key} onClick={() => { snd.click(); setBridgeTab(key); }}
                    style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: bridgeTab === key ? 900 : 500, background: bridgeTab === key ? '#14b8a6' : 'rgba(255,255,255,0.06)', color: bridgeTab === key ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>
                    {label}
                  </button>
                ))}
              </div>
              {bridgeTab === 'ladder' && bridge.investigation_ladder && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bridge.investigation_ladder.map(s => (
                    <div key={s.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#14b8a6', flexShrink: 0 }}>{s.step}</span>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.label}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}> — {s.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {bridgeTab === 'rules' && bridge.beginner_rules && (
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bridge.beginner_rules.map((r, i) => <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{r}</li>)}
                </ul>
              )}
              {bridgeTab === 'patterns' && bridge.evidence_patterns && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bridge.evidence_patterns.map((p, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Pattern</div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, marginBottom: 8, lineHeight: 1.5 }}>{p.pattern}</p>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Response</div>
                      <p style={{ fontSize: 13, color: '#14b8a6', margin: 0, lineHeight: 1.5 }}>{p.response}</p>
                    </div>
                  ))}
                </div>
              )}
              {bridgeTab === 'close' && bridge.close_loop_questions && (
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bridge.close_loop_questions.map((q, i) => <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{q}</li>)}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
      {/* Next step CTA */}
      {phase !== 'result' && investigateStarted && (
        <button onClick={() => { snd.click(); setTab('ticket'); }}
          style={{ width: '100%', padding: 14, background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.22)', borderRadius: 10, color: '#14b8a6', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Step 3: File Your Report <ArrowRight size={13} />
        </button>
      )}
    </div>
  );

  /* ── Ticket Panel (right) ── */
  const TicketPanel = (
    <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase === 'result' ? '#14b8a6' : '#ef4444', animation: phase === 'result' ? undefined : 'cf-pulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Incident Ticket</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 6 }}>Step 3</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} /> Case {activeScenario.scenario_number}
        </span>
      </div>

      {phase === 'result' ? (
        /* ── Result screen ── */
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 24, borderRadius: 12, textAlign: 'center', border: resultCorrect ? '1px solid rgba(22,163,74,0.3)' : resultCorrect === false ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)', background: resultCorrect ? 'rgba(22,163,74,0.1)' : resultCorrect === false ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)' }}>
            <p style={{ fontSize: 40, margin: '0 0 8px 0' }}>{resultCorrect ? '✅' : resultCorrect === false ? '❌' : '⚪'}</p>
            <p style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', margin: 0, color: resultCorrect ? '#22c55e' : resultCorrect === false ? '#ef4444' : 'rgba(255,255,255,0.5)' }}>
              {resultCorrect ? 'Correct Call' : resultCorrect === false ? 'Incorrect Verdict' : 'Submitted'}
            </p>
            {activeScenario.real_or_noise_default && (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                Expected: <span style={{ color: '#fff', fontWeight: 700 }}>{activeScenario.real_or_noise_default.replace('_', ' ')}</span>
              </p>
            )}
          </div>

          {/* AI Debrief */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: debriefLoading ? '#f59e0b' : '#14b8a6', animation: debriefLoading ? 'cf-pulse 1s ease-in-out infinite' : undefined }} />
              <p style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                {debriefLoading ? 'Senior Analyst Reviewing...' : 'AI Debrief'}
              </p>
            </div>
            {debriefFeedback ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{debriefFeedback.verdict_line}</p>
                {[
                  { label: 'Strengths', items: debriefFeedback.strengths, color: '#22c55e' },
                  { label: 'Areas to sharpen', items: debriefFeedback.gaps, color: '#f59e0b' },
                ].map(({ label, items, color }) => (
                  <div key={label}>
                    <p style={{ fontSize: 9, color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px 0' }}>{label}</p>
                    {items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start' }}>
                        <span style={{ color, fontSize: 12, marginTop: 1, flexShrink: 0 }}>›</span>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>{it}</p>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ padding: '10px 14px', background: 'rgba(20,184,166,0.05)', borderRadius: 8, border: '1px solid rgba(20,184,166,0.15)', marginTop: 4 }}>
                  <p style={{ fontSize: 9, color: '#14b8a6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0' }}>Key Insight</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{debriefFeedback.key_insight}</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0, fontStyle: debriefLoading ? 'italic' : 'normal' }}>
                {debriefLoading
                  ? 'Analyzing your investigation approach...'
                  : `Completed ${missionDone}/${missionTotal} steps, reviewed ${evidenceReviewed.size}/${activeScenario.evidence_locker.length} evidence sources.${ticket.escalated ? ' Escalation flagged.' : ''}`}
              </p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Steps', value: `${missionDone}/${missionTotal}`, color: missionDone === missionTotal ? '#22c55e' : '#f59e0b' },
              { label: 'Evidence', value: `${evidenceReviewed.size}/${activeScenario.evidence_locker.length}`, color: evidenceReviewed.size === activeScenario.evidence_locker.length ? '#22c55e' : '#f59e0b' },
              { label: 'Cases', value: casesSolved, color: '#14b8a6' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center', padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 900, color, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          <button onClick={handleNext}
            style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14 }}>
            Next Case <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* ── Ticket form ── */
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Verdict */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Incident Verdict</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([['likely_real', '#ef4444'], ['likely_noise', '#22c55e'], ['unsure', '#f59e0b']] as const).map(([v, c]) => (
                <button key={v} onClick={() => { snd.click(); setTicket(t => ({ ...t, real_or_noise: v })); }}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s', border: ticket.real_or_noise === v ? `1.5px solid ${c}` : '1.5px solid rgba(255,255,255,0.08)', background: ticket.real_or_noise === v ? c : 'rgba(255,255,255,0.03)', color: ticket.real_or_noise === v ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {v.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Text fields */}
          {TICKET_TEXT_FIELDS.map(({ key, label, ph }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</label>
              <textarea value={ticket[key] as string} onChange={e => setTicket(t => ({ ...t, [key]: e.target.value }))} placeholder={ph}
                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, fontSize: 14, color: 'rgba(255,255,255,0.8)', resize: 'vertical', height: 72, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
            </div>
          ))}

          {/* Severity + Confidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {TICKET_LEVEL_FIELDS.map(({ field, label, colors: tc }) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, textAlign: 'center' }}>{label}</label>
                <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 36 }}>
                  {(['low', 'medium', 'high'] as const).map((o, i) => (
                    <button key={o} onClick={() => { snd.click(); setTicket(t => ({ ...t, [field]: o })); }}
                      style={{ flex: 1, fontSize: 9, textTransform: 'uppercase', fontWeight: 900, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: ticket[field] === o ? 'rgba(255,255,255,0.12)' : 'transparent', color: ticket[field] === o ? tc[i] : 'rgba(255,255,255,0.3)' }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Escalated */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: ticket.escalated ? '#8b5cf6' : 'rgba(255,255,255,0.5)' }}>
            <input type="checkbox" checked={ticket.escalated} onChange={e => { snd.click(); setTicket(t => ({ ...t, escalated: e.target.checked })); }} style={{ accentColor: '#8b5cf6' }} />
            Escalated
          </label>

          {submitError && <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{submitError}</p>}

          <button onClick={handleSubmit} disabled={!canSubmit || submitting}
            style={{ width: '100%', padding: 16, borderRadius: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 14, cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', border: 'none', background: canSubmit ? 'linear-gradient(135deg, #059669, #0d9488)' : 'rgba(255,255,255,0.03)', color: canSubmit ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {submitting ? 'Submitting...' : 'Submit Investigation'}
            {!submitting && <ArrowRight size={16} />}
          </button>
          {!canSubmit && (
            <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              {!ticket.real_or_noise ? 'Select a verdict' : ticket.alert_summary.trim().length <= 10 ? 'Write a summary (10+ chars)' : 'Set severity & confidence'}
            </p>
          )}
        </div>
      )}
    </div>
  );

  /* ── Render ── */
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', color: 'rgba(255,255,255,0.7)' }}>
      {modalItem && <EvidenceModal item={modalItem.item} investigation={modalItem.investigation} onClose={() => setModalItem(null)} />}

      {/* Header bar */}
      <header style={{ background: '#0d0f18', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'rgba(20,184,166,0.15)', padding: 8, borderRadius: 12, border: '1px solid rgba(20,184,166,0.3)' }}>
              <Shield size={20} color="#14b8a6" />
            </div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.01em', margin: 0, lineHeight: 1 }}>Sentinel Investigation</h1>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', margin: 0 }}>Case File Workbook</p>
            </div>
            {/* Vertical divider */}
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)', marginLeft: 4 }} />
            {/* Role badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 20 }}>
                <Briefcase size={10} color="#14b8a6" />
                <span style={{ fontSize: 10, color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  {activeScenario ? (ROLE_LABELS[activeScenario.onetsoc_code] ?? 'Security Analyst') : 'Security Analyst'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {[
              { label: 'Cases', value: `${casesSolved}`, color: '#fff' },
              { label: 'Evidence', value: `${evidenceReviewed.size}`, color: '#14b8a6' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 900, color, margin: 0 }}>{value}</p>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                <User size={14} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Analyst</p>
                <p style={{ fontSize: 12, fontWeight: 900, color: '#14b8a6', margin: 0, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step progress bar */}
      <div style={{ background: '#0d0f18', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          {([
            { n: 1, label: 'Read Brief',   tab: 'brief'       as const },
            { n: 2, label: 'Investigate',  tab: 'investigate' as const },
            { n: 3, label: 'File Report',  tab: 'ticket'      as const },
          ] as const).map(({ n, label, tab: t }, i) => {
            const done   = currentStep > n || phase === 'result';
            const active = currentStep === n && phase !== 'result';
            return (
              <div key={n} style={{ display: 'contents' }}>
                {i > 0 && <div style={{ flex: 1, height: 1, background: done ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.08)', transition: 'background 0.4s' }} />}
                <button onClick={() => { snd.click(); setTab(t); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, border: done ? '2px solid #22c55e' : active ? '2px solid #14b8a6' : '2px solid rgba(255,255,255,0.12)', background: done ? 'rgba(34,197,94,0.12)' : active ? 'rgba(20,184,166,0.12)' : 'transparent', color: done ? '#22c55e' : active ? '#14b8a6' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', flexShrink: 0 }}>
                    {done ? '✓' : n}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: done ? '#22c55e' : active ? '#14b8a6' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile tabs */}
      <div style={{ display: 'none' }} className="cf-mobile-tabs">
        {[
          { key: 'brief' as const, icon: '📋', label: 'Brief' },
          { key: 'investigate' as const, icon: '🔍', label: 'Investigate' },
          { key: 'ticket' as const, icon: '📝', label: phase === 'result' ? 'Results' : 'Report' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => { snd.click(); setTab(key); }}
            style={{ flex: 1, padding: '10px 0', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', border: 'none', borderBottom: tab === key ? '2px solid #14b8a6' : '2px solid transparent', background: tab === key ? 'rgba(20,184,166,0.05)' : 'transparent', color: tab === key ? '#14b8a6' : 'rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 16 }}>
        {/* Desktop 3-col */}
        <div className="cf-desktop-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr 380px', gap: 20 }}>
          <div>{BriefPanel}</div>
          <div>{InvestigatePanel}</div>
          <div>{TicketPanel}</div>
        </div>
        {/* Mobile (shown via CSS) */}
        <div className="cf-mobile-content" style={{ display: 'none' }}>
          {tab === 'brief' && BriefPanel}
          {tab === 'investigate' && InvestigatePanel}
          {tab === 'ticket' && TicketPanel}
        </div>
      </main>

      <style>{`
        @keyframes cf-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cf-slideUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 1024px) {
          .cf-desktop-grid { display: none !important; }
          .cf-mobile-tabs { display: flex !important; background: #0d0f18; border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 56px; z-index: 20; }
          .cf-mobile-content { display: block !important; }
        }
      `}</style>
    </div>
  );
}
