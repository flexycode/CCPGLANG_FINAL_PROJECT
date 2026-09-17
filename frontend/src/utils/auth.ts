/**
 * auth.ts — Functional Authentication Helper
 * ==========================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Provides pure functions and immutable token/session operations.
 */

export interface UserProfile {
  readonly username: string;
  readonly full_name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly avatar_url?: string;
}

export interface AuthSession {
  readonly access_token: string;
  readonly user: UserProfile;
}

const AUTH_KEY = 'checkmate_auth_session';

export const getStoredSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const saveSession = (session: AuthSession): void => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to persist auth session:', err);
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
};

export const isAuthenticated = (): boolean => {
  return getStoredSession() !== null;
};
