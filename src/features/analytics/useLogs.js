import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit as withLimit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const LOGS_COLLECTION = 'logs';

export const useLogs = (params = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const constraints = [orderBy('timestamp', 'desc')];

        if (params.resourceId) {
          constraints.push(where('resourceId', '==', params.resourceId));
        }

        if (params.startDate) {
          constraints.push(where('timestamp', '>=', params.startDate));
        }

        if (params.endDate) {
          constraints.push(where('timestamp', '<=', params.endDate));
        }

        if (params.limit) {
          constraints.push(withLimit(params.limit));
        }

        const q = query(collection(db, LOGS_COLLECTION), ...constraints);
        const snap = await getDocs(q);

        setLogs(
          snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        );
      } catch (err) {
        setError(err.message || 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params.endDate, params.limit, params.resourceId, params.startDate]);

  return { logs, loading, error };
};
