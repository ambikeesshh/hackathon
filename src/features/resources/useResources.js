import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const RESOURCES_COLLECTION = 'rooms';

export const useResources = (filter = {}) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const constraints = useMemo(() => {
    const values = [orderBy('name')];

    if (filter.type && filter.type !== 'all') {
      values.push(where('type', '==', filter.type));
    }

    if (filter.status && filter.status !== 'all') {
      values.push(where('status', '==', filter.status));
    }

    if (filter.building && filter.building !== 'all') {
      values.push(where('building', '==', filter.building));
    }

    return values;
  }, [filter.building, filter.status, filter.type]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, RESOURCES_COLLECTION), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setResources(
          snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Failed to load resources');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [constraints]);

  return { resources, loading, error };
};
