import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabaseAdmin } from '../lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  if (!supabaseAdmin) return res.status(500).json({ error: 'Database connection error' });

  try {
    const [sessionsResult, vocabResult] = await Promise.all([
      supabaseAdmin
        .from('interview_drill_sessions')
        .select('id, area_id, area_label, question, score, verdict, response_time_seconds, completed_at')
        .eq('user_id', decoded.id)
        .order('completed_at', { ascending: false })
        .limit(50),
      supabaseAdmin
        .from('interview_vocab')
        .select('keyword, hit_count, areas, first_seen_at')
        .eq('user_id', decoded.id)
        .order('hit_count', { ascending: false }),
    ]);

    return res.status(200).json({
      sessions: sessionsResult.data ?? [],
      vocab: vocabResult.data ?? [],
    });
  } catch (err: any) {
    console.error('Interview history error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
