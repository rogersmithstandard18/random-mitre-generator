import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable body parsing - we need the raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const tier = session.metadata?.tier;

  if (!userId || !tier) {
    console.error('Missing userId or tier in session metadata');
    return;
  }

  console.log(`Upgrading user ${userId} to tier: ${tier}`);

  // Update user tier in Supabase
  const { error } = await supabase
    .from('users')
    .update({
      tier: tier,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update user tier:', error);
  } else {
    console.log(`Successfully upgraded user ${userId} to ${tier}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('Could not find user for customer:', customerId);
    return;
  }

  // Get the price to determine tier
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  if (subscription.status === 'active' && tier) {
    await supabase
      .from('users')
      .update({ tier })
      .eq('id', user.id);

    console.log(`Updated user ${user.id} to tier: ${tier}`);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (findError || !user) {
    console.error('Could not find user for customer:', customerId);
    return;
  }

  // Downgrade to free tier
  await supabase
    .from('users')
    .update({ tier: 'free' })
    .eq('id', user.id);

  console.log(`Downgraded user ${user.id} to free tier (subscription canceled)`);
}

function getTierFromPriceId(priceId: string): string | null {
  const priceToTier: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER || '']: 'starter',
    [process.env.STRIPE_PRICE_PROFESSIONAL || '']: 'professional',
    [process.env.STRIPE_PRICE_TEAM || '']: 'team',
  };

  return priceToTier[priceId] || null;
}
