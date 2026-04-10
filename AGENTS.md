# CampusSync — Agent Instructions

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `firebase deploy` | Deploy to Firebase Hosting (run build first) |
| `firebase deploy --only firestore:rules` | Deploy security rules |

## Tech Rules

- **Firebase 10 modular imports only** — never use `firebase/compat`
- **Role stored in Firestore** — never in localStorage
- **All Firebase calls in service files** — never call Firestore directly from components
- **Use constants** — never hardcode strings; import from `src/lib/constants.js`
  - `STATUS.FREE`, `STATUS.OCCUPIED`, `STATUS.RESERVED`, `STATUS.PARTIAL`
  - `ROLES.ADMIN`, `ROLES.FACULTY`, `ROLES.STUDENT`

## Data Collection

- **Collection name**: `rooms` (not `resources` - kept for compatibility)
- Firestore rules enforce field validation and ownership

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/` | SmartRedirect | Auth required → role-based |
| `/dashboard` | Dashboard | student/faculty/admin |
| `/faculty` | FacultyPanel | faculty/admin |
| `/admin` | AdminPanel | admin |
| `/admin/analytics` | AdminAnalytics | admin |
| `/toggle/:resourceId` | TogglePage | faculty/admin |
| `/room/:roomId` | RoomPage | All roles |
| `/unauthorized` | Unauthorized | All |
| `*` | NotFound | All |

## Architecture

### Data Flow
1. Auth bootstrap → Firestore user doc fetched
2. Single `onSnapshot` on resources collection → Zustand store
3. All components read from Zustand (no per-room listeners)

### Key Stores
- `useAuthStore.js` — user, profile, role
- `useUIStore.js` — theme, sidebar state
- Legacy: `useStore.js` — combined (being migrated)

### Feature Folders
- `src/features/auth/` — AuthContext, useAuth, authService, LoginForm
- `src/features/resources/` — ResourceCard, ResourceGrid, resourceService, useResources
- `src/features/bookings/` — BookingCard, BookingList, bookingService, useBookings
- `src/features/analytics/` — charts, useLogs
- `src/features/admin/` — ResourceManager, UserManager, adminService
- `src/features/qr/` — QRModal, qrService

### Faculty Permissions (Firestore Rules Enforced)
Faculty can only update these fields:
- `currentStatus`
- `statusNote`
- `occupiedUntil`
- `currentOccupancy`
- `lastUpdatedBy`
- `lastUpdatedAt`

## Environment

Create `.env` in project root:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Access in code: `import.meta.env.VITE_FIREBASE_API_KEY`

## Key Constants

```js
// src/lib/constants.js
STATUS: { FREE: 'free', OCCUPIED: 'occupied', PARTIAL: 'partial' }
ROLES: { ADMIN: 'admin', FACULTY: 'faculty', STUDENT: 'student' }
RESOURCE_TYPES: { LAB: 'lab', CLASSROOM: 'classroom', LIBRARY: 'library', PARKING: 'parking', SEMINAR: 'seminar' }
BOOKING_STATUS: { PENDING: 'pending', APPROVED: 'approved', DECLINED: 'declined' }
```

## Data Model

### users/{uid}
```
{ name, email, role: 'admin'|'faculty'|'student', assignedResources: string[], createdAt }
```

### resources/{resourceId}
```
{ name, type, building, floor, capacity, currentStatus, statusNote, occupiedUntil,
  currentOccupancy, assignedFaculty: string[], equipmentTags: string[],
  lastUpdatedBy, lastUpdatedAt, createdAt, createdBy }
```

### logs/{logId}
```
{ resourceId, resourceName, previousStatus, newStatus, note, changedBy, changedByName, timestamp }
```
(append-only — update/delete blocked by Firestore rules)

### bookings/{bookingId}
```
{ resourceId, resourceName, studentId, studentName, date, startTime, endTime,
  purpose, status: 'pending'|'approved'|'declined', responseNote, respondedBy, respondedAt, createdAt }
```

## Build Priority (for reference)

Must have: Auth → useResources hook → StudentDashboard → StatusToggleModal → Navbar
Should have: QR codes → FloorPlanView → Predictive badges → Booking system
Nice to have: Analytics → Admin user management → Equipment filtering

## Notes

- No lint/typecheck scripts in package.json
- Dev server auto-opens browser (config in vite.config.js)
- Skeleton loading states in resource cards while data loads
- QR encodes: `{origin}/toggle/{resourceId}`