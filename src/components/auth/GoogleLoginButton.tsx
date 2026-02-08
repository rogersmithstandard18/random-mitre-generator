import { useState, useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore, UserTier } from '@/store/authStore';
import { useTopicStore } from '@/store/topicStore';
import { useNavigate } from 'react-router-dom';

interface ApiUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  tier: UserTier;
}

interface ApiResponse {
  token: string;
  user: ApiUser;
  savedData?: {
    cardHistory: unknown[];
    favorites: string[];
    showAdvanced: boolean;
  };
}

interface GoogleLoginButtonProps {
  useOneTap?: boolean;
}

export function GoogleLoginButton({ useOneTap = false }: GoogleLoginButtonProps) {
  const login = useAuthStore((s) => s.login);
  const restoreFromServer = useTopicStore((s) => s.restoreFromServer);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    if (isLoading) return;

    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response was not JSON (e.g. plain text server error)
        }
        setLoginError(errorMessage);
        setIsLoading(false);
        return;
      }

      const data: ApiResponse = await response.json();

      // Login with user data from server (includes tier from database)
      login(data.token, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        tier: data.user.tier,
      });

      // Restore saved data from server if available
      if (data.savedData) {
        restoreFromServer(data.savedData);
      } else {
        // First time user - sync local data to server
        await syncLocalDataToBackend(data.token);
      }

      navigate('/learn');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, login, restoreFromServer, navigate]);

  const handleError = useCallback(() => {
    setLoginError('Google sign-in failed. Please try again.');
  }, []);

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={useOneTap}
        theme="filled_blue"
        cancel_on_tap_outside
      />
      {loginError && (
        <p className="login-error-message">{loginError}</p>
      )}
    </div>
  );
}

async function syncLocalDataToBackend(token: string) {
  const localData = localStorage.getItem('topic-storage');
  if (!localData) return;

  try {
    const parsed = JSON.parse(localData);
    const { cardHistory, favorites, showAdvanced } = parsed.state;

    // Only sync if there's actual data
    if (cardHistory?.length || favorites?.length) {
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardHistory, favorites, showAdvanced }),
      });
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
