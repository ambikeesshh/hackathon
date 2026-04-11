import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export const logRoomAction = async (roomId, action, userId, note = '') => {
  await addDoc(collection(db, 'activityLogs'), {
    roomId,
    action,
    userId,
    timestamp: serverTimestamp(),
    note,
  });
};

export const subscribeActivityLogs = (callback, maxRows = 40, onError) => {
  const q = query(
    collection(db, 'activityLogs'),
    orderBy('timestamp', 'desc'),
    limit(maxRows)
  );

  return onSnapshot(
    q,
    (snap) => {
      callback(
        snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      );
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  );
};
