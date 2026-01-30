import { HeroSection } from '../components/sales/HeroSection';
import { FeaturesSection } from '../components/sales/FeaturesSection';
import { TestimonialsSection } from '../components/sales/TestimonialsSection';
import { PricingSection } from '../components/sales/PricingSection';
import { FAQSection } from '../components/sales/FAQSection';
import { SalesFooter } from '../components/sales/SalesFooter';

export function SalesPage() {
  return (
    <div className="sales-page">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <SalesFooter />
    </div>
  );
}
