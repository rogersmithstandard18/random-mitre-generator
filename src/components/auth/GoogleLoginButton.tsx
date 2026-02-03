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

export function GoogleLoginButton() {
  const login = useAuthStore((s) => s.login);
  const restoreFromServer = useTopicStore((s) => s.restoreFromServer);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      theme="filled_blue"
    />
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
