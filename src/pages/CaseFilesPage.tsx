import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Info, Clock, ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { CaseFileScenario } from '@/types/CaseFile';
import { buildCaseFiles } from '@/constants/caseFileScenarios';
import { useTopicStore } from '@/store/topicStore';
import { useGameEngine } from '@/hooks/useGameEngine';
import { getWeeklyCaseFileId, getNextWeekReset, WEEKLY_CASE_FILE_IDS } from '@/constants/weeklyCaseFiles';

// Game components
import GameHeader from '@/components/game/GameHeader';
import LoadoutScreen from '@/components/game/LoadoutScreen';
import ThreatAlert from '@/components/game/ThreatAlert';
import RootCausePanel from '@/components/game/RootCausePanel';
import ToolGrid from '@/components/game/ToolGrid';
import EvidenceLocker from '@/components/game/EvidenceLocker';
import GameLog from '@/components/game/GameLog';
import VerdictPanel from '@/components/game/VerdictPanel';
import RoundEndScreen from '@/components/game/RoundEndScreen';
import GameOverScreen from '@/components/game/GameOverScreen';

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
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
const BOOT_LINES = [
  'CYBER DEFENSE v1.0 — INITIALIZING...',
  'Loading threat intelligence feeds............. OK',
  'Calibrating security tools.................... OK',
  'Generating 3-round campaign................... OK',
  'SYSTEM READY — Select your loadout.',
];

function LoadingScreen() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < BOOT_LINES.length) { setLines(p => [...p, BOOT_LINES[i]]); i++; }
      else clearInterval(t);
    }, 280);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', marginBottom: 16 }}>
          <Shield size={32} color="#14b8a6" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: 4 }}>Cyber Defense</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'cf-pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: '#f59e0b', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preparing campaign...</p>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: 440, background: '#0d0f18', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginLeft: 8 }}>cyber-defense://init</span>
        </div>
        <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 11, minHeight: 120 }}>
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
   COUNTDOWN HOOK
═══════════════════════════════════════════════════════════ */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Available now!'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

/* ═══════════════════════════════════════════════════════════
   WEEKLY CASE FILE SCREEN (FREE TIER)
═══════════════════════════════════════════════════════════ */
function WeeklyCaseFileScreen({ onStartGame, allScenarios }: { onStartGame: () => void; allScenarios: CaseFileScenario[] }) {
  const token = useAuthStore(s => s.token);
  const [weeklyData, setWeeklyData] = useState<{ alreadyUsed: boolean; nextResetAt: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const weeklyCaseFileId = getWeeklyCaseFileId();
  const weeklyScenario = allScenarios.find(s => s.id === weeklyCaseFileId);
  const nextReset = useMemo(() => getNextWeekReset(), []);
  const countdown = useCountdown(nextReset);

  // Get upcoming weeks' scenarios for teaser
  const upcomingScenarios = useMemo(() => {
    const now = new Date();
    const upcoming: CaseFileScenario[] = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(now.getTime() + i * 7 * 86400000);
      const futureId = getWeeklyCaseFileId(futureDate);
      const scenario = allScenarios.find(s => s.id === futureId);
      if (scenario) upcoming.push(scenario);
    }
    return upcoming;
  }, [allScenarios]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/case-files/weekly', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setWeeklyData(data))
      .catch(() => setWeeklyData(null))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#14b8a6', animation: 'cf-pulse 1.5s ease-in-out infinite' }} />
      </div>
    );
  }

  const alreadyUsed = weeklyData?.alreadyUsed ?? false;

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 32 }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: alreadyUsed ? 'rgba(34,197,94,0.1)' : 'rgba(20,184,166,0.1)', border: `1px solid ${alreadyUsed ? 'rgba(34,197,94,0.3)' : 'rgba(20,184,166,0.3)'}`, marginBottom: 16 }}>
          {alreadyUsed ? <Shield size={32} color="#22c55e" /> : <Shield size={32} color="#14b8a6" />}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
          {alreadyUsed ? 'Case Completed' : 'Weekly Case File'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
          {alreadyUsed ? 'Great work, analyst.' : 'Your weekly investigation is ready.'}
        </p>
      </div>

      {/* Case File Card */}
      {weeklyScenario && (
        <div style={{
          maxWidth: 460, width: '100%', background: '#0f1117', borderRadius: 16,
          border: `1px solid ${alreadyUsed ? 'rgba(34,197,94,0.2)' : 'rgba(20,184,166,0.2)'}`,
          overflow: 'hidden',
        }}>
          {/* Card header bar */}
          <div style={{ padding: '12px 20px', background: alreadyUsed ? 'rgba(34,197,94,0.05)' : 'rgba(20,184,166,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#14b8a6' }}>
                {weeklyScenario.subtitle}
              </span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)' }}>
              {weeklyScenario.level_label}
            </span>
          </div>

          {/* Card body */}
          <div style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
              {weeklyScenario.title}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>
              "{weeklyScenario.scenario_text}"
            </p>

            {alreadyUsed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                <Clock size={14} />
                <span>Next case in <strong style={{ color: '#14b8a6' }}>{countdown}</strong></span>
              </div>
            ) : (
              <button onClick={onStartGame} style={{
                width: '100%', padding: '14px 24px', borderRadius: 10, fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff',
              }}>
                Start Investigation <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      <div style={{ maxWidth: 460, width: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 20, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
          <Zap size={14} color="#f59e0b" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>Want unlimited case files?</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.5 }}>
          Professional plan gives you unlimited investigations, AI-powered debriefs, scenario filters, and progress tracking.
        </p>
        <Link to="/#pricing" style={{ display: 'inline-block', padding: '10px 24px', background: 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 13, border: '1px solid rgba(255,255,255,0.1)' }}>
          View Plans
        </Link>
      </div>

      {/* Upcoming cases teaser */}
      {upcomingScenarios.length > 0 && (
        <div style={{ maxWidth: 460, width: '100%' }}>
          <h3 style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Coming Up
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcomingScenarios.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#0f1117', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Lock size={12} color="rgba(255,255,255,0.15)" />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.title}</span>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Week {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
  const userTier = useAuthStore(s => s.getUserTier());
  const storeTechniques = useTopicStore(s => s.techniques);

  const allLocalScenarios = useMemo(
    () => buildCaseFiles(storeTechniques).scenarios,
    [storeTechniques]
  );

  const [scenarios, setScenarios] = useState<CaseFileScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameKey, setGameKey] = useState(0);
  const [weeklyGameStarted, setWeeklyGameStarted] = useState(false);

  const isFreeTier = !features.canAccessCaseFiles && features.canAccessWeeklyCaseFile;

  // Fetch scenarios on mount
  useEffect(() => {
    // For free-tier weekly case: use the single weekly scenario from local data
    if (isFreeTier) {
      const weeklyCaseFileId = getWeeklyCaseFileId();
      const weeklyScenario = allLocalScenarios.find(s => s.id === weeklyCaseFileId);
      if (weeklyScenario) setScenarios([weeklyScenario]);
      setLoading(false);
      return;
    }
    if (!features.canAccessCaseFiles) { setLoading(false); return; }
    if (!token) {
      setScenarios(allLocalScenarios);
      setLoading(false);
      return;
    }
    fetch('/api/case-files/scenarios', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch scenarios');
        return data;
      })
      .then(data => {
        const remote = data.scenarios || [];
        setScenarios([...allLocalScenarios, ...remote]);
      })
      .catch(() => {
        setScenarios(allLocalScenarios);
      })
      .finally(() => setLoading(false));
  }, [features.canAccessCaseFiles, isFreeTier, token, allLocalScenarios]);

  // Not authenticated and no weekly access — full lock
  if (!features.canAccessCaseFiles && !features.canAccessWeeklyCaseFile) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ display: 'inline-flex', padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
            <Lock size={32} color="rgba(255,255,255,0.3)" />
          </div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Pro Feature</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Cyber Defense Campaign is available on the Professional and Team plans.
          </p>
          <Link to="/#pricing" style={{ display: 'inline-block', padding: '12px 28px', background: 'linear-gradient(135deg, #0891b2, #2563eb)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            View Pricing
          </Link>
        </div>
      </div>
    );
  }

  // Free tier: show weekly case file screen or the game
  if (isFreeTier && !weeklyGameStarted) {
    return (
      <>
        <WeeklyCaseFileScreen onStartGame={() => setWeeklyGameStarted(true)} allScenarios={allLocalScenarios} />
        <style>{`
          @keyframes cf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
      </>
    );
  }

  if (loading) return <LoadingScreen />;
  if (scenarios.length === 0) return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
      <p>No scenarios available.</p>
    </div>
  );

  return (
    <>
      <GameSession key={gameKey} scenarios={scenarios} snd={snd} token={token} onRestart={() => {
        if (isFreeTier) {
          // Free users go back to weekly screen after game ends
          setWeeklyGameStarted(false);
          setGameKey(k => k + 1);
        } else {
          setGameKey(k => k + 1);
        }
      }} isWeeklyFree={isFreeTier} />
      <style>{`
        @keyframes cf-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cf-slideUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes cf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 860px) {
          .gm-desktop-grid { display: none !important; }
          .gm-mobile-tabs { display: flex !important; }
          .gm-mobile-content { display: block !important; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   GAME SESSION — isolated so key reset works
═══════════════════════════════════════════════════════════ */
function GameSession({
  scenarios, snd, token, onRestart, isWeeklyFree = false,
}: {
  scenarios: CaseFileScenario[];
  snd: ReturnType<typeof useSounds>;
  token: string | null;
  onRestart: () => void;
  isWeeklyFree?: boolean;
}) {
  const { state, dispatch, actions } = useGameEngine(scenarios);
  const [mobileTab, setMobileTab] = useState<'action' | 'status' | 'verdict'>('action');
  const prevPhaseRef = useRef(state.phase);

  // Play sounds on phase transitions
  useEffect(() => {
    if (prevPhaseRef.current !== state.phase) {
      if (state.phase === 'encounter') snd.incoming();
      if (state.phase === 'verdict') snd.success();
      if (state.phase === 'gameover') snd.fail();
      if (state.phase === 'debrief') snd.success();
      prevPhaseRef.current = state.phase;
    }
  }, [state.phase, snd]);

  // Handle loadout confirm
  const handleLoadout = useCallback((toolIds: any[]) => {
    snd.click();
    actions.selectLoadout(toolIds);
    actions.startRound();
  }, [actions, snd]);

  // Transition encounter → playing
  const handleBeginEncounter = useCallback(() => {
    snd.click();
    dispatch({ type: 'BEGIN_PLAYING' });
  }, [actions, snd]);

  const handleGuess = useCallback((index: number) => {
    snd.step();
    actions.guessRootCause(index);
  }, [actions, snd]);

  const handleDeploy = useCallback((toolId: any) => {
    snd.click();
    actions.deployTool(toolId);
  }, [actions, snd]);

  const handleInvestigate = useCallback(() => {
    snd.reveal();
    actions.investigateEvidence();
  }, [actions, snd]);

  /* ── Phase-based rendering ── */

  // Loadout
  if (state.phase === 'loadout') {
    return <LoadoutScreen onConfirm={handleLoadout} />;
  }

  // Encounter intro
  if (state.phase === 'encounter' && state.activeThreat) {
    return (
      <div style={{ background: '#0a0c10', minHeight: 'calc(100vh - 56px)' }}>
        <GameHeader state={state} />
        <ThreatAlert
          threat={state.activeThreat}
          round={state.round}
          onBegin={handleBeginEncounter}
        />
      </div>
    );
  }

  // Round end (tool unlock)
  if (state.phase === 'roundEnd') {
    return (
      <div style={{ background: '#0a0c10', minHeight: 'calc(100vh - 56px)' }}>
        <GameHeader state={state} />
        <RoundEndScreen state={state} onPickTool={(id) => { snd.click(); actions.pickToolUnlock(id); }} onNext={() => { snd.click(); actions.nextRound(); }} />
      </div>
    );
  }

  // Debrief / Game Over
  if (state.phase === 'debrief' || state.phase === 'gameover') {
    return (
      <div style={{ background: '#0a0c10', minHeight: 'calc(100vh - 56px)' }}>
        <GameHeader state={state} />
        <GameOverScreen state={state} isGameOver={state.phase === 'gameover'} onPlayAgain={onRestart} isWeeklyFree={isWeeklyFree} />
      </div>
    );
  }

  /* ── Playing / Verdict: 2-column game layout ── */

  const ActionPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Case brief */}
      {state.activeThreat && (
        <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Info size={12} color="#14b8a6" />
            <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Case</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{state.activeThreat.scenarioTitle}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
            "{state.activeThreat.intro}"
          </p>
        </div>
      )}

      {/* Root cause guessing (playing phase) */}
      {state.phase === 'playing' && (
        <RootCausePanel options={state.rootCauseOptions} onGuess={handleGuess} disabled={false} />
      )}

      {/* Evidence investigation (playing phase) */}
      {state.phase === 'playing' && (
        <EvidenceLocker state={state} onInvestigate={handleInvestigate} />
      )}

      {/* Verdict panel */}
      {state.phase === 'verdict' && (
        <VerdictPanel
          state={state}
          onSetVerdict={(v) => { snd.click(); actions.setVerdict(v); }}
          onSetSummary={actions.setVerdictSummary}
          onSetSeverity={(s) => { snd.click(); actions.setVerdictSeverity(s); }}
          onSubmit={() => { snd.click(); actions.submitVerdict(); }}
        />
      )}
    </div>
  );

  const StatusPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tool grid */}
      <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
        <ToolGrid state={state} onDeploy={handleDeploy} />
      </div>

      {/* Game log */}
      <div style={{ background: '#0f1117', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', padding: 16 }}>
        <GameLog entries={state.log} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#0a0c10', color: 'rgba(255,255,255,0.7)' }}>
      <GameHeader state={state} />

      {/* Mobile tabs */}
      <div className="gm-mobile-tabs" style={{ display: 'none', background: '#0d0f18', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 56, zIndex: 20 }}>
        {([
          { key: 'action' as const, label: state.phase === 'verdict' ? 'Verdict' : 'Actions' },
          { key: 'status' as const, label: 'Tools & Log' },
        ]).map(({ key, label }) => (
          <button key={key} onClick={() => { snd.click(); setMobileTab(key); }}
            style={{
              flex: 1, padding: '12px 0', fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.08em', cursor: 'pointer', border: 'none',
              borderBottom: mobileTab === key ? '2px solid #14b8a6' : '2px solid transparent',
              background: mobileTab === key ? 'rgba(20,184,166,0.05)' : 'transparent',
              color: mobileTab === key ? '#14b8a6' : 'rgba(255,255,255,0.3)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Desktop 2-col */}
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: 16 }}>
        <div className="gm-desktop-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div>{ActionPanel}</div>
          <div>{StatusPanel}</div>
        </div>
        {/* Mobile */}
        <div className="gm-mobile-content" style={{ display: 'none' }}>
          {mobileTab === 'action' && ActionPanel}
          {mobileTab === 'status' && StatusPanel}
        </div>
      </main>
    </div>
  );
}
