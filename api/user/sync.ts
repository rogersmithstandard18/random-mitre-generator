import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

interface UserData {
  cardHistory: unknown[];
  favorites: string[];
  showAdvanced: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const decoded = verifyFunc(token, JWT_SECRET) as { id: string };

    const { cardHistory, favorites, showAdvanced } = req.body as UserData;

    // Save to Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        card_history: cardHistory || [],
        favorites: favorites || [],
        show_advanced: showAdvanced || false,
      })
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
