import { HeroSection } from '../components/sales/HeroSection';
import { FeaturesSection } from '../components/sales/FeaturesSection';
import { TestimonialsSection } from '../components/sales/TestimonialsSection';
import { PricingSection } from '../components/sales/PricingSection';

export function SalesPage() {
  return (
    <div className="sales-page">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      {/* Phase 5: FAQSection, SalesFooter */}
    </div>
  );
}
