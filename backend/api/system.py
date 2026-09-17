"""
system.py — System & Real-Time Time API Endpoints
=================================================
PARADIGM: Object-Oriented Programming (OOP)

Provides server-synchronized real-time date, time, and active class
period computation. This allows frontend clients to synchronize their
internal clocks and display consistent institutional time.
"""

from datetime import datetime
import time
from fastapi import APIRouter
from backend.schemas import SystemTimeResponse

router = APIRouter(tags=["System"])


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
    Get current server date and time synchronized for institutional display.
    """
    now = datetime.now()
    formatted_date = now.strftime("%A, %B %d")  # e.g., "Thursday, September 17"
    formatted_time = now.strftime("%I:%M %p").lstrip("0")  # e.g., "3:00 PM"
    active_period = calculate_active_period(now)

    return SystemTimeResponse(
        iso_timestamp=now.isoformat(),
        timestamp_ms=int(time.time() * 1000),
        formatted_date=formatted_date,
        formatted_time=formatted_time,
        active_period=active_period,
        timezone="Asia/Manila",
    )
