## Overview
This PR introduces a major architectural upgrade, migrating the frontend to TypeScript and implementing new features based on the Figma UI designs. It also finalizes the backend transition from a CLI-based OOP demo to a fully-fledged FastAPI REST API with SQLAlchemy and SQLite.

## Key Changes
*   **TypeScript Migration:** Ported the frontend React application from JavaScript to TypeScript for improved type safety and developer experience.
*   **UI Modernization (Figma-Accurate):**
    *   Implemented a dual-pane **Sign In Page** (`Login.tsx`) with backend authentication.
    *   Added **Account Settings** (`Settings.tsx`, `SettingsModal.tsx`) with form state and persistence.
    *   Added a **Notification System** (`NotificationPopover.tsx`) with read/unread tracking and badge updates.
*   **Real-Time Data Integration:** Added a `/api/system/time` endpoint and a `useServerTime` React hook to synchronize the dashboard clock with the server.
*   **Backend Cleanup:** Removed obsolete OOP models and services (`backend/models`, `backend/services`) and the `demo.js` artifacts, as the system now fully utilizes the SQLAlchemy `db_models` and Pydantic `schemas`.
*   **Tooling Updates:** Configured Vite dev server and cleared unused entry points (`main.jsx`, `App.jsx`).

## Testing
- Verified all endpoints via Swagger UI (`/docs`).
- Verified React frontend components load properly via `npm run dev`.
- Authentication, Settings, and Notification flows manually tested.
