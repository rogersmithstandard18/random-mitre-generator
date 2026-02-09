import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesSection } from './shared';
import { PricingCard } from './PricingCard';

interface PricingSectionProps {
  onLoginClick?: () => void;
}

export function PricingSection({ onLoginClick }: PricingSectionProps) {
  const { pricing } = salesPageCopy;

  return (
    <SalesSection id="pricing" background="gray">
      <h2 className="sales-section-title">{pricing.headline}</h2>
      {pricing.subheadline && (
        <p className="sales-pricing-subheadline">{pricing.subheadline}</p>
      )}
      <div className="sales-pricing-grid">
        {pricing.tiers.map((tier, index) => (
          <PricingCard key={index} tier={tier} onLoginClick={onLoginClick} />
        ))}
      </div>
    </SalesSection>
  );
}
