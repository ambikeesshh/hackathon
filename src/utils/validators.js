import { STATUS } from '../lib/constants';

export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isNonEmpty = (value) => {
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
};

export const isMinLength = (value, min) => {
  if (typeof value !== 'string') return false;
  return value.trim().length >= min;
};

export const isMaxLength = (value, max) => {
  if (typeof value !== 'string') return false;
  return value.trim().length <= max;
};

export const isPositiveInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

export const isValidStatus = (status) => {
  return Object.values(STATUS).includes(status);
};

export const isFutureTimestamp = (timestamp) => {
  if (!timestamp) return false;
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.getTime() > Date.now();
};
