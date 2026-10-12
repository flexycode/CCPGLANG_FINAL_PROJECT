"""
api/calendar.py — Calendar Event CRUD API Routes
==================================================
PARADIGM: Object-Oriented Programming (OOP)

These endpoints manage calendar events such as holidays, class
suspensions, and professor excuses. Dates with calendar events
are excluded from attendance counting and school day calculations.

KEY OOP CONCEPTS:
- Object creation: CalendarEventModel(...) creates database-mapped objects
- Encapsulation: Event validation hidden behind schema + ORM layers
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from backend.database import get_db
from backend.db_models import CalendarEventModel
from backend.schemas import (
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventResponse,
    CalendarEventListResponse,
    DateCheckResponse,
)

router = APIRouter(tags=["Calendar Events"])


@router.get("/", response_model=CalendarEventListResponse)
def list_calendar_events(
    event_type: Optional[str] = Query(
        default=None,
        description="Filter by event type: holiday, suspension, professor_excuse",
    ),
    db: Session = Depends(get_db),
):
    """
    List all calendar events, optionally filtered by event type.
    
    Returns holidays, suspensions, and professor excuses that mark
    non-class days in the academic calendar.
    """
    query = db.query(CalendarEventModel)
    if event_type:
        query = query.filter(CalendarEventModel.event_type == event_type)
    events = query.order_by(CalendarEventModel.date).all()
    return CalendarEventListResponse(
        events=[CalendarEventResponse.model_validate(e) for e in events],
        total=len(events),
    )


@router.get("/check/{date}", response_model=DateCheckResponse)
def check_date(date: str, db: Session = Depends(get_db)):
    """
    Check if a specific date is a class day or a non-class day.
    
    Returns whether the date has a calendar event (holiday, suspension,
    or professor excuse) that would block attendance marking.
    """
    event = (
        db.query(CalendarEventModel)
        .filter(CalendarEventModel.date == date)
        .first()
    )
    if event:
        return DateCheckResponse(
            date=date,
            is_class_day=False,
            event=CalendarEventResponse.model_validate(event),
        )
    return DateCheckResponse(date=date, is_class_day=True, event=None)


@router.get("/{event_id}", response_model=CalendarEventResponse)
def get_calendar_event(event_id: int, db: Session = Depends(get_db)):
    """
    Get a specific calendar event by its ID.
    
    Raises 404 if the event does not exist.
    """
    event = db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail=f"Calendar event {event_id} not found.")
    return CalendarEventResponse.model_validate(event)


@router.post("/", response_model=CalendarEventResponse, status_code=201)
def create_calendar_event(
    payload: CalendarEventCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new calendar event (holiday, suspension, or professor excuse).
    
    PARADIGM NOTE:
    Creates a new CalendarEventModel OBJECT and persists it to the database.
    The event marks the specified date as a non-class day, which prevents
    attendance marking and excludes the date from school day calculations.
    """
    # Check for duplicate event on the same date
    existing = (
        db.query(CalendarEventModel)
        .filter(CalendarEventModel.date == payload.date)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"A calendar event already exists on {payload.date}: {existing.title}",
        )
    
    event = CalendarEventModel(
        date=payload.date,
        event_type=payload.event_type.value,
        title=payload.title,
        description=payload.description,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return CalendarEventResponse.model_validate(event)


@router.put("/{event_id}", response_model=CalendarEventResponse)
def update_calendar_event(
    event_id: int,
    payload: CalendarEventUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing calendar event.
    
    PARADIGM NOTE:
    In OOP, we modify the object's attributes directly.
    The ORM tracks changes and persists them on commit.
    """
    event = db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail=f"Calendar event {event_id} not found.")
    
    if payload.date is not None:
        # Check for duplicate on the new date (exclude current event)
        dup = (
            db.query(CalendarEventModel)
            .filter(
                CalendarEventModel.date == payload.date,
                CalendarEventModel.id != event_id,
            )
            .first()
        )
        if dup:
            raise HTTPException(
                status_code=409,
                detail=f"A calendar event already exists on {payload.date}: {dup.title}",
            )
        event.date = payload.date
    
    if payload.event_type is not None:
        event.event_type = payload.event_type.value
    if payload.title is not None:
        event.title = payload.title
    if payload.description is not None:
        event.description = payload.description
    
    db.commit()
    db.refresh(event)
    return CalendarEventResponse.model_validate(event)


@router.delete("/{event_id}", status_code=204)
def delete_calendar_event(event_id: int, db: Session = Depends(get_db)):
    """
    Delete a calendar event.
    
    This restores the date as a normal class day.
    """
    event = db.query(CalendarEventModel).filter(CalendarEventModel.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail=f"Calendar event {event_id} not found.")
    
    db.delete(event)
    db.commit()
    return None
