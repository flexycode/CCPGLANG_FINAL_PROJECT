"""
api/attendance.py — Attendance Recording API Routes
====================================================
PARADIGM: Object-Oriented Programming (OOP)

These endpoints handle attendance marking and record retrieval.
Each operation creates or queries AttendanceRecord OBJECTS
through the SQLAlchemy ORM session.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.db_models import StudentModel, AttendanceRecordModel, CalendarEventModel
from backend.schemas import (
    AttendanceMarkRequest,
    AttendanceRecordResponse,
    AttendanceListResponse,
)

router = APIRouter(tags=["Attendance"])


@router.post("/", response_model=AttendanceRecordResponse, status_code=201)
def mark_attendance(
    payload: AttendanceMarkRequest,
    db: Session = Depends(get_db),
):
    """
    Mark attendance for a student on a given date.
    
    PARADIGM NOTE:
    This endpoint mirrors AttendanceTracker.mark_attendance() from the
    OOP model. It validates the student exists, checks for calendar events
    (holidays, suspensions, professor excuses), creates an AttendanceRecord
    OBJECT, and persists it to the database.
    
    In the functional JS approach, this would be a pure function:
    markAttendance(records, studentId, date, status) → [...records, newRecord]
    """
    # Check if the date is a non-class day (holiday, suspension, professor excuse)
    calendar_event = (
        db.query(CalendarEventModel)
        .filter(CalendarEventModel.date == payload.date)
        .first()
    )
    if calendar_event:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot mark attendance on {payload.date}: "
                f"{calendar_event.title} ({calendar_event.event_type})"
            ),
        )
    
    # Validate student exists and is active
    student = db.query(StudentModel).filter(
        StudentModel.id == payload.student_id
    ).first()
    
    if student is None:
        raise HTTPException(
            status_code=404,
            detail=f"Student {payload.student_id} not found.",
        )
    
    if student.status not in ("enrolled", "late_enrolled"):
        raise HTTPException(
            status_code=400,
            detail=f"Student {payload.student_id} is not active (status: {student.status}).",
        )
    
    record = AttendanceRecordModel(
        student_id=payload.student_id,
        date=payload.date,
        status=payload.status.value,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return AttendanceRecordResponse.model_validate(record)


@router.get("/student/{student_id}", response_model=AttendanceListResponse)
def get_student_attendance(
    student_id: str,
    db: Session = Depends(get_db),
):
    """
    Get all attendance records for a specific student.
    
    PARADIGM NOTE:
    This mirrors AttendanceTracker.get_records_for_student() — filtering
    records by student ID. In OOP, the tracker owns the records and
    provides a method to filter them. Here, the database handles filtering
    via SQL WHERE clause.
    """
    records = (
        db.query(AttendanceRecordModel)
        .filter(AttendanceRecordModel.student_id == student_id)
        .order_by(AttendanceRecordModel.date)
        .all()
    )
    return AttendanceListResponse(
        records=[AttendanceRecordResponse.model_validate(r) for r in records],
        total=len(records),
    )


@router.get("/", response_model=AttendanceListResponse)
def list_all_attendance(db: Session = Depends(get_db)):
    """
    Get all attendance records across all students.
    """
    records = (
        db.query(AttendanceRecordModel)
        .order_by(AttendanceRecordModel.date)
        .all()
    )
    return AttendanceListResponse(
        records=[AttendanceRecordResponse.model_validate(r) for r in records],
        total=len(records),
    )
