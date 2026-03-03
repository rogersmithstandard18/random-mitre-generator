import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
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

    const { data: scenarios, error } = await supabaseAdmin
      .from('case_file_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('scenario_number');

    if (error) {
      console.error('Error fetching scenarios:', error);
      return res.status(500).json({ error: 'Failed to fetch scenarios' });
    }

    return res.status(200).json({ scenarios });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Scenarios fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
