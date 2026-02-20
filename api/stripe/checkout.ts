import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import * as jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

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

  try {
    // Validate configuration
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check if any price IDs are missing
    const missingPrices = Object.entries(PRICE_IDS)
      .filter(([_, price]) => !price)
      .map(([tier, _]) => `STRIPE_PRICE_${tier.toUpperCase()}`);

    if (missingPrices.length > 0) {
      console.error('Missing price IDs in environment:', missingPrices);
      return res.status(500).json({
        error: 'Server configuration error',
        missing: missingPrices
      });
    }

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

    const decoded = verifyFunc(token, jwtSecret) as { id: string; email: string };

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Checkout error:', errorMessage);
    console.error('Full error:', error);

    // Check if it's a Stripe error
    if (error instanceof Error && 'type' in error) {
      console.error('Stripe error type:', (error as any).type);
    }

    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
