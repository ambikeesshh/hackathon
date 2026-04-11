import { useEffect, useState } from 'react';
import { subscribeActivityLogs } from '../firebase/activityLogs';

export const useActivityLogs = (maxRows = 40, enabled = true) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!enabled) {
      setLogs([]);
      return undefined;
    }

    const unsubscribe = subscribeActivityLogs(setLogs, maxRows, (error) => {
      if (error?.code === 'permission-denied') {
        console.warn('Activity logs permission denied during auth transition');
        setLogs([]);
        return;
      }

      console.error('Failed to subscribe activity logs', error);
    });

    return unsubscribe;
  }, [enabled, maxRows]);

  return logs;
};
