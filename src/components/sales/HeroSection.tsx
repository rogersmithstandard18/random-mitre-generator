import { CheckCircle } from 'lucide-react';
import { salesPageCopy } from '../../constants/salesPageCopy';
import { SalesButton, SalesSection } from './shared';
import { GoogleLoginButton } from '../auth/GoogleLoginButton';
import { useAuthStore } from '@/store/authStore';

export function HeroSection() {
  const { hero } = salesPageCopy;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SalesSection background="white" className="sales-hero">
      <div className="sales-hero-content">
        <h1 className="sales-headline">{hero.headline}</h1>
        <p className="sales-subheadline">{hero.subheadline}</p>

        <ul className="sales-hero-benefits">
          {hero.benefits.map((benefit, index) => (
            <li key={index}>
              <CheckCircle size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="sales-hero-cta">
          {isAuthenticated ? (
            <SalesButton variant="primary" size="lg" to="/learn">
              {hero.primaryCTA}
            </SalesButton>
          ) : (
            <div className="google-login-wrapper">
              <GoogleLoginButton useOneTap />
            </div>
          )}
          <SalesButton variant="outline" size="lg" onClick={scrollToPricing}>
            {hero.secondaryCTA}
          </SalesButton>
        </div>
      </div>
    </SalesSection>
  );
}
