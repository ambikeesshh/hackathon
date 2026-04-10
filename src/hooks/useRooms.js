// src/hooks/useRooms.js
import { useEffect } from "react";
import { subscribeRooms } from "../firebase/rooms";
import useStore from "../store/useStore";

/**
 * Single Firestore onSnapshot listener for all rooms.
 * Attach once at the app root (after auth is confirmed).
 */
export const useRoomsListener = () => {
  const { setRooms, authUser } = useStore();

  useEffect(() => {
    if (!authUser) return;
    const unsub = subscribeRooms(setRooms);
    return unsub;
  }, [authUser]);
};
