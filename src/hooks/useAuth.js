// src/hooks/useAuth.js
import { useEffect } from 'react';
import {
  subscribeAuthState,
  getUserProfile,
} from '../features/auth/authService';
import useStore from '../store/useStore';

/**
 * Bootstraps Firebase Auth listener once.
 * Populates Zustand authUser + handles loading state.
 * Call once at App root.
 */
export const useAuthBootstrap = () => {
  const { setAuthUser, clearAuth } = useStore();

  useEffect(() => {
    const unsub = subscribeAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        clearAuth();
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setAuthUser(profile);
          return;
        }

        clearAuth();
      } catch (error) {
        console.error('Failed to load authenticated user profile', error);
        clearAuth();
      }
    });

    return unsub;
  }, [clearAuth, setAuthUser]);
};
