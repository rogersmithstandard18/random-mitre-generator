import { VercelRequest, VercelResponse } from '@vercel/node';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const adminEmail = process.env.VITE_AUDIO || 'socialfunnels@gmail.com';

    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check auth
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const verifyFunc = (jwt as any).default?.verify || (jwt as any).verify;
    const decoded = verifyFunc(token, jwtSecret) as { id: string; email: string };

    // Only allow admin to update tiers
    if (decoded.email !== adminEmail) {
      return res.status(403).json({ error: 'Forbidden - admin only' });
    }

    const { email, tier } = req.body;

    if (!email || !tier) {
      return res.status(400).json({ error: 'Missing email or tier' });
    }

    const validTiers = ['free', 'starter', 'professional', 'team'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    // Update user tier
    const { data, error } = await supabase
      .from('users')
      .update({ tier })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: `Updated ${email} to ${tier}`,
      user: data[0],
    });
  } catch (error) {
    console.error('Admin error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
