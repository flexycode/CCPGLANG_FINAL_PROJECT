"""
attendance_tracker.py — AttendanceTracker Class
===============================================
PARADIGM: Object-Oriented Programming (OOP)

This is the CORE MANAGER CLASS that orchestrates attendance operations.
It demonstrates OOP's approach to managing collections of objects and
performing aggregate calculations.

KEY OOP CONCEPTS DEMONSTRATED:
- Composition: Contains collections of Student and AttendanceRecord objects
- Manager pattern: Coordinates operations across multiple objects
- Encapsulation: Internal data structures hidden behind methods
- Computed properties: Analytics derived from internal state

COMPARISON WITH JS (FUNCTIONAL):
In the functional approach, all of these operations would be standalone
functions that receive data as parameters and return new data. There is
no "manager" object — just functions composed together.
"""

from typing import List, Dict, Optional
from datetime import datetime

from backend.models.student import Student, StudentStatus
from backend.models.attendance_record import AttendanceRecord, AttendanceStatus


class AttendanceTracker:
    """
    Manages students and their attendance records.
    
    This class acts as the central coordinator, demonstrating the OOP
    pattern of a "manager" or "service" class that owns and operates
    on collections of domain objects.
    
    Attributes:
        __students: Private dictionary mapping student IDs to Student objects
        __records: Private list of all AttendanceRecord objects
        __total_school_days: Total number of scheduled class days
    """
    
    def __init__(self, total_school_days: int = 0):
        """
        Initialize the AttendanceTracker.
        
        Args:
            total_school_days: Total number of scheduled class days in the term
        """
        self.__students: Dict[str, Student] = {}
        self.__records: List[AttendanceRecord] = []
        self.__total_school_days = total_school_days
    
    # ─── Student Management ───────────────────────────────────────────
    
    def add_student(self, student: Student) -> None:
        """
        Registers a student in the tracker.
        
        PARADIGM NOTE:
        The tracker OWNS the student references — it maintains a dictionary
        of students indexed by ID. In functional JS:
        const addStudent = (students, student) => ({...students, [student.id]: student})
        
        Args:
            student: A Student object to register
            
        Raises:
            ValueError: If a student with the same ID already exists
        """
        if student.student_id in self.__students:
            raise ValueError(f"Student {student.student_id} already registered.")
        self.__students[student.student_id] = student
    
    def get_student(self, student_id: str) -> Optional[Student]:
        """Retrieves a student by their ID."""
        return self.__students.get(student_id)
    
    # ─── Attendance Recording ─────────────────────────────────────────
    
    def mark_attendance(self, student_id: str, date: str, 
                        status: AttendanceStatus) -> AttendanceRecord:
        """
        Records attendance for a student on a given date.
        
        PARADIGM NOTE:
        This method:
        1. Validates the student exists and is active (business logic)
        2. Creates a new AttendanceRecord object (object creation)
        3. Appends it to the internal list (state mutation)
        
        In functional JS, this would be a pure function:
        const markAttendance = (records, studentId, date, status) => [
            ...records, { studentId, date, status, timestamp: Date.now() }
        ];
        
        Args:
            student_id: The student's unique identifier
            date: The date string
            status: The attendance status
            
        Returns:
            The created AttendanceRecord
            
        Raises:
            ValueError: If the student is not registered or not active
        """
        student = self.__students.get(student_id)
        if student is None:
            raise ValueError(f"Student {student_id} is not registered.")
        if not student.is_active():
            raise ValueError(f"Student {student_id} is not active (status: {student.status.value}).")
        
        record = AttendanceRecord(student_id, date, status)
        self.__records.append(record)
        return record
    
    # ─── Analytics: Counting ──────────────────────────────────────────
    
    def get_records_for_student(self, student_id: str) -> List[AttendanceRecord]:
        """
        Retrieves all attendance records for a specific student.
        
        PARADIGM NOTE:
        Uses a list comprehension (Pythonic filtering). In functional JS,
        this would be: records.filter(r => r.studentId === studentId)
        """
        return [r for r in self.__records if r.student_id == student_id]
    
    def count_by_status(self, student_id: str, status: AttendanceStatus) -> int:
        """
        Counts how many times a student has a specific status.
        
        PURPOSE:
        This is the foundation for Total Present, Total Absent, Total Excused.
        
        Args:
            student_id: The student's unique identifier
            status: The AttendanceStatus to count
            
        Returns:
            Number of records matching the status
        """
        return sum(
            1 for r in self.__records
            if r.student_id == student_id and r.status == status
        )
    
    def total_present(self, student_id: str) -> int:
        """Total days marked as PRESENT for a student."""
        return self.count_by_status(student_id, AttendanceStatus.PRESENT)
    
    def total_absent(self, student_id: str) -> int:
        """Total days marked as ABSENT for a student."""
        return self.count_by_status(student_id, AttendanceStatus.ABSENT)
    
    def total_excused(self, student_id: str) -> int:
        """Total days marked as EXCUSED for a student."""
        return self.count_by_status(student_id, AttendanceStatus.EXCUSED)
    
    def total_late(self, student_id: str) -> int:
        """Total days marked as LATE for a student."""
        return self.count_by_status(student_id, AttendanceStatus.LATE)
    
    def total_days_attended(self, student_id: str) -> int:
        """
        Total days the student was physically in class.
        
        PURPOSE:
        Counts both PRESENT and LATE, since late students still attended.
        
        Formula: total_present + total_late
        """
        return self.total_present(student_id) + self.total_late(student_id)
    
    # ─── Analytics: Percentages ───────────────────────────────────────
    
    def attendance_percentage(self, student_id: str) -> float:
        """
        Calculates the attendance rate as a percentage.
        
        PURPOSE:
        Shows what proportion of school days the student attended.
        
        Formula: (total_days_attended / total_school_days) × 100
        
        Returns:
            Percentage rounded to 2 decimal places (0.00 - 100.00)
        """
        if self.__total_school_days == 0:
            return 0.0
        return round(
            (self.total_days_attended(student_id) / self.__total_school_days) * 100, 2
        )
    
    def absence_percentage(self, student_id: str) -> float:
        """
        Calculates the absence rate as a percentage.
        
        Formula: (total_absent / total_school_days) × 100
        """
        if self.__total_school_days == 0:
            return 0.0
        return round(
            (self.total_absent(student_id) / self.__total_school_days) * 100, 2
        )
    
    def late_percentage(self, student_id: str) -> float:
        """
        Calculates the late rate as a percentage.
        
        Formula: (total_late / total_school_days) × 100
        """
        if self.__total_school_days == 0:
            return 0.0
        return round(
            (self.total_late(student_id) / self.__total_school_days) * 100, 2
        )
    
    # ─── Analytics: Streaks ───────────────────────────────────────────
    
    def consecutive_absences(self, student_id: str) -> int:
        """
        Finds the longest streak of consecutive ABSENT records.
        
        PURPOSE:
        Identifies students who may be at risk of dropping out or
        who may need academic intervention.
        
        PARADIGM NOTE:
        Uses an imperative loop with mutable variables (max_streak, 
        current_streak). In functional JS, this would use `reduce`:
        
        records.reduce((acc, r) => {
            const current = r.status === "absent" ? acc.current + 1 : 0;
            return { max: Math.max(acc.max, current), current };
        }, { max: 0, current: 0 }).max;
        """
        return self.__calculate_streak(student_id, AttendanceStatus.ABSENT)
    
    def consecutive_lates(self, student_id: str) -> int:
        """
        Finds the longest streak of consecutive LATE records.
        
        PURPOSE:
        Identifies patterns of chronic tardiness.
        """
        return self.__calculate_streak(student_id, AttendanceStatus.LATE)
    
    def __calculate_streak(self, student_id: str, status: AttendanceStatus) -> int:
        """
        Private helper method to calculate the longest consecutive streak.
        
        PARADIGM NOTE:
        This is a PRIVATE METHOD (name mangled with __). It demonstrates
        encapsulation — external code cannot call this directly. The public
        methods consecutive_absences() and consecutive_lates() delegate to it.
        
        Args:
            student_id: The student's unique identifier
            status: The AttendanceStatus to track streaks for
            
        Returns:
            Length of the longest consecutive streak
        """
        records = sorted(
            self.get_records_for_student(student_id),
            key=lambda r: r.date
        )
        
        max_streak = 0
        current_streak = 0
        
        for record in records:
            if record.status == status:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        
        return max_streak
    
    # ─── Properties ───────────────────────────────────────────────────
    
    @property
    def total_school_days(self) -> int:
        """Total number of scheduled class days."""
        return self.__total_school_days
    
    @total_school_days.setter
    def total_school_days(self, value: int) -> None:
        """Set total school days with validation."""
        if value < 0:
            raise ValueError("Total school days cannot be negative.")
        self.__total_school_days = value
    
    @property
    def student_count(self) -> int:
        """Number of registered students."""
        return len(self.__students)
    
    @property
    def record_count(self) -> int:
        """Total number of attendance records."""
        return len(self.__records)
