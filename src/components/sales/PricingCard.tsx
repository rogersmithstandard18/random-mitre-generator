import { Check } from 'lucide-react';
import { SalesButton, SalesBadge } from './shared';
import type { PricingTier } from '../../constants/salesPageCopy';

export interface PricingCardProps {
  tier: PricingTier;
}

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
  } = tier;

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
      <SalesButton
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        fullWidth
        to="/learn"
      >
        {cta}
      </SalesButton>
    </div>
  );
}
