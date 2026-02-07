import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentCancelPage() {
  return (
    <div className="payment-result-page">
      <div className="payment-result-card cancel">
        <div className="payment-result-icon">
          <XCircle size={64} />
        </div>
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. No charges were made.</p>
        <p className="payment-result-note">
          You can try again anytime from our pricing page.
        </p>
        <div className="payment-result-actions">
          <Link to="/#pricing" className="sales-btn sales-btn-primary sales-btn-lg">
            View Pricing
          </Link>
          <Link to="/learn" className="sales-btn sales-btn-outline sales-btn-lg">
            Continue Free
          </Link>
        </div>
      </div>
    </div>
  );
}
