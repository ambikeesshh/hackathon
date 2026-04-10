// src/utils/helpers.js

/**
 * Compute effective status respecting autoResetAt.
 * Does NOT write to DB – purely a UI derivation.
 */
export const effectiveStatus = (room) => {
  if (room.status === "occupied" && room.autoResetAt) {
    const resetMs = room.autoResetAt.toDate
      ? room.autoResetAt.toDate().getTime()
      : room.autoResetAt;
    if (Date.now() > resetMs) return "free";
  }
  return room.status;
};

/** Human-readable "X mins ago" label */
export const timeAgo = (timestamp) => {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/** URL-safe room page link */
export const roomUrl = (roomId) =>
  `${window.location.origin}/room/${roomId}`;
