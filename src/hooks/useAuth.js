// src/hooks/useAuth.js
import { useEffect } from "react";
import { subscribeAuthState, fetchUserProfile } from "../firebase/auth";
import useStore from "../store/useStore";

/**
 * Bootstraps Firebase Auth listener once.
 * Populates Zustand authUser + handles loading state.
 * Call once at App root.
 */
export const useAuthBootstrap = () => {
  const { setAuthUser, clearAuth } = useStore();

  useEffect(() => {
    const unsub = subscribeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        if (profile) setAuthUser(profile);
        else clearAuth();
      } else {
        clearAuth();
      }
    });
    return unsub;
  }, []);
};
