import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

const SCENARIO_COLUMNS = [
  'id', 'onetsoc_code', 'scenario_number', 'level', 'level_label',
  'title', 'subtitle', 'scenario_text', 'real_or_noise_default',
  'mission_steps', 'scope_options', 'evidence_locker', 'decision_options',
  'escalation_options', 'learning_bridge', 'pause_prompt', 'playbook', 'is_active', 'is_pro_only',
].join(', ');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    const decoded = verifyAuth(req, res, { requiredTier: ['professional', 'team'] });
    if (!decoded) return;

    const { data: scenarios, error } = await supabaseAdmin
      .from('case_file_scenarios')
      .select(SCENARIO_COLUMNS)
      .eq('is_active', true)
      .order('scenario_number');

    if (error) {
      console.error('Error fetching scenarios:', error);
      return res.status(500).json({ error: 'Failed to fetch scenarios' });
    }

    return res.status(200).json({ scenarios });
  } catch (error: any) {
    console.error('Scenarios fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
