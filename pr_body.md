## Overview
This PR implements three major updates to the Checkmate Attendance Monitoring System based on the Figma design and infrastructure requirements.

1. **Supabase PostgreSQL Migration**: Replaced the hardcoded SQLite connection with a dynamic Supabase PostgreSQL connection pool (with local SQLite fallback).
2. **Real-Time Clock (WorldTimeAPI)**: Replaced local system time with `WorldTimeAPI` (Asia/Manila) to serve authoritative Philippine Standard Time.
3. **Figma-Aligned Topbar UI**: Restructured the Topbar component to accurately match the Figma design (node 2010-3598).

## Key Changes
- **Backend**:
  - `database.py`: Added Supabase connection pooling and `.env` parsing.
  - `api/system.py`: Added `httpx` integration to fetch and cache WorldTimeAPI offset for UTC+8 time.
  - `requirements.txt`: Added `psycopg2-binary`, `python-dotenv`, and `httpx`.
  - Added `.env.example` template for Supabase credentials.
- **Frontend**:
  - `useServerTime.ts`: Updated to provide a live-ticking clock (HH:MM:SS) synchronized with the backend's WorldTimeAPI offset.
  - `Topbar.tsx`: Updated layout to include a 480px pill-shaped search bar, right-aligned stacked datetime block (Date + Live Clock), and pulse animation for the live sync dot.
  - `index.css`: Added focus transitions for the new search bar.
