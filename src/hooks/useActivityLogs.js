import { useEffect, useState } from "react";
import { subscribeActivityLogs } from "../firebase/activityLogs";

export const useActivityLogs = (maxRows = 40) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeActivityLogs(setLogs, maxRows);
    return unsubscribe;
  }, [maxRows]);

  return logs;
};
