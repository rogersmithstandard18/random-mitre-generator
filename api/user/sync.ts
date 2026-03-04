import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAuth } from '../lib/auth.js';
import { supabase } from '../lib/supabase.js';

interface UserData {
  cardHistory: unknown[];
  favorites: string[];
  showAdvanced: boolean;
  scenarioProgress?: unknown[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ error: 'Database connection error' });
    }

    const decoded = verifyAuth(req, res);
    if (!decoded) return;

    const { cardHistory, favorites, showAdvanced, scenarioProgress } = req.body as UserData;

    // Build update object - only include fields that were sent
    const updateData: Record<string, unknown> = {};
    if (cardHistory !== undefined) updateData.card_history = cardHistory || [];
    if (favorites !== undefined) updateData.favorites = favorites || [];
    if (showAdvanced !== undefined) updateData.show_advanced = showAdvanced || false;
    if (scenarioProgress !== undefined) updateData.scenario_progress = scenarioProgress || [];

    // Save to Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', decoded.id);

    if (updateError) {
      console.error('Sync error:', updateError);
      return res.status(500).json({ error: 'Sync failed' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: 'Sync failed' });
  }
}
