import { useGoogleOneTapLogin } from '@react-oauth/google';
import { HeroSection } from '../components/sales/HeroSection';
import { FeaturesSection } from '../components/sales/FeaturesSection';
import { TestimonialsSection } from '../components/sales/TestimonialsSection';
import { PricingSection } from '../components/sales/PricingSection';
import { FAQSection } from '../components/sales/FAQSection';
import { SalesFooter } from '../components/sales/SalesFooter';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useAuthStore } from '../store/authStore';

export function SalesPage() {
  const { handleGoogleSuccess } = useGoogleAuth();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Enable One Tap on the Sales Page for unauthenticated users
  // We don't redirect on the Sales Page so they can continue to Pricing if they want
  useGoogleOneTapLogin({
    onSuccess: (resp) => handleGoogleSuccess(resp, null),
    onError: () => console.error('One Tap login failed'),
    disabled: isAuthenticated,
  });

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
