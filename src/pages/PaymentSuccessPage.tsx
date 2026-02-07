import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Force re-login to get updated tier from database
    // This ensures the user sees their new permissions immediately
    if (sessionId) {
      // Clear the current session so they re-authenticate
      // and get their updated tier from the database
      logout();
    }
  }, [sessionId, logout]);

  return (
    <div className="payment-result-page">
      <div className="payment-result-card success">
        <div className="payment-result-icon">
          <CheckCircle size={64} />
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for subscribing. Your account has been upgraded.</p>
        <p className="payment-result-note">
          Please sign in again to access your new features.
        </p>
        <Link to="/" className="sales-btn sales-btn-primary sales-btn-lg">
          Go to Home & Sign In
        </Link>
      </div>
    </div>
  );
}
