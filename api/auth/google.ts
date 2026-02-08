import { VercelRequest, VercelResponse } from '@vercel/node';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { supabase, DbUser } from '../lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Try to set JSON header immediately
  try {
    res.setHeader('Content-Type', 'application/json');
  } catch (e) {
    console.error('Failed to set header:', e);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('GOOGLE_CLIENT_ID environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error: Missing Google Client ID' });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not set');
      return res.status(500).json({ error: 'Server configuration error: Missing database credentials' });
    }

    if (!supabase) {
      console.error('Supabase client failed to initialize');
      return res.status(500).json({ error: 'Server configuration error: Database client error' });
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    console.log('Verifying Google token...');
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
      console.error('No payload in Google token');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const userId = payload.sub;
    const email = payload.email;

    if (!userId || !email) {
      console.error('Missing userId or email in payload');
      return res.status(401).json({ error: 'Token missing required user information' });
    }

    const name = payload.name || '';
    const picture = payload.picture || '';

    console.log(`User ${email} authenticated, checking database...`);

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    let user: DbUser;

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('User not found, creating new user...');
      // User doesn't exist, create new user with 'free' tier
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
        return res.status(500).json({ error: 'Failed to create user in database' });
      }

      user = newUser;
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ error: 'Database error while fetching user' });
    } else {
      console.log('Existing user found, updating profile...');
      // Update existing user's name and picture (they may have changed)
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ name, picture })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        user = existingUser;
      } else {
        user = updatedUser;
      }
    }

    // Create JWT with user info including tier
    const authToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        tier: user.tier,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Auth successful, returning token');
    return res.status(200).json({
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        tier: user.tier,
      },
      // Include saved data so client can restore state
      savedData: {
        cardHistory: user.card_history,
        favorites: user.favorites,
        showAdvanced: user.show_advanced,
      },
    });
  } catch (error: any) {
    console.error('UNCAUGHT Auth error:', error);
    return res.status(500).json({
      error: 'Authentication failed due to an internal server error',
      details: error.message
    });
  }
}
