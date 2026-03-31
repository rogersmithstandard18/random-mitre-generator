import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from './auth/GoogleLoginButton';

export default function DemoLimitReached() {
  const navigate = useNavigate();

  return (
    <div className="demo-limit-reached">
      <h2>You've explored 3 sample concepts!</h2>
      <p>Sign up to unlock unlimited learning, smart filters, favorites, detection strategies, and more.</p>
      <div className="demo-limit-actions">
        <button className="next-btn" onClick={() => navigate('/')}>
          View Pricing
        </button>
        <div className="google-login-wrapper">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
