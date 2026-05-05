import { useGoogleOneTapLogin } from '@react-oauth/google';
import { HeroSection } from '../components/sales/HeroSection';
import { FeaturesSection } from '../components/sales/FeaturesSection';
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
    use_fedcm_for_prompt: true,
  });

  return (
    <div className="sales-page">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <SalesFooter />
    </div>
  );
}
