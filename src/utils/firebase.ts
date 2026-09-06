import type { Auth, User } from 'firebase/auth';

/**
 * Firebase is optional in the distributed offline app. The uploaded project does
 * not include firebase-applet-config.json, so authentication must not prevent a
 * clean build or crash the Quran/prayer features.
 */
export const auth = null as unknown as Auth;

let cachedAccessToken: string | null = null;

export const initAuth = (
  _onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void,
) => {
  onAuthFailure?.();
  return () => undefined;
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  console.warn('Firebase authentication is unavailable because no Firebase app configuration was included.');
  return null;
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const logout = async (): Promise<void> => {
  cachedAccessToken = null;
};
