"""
attendance_record.py — AttendanceRecord Class
=============================================
PARADIGM: Object-Oriented Programming (OOP)

This module defines the AttendanceRecord class, representing a single
attendance entry for a student on a specific date.

KEY OOP CONCEPTS DEMONSTRATED:
- Data encapsulation: Each record bundles its data together
- Enum usage: Type-safe status values
- Immutable-like design: Records are created once and rarely modified
- String representation: Objects can describe themselves
"""

from enum import Enum
from datetime import datetime
from typing import Optional


class AttendanceStatus(Enum):
    """
    Enumeration of possible attendance statuses.
    
    PARADIGM NOTE:
    In OOP, we use Enum classes to enforce type safety. The system will
    only accept these four values — any other string would raise an error.
    
    In functional JS, these would be simple string constants:
    const STATUSES = { PRESENT: "present", ABSENT: "absent", ... }
    — but there's no enforcement; any string could be passed.
    """
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"


class AttendanceRecord:
    """
    Represents a single attendance record for one student on one date.
    
    Each record captures:
    - WHO: The student's ID
    - WHEN: The date and timestamp
    - WHAT: The attendance status (present, absent, late, excused)
    - TIME: Optional time-in and time-out timestamps
    
    PARADIGM NOTE:
    This class demonstrates ENCAPSULATION — all related data about an
    attendance event is bundled into a single object. The object provides
    methods to query and interact with its own data.
    
    In functional JS, this would be a plain object:
    { studentId: "123", date: "2026-09-15", status: "present", ... }
    """
    
    def __init__(self, student_id: str, date: str, status: AttendanceStatus):
        """
        Initialize a new AttendanceRecord.
        
        Args:
            student_id: The unique identifier of the student
            date: The date string (e.g., "2026-09-15")
            status: The attendance status (must be an AttendanceStatus enum value)
        """
        self.__student_id = student_id
        self.__date = date
        self.__status = status
        self.__created_at = datetime.now()
        self.__time_in: Optional[datetime] = None
        self.__time_out: Optional[datetime] = None
    
    @property
    def student_id(self) -> str:
        """The student's unique identifier."""
        return self.__student_id
    
    @property
    def date(self) -> str:
        """The date of this attendance record."""
        return self.__date
    
    @property
    def status(self) -> AttendanceStatus:
        """The attendance status for this record."""
        return self.__status
    
    @property
    def time_in(self) -> Optional[datetime]:
        """The timestamp when the student checked in."""
        return self.__time_in
    
    @property
    def time_out(self) -> Optional[datetime]:
        """The timestamp when the student checked out."""
        return self.__time_out
    
    def record_time_in(self, timestamp: Optional[datetime] = None) -> None:
        """
        Records the student's time of arrival.
        
        PARADIGM NOTE:
        This method MUTATES the object's internal state by setting
        self.__time_in. In functional JS, you would instead create
        a new object: const withTimeIn = (record, time) => ({...record, timeIn: time})
        
        Args:
            timestamp: The arrival time (defaults to now if not provided)
        """
        self.__time_in = timestamp or datetime.now()
    
    def record_time_out(self, timestamp: Optional[datetime] = None) -> None:
        """
        Records the student's time of departure.
        
        Args:
            timestamp: The departure time (defaults to now if not provided)
            
        Raises:
            ValueError: If time_in has not been recorded yet
        """
        if self.__time_in is None:
            raise ValueError("Cannot record time out before time in.")
        self.__time_out = timestamp or datetime.now()
    
    @property
    def duration(self) -> Optional[float]:
        """
        Calculates the duration of attendance in hours.
        
        Returns:
            Duration in hours, or None if time_in/time_out not set
        """
        if self.__time_in and self.__time_out:
            delta = self.__time_out - self.__time_in
            return round(delta.total_seconds() / 3600, 2)
        return None
    
    def is_present_or_late(self) -> bool:
        """
        Checks if this record counts toward "days attended".
        Both PRESENT and LATE count as days the student was physically in class.
        
        Returns:
            True if status is PRESENT or LATE
        """
        return self.__status in (AttendanceStatus.PRESENT, AttendanceStatus.LATE)
    
    def __str__(self) -> str:
        return (f"AttendanceRecord(student={self.__student_id}, "
                f"date={self.__date}, status={self.__status.value})")
    
    def __repr__(self) -> str:
        return (f"AttendanceRecord(student_id='{self.__student_id}', "
                f"date='{self.__date}', status={self.__status})")
