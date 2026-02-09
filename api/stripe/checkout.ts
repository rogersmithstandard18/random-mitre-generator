import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import * as jwt from 'jsonwebtoken';

const getEnv = (name: string) => {
  return process.env[name] || process.env[name.toLowerCase()] || process.env[name.toUpperCase()] || '';
};

const stripeSecretKey = getEnv('STRIPE_SECRET_KEY');
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
}) : null;

const JWT_SECRET = getEnv('JWT_SECRET') || getEnv('SUPABASE_JWT_SECRET') || 'your-secret-key-change-this';

// Price IDs from Stripe (set these in Vercel env vars after running setup script)
const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  team: process.env.STRIPE_PRICE_TEAM,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    console.error('Stripe client not initialized. Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  try {
    // Get user from auth token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - please login first' });
    }

    const token = authHeader.substring(7);

    // Use the verify method safely
    const verifyFunc = (jwt as any).default?.verify || (jwt as any).verify;
    if (typeof verifyFunc !== 'function') {
      throw new Error('JWT verify is not a function');
    }

    const decoded = verifyFunc(token, JWT_SECRET) as { id: string; email: string };

    const { tier } = req.body;

    if (!tier || !PRICE_IDS[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      return res.status(500).json({ error: 'Price not configured for this tier' });
    }

    // Get the origin for redirect URLs
    const origin = req.headers.origin || 'https://www.teacheme.online';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: decoded.email,
      client_reference_id: decoded.id, // User ID for webhook
      metadata: {
        userId: decoded.id,
        tier: tier,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
