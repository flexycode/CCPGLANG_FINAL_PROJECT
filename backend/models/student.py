"""
student.py — Student Class
==========================
PARADIGM: Object-Oriented Programming (OOP)

This module defines the Student class, which encapsulates all data and behavior
related to a single student in the attendance monitoring system.

KEY OOP CONCEPTS DEMONSTRATED:
- Encapsulation: Student data is bundled with the methods that operate on it
- Constructor (__init__): Initializes the object's state
- Properties (@property): Controlled access to internal attributes
- String representation (__str__, __repr__): How objects describe themselves

COMPARISON WITH JS (FUNCTIONAL):
In the functional approach, a student would simply be a plain data object (dict/JSON).
There would be no methods attached to it — instead, separate functions would
operate on the student data. Here, the student "knows" things about itself.
"""

from enum import Enum
from datetime import datetime


class StudentStatus(Enum):
    """
    Enumeration of possible student enrollment statuses.
    
    Using an Enum class demonstrates OOP's approach to defining
    a fixed set of valid values. In functional JS, these would be
    simple string constants.
    """
    ENROLLED = "enrolled"
    LATE_ENROLLED = "late_enrolled"
    DROPPED = "dropped"
    SUSPENDED = "suspended"


class Student:
    """
    Represents a single student in the attendance monitoring system.
    
    This class ENCAPSULATES:
    - Student identity (id, name)
    - Enrollment status
    - Enrollment metadata (date, section)
    
    The student object maintains its own state and provides methods
    to interact with that state in a controlled way.
    
    Attributes:
        student_id (str): Unique identifier for the student
        first_name (str): Student's first name
        last_name (str): Student's last name
        status (StudentStatus): Current enrollment status
        enrolled_date (datetime): When the student enrolled
    """
    
    def __init__(self, student_id: str, first_name: str, last_name: str,
                 status: StudentStatus = StudentStatus.ENROLLED):
        """
        Initialize a new Student instance.
        
        PARADIGM NOTE:
        The __init__ method is the CONSTRUCTOR — it sets up the object's
        initial state. All attributes are bound to `self`, making them
        accessible throughout the object's lifetime. This is fundamentally
        different from functional programming, where data and behavior
        are separate.
        
        Args:
            student_id: Unique identifier for the student
            first_name: Student's first name
            last_name: Student's last name
            status: Initial enrollment status (defaults to ENROLLED)
        """
        self.__student_id = student_id       # Private (name mangling)
        self.__first_name = first_name
        self.__last_name = last_name
        self.__status = status
        self.__enrolled_date = datetime.now()
    
    @property
    def student_id(self) -> str:
        """Read-only property for student ID (encapsulation)."""
        return self.__student_id
    
    @property
    def full_name(self) -> str:
        """
        Computed property — derives the full name from stored parts.
        
        PARADIGM NOTE:
        In OOP, this is a @property — it looks like an attribute but
        is actually a method call. The student object "knows" how to
        present its own name. In functional JS, you would write a
        separate function: getFullName(student) => `${student.first} ${student.last}`
        """
        return f"{self.__last_name}, {self.__first_name}"
    
    @property
    def status(self) -> StudentStatus:
        """Current enrollment status."""
        return self.__status
    
    def update_status(self, new_status: StudentStatus) -> None:
        """
        Updates the student's enrollment status.
        
        PARADIGM NOTE:
        This METHOD mutates the object's internal state (self.__status).
        In functional programming, you would never mutate — instead,
        you'd return a NEW student object with the updated status:
        
        JS: const updateStatus = (student, status) => ({...student, status});
        
        Args:
            new_status: The new StudentStatus to assign
            
        Raises:
            ValueError: If the status transition is invalid
        """
        # Business rule: dropped/suspended students cannot re-enroll directly
        if self.__status in (StudentStatus.DROPPED, StudentStatus.SUSPENDED):
            if new_status == StudentStatus.ENROLLED:
                raise ValueError(
                    f"Cannot change status from {self.__status.value} "
                    f"to {new_status.value} directly."
                )
        self.__status = new_status
    
    def is_active(self) -> bool:
        """
        Checks if the student is currently active (can attend classes).
        
        Returns:
            True if status is ENROLLED or LATE_ENROLLED
        """
        return self.__status in (StudentStatus.ENROLLED, StudentStatus.LATE_ENROLLED)
    
    def __str__(self) -> str:
        """Human-readable string representation."""
        return f"Student({self.full_name}, ID: {self.__student_id}, Status: {self.__status.value})"
    
    def __repr__(self) -> str:
        """Developer-oriented string representation."""
        return (f"Student(student_id='{self.__student_id}', "
                f"first_name='{self.__first_name}', "
                f"last_name='{self.__last_name}', "
                f"status={self.__status})")
