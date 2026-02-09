import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { SalesButton, SalesBadge } from './shared';
import { GoogleLoginButton } from '../auth/GoogleLoginButton';
import { useAuthStore } from '@/store/authStore';
import type { PricingTier } from '../../constants/salesPageCopy';

export interface PricingCardProps {
  tier: PricingTier;
  onLoginClick?: () => void;
}

// Map tier names to API tier values
const tierNameToApiTier: Record<string, string> = {
  'Starter': 'starter',
  'Professional': 'professional',
  'Team': 'team',
};

export function PricingCard({ tier, onLoginClick }: PricingCardProps) {
  const {
    name,
    price,
    period,
    description,
    features,
    cta,
    highlighted,
    badge,
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

  const isFree = price === 0;
  const isPaid = price > 0;

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
      <div className="sales-pricing-price">
        <span className="sales-pricing-currency">$</span>
        <span className="sales-pricing-amount">{price}</span>
        <span className="sales-pricing-period">/{period}</span>
      </div>
      <ul className="sales-pricing-features">
        {features.map((feature, index) => (
          <li key={index}>
            <Check size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      {isAuthenticated ? (
        <SalesButton
          variant={highlighted ? 'primary' : 'outline'}
          size="lg"
          fullWidth
          onClick={isPaid ? handleCheckout : undefined}
          to={isFree ? "/learn" : undefined}
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
        <SalesButton
          variant={highlighted ? 'primary' : 'outline'}
          size="lg"
          fullWidth
          onClick={onLoginClick}
        >
          {isFree ? 'Sign in to Start' : 'Sign in to Subscribe'}
        </SalesButton>
      )}
    </div>
  );
}
