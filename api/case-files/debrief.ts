import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';

// Curated weekly case file IDs — must match src/constants/weeklyCaseFiles.ts
const WEEKLY_CASE_FILE_IDS = [
  'T1566', 'T1486', 'T1059', 'T1110', 'T1204', 'T1136',
  'T1046', 'T1113', 'T1087', 'T1498', 'T1593', 'T1547',
];

function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getCurrentWeeklyTechniqueId(): string {
  const week = getISOWeekNumber();
  return WEEKLY_CASE_FILE_IDS[week % WEEKLY_CASE_FILE_IDS.length];
}

interface DebriefBody {
  scenario: {
    title: string;
    subtitle: string | null;
    scenario_text: string;
    real_or_noise_default: string | null;
    mission_steps: string[];
    evidence_locker: Array<{ item: string; category: string }>;
  };
  submission: {
    verdict: string;
    alert_summary: string;
    evidence_collected: string;
    actions_taken: string;
    escalation_notes: string;
    open_questions: string;
    severity: string;
    confidence: string;
    escalated: boolean;
  };
  progress: {
    missionChecked: number[];
    evidenceReviewed: number[];
    scopeSelections: string[];
    escalationSelections: string[];
  };
}

export interface DebriefFeedback {
  verdict_line: string;
  strengths: string[];
  gaps: string[];
  key_insight: string;
  next_focus: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI debrief not configured' });
  }

  try {
    // Allow all authenticated users (free users get debrief for weekly case)
    const decoded = verifyAuth(req, res);
    if (!decoded) return;

    const { scenario, submission, progress } = req.body as DebriefBody;

    // For non-pro users, validate this is the current weekly case
    const userTier = decoded.tier || 'free';
    if (userTier !== 'professional' && userTier !== 'team') {
      const weeklyTechniqueId = getCurrentWeeklyTechniqueId();
      if (scenario?.title) {
        // We check by scenario ID if available via the scenarioId field
        const scenarioId = (req.body as any).scenarioId;
        if (scenarioId && scenarioId !== `cf-${weeklyTechniqueId}`) {
          return res.status(403).json({ error: 'Free users can only debrief the weekly case file' });
        }
      }
    }
    if (!scenario || !submission) {
      return res.status(400).json({ error: 'scenario and submission are required' });
    }

    const missionTotal = scenario.mission_steps.length;
    const missionDone = progress.missionChecked.length;
    const evidenceTotal = scenario.evidence_locker.length;
    const evidenceDone = progress.evidenceReviewed.length;

    const prompt = `You are a senior SOC analyst giving a short debrief to a junior analyst who just completed an incident investigation training scenario.

SCENARIO: "${scenario.title}"${scenario.subtitle ? `\nCategory: ${scenario.subtitle}` : ''}
Situation: ${scenario.scenario_text}
Expected verdict: ${scenario.real_or_noise_default ?? 'not specified'}

ANALYST INVESTIGATION RESULTS:
- Verdict submitted: ${submission.verdict}
- Mission steps completed: ${missionDone}/${missionTotal}
- Evidence items reviewed: ${evidenceDone}/${evidenceTotal}
- Scope identified: ${progress.scopeSelections.join(', ') || 'none selected'}
- Escalation flags: ${progress.escalationSelections.join(', ') || 'none'}
- Escalated: ${submission.escalated ? 'yes' : 'no'}
- Severity rated: ${submission.severity || 'not set'}
- Confidence rated: ${submission.confidence || 'not set'}
- Alert summary: "${submission.alert_summary}"
- Evidence notes: "${submission.evidence_collected || 'none'}"
- Actions taken: "${submission.actions_taken || 'none'}"
- Escalation notes: "${submission.escalation_notes || 'none'}"
- Open questions: "${submission.open_questions || 'none'}"

Respond with ONLY a valid JSON object — no markdown, no code fences — using exactly these keys:
{
  "verdict_line": "one sentence on whether the verdict was correct and why",
  "strengths": ["2 or 3 bullet points on what the analyst did well, max 15 words each"],
  "gaps": ["2 or 3 bullet points on what could be stronger or was missed, max 15 words each"],
  "key_insight": "one sentence — the most important takeaway from this scenario for a junior analyst",
  "next_focus": "one sentence on what skill or area this analyst should practice next"
}

Be direct and constructive. Avoid vague praise. Reference specific details from their investigation.`;

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error('Gemini HTTP error:', geminiRes.status, await geminiRes.text());
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'No response from AI' });
    }

    const feedback: DebriefFeedback = JSON.parse(text);
    return res.status(200).json({ feedback });
  } catch (err: any) {
    console.error('Debrief error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
