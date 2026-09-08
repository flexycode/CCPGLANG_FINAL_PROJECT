"""
main.py — Entry Point for the Python Backend
============================================
PARADIGM: Object-Oriented Programming (OOP)

This is the main entry point that demonstrates how the OOP-based
attendance system works. It creates objects, calls methods, and
shows the flow of data through the class hierarchy.

Run this file to see a demonstration:
    python -m backend.main
"""

from backend.models.student import Student, StudentStatus
from backend.models.attendance_record import AttendanceStatus
from backend.models.attendance_tracker import AttendanceTracker
from backend.services.analytics_service import AnalyticsService


def main():
    """
    Demonstration of the Student Attendance Monitoring System (OOP).
    
    This function creates sample data and demonstrates every feature
    of the system using the OOP paradigm.
    """
    print("=" * 60)
    print("  Student Attendance Monitoring System")
    print("  Paradigm: Object-Oriented Programming (Python)")
    print("=" * 60)
    print()
    
    # ─── Step 1: Create the tracker (manager object) ──────────────
    tracker = AttendanceTracker(total_school_days=20)
    print(f"[1] Created AttendanceTracker with {tracker.total_school_days} school days")
    
    # ─── Step 2: Register students (create Student objects) ───────
    student1 = Student("STU-001", "Juan", "Dela Cruz")
    student2 = Student("STU-002", "Maria", "Santos")
    
    tracker.add_student(student1)
    tracker.add_student(student2)
    print(f"[2] Registered {tracker.student_count} students")
    print(f"    - {student1}")
    print(f"    - {student2}")
    print()
    
    # ─── Step 3: Record attendance ────────────────────────────────
    # Simulating 10 days of attendance for Student 1
    sample_statuses = [
        ("2026-09-01", AttendanceStatus.PRESENT),
        ("2026-09-02", AttendanceStatus.PRESENT),
        ("2026-09-03", AttendanceStatus.LATE),
        ("2026-09-04", AttendanceStatus.PRESENT),
        ("2026-09-05", AttendanceStatus.ABSENT),
        ("2026-09-08", AttendanceStatus.ABSENT),
        ("2026-09-09", AttendanceStatus.ABSENT),
        ("2026-09-10", AttendanceStatus.EXCUSED),
        ("2026-09-11", AttendanceStatus.PRESENT),
        ("2026-09-12", AttendanceStatus.LATE),
    ]
    
    for date, status in sample_statuses:
        tracker.mark_attendance("STU-001", date, status)
    
    print(f"[3] Recorded {tracker.record_count} attendance entries")
    print()
    
    # ─── Step 4: Display analytics ────────────────────────────────
    analytics = AnalyticsService(tracker)
    summary = analytics.student_summary("STU-001")
    
    print("[4] Attendance Analytics for STU-001 (Juan Dela Cruz):")
    print(f"    Total Present:          {summary['total_present']}")
    print(f"    Total Absent:           {summary['total_absent']}")
    print(f"    Total Late:             {summary['total_late']}")
    print(f"    Total Excused:          {summary['total_excused']}")
    print(f"    Total Days Attended:    {summary['total_days_attended']}")
    print(f"    Total School Days:      {summary['total_school_days']}")
    print(f"    Attendance Percentage:  {summary['attendance_percentage']}%")
    print(f"    Absence Percentage:     {summary['absence_percentage']}%")
    print(f"    Late Percentage:        {summary['late_percentage']}%")
    print(f"    Consecutive Absences:   {summary['consecutive_absences']}")
    print(f"    Consecutive Lates:      {summary['consecutive_lates']}")
    print()
    print("=" * 60)


if __name__ == "__main__":
    main()
