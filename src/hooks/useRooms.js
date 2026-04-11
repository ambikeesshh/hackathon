// src/hooks/useRooms.js
import { useEffect, useRef } from 'react';
import { subscribeRooms } from '../firebase/rooms';
import useStore from '../store/useStore';
import { effectiveStatus, isReservationActive } from '../utils/helpers';
import { STATUS } from '../lib/constants';
import toast from 'react-hot-toast';

/**
 * Single Firestore onSnapshot listener for all rooms.
 * Attach once at the app root (after auth is confirmed).
 */
export const useRoomsListener = () => {
  const { setRooms, authUser } = useStore();
  const previousRoomsRef = useRef(null);

  useEffect(() => {
    if (!authUser) return;

    const unsub = subscribeRooms(
      (rooms) => {
        const previousRooms = previousRoomsRef.current;

        if (previousRooms) {
          const prevMap = new Map(previousRooms.map((room) => [room.id, room]));

          rooms.forEach((room) => {
            const prevRoom = prevMap.get(room.id);
            if (!prevRoom) return;

            const prevStatus = effectiveStatus(prevRoom);
            const nextStatus = effectiveStatus(room);

            if (prevStatus !== STATUS.FREE && nextStatus === STATUS.FREE) {
              toast.success(`${room.name} is now free`);
            }

            const hadReservation = isReservationActive(prevRoom);
            const hasReservation = isReservationActive(room);
            if (hadReservation && !hasReservation) {
              toast(`${room.name} reservation expired`, { icon: '!' });
            }
          });
        }

        previousRoomsRef.current = rooms;
        setRooms(rooms);
      },
      (error) => {
        console.error('Failed to subscribe to rooms', error);
      }
    );

    return unsub;
  }, [authUser, setRooms]);
};
