/**
 * Stripe Products Setup Script
 *
 * Run this script ONCE to create your products and prices in Stripe.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_xxx npx ts-node scripts/setup-stripe-products.ts
 *
 * After running, copy the price IDs to your environment variables.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const products = [
  {
    name: 'Starter',
    description: 'Perfect for students and beginners - Basic filtering, favorites & history tracking',
    price: 900, // $9.00 in cents
    tier: 'starter',
  },
  {
    name: 'Professional',
    description: 'For security professionals - Advanced filtering by learning path, priority support',
    price: 2900, // $29.00 in cents
    tier: 'professional',
  },
  {
    name: 'Team',
    description: 'For teams and organizations - Team collaboration, custom paths, API access',
    price: 7900, // $79.00 in cents
    tier: 'team',
  },
];

async function setupStripeProducts() {
  console.log('Creating Stripe products and prices...\n');

  const priceIds: Record<string, string> = {};

  for (const product of products) {
    // Create product
    const stripeProduct = await stripe.products.create({
      name: `CyberSecurity Learner - ${product.name}`,
      description: product.description,
      metadata: {
        tier: product.tier,
      },
    });

    console.log(`Created product: ${stripeProduct.name} (${stripeProduct.id})`);

    // Create price
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.price,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: product.tier,
      },
    });

    console.log(`  Price: $${product.price / 100}/month (${stripePrice.id})\n`);
    priceIds[product.tier] = stripePrice.id;
  }

  console.log('\n========================================');
  console.log('Add these to your Vercel Environment Variables:');
  console.log('========================================\n');
  console.log(`STRIPE_PRICE_STARTER=${priceIds.starter}`);
  console.log(`STRIPE_PRICE_PROFESSIONAL=${priceIds.professional}`);
  console.log(`STRIPE_PRICE_TEAM=${priceIds.team}`);
  console.log('\n========================================\n');
}

setupStripeProducts().catch(console.error);
