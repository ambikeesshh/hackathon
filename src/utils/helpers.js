// src/utils/helpers.js
import { ROLES, STATUS } from '../lib/constants';

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (value.toDate) return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

export const isReservationActive = (room) => {
  if (!room?.reservedBy || !room?.reservedUntil) return false;
  const reservedUntilMs = toMillis(room.reservedUntil);
  if (!reservedUntilMs) return false;
  return Date.now() <= reservedUntilMs;
};

export const normalizeRoom = (room) => ({
  building: '',
  floor: '',
  type: 'classroom',
  capacity: 0,
  note: '',
  reservedBy: null,
  reservedUntil: null,
  features: [],
  coordinates: { x: null, y: null },
  createdAt: null,
  autoResetAt: null,
  ...room,
});

/**
 * Compute effective status respecting autoResetAt.
 * Does NOT write to DB – purely a UI derivation.
 */
export const effectiveStatus = (room) => {
  const normalized = normalizeRoom(room);

  if (normalized.status === STATUS.OCCUPIED && normalized.autoResetAt) {
    const resetMs = toMillis(normalized.autoResetAt);
    if (Date.now() > resetMs) return STATUS.FREE;
    return STATUS.OCCUPIED;
  }

  if (isReservationActive(normalized)) return STATUS.RESERVED;

  return normalized.status;
};

/** Human-readable "X mins ago" label */
export const timeAgo = (timestamp) => {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/** URL-safe room page link */
export const roomUrl = (roomId) => `${window.location.origin}/room/${roomId}`;

export const hourLabel = (timestamp) => {
  const ms = toMillis(timestamp);
  if (!ms) return 'Unknown';
  const date = new Date(ms);
  return `${String(date.getHours()).padStart(2, '0')}:00`;
};

export const timeUntil = (timestamp) => {
  const ms = toMillis(timestamp);
  if (!ms) return '—';
  const diff = Math.max(0, Math.floor((ms - Date.now()) / 1000));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

export const canManageRoom = (user, roomId) => {
  if (!user || !roomId) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role !== ROLES.FACULTY) return false;
  return (
    Array.isArray(user.assignedResources) &&
    user.assignedResources.includes(roomId)
  );
};
