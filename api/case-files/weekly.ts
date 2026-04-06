import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

// Curated beginner-friendly technique IDs — must match src/constants/weeklyCaseFiles.ts
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Any authenticated user can access (including free tier)
    const decoded = verifyAuth(req, res);
    if (!decoded) return;

    const now = new Date();
    const weekNum = getISOWeekNumber(now);
    const techniqueId = WEEKLY_CASE_FILE_IDS[weekNum % WEEKLY_CASE_FILE_IDS.length];
    const caseFileId = `cf-${techniqueId}`;

    // Check user's weekly usage
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('weekly_case_used_at, weekly_case_scenario_id')
      .eq('id', decoded.id)
      .single();

    if (userError) {
      console.error('Error fetching user weekly status:', userError);
      return res.status(500).json({ error: 'Failed to check weekly status' });
    }

    const alreadyUsed = user?.weekly_case_used_at
      ? isCurrentWeek(user.weekly_case_used_at, now)
      : false;

    // Compute next Monday 00:00 UTC for countdown
    const dayNum = (now.getUTCDay() || 7);
    const nextReset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + (8 - dayNum)));
    nextReset.setUTCHours(0, 0, 0, 0);

    return res.status(200).json({
      caseFileId,
      techniqueId,
      weekNumber: weekNum,
      alreadyUsed,
      nextResetAt: nextReset.toISOString(),
    });
  } catch (error: any) {
    console.error('Weekly case file error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
