import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

const AREAS = [
  { id: "triage",     label: "Threat Detection & Triage",               color: "#1D9E75", bg: "#E1F5EE", border: "#5DCAA5" },
  { id: "ir",         label: "Incident Investigation & Response",        color: "#185FA5", bg: "#E6F1FB", border: "#85B7EB" },
  { id: "hunting",    label: "Threat Hunting & Proactive Defense",       color: "#7B3FA8", bg: "#F3EBF9", border: "#C49EE0" },
  { id: "automation", label: "Automation, Ownership & Collaboration",    color: "#993C1D", bg: "#FAECE7", border: "#F0997B" },
];

const STRUCTURE = [
  { id: "situation", label: "Situation",      hint: "Set the scene. What was happening? What system, alert, or context?",          example: "e.g. High-severity SIEM alert fired at 11PM on a domain controller..." },
  { id: "action",    label: "Specific Action", hint: "What did YOU do first? Be concrete — no vague verbs.",                        example: "e.g. I immediately pulled Event ID 4688 process creation logs for that host..." },
  { id: "tool",      label: "Tool / Log / Command", hint: "Name the exact tool, Event ID, query, or data source you used.",         example: "e.g. EDR telemetry, Event ID 4104, Suricata rule, firewall ACL..." },
  { id: "outcome",   label: "Outcome",         hint: "What did you find or decide? What was the result?",                           example: "e.g. Confirmed lateral movement, isolated host, escalated to IR lead within 8 minutes..." },
];

const VOCAB_LEVELS = [
  { min: 0,  max: 9,           label: "Beginner",  color: "#999" },
  { min: 10, max: 24,          label: "Developing", color: "#E8840A" },
  { min: 25, max: 39,          label: "Competent",  color: "#185FA5" },
  { min: 40, max: 59,          label: "Proficient", color: "#7B3FA8" },
  { min: 60, max: Infinity,    label: "Expert",     color: "#1D9E75" },
];
const VOCAB_TARGET = 60;

function getVocabLevel(count: number) {
  return VOCAB_LEVELS.find(l => count >= l.min && count <= l.max) ?? VOCAB_LEVELS[0];
}

// ── Types ────────────────────────────────────────────────────────────────────

interface DrillQuestion {
  question: string;
  idealKeywords: string[];
  idealStructure: string;
  commonMistake: string;
}

interface DrillFeedback {
  score: number;
  verdict: string;
  whatWorked: string;
  gap: string;
  modelAnswer: string;
  keywordHits: string[];
  keywordMisses: string[];
  newTerms: string[];
}

interface HistoryEntry {
  area_label: string;
  question: string;
  score: number;
  verdict: string;
  response_time_seconds: number;
}

interface VocabEntry {
  keyword: string;
  hit_count: number;
  areas: string[];
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function apiPost<T>(path: string, token: string | null, body: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

async function apiGet<T>(path: string, token: string | null): Promise<T> {
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InterviewDrill() {
  const token = useAuthStore(s => s.token);

  const [screen, setScreen] = useState("home");
  const [area, setArea] = useState<typeof AREAS[0] | null>(null);
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [answer, setAnswer] = useState({ situation: "", action: "", tool: "", outcome: "" });
  const [feedback, setFeedback] = useState<DrillFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [usedQs, setUsedQs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Persisted data loaded from Supabase
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [vocabPanelOpen, setVocabPanelOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadMsgs = ["Pulling from panel question bank...", "Generating scenario...", "Loading interviewer...", "Preparing follow-up..."];

  // Load history + vocab from Supabase on mount
  useEffect(() => {
    if (!token) { setHistoryLoading(false); return; }
    apiGet<{ sessions: HistoryEntry[]; vocab: VocabEntry[] }>("/api/interview/history", token)
      .then(data => {
        setHistory(data.sessions ?? []);
        setVocab(data.vocab ?? []);
      })
      .catch(() => {}) // non-fatal — session-only fallback
      .finally(() => setHistoryLoading(false));
  }, [token]);

  // Timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const timerColor = elapsed > 90 ? "#E24B4A" : elapsed > 60 ? "#E8840A" : "#1D9E75";
  const vocabCount = vocab.length;
  const vocabLevel = getVocabLevel(vocabCount);
  const nextLevel = VOCAB_LEVELS.find(l => l.min > vocabCount);
  const vocabPct = Math.min(100, (vocabCount / VOCAB_TARGET) * 100);

  async function loadQuestion(a: typeof AREAS[0]) {
    setArea(a); setLoading(true); setError(null);
    setAnswer({ situation: "", action: "", tool: "", outcome: "" });
    setFeedback(null); setActiveStep(0); setElapsed(0); setTimerActive(false);
    let i = 0; setLoadMsg(loadMsgs[0]);
    const iv = setInterval(() => { i = (i + 1) % loadMsgs.length; setLoadMsg(loadMsgs[i]); }, 800);
    try {
      const q = await apiPost<DrillQuestion>("/api/interview/question", token, {
        areaLabel: a.label,
        usedQuestions: usedQs,
      });
      setQuestion(q);
      setUsedQs(prev => [...prev, q.question]);
      setScreen("drill");
      setTimerActive(true);
    } catch (e: any) {
      setError(e.message ?? "Failed to load question. Try again.");
    } finally {
      clearInterval(iv); setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.situation || !answer.action || !answer.tool || !answer.outcome || !question || !area) return;
    setTimerActive(false); setLoading(true); setLoadMsg("Evaluating your answer...");
    try {
      const fb = await apiPost<DrillFeedback>("/api/interview/feedback", token, {
        areaId: area.id,
        areaLabel: area.label,
        question: question.question,
        idealKeywords: question.idealKeywords,
        idealStructure: question.idealStructure,
        commonMistake: question.commonMistake,
        answer,
        elapsedSeconds: elapsed,
      });
      setFeedback(fb);

      // Update local state from the server response
      setHistory(prev => [{
        area_label: area.label,
        question: question.question,
        score: fb.score,
        verdict: fb.verdict,
        response_time_seconds: elapsed,
      }, ...prev]);

      // Merge newly earned terms into local vocab
      if (fb.newTerms?.length) {
        setVocab(prev => [
          ...prev,
          ...fb.newTerms.map(kw => ({ keyword: kw.toLowerCase(), hit_count: 1, areas: [area.label] })),
        ]);
      }
      // Increment hit_count for already-known terms
      const knownHits = (fb.keywordHits ?? []).filter(k => !fb.newTerms?.includes(k));
      if (knownHits.length) {
        setVocab(prev => prev.map(v =>
          knownHits.map(k => k.toLowerCase()).includes(v.keyword)
            ? { ...v, hit_count: v.hit_count + 1 }
            : v
        ));
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to get feedback. Try again.");
    } finally { setLoading(false); }
  }

  const verdictColor = (v: string) =>
    ({ Strong: "#1D9E75", Good: "#185FA5", "Needs Work": "#E8840A", "Too Vague": "#E24B4A" }[v] ?? "#666");
  const verdictBg = (v: string) =>
    ({ Strong: "#E1F5EE", Good: "#E6F1FB", "Needs Work": "#FEF3E2", "Too Vague": "#FCEBEB" }[v] ?? "#f5f5f5");

  const s = {
    wrap:     { fontFamily: "var(--font-sans)", padding: "1.25rem", maxWidth: 680, margin: "0 auto" } as React.CSSProperties,
    h1:       { fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 4px" } as React.CSSProperties,
    sub:      { fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.25rem" } as React.CSSProperties,
    card:     { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 } as React.CSSProperties,
    btn:      { background: "transparent", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, padding: "8px 18px", fontSize: 14, cursor: "pointer", color: "var(--color-text-primary)" } as React.CSSProperties,
    btnP:     (c: string) => ({ background: c, border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 14, cursor: "pointer", color: "#fff", fontWeight: 500 } as React.CSSProperties),
    badge:    (bg: string, color: string) => ({ background: bg, color, fontSize: 12, padding: "3px 10px", borderRadius: 6, display: "inline-block", fontWeight: 500 } as React.CSSProperties),
    textarea: { width: "100%", minHeight: 72, borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 14, padding: "10px 12px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 } as React.CSSProperties,
    label:    { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4, display: "block" } as React.CSSProperties,
    hint:     { fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6, display: "block" } as React.CSSProperties,
    metric:   { background: "var(--color-background-secondary)", borderRadius: 8, padding: "0.6rem 0.75rem", textAlign: "center" } as React.CSSProperties,
  };

  // ── Vocabulary meter ────────────────────────────────────────────────────────
  function VocabMeter() {
    const termsToNext = nextLevel ? nextLevel.min - vocabCount : 0;
    return (
      <div style={{ ...s.card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: vocabLevel.color }}>{vocabLevel.label}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{vocabCount} / {VOCAB_TARGET} technical terms</span>
          </div>
          {vocabCount > 0 && (
            <button style={{ ...s.btn, fontSize: 12, padding: "4px 10px" }} onClick={() => setVocabPanelOpen(o => !o)}>
              {vocabPanelOpen ? "Hide" : "View collection"}
            </button>
          )}
        </div>

        <div style={{ height: 8, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${vocabPct}%`, background: `linear-gradient(90deg, #1D9E75, ${vocabLevel.color})`, borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {VOCAB_LEVELS.map(l => (
            <span key={l.label} style={{ fontSize: 10, color: vocabCount >= l.min ? l.color : "var(--color-border-tertiary)", fontWeight: vocabLevel.label === l.label ? 700 : 400 }}>
              {l.label}
            </span>
          ))}
        </div>

        {nextLevel && vocabCount > 0 && (
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "8px 0 0" }}>
            {termsToNext} more {termsToNext === 1 ? "term" : "terms"} to <span style={{ color: nextLevel.color, fontWeight: 600 }}>{nextLevel.label}</span>
          </p>
        )}
        {vocabCount === 0 && !historyLoading && (
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "8px 0 0" }}>
            Complete a drill to start collecting technical vocabulary.
          </p>
        )}

        {vocabPanelOpen && vocabCount > 0 && (
          <div style={{ marginTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 8px" }}>Collected terms ({vocabCount})</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {vocab.map(v => (
                <span key={v.keyword} title={`Used ${v.hit_count}× · ${v.areas.join(", ")}`}
                  style={{ background: "var(--color-background-secondary)", border: `0.5px solid ${v.hit_count > 1 ? "#1D9E75" : "var(--color-border-tertiary)"}`, color: v.hit_count > 1 ? "#1D9E75" : "var(--color-text-primary)", fontSize: 12, padding: "3px 9px", borderRadius: 6, cursor: "default" }}>
                  {v.keyword}{v.hit_count > 1 ? ` ×${v.hit_count}` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Home screen ─────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={s.wrap}>
      <h2 style={s.h1}>SOC Interview Drill</h2>
      <p style={s.sub}>AI-generated panel questions · Situation → Action → Tool → Outcome · Live feedback</p>

      {!token && (
        <div style={{ ...s.card, borderLeft: "3px solid #E8840A", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Sign in to save your drill history and vocabulary progress across sessions.
        </div>
      )}

      {error && <div style={{ ...s.card, borderLeft: "3px solid #E24B4A", color: "#A32D2D", fontSize: 14 }}>{error}</div>}

      {history.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { l: "Drills done", v: history.length },
            { l: "Avg score",   v: (history.reduce((a, b) => a + b.score, 0) / history.length).toFixed(1) + "/10" },
            { l: "Avg time",    v: Math.round(history.reduce((a, b) => a + b.response_time_seconds, 0) / history.length) + "s" },
          ].map(m => (
            <div key={m.l} style={s.metric}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 2 }}>{m.l}</div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{m.v}</div>
            </div>
          ))}
        </div>
      )}

      <VocabMeter />

      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>Choose a focus area</p>

      {AREAS.map(a => {
        const aHistory = history.filter(h => h.area_label === a.label);
        return (
          <div key={a.id} style={{ ...s.card, borderLeft: `3px solid ${a.border}`, opacity: loading && area?.id === a.id ? 0.7 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={s.badge(a.bg, a.color)}>{a.label}</span>
                {aHistory.length > 0 && (
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 8 }}>
                    {aHistory.length} drills · avg {(aHistory.reduce((x, y) => x + y.score, 0) / aHistory.length).toFixed(1)}/10
                  </span>
                )}
              </div>
              <button style={s.btnP(a.color)} onClick={() => loadQuestion(a)} disabled={loading}>
                {loading && area?.id === a.id ? loadMsg : "Drill →"}
              </button>
            </div>
          </div>
        );
      })}

      {history.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Recent drills</p>
          {history.slice(0, 5).map((h, i) => (
            <div key={i} style={{ ...s.card, padding: "0.75rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, flex: 1, lineHeight: 1.5 }}>{h.question}</p>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <span style={s.badge(verdictBg(h.verdict), verdictColor(h.verdict))}>{h.verdict}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", alignSelf: "center" }}>{h.score}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Drill screen ─────────────────────────────────────────────────────────────
  if (screen === "drill") return (
    <div style={s.wrap}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button style={s.btn} onClick={() => { setTimerActive(false); setScreen("home"); }}>← Back</button>
        <span style={s.badge(area!.bg, area!.color)}>{area!.label}</span>
        <span style={{ fontSize: 12, color: vocabLevel.color, marginLeft: 4 }}>{vocabCount} terms</span>
        <span style={{ marginLeft: "auto", fontSize: 16, fontWeight: 500, color: timerColor, fontVariantNumeric: "tabular-nums" }}>
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>

      <div style={{ ...s.card, borderLeft: `3px solid ${area!.border}`, marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px" }}>Panel question</p>
        <p style={{ fontSize: 15, color: "var(--color-text-primary)", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{question?.question}</p>
      </div>

      {!feedback && (
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 12, display: "flex", gap: 16 }}>
          <span style={{ color: "#1D9E75" }}>● 0–60s Good pace</span>
          <span style={{ color: "#E8840A" }}>● 60–90s Getting long</span>
          <span style={{ color: "#E24B4A" }}>● 90s+ Too long</span>
        </div>
      )}

      {!feedback && (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {STRUCTURE.map((step, i) => (
              <button key={step.id}
                style={{ ...s.btn, background: activeStep === i ? "var(--color-background-secondary)" : "transparent", borderColor: answer[step.id as keyof typeof answer] ? area!.color : "var(--color-border-tertiary)", color: answer[step.id as keyof typeof answer] ? area!.color : "var(--color-text-secondary)", fontSize: 13 }}
                onClick={() => setActiveStep(i)}>
                {i + 1}. {step.label} {answer[step.id as keyof typeof answer] ? "✓" : ""}
              </button>
            ))}
          </div>

          <div style={s.card}>
            <label style={s.label}>{STRUCTURE[activeStep].label}</label>
            <span style={s.hint}>{STRUCTURE[activeStep].hint}</span>
            <span style={{ ...s.hint, fontStyle: "italic", marginBottom: 8 }}>{STRUCTURE[activeStep].example}</span>
            <textarea
              style={s.textarea}
              placeholder={`Type your ${STRUCTURE[activeStep].label.toLowerCase()} here...`}
              value={answer[STRUCTURE[activeStep].id as keyof typeof answer]}
              onChange={e => setAnswer(prev => ({ ...prev, [STRUCTURE[activeStep].id]: e.target.value }))}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {activeStep < 3 && answer[STRUCTURE[activeStep].id as keyof typeof answer] && (
                <button style={s.btnP(area!.color)} onClick={() => setActiveStep(activeStep + 1)}>Next →</button>
              )}
              {activeStep === 3 && answer.situation && answer.action && answer.tool && answer.outcome && (
                <button style={s.btnP(area!.color)} onClick={submitAnswer} disabled={loading}>
                  {loading ? loadMsg : "Submit for feedback"}
                </button>
              )}
              {activeStep > 0 && <button style={s.btn} onClick={() => setActiveStep(activeStep - 1)}>← Back</button>}
            </div>
          </div>

          {(answer.situation || answer.action || answer.tool || answer.outcome) && (
            <div style={{ ...s.card, background: "var(--color-background-secondary)" }}>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 8px" }}>Your answer so far</p>
              {STRUCTURE.map(step => answer[step.id as keyof typeof answer] ? (
                <div key={step.id} style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: area!.color }}>{step.label}: </span>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{answer[step.id as keyof typeof answer]}</span>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div>
          {feedback.newTerms?.length > 0 && (
            <div style={{ ...s.card, borderLeft: "3px solid #1D9E75", background: "#E1F5EE", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1D9E75", margin: "0 0 6px" }}>
                +{feedback.newTerms.length} new {feedback.newTerms.length === 1 ? "term" : "terms"} added to your vocabulary
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {feedback.newTerms.map(t => <span key={t} style={s.badge("#C6EFE0", "#0F6B4E")}>{t}</span>)}
              </div>
              <p style={{ fontSize: 12, color: "#0F6B4E", margin: "8px 0 0" }}>
                {vocabCount} / {VOCAB_TARGET} terms — <strong>{vocabLevel.label}</strong>
                {nextLevel ? ` · ${nextLevel.min - vocabCount} to ${nextLevel.label}` : " · Max level"}
              </p>
              <div style={{ height: 4, background: "#A7DFC9", borderRadius: 99, marginTop: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${vocabPct}%`, background: "#1D9E75", borderRadius: 99, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
              </div>
            </div>
          )}

          <div style={{ ...s.card, borderLeft: `3px solid ${verdictColor(feedback.verdict)}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={s.badge(verdictBg(feedback.verdict), verdictColor(feedback.verdict))}>{feedback.verdict}</span>
              <span style={{ fontSize: 20, fontWeight: 500, color: verdictColor(feedback.verdict) }}>{feedback.score}/10</span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{elapsed}s response time</span>
            </div>

            <p style={{ fontSize: 13, fontWeight: 500, color: "#1D9E75", margin: "0 0 4px" }}>What worked</p>
            <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: "0 0 12px", lineHeight: 1.6 }}>{feedback.whatWorked}</p>

            <p style={{ fontSize: 13, fontWeight: 500, color: "#E24B4A", margin: "0 0 4px" }}>Gap</p>
            <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: "0 0 12px", lineHeight: 1.6 }}>{feedback.gap}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {feedback.keywordHits?.map(k => {
                const isNew = feedback.newTerms?.includes(k);
                return (
                  <span key={k} style={{ ...s.badge(isNew ? "#C6EFE0" : "#E1F5EE", isNew ? "#0F6B4E" : "#1D9E75"), outline: isNew ? "1.5px solid #1D9E75" : "none" }}>
                    ✓ {k}{isNew ? " ★" : ""}
                  </span>
                );
              })}
              {feedback.keywordMisses?.map(k => (
                <span key={k} style={s.badge("#FCEBEB", "#A32D2D")}>✗ {k}</span>
              ))}
            </div>

            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Model answer</p>
            <p style={{ fontSize: 14, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.7, background: "var(--color-background-secondary)", padding: "10px 12px", borderRadius: 8 }}>{feedback.modelAnswer}</p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={s.btnP(area!.color)} onClick={() => loadQuestion(area!)}>Next question →</button>
            <button style={s.btn} onClick={() => { setTimerActive(false); setScreen("home"); }}>Back to hub</button>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
