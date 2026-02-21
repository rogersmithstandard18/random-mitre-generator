import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { SalesButton, SalesBadge } from './shared';
import { GoogleLoginButton } from '../auth/GoogleLoginButton';
import { useAuthStore } from '@/store/authStore';
import type { PricingTier } from '../../constants/salesPageCopy';

export interface PricingCardProps {
  tier: PricingTier & { contactEmail?: string };
}

// Map tier names to API tier values
const tierNameToApiTier: Record<string, string> = {
  'Starter': 'starter',
  'Professional': 'professional',
  'Team': 'team',
};

export function PricingCard({ tier }: PricingCardProps) {
  const {
    name,
    price,
    period,
    description,
    features,
    cta,
    highlighted,
    badge,
    contactEmail,
  } = tier;

  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  const handleCheckout = async () => {
    const apiTier = tierNameToApiTier[name];
    if (!apiTier || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: apiTier }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCustom = price === null || price === undefined;
  const isFree = !isCustom && price === 0;
  const isPaid = !isCustom && price > 0;

  return (
    <div
      className={`sales-pricing-card ${highlighted ? 'sales-pricing-card-highlighted' : ''}`}
    >
      {badge && (
        <SalesBadge variant="primary" className="sales-pricing-badge">
          {badge}
        </SalesBadge>
      )}
      <h3 className="sales-pricing-name">{name}</h3>
      <p className="sales-pricing-description">{description}</p>
      {!isCustom ? (
        <div className="sales-pricing-price">
          <span className="sales-pricing-currency">$</span>
          <span className="sales-pricing-amount">{price as number}</span>
          <span className="sales-pricing-period">/{period}</span>
        </div>
      ) : (
        <div className="sales-pricing-price">
          <span className="sales-pricing-amount">Custom Pricing</span>
        </div>
      )}
      <ul className="sales-pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <Check size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Free tier */}
      {isFree && (
        isAuthenticated ? (
          <SalesButton
            variant={highlighted ? 'primary' : 'outline'}
            size="lg"
            fullWidth
            to="/learn"
          >
            {cta}
          </SalesButton>
        ) : (
          <div className="pricing-login-wrapper">
            <GoogleLoginButton redirectPath={null} />
          </div>
        )
      )}

      {/* Paid tiers */}
      {isPaid && (
        isAuthenticated ? (
          <SalesButton
            variant={highlighted ? 'primary' : 'outline'}
            size="lg"
            fullWidth
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Processing...
              </>
            ) : (
              cta
            )}
          </SalesButton>
        ) : (
          <div className="pricing-login-wrapper">
            <p className="pricing-login-hint">Sign in to subscribe</p>
            <GoogleLoginButton redirectPath={null} />
          </div>
        )
      )}

      {/* Custom pricing tier (Team) */}
      {isCustom && contactEmail && (
        <a
          href={`mailto:${contactEmail}?subject=Team Plan Inquiry`}
          className={`sales-btn sales-btn-${highlighted ? 'primary' : 'outline'} sales-btn-lg sales-btn-full`}
        >
          {cta}
        </a>
      )}
    </div>
  );
}
