import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ROLES } from '../../lib/constants';

const BOOKINGS_COLLECTION = 'bookings';

export const useBookings = ({ role, studentId, resourceId } = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const constraints = [];

    if (role === ROLES.STUDENT && studentId) {
      constraints.push(where('studentId', '==', studentId));
    }

    if (role === ROLES.FACULTY && resourceId) {
      constraints.push(where('resourceId', '==', resourceId));
    }

    const q = query(collection(db, BOOKINGS_COLLECTION), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setBookings(
          snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load bookings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [resourceId, role, studentId]);

  return { bookings, loading, error };
};
