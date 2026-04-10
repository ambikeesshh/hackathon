export const STATUS = {
  FREE: 'free',
  OCCUPIED: 'occupied',
  PARTIAL: 'partial',
  RESERVED: 'reserved',
};

export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const RESOURCE_TYPES = {
  LAB: 'lab',
  CLASSROOM: 'classroom',
  LIBRARY: 'library',
  PARKING: 'parking',
  SEMINAR: 'seminar',
};

export const EQUIPMENT_TAGS = [
  'projector',
  'ac',
  'linux',
  'windows',
  'hardware',
  'whiteboard',
  'smartboard',
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
};

export const STATUS_COLORS = {
  free: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  occupied: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  partial: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  reserved: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
};

export const DURATION_OPTIONS = [
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '3h', minutes: 180 },
  { label: 'Custom', minutes: null },
];

export const FIREBASE_ERROR_MESSAGES = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/weak-password': 'Password must be at least 6 characters',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Check your connection',
  default: 'Something went wrong. Please try again',
};
