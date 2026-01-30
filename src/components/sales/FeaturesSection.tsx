import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesSection } from './shared';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  const { features } = salesPageCopy;

  return (
    <SalesSection id="features" background="gray">
      <h2 className="sales-section-title">{features.headline}</h2>
      <div className="sales-grid-3">
        {features.items.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </SalesSection>
  );
}
