import { useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { useTopicStore } from '@/store/topicStore';
import { useNavigate } from 'react-router-dom';

interface ApiUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  tier: any;
}

interface ApiResponse {
  token: string;
  user: ApiUser;
  error?: string;
  savedData?: {
    cardHistory: unknown[];
    favorites: string[];
    showAdvanced: boolean;
  };
}

let isGlobalLoading = false;

export function useGoogleAuth() {
  const login = useAuthStore((s) => s.login);
  const restoreFromServer = useTopicStore((s) => s.restoreFromServer);
  const navigate = useNavigate();

  const handleGoogleSuccess = useCallback(async (
    credentialResponse: CredentialResponse,
    redirectPath: string | null = '/learn'
  ) => {
    if (!credentialResponse.credential) return;
    if (isGlobalLoading) {
      console.warn('Google Auth already in progress');
      return;
    }

    isGlobalLoading = true;
    console.log('Starting Google authentication process...');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      let data: ApiResponse | null = null;
      let errorText = '';
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          console.error('Failed to parse response as JSON', e);
        }
      } else {
        errorText = await response.text();
      }

      if (!response.ok) {
        if (data?.error) {
          throw new Error(data.error);
        }
        const message = errorText
          ? `Server error (${response.status}): ${errorText.substring(0, 100)}`
          : `Server error (${response.status})`;
        throw new Error(message);
      }

      if (!data) {
        throw new Error('Invalid response from server: Missing data');
      }

      login(data.token, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.picture,
        tier: data.user.tier,
      });

      if (data.savedData) {
        restoreFromServer(data.savedData);
      } else {
        await syncLocalDataToBackend(data.token);
      }

      if (redirectPath) {
        console.log('Login successful, navigating to:', redirectPath);
        navigate(redirectPath);
      } else {
        console.log('Login successful, staying on current page');
      }
    } catch (error: any) {
      console.error('Login process failed:', error);
      throw error;
    } finally {
      isGlobalLoading = false;
    }
  }, [login, restoreFromServer, navigate]);

  return { handleGoogleSuccess };
}

async function syncLocalDataToBackend(token: string) {
  const localData = localStorage.getItem('topic-storage');
  if (!localData) return;

  try {
    const parsed = JSON.parse(localData);
    const { cardHistory, favorites, showAdvanced } = parsed.state;

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
