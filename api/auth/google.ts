import { VercelRequest, VercelResponse } from '@vercel/node';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Wrap everything in a top-level try-catch to avoid FUNCTION_INVOCATION_FAILED
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

    // Environment variable validation
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const jwtSecret = process.env.JWT_SECRET;

    if (!googleClientId || !jwtSecret) {
      const missing = [];
      if (!googleClientId) missing.push('GOOGLE_CLIENT_ID');
      if (!jwtSecret) missing.push('JWT_SECRET');

      console.error('Missing required environment variables:', missing.join(', '));
      return res.status(500).json({
        error: 'Server configuration error',
        details: `Missing: ${missing.join(', ')}`
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

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    let user;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: insertError } = await supabase
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
      const { data: updatedUser, error: updateError } = await supabase
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

      // Use the sign method from the imported jwt module
      // Note: jsonwebtoken often uses default export for sign, but * as jwt handles both
      const signOptions: any = { expiresIn: '7d' };
      const signFunc = (jwt as any).default?.sign || (jwt as any).sign;

      if (typeof signFunc !== 'function') {
        throw new Error('JWT sign is not a function. Check jsonwebtoken import.');
      }

      const authToken = signFunc(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          tier: user.tier,
        },
        JWT_SECRET,
        signOptions
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
