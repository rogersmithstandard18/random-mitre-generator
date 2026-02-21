import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';

// Helper to get env var with case-insensitive names
const getEnv = (name: string) => {
  return process.env[name] || process.env[name.toLowerCase()] || process.env[name.toUpperCase()] || '';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Always return JSON content type if possible
    try {
      res.setHeader('Content-Type', 'application/json');
    } catch (e) {
      console.error('Failed to set Content-Type header');
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const jwtSecret = getEnv('JWT_SECRET');
    const adminEmail = getEnv('VITE_AUDIO') || 'socialfunnels@gmail.com';

    if (!jwtSecret) {
      console.error('Missing JWT_SECRET');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - missing or invalid Bearer token' });
    }

    const token = authHeader.substring(7);

    let decoded: any;
    try {
      // Support both default and named export for verify
      const verifyFunc = (jwt as any).verify || (jwt as any).default?.verify;
      decoded = verifyFunc(token, jwtSecret) as { id: string; email: string };
    } catch (tokenError: any) {
      console.error('Token verification failed:', tokenError.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Only allow admin to update tiers
    if (decoded.email !== adminEmail) {
      console.error(`Forbidden: ${decoded.email} tried to access admin endpoint`);
      return res.status(403).json({ error: 'Forbidden - admin only' });
    }

    const { email, tier } = req.body || {};

    if (!email || !tier) {
      return res.status(400).json({ error: 'Missing email or tier' });
    }

    const validTiers = ['free', 'starter', 'professional', 'team'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ error: 'Database connection error' });
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

    console.log(`Admin updated ${email} to ${tier} tier`);

    return res.status(200).json({
      message: `Updated ${email} to ${tier}`,
      user: data[0],
    });
  } catch (error: any) {
    console.error('Admin endpoint error:', error);
    if (!res.writableEnded) {
      return res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
}
