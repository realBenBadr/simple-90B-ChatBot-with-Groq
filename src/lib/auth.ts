import { GoogleOAuthProvider } from '@react-oauth/google';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const response = await new Promise((resolve, reject) => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: (response) => {
          if (response.error) {
            reject(response);
          }
          resolve(response);
        },
        error_callback: (error) => {
          reject(error);
        }
      }).requestAccessToken();
    });

    // Get user info using the access token
    const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    }).then(res => res.json());

    const user: User = {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export function signOut(): void {
  localStorage.removeItem('user');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
} 