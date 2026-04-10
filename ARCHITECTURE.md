# CampusSync Architecture

## Principles

- Firestore rooms collection is the single source of truth for room state.
- Zustand stores only app state slices needed by UI (auth + rooms + theme).
- Exactly one real-time listener subscribes to rooms.
- UI derives computed values (effective status, filters, analytics projections) client-side.

## Data Flow

1. Auth bootstrap initializes current user.
2. Single rooms listener starts only after auth user is available.
3. Listener writes latest rooms array into Zustand.
4. All pages and components render from Zustand rooms state.
5. Activity logs use a separate listener for feed and analytics only.

## Folder Responsibilities

- src/firebase
  - auth.js: authentication and profile fetch logic.
  - rooms.js: room writes + single rooms subscription.
  - activityLogs.js: activity log writes + log feed subscription.
- src/hooks
  - useAuth.js: auth lifecycle bootstrap.
  - useRooms.js: single rooms realtime subscription.
  - useActivityLogs.js: realtime activity logs stream.
- src/components
  - shared UI primitives and feature widgets.
  - dashboard/*: dashboard-only composition components.
- src/pages
  - route-level composition and orchestration.

## Dashboard Composition

- DashboardHeader: page title and context.
- DashboardSidebar: status cards + live activity feed.
- RoomsSection: smart filters + room card grid.

This keeps route pages thin and moves UI sections into focused, reusable components.
