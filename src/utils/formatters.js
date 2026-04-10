export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'just now';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSeconds < 30) return 'just now';
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '--';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '--';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const isOverdue = (occupiedUntil) => {
  if (!occupiedUntil) return false;
  const date = occupiedUntil.toDate
    ? occupiedUntil.toDate()
    : new Date(occupiedUntil);
  return date.getTime() < Date.now();
};
