import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

interface GoogleJWT {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export function GoogleLoginButton() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        });

        await syncLocalDataToBackend(data.token);

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

    await fetch('/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cardHistory, favorites, showAdvanced }),
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
