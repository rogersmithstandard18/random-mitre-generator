import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';

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
    const decoded = verifyAuth(req, res, { requiredTier: ['professional', 'team'] });
    if (!decoded) return;

    const { scenario, submission, progress } = req.body as DebriefBody;
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
