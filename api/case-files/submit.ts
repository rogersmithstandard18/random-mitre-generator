import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

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

function isCurrentWeek(timestamp: string, now: Date = new Date()): boolean {
  const ts = new Date(timestamp);
  return getISOWeekNumber(ts) === getISOWeekNumber(now) &&
    ts.getUTCFullYear() === now.getUTCFullYear();
}

function getCurrentWeeklyCaseFileId(): string {
  const week = getISOWeekNumber();
  return `cf-${WEEKLY_CASE_FILE_IDS[week % WEEKLY_CASE_FILE_IDS.length]}`;
}

interface SubmitBody {
  scenarioId: string;
  onetsocCode: string;
  caseTitle: string;
  ticketDraft: {
    alert_summary: string;
    evidence_collected: string;
    scope_notes: string;
    actions_taken: string;
    containment_decision: string;
    escalation_notes: string;
    open_questions: string;
    severity: string;
    confidence: string;
    real_or_noise: string;
    escalated: boolean;
  };
  missionChecked: number[];
  scopeSelections: string[];
  escalationSelections: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Allow all authenticated users (free users validated below for weekly case)
    const decoded = verifyAuth(req, res);
    if (!decoded) return;

    const userTier = decoded.tier || 'free';
    const isPro = userTier === 'professional' || userTier === 'team';

    const {
      scenarioId,
      onetsocCode,
      caseTitle,
      ticketDraft,
      missionChecked,
      scopeSelections,
      escalationSelections,
    } = req.body as SubmitBody;

    if (!scenarioId || !ticketDraft) {
      return res.status(400).json({ error: 'scenarioId and ticketDraft are required' });
    }

    // For non-pro users, validate this is the current weekly case file
    if (!isPro) {
      const weeklyCaseFileId = getCurrentWeeklyCaseFileId();
      if (scenarioId !== weeklyCaseFileId) {
        return res.status(403).json({ error: 'Free users can only submit the weekly case file' });
      }

      // Check if already used this week
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('weekly_case_used_at')
        .eq('id', decoded.id)
        .single();

      if (user?.weekly_case_used_at && isCurrentWeek(user.weekly_case_used_at)) {
        return res.status(403).json({ error: 'Weekly case file already used this week' });
      }

      // Mark weekly case as used
      await supabaseAdmin
        .from('users')
        .update({
          weekly_case_used_at: new Date().toISOString(),
          weekly_case_scenario_id: scenarioId,
        })
        .eq('id', decoded.id);
    }

    const { data, error } = await supabaseAdmin
      .from('scenario_submissions')
      .insert({
        user_id: decoded.id,
        scenario_id: scenarioId,
        onetsoc_code: onetsocCode,
        case_title: caseTitle,
        alert_summary: ticketDraft.alert_summary || null,
        evidence_collected: ticketDraft.evidence_collected || null,
        scope_notes: ticketDraft.scope_notes || null,
        actions_taken: ticketDraft.actions_taken || null,
        containment_decision: ticketDraft.containment_decision || null,
        escalation_notes: ticketDraft.escalation_notes || null,
        open_questions: ticketDraft.open_questions || null,
        severity: ticketDraft.severity || null,
        confidence: ticketDraft.confidence || null,
        real_or_noise: ticketDraft.real_or_noise || null,
        escalated: ticketDraft.escalated,
        initial_assessment: missionChecked,
        scope_selections: scopeSelections,
        escalation_selections: escalationSelections,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving submission:', error);
      return res.status(500).json({ error: 'Failed to save submission' });
    }

    return res.status(200).json({ id: data.id });
  } catch (error: any) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
