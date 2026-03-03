import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase.js';

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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const verifyFunc = (jwt as any).default?.verify || (jwt as any).verify;
    if (typeof verifyFunc !== 'function') {
      throw new Error('JWT verify is not a function');
    }

    const decoded = verifyFunc(token, jwtSecret) as { id: string; tier: string };

    if (decoded.tier !== 'professional' && decoded.tier !== 'team') {
      return res.status(403).json({ error: 'Pro tier required' });
    }

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
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
