import { HeroSection } from '../components/sales/HeroSection';
import { FeaturesSection } from '../components/sales/FeaturesSection';
import { TestimonialsSection } from '../components/sales/TestimonialsSection';

export function SalesPage() {
  return (
    <div className="sales-page">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      {/* Phase 4: PricingSection */}
      {/* Phase 5: FAQSection, SalesFooter */}
    </div>
  );
}
