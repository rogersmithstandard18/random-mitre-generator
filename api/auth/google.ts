import { VercelRequest, VercelResponse } from '@vercel/node';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../lib/supabase.js'; 

// Helper to get env var with case-insensitive names
const getEnv = (name: string) => {
  return process.env[name] || process.env[name.toLowerCase()] || process.env[name.toUpperCase()] || '';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Wrap everything in a top-level try-catch to avoid FUNCTION_INVOCATION_FAILED
  try {
    // Always return JSON content type if possible
    try {
      res.setHeader('Content-Type', 'application/json');
    } catch (e) {
      console.error('Failed to set Content-Type header');
    }

    console.log(`Auth request received: ${req.method}`);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Environment variable validation
    const googleClientId = getEnv('GOOGLE_CLIENT_ID');
    const jwtSecret = getEnv('JWT_SECRET');

    if (!googleClientId || !jwtSecret) {
      const missing = [];
      if (!googleClientId) missing.push('GOOGLE_CLIENT_ID');
      if (!jwtSecret) missing.push('JWT_SECRET');

      console.error('Missing required environment variables:', missing.join(', '));
      return res.status(500).json({
        error: 'Server configuration error',
        details: `Missing: ${missing.join(', ')}. Check Vercel environment variables.`
      });
    }

    const { token } = req.body || {};
    if (!token) {
      console.error('Request body is missing token');
      return res.status(400).json({ error: 'Token is required' });
    }

    const client = new OAuth2Client(googleClientId);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
    } catch (verifyError: any) {
      console.error('Google token verification failed:', verifyError.message);
      return res.status(401).json({ error: 'Invalid Google token', details: verifyError.message });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      console.error('Google token payload is missing');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const userId = payload.sub;
    const email = payload.email;
    const name = payload.name || '';
    const picture = payload.picture || '';

    if (!userId || !email) {
      console.error('Missing sub or email in Google payload');
      return res.status(401).json({ error: 'Token missing required user information' });
    }

    if (!supabase) {
      console.error('Supabase client not initialized. Check server logs for initialization errors.');
      return res.status(500).json({
        error: 'Database connection error',
        details: 'Supabase client failed to initialize. Check environment variables (URL/Keys).'
      });
    }

    // Check if user exists in Supabase (SELECT FIRST)
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    let user;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email,
          name,
          picture,
          tier: 'free',
          card_history: [],
          favorites: [],
          show_advanced: false,
          scenario_progress: [],
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      user = newUser;
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ error: 'Database error' });
    } else {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({ name, picture })
        .eq('id', userId)
        .select()
        .single();

      user = updateError ? existingUser : updatedUser;
    }

    if (!user) {
      return res.status(500).json({ error: 'User data missing after database operation' });
    }

    // Create JWT
    try {
      console.log('Attempting to sign JWT for user:', user.email);

      // Support both default and named export for sign
      const signFunc = (jwt as any).sign || (jwt as any).default?.sign;

      if (typeof signFunc !== 'function') {
        console.error('JWT sign is not a function. jwt object:', typeof jwt, Object.keys(jwt as any));
        throw new Error('JWT sign is not a function. Check jsonwebtoken module loading.');
      }

      const authToken = signFunc(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          tier: user.tier,
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      console.log('JWT signed successfully');

      return res.status(200).json({
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          tier: user.tier,
        },
        savedData: {
          cardHistory: user.card_history,
          favorites: user.favorites,
          showAdvanced: user.show_advanced,
          scenarioProgress: user.scenario_progress || [],
        },
      });
    } catch (jwtError: any) {
      console.error('JWT signing failed:', jwtError.message);
      return res.status(500).json({ error: 'Failed to generate authentication token' });
    }
  } catch (globalError: any) {
    console.error('GLOBAL AUTH ERROR:', globalError);
    // Try to respond with JSON if we haven't already
    if (!res.writableEnded) {
      try {
        return res.status(500).json({
          error: 'A critical internal server error occurred',
          details: globalError.message,
          stack: process.env.NODE_ENV === 'development' ? globalError.stack : undefined
        });
      } catch (e) {
        // Fallback for extreme cases
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Fatal server error' }));
      }
    }
  }
}
