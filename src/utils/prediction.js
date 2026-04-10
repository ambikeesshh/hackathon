const dayHourKey = (date) => `${date.getDay()}-${date.getHours()}`;

export const getPredictedAvailability = (logs, resourceId) => {
  const filtered = logs.filter((log) => log.resourceId === resourceId);
  const buckets = new Map();

  filtered.forEach((log) => {
    if (!log.timestamp) return;
    const date = log.timestamp.toDate
      ? log.timestamp.toDate()
      : new Date(log.timestamp);
    const key = dayHourKey(date);

    if (!buckets.has(key)) {
      buckets.set(key, {
        freeCount: 0,
        totalCount: 0,
        day: date.getDay(),
        hour: date.getHours(),
      });
    }

    const entry = buckets.get(key);
    entry.totalCount += 1;
    if (log.newStatus === 'free' || log.action === 'free') entry.freeCount += 1;
  });

  const map = {};

  buckets.forEach((entry) => {
    if (!map[entry.day]) map[entry.day] = {};
    map[entry.day][entry.hour] =
      entry.totalCount > 0 ? entry.freeCount / entry.totalCount : 0;
  });

  return map;
};

export const getCurrentSlotPrediction = (predictionMap) => {
  if (!predictionMap) return null;
  const now = new Date();
  const dayMap = predictionMap[now.getDay()];
  if (!dayMap) return null;
  const ratio = dayMap[now.getHours()];
  return typeof ratio === 'number' ? ratio : null;
};

export const getPredictionLabel = (ratio) => {
  if (ratio === null || ratio === undefined) return 'No Data';
  if (ratio > 0.7) return 'Usually Free';
  if (ratio >= 0.4) return 'Mixed';
  return 'Usually Busy';
};

export const getPredictionColor = (label) => {
  if (label === 'Usually Free')
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (label === 'Mixed')
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  if (label === 'Usually Busy')
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
};
