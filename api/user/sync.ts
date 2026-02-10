import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ error: 'Database connection error' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    // Use the verify method safely
    const verifyFunc = (jwt as any).default?.verify || (jwt as any).verify;
    if (typeof verifyFunc !== 'function') {
      throw new Error('JWT verify is not a function');
    }

    const decoded = verifyFunc(token, jwtSecret) as { id: string };

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
