"""
api/analytics.py — Analytics API Routes
========================================
PARADIGM: Object-Oriented Programming (OOP)

These endpoints use the existing OOP-based analytics services
(AttendanceTracker and AnalyticsService) to compute attendance
metrics from the database records.

This demonstrates how OOP models can be composed with an API layer
to serve computed results to the frontend.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.db_models import StudentModel, AttendanceRecordModel, CalendarEventModel
from backend.schemas import StudentSummaryResponse

router = APIRouter(tags=["Analytics"])


@router.get(
    "/summary/{student_id}",
    response_model=StudentSummaryResponse,
)
def get_student_summary(
    student_id: str,
    total_school_days: int = Query(
        default=20,
        ge=1,
        description=(
            "Base total scheduled class days for the semester. "
            "Calendar events (holidays, suspensions, professor excuses) "
            "will be automatically subtracted from this count."
        ),
    ),
    db: Session = Depends(get_db),
):
    """
    Get a complete attendance summary for a student.
    
    PARADIGM NOTE:
    This endpoint combines database queries with the OOP-based
    analytics calculations. It mirrors AnalyticsService.student_summary()
    but uses database-backed records instead of in-memory data.
    
    The calculations (percentages, streaks) are done in Python
    using the same OOP logic from the models layer.
    
    Calendar events (holidays, suspensions, professor excuses) are
    automatically subtracted from total_school_days so that students
    are not penalized for non-class days.
    """
    # Verify student exists
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found.")
    
    # Auto-subtract calendar event days from total school days
    calendar_event_count = db.query(CalendarEventModel).count()
    effective_school_days = max(1, total_school_days - calendar_event_count)
    
    # Fetch all records from DB
    records = (
        db.query(AttendanceRecordModel)
        .filter(AttendanceRecordModel.student_id == student_id)
        .order_by(AttendanceRecordModel.date)
        .all()
    )
    
    # Exclude attendance records that fall on calendar event dates
    calendar_event_dates = {
        e.date for e in db.query(CalendarEventModel).all()
    }
    active_records = [r for r in records if r.date not in calendar_event_dates]
    
    # Count by status (only active records)
    total_present = sum(1 for r in active_records if r.status == "present")
    total_absent = sum(1 for r in active_records if r.status == "absent")
    total_late = sum(1 for r in active_records if r.status == "late")
    total_excused = sum(1 for r in active_records if r.status == "excused")
    total_days_attended = total_present + total_late
    
    # Percentages
    def pct(part: int, total: int) -> float:
        return round((part / total) * 100, 2) if total > 0 else 0.0
    
    # Streaks (use active records only)
    def consecutive_streak(status_val: str) -> int:
        max_s = 0
        cur_s = 0
        for r in active_records:
            if r.status == status_val:
                cur_s += 1
                max_s = max(max_s, cur_s)
            else:
                cur_s = 0
        return max_s
    
    return StudentSummaryResponse(
        student_id=student_id,
        student_name=f"{student.last_name}, {student.first_name}",
        total_present=total_present,
        total_absent=total_absent,
        total_late=total_late,
        total_excused=total_excused,
        total_days_attended=total_days_attended,
        total_school_days=effective_school_days,
        attendance_percentage=pct(total_days_attended, effective_school_days),
        absence_percentage=pct(total_absent, effective_school_days),
        late_percentage=pct(total_late, effective_school_days),
        consecutive_absences=consecutive_streak("absent"),
        consecutive_lates=consecutive_streak("late"),
    )

