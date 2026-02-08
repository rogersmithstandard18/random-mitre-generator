import { useState, useCallback, useRef } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

interface GoogleLoginButtonProps {
  useOneTap?: boolean;
}

export function GoogleLoginButton({ useOneTap = false }: GoogleLoginButtonProps) {
  const { handleGoogleSuccess } = useGoogleAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const processingRef = useRef(false);

  const onSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    if (processingRef.current) return;

    processingRef.current = true;
    setIsLoading(true);
    setLoginError(null);

    try {
      await handleGoogleSuccess(credentialResponse);
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      processingRef.current = false;
    }
  }, [handleGoogleSuccess]);

  const onError = useCallback(() => {
    setLoginError('Google sign-in failed. Please try again.');
  }, []);

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap={useOneTap}
        theme="filled_blue"
        cancel_on_tap_outside
      />
      {loginError && (
        <p className="login-error-message">{loginError}</p>
      )}
      {isLoading && (
        <div className="login-loading-overlay">
          <span className="loading-spinner"></span>
          Signing in...
        </div>
      )}
    </div>
  );
}
