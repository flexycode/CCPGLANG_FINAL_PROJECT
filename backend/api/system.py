"""
system.py — System & Real-Time Time API Endpoints (WorldTimeAPI + Asia/Manila)
===============================================================================
PARADIGM: Object-Oriented Programming (OOP)

Provides server-synchronized real-time date, time, and active class
period computation. Uses the WorldTimeAPI open-source service to fetch
authoritative Philippine Standard Time (PHT, UTC+8), ensuring the
displayed clock is accurate regardless of server location.

REAL-TIME CLOCK:
- Primary: WorldTimeAPI (http://worldtimeapi.org/api/timezone/Asia/Manila)
- Fallback: Manual UTC+8 offset from system clock
- Cached offset refreshes every 60 seconds to avoid rate limiting
"""

from datetime import datetime, timezone, timedelta
import time
import threading

from fastapi import APIRouter
import httpx

from backend.schemas import SystemTimeResponse

router = APIRouter(tags=["System"])

# ─── Philippine Standard Time (UTC+8) ───────────────────────────────
PHT = timezone(timedelta(hours=8))

# ─── WorldTimeAPI Sync State ────────────────────────────────────────
# Cached offset between local system clock and WorldTimeAPI response.
# This avoids calling the API on every request.

_worldtime_offset_ms: float = 0.0
_last_sync_timestamp: float = 0.0
_sync_lock = threading.Lock()
_SYNC_INTERVAL_SECONDS = 60  # Re-sync with WorldTimeAPI every 60 seconds


def _sync_with_worldtime_api() -> None:
    """
    Fetch current Philippine time from WorldTimeAPI and calculate
    the offset between the local system clock and the API response.
    
    Thread-safe: uses a lock to prevent concurrent syncs.
    """
    global _worldtime_offset_ms, _last_sync_timestamp

    now = time.time()
    if now - _last_sync_timestamp < _SYNC_INTERVAL_SECONDS:
        return  # Skip if recently synced

    with _sync_lock:
        # Double-check after acquiring lock
        if time.time() - _last_sync_timestamp < _SYNC_INTERVAL_SECONDS:
            return

        try:
            client_req_start = time.time()
            response = httpx.get(
                "http://worldtimeapi.org/api/timezone/Asia/Manila",
                timeout=5.0,
            )
            client_req_end = time.time()

            if response.status_code == 200:
                data = response.json()
                # WorldTimeAPI returns Unix timestamp in seconds
                api_unix_seconds = data.get("unixtime", 0)
                round_trip_latency = (client_req_end - client_req_start) / 2
                api_time_with_latency = api_unix_seconds + round_trip_latency

                _worldtime_offset_ms = (api_time_with_latency - client_req_end) * 1000
                _last_sync_timestamp = time.time()
                print(f"[CLOCK] WorldTimeAPI synced -- offset: {_worldtime_offset_ms:.0f}ms")
            else:
                print(f"[WARN] WorldTimeAPI returned status {response.status_code}, using UTC+8 fallback")
        except Exception as err:
            print(f"[WARN] WorldTimeAPI unreachable ({err}), using UTC+8 fallback")


def _get_philippine_now() -> datetime:
    """
    Get the current Philippine time, corrected by WorldTimeAPI offset.
    Falls back to UTC+8 if the API has never been reached.
    """
    _sync_with_worldtime_api()

    corrected_unix_ms = (time.time() * 1000) + _worldtime_offset_ms
    corrected_utc = datetime.fromtimestamp(corrected_unix_ms / 1000, tz=timezone.utc)
    return corrected_utc.astimezone(PHT)


def calculate_active_period(now: datetime) -> str:
    """
    Compute current active class schedule slot based on time of day.
    
    Demonstrates procedural encapsulation within class/service architecture.
    Default periods aligned with university scheduling blocks:
    - 07:30 - 09:30
    - 09:30 - 11:30
    - 11:30 - 01:30
    - 01:30 - 03:00
    - 03:00 - 05:00 (Figma reference block)
    - 05:00 - 07:00
    - 07:00 - 09:00
    """
    hour = now.hour
    
    if 7 <= hour < 9 or (hour == 9 and now.minute < 30):
        return "7:30 AM - 9:30 AM"
    elif 9 <= hour < 11 or (hour == 11 and now.minute < 30):
        return "9:30 AM - 11:30 AM"
    elif 11 <= hour < 13 or (hour == 13 and now.minute < 30):
        return "11:30 AM - 1:30 PM"
    elif 13 <= hour < 15:
        return "1:30 PM - 3:00 PM"
    elif 15 <= hour < 17:
        return "3:00 PM - 5:00 PM"
    elif 17 <= hour < 19:
        return "5:00 PM - 7:00 PM"
    elif 19 <= hour < 21:
        return "7:00 PM - 9:00 PM"
    else:
        return "3:00 PM - 5:00 PM"  # Default reference period


@router.get("/time", response_model=SystemTimeResponse)
def get_system_time() -> SystemTimeResponse:
    """
    Get current Philippine Standard Time synchronized via WorldTimeAPI.
    
    Returns authoritative date, time (with seconds), and active class period.
    The frontend uses this to calibrate its local ticking clock.
    """
    now = _get_philippine_now()
    formatted_date = now.strftime("%A, %B %d")  # e.g., "Thursday, September 17"
    formatted_time = now.strftime("%I:%M:%S %p").lstrip("0")  # e.g., "3:45:22 PM"
    active_period = calculate_active_period(now)

    return SystemTimeResponse(
        iso_timestamp=now.isoformat(),
        timestamp_ms=int(now.timestamp() * 1000),
        formatted_date=formatted_date,
        formatted_time=formatted_time,
        active_period=active_period,
        timezone="Asia/Manila",
    )
