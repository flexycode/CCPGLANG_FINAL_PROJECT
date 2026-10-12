## Summary

This PR introduces comprehensive support for **Calendar Events (Holidays, Suspensions, Professor Excuses)** and a **Dropped Student Soft-Delete Lifecycle** across both the backend (FastAPI + SQLAlchemy OOP) and the frontend (TypeScript + React Functional UI).

---

### 1. 📅 Calendar Events & Non-Class Day Management (Holidays, Suspensions, Professor Excuses)

- **Database Model (`backend/db_models.py`)**:
  - Added `CalendarEventModel` mapped to `calendar_events` storing `date`, `event_type` (`holiday`, `suspension`, `professor_excuse`), `title`, and `description`.
- **API Router (`backend/api/calendar.py` & `backend/main.py`)**:
  - Implemented `/api/calendar/` CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) with query filtering by `event_type` and date range.
  - Implemented `/api/calendar/check/{date}` endpoint for fast non-class day verification.
- **Attendance Defense-in-Depth (`backend/api/attendance.py`)**:
  - `mark_attendance` now verifies against `CalendarEventModel` before logging attendance, returning a 400 advisory error if an instructor attempts to mark attendance on a non-class day.
- **Analytics Auto-Calculation (`backend/api/analytics.py`)**:
  - Total school days and expected attendance metrics automatically subtract dates marked with holidays, suspensions, and professor emergencies so student attendance rates and professor schedules are never penalized.
- **Database Schema & Seed (`supabase_schema_and_seed.sql`)**:
  - Added `calendar_events` table schema, index on `date`, and seed data with standard Philippine academic holidays and suspensions.

---

### 2. 👥 Dropped Student Feature (Soft-Delete & Historical Record Preservation)

- **Student Lifecycle (`backend/db_models.py` & `backend/schemas.py`)**:
  - Updated `StudentModel` with soft-delete fields: `status` (`enrolled` / `dropped`), `dropped_date`, and `drop_reason`.
- **API Endpoints (`backend/api/students.py`)**:
  - Replaced hard-deletion with soft-delete:
    - `POST /api/students/{id}/drop` marks the student as `dropped` and records an optional reason.
    - `POST /api/students/{id}/reenroll` restores a dropped student back to `enrolled`.
    - `DELETE /api/students/{id}` accepts a soft-delete fallback.
- **Interactive UI (`frontend/src/classDetails.tsx`)**:
  - **6-Stat-Card Grid**: Added a dedicated **Dropped** metric card (`Ban` icon) alongside Enrolled, Present, Absent, Late, and Excused.
  - **Roster Controls**: Added **Drop** button (`UserMinus` icon) in the attendees toolbar.
  - **Drop Confirmation Modal**: Allows instructors to select an enrolled student and provide a drop reason (e.g., *Transferred*, *Medical*, *Personal*, *Academic*).
  - **"Show Dropped" Toggle**: Allows teachers to filter dropped students in and out of the active view.
  - **Table Rows**: Dropped students receive distinct visual treatment (grayed out with `Dropped` status badge and a **Re-enroll** button to restore them at any time).
  - **Dynamic Metrics**: Dropped students are automatically excluded from active enrolled counts and attendance percentages.

---

### 3. 🧪 Verification & Build Status

- **Frontend**: Successfully compiled with `tsc -b && vite build` (0 errors, 0 warnings).
- **Backend**: Successfully validated with FastAPI / SQLAlchemy schemas and live SQLite/Supabase connections.
- **E2E Browser Verification**: Tested on local dev servers (`http://localhost:5173/` and `http://127.0.0.1:8000/`) confirming responsive card layout, drop modal operation, and state persistence.
