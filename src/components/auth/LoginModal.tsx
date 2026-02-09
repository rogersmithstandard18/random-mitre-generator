import React from 'react';
import { X } from 'lucide-react';
import { GoogleLoginButton } from './GoogleLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  title = "Sign in to Subscribe",
  subtitle = "Log in with your Google account to choose a plan and continue to checkout."
}) => {
  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="login-modal-close"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="login-modal-title">{title}</h2>
        <p className="login-modal-subtitle">{subtitle}</p>

        <div className="google-login-wrapper">
          <GoogleLoginButton redirectPath={null} useOneTap={false} />
        </div>

        <div className="login-modal-footer">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};
