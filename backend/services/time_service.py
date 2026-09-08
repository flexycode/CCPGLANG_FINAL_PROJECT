"""
time_service.py — Time Tracking Service Class
=============================================
PARADIGM: Object-Oriented Programming (OOP)

This service manages time-in/time-out operations and provides
time-related calculations for the attendance system.

PURPOSE:
- Handle time-in and time-out recording for students
- Calculate session durations
- Determine if a student is "late" based on a cutoff time
"""

from datetime import datetime, time
from typing import Optional


class TimeService:
    """
    Manages time tracking operations for attendance.
    
    PARADIGM NOTE:
    This class maintains configuration state (e.g., class_start_time,
    late_threshold_minutes) as instance attributes. In functional JS,
    these would be passed as parameters to each function call or stored
    in a configuration object.
    """
    
    def __init__(self, class_start_time: time, late_threshold_minutes: int = 15):
        """
        Initialize the TimeService.
        
        Args:
            class_start_time: The official class start time
            late_threshold_minutes: Minutes after start time before marked "late"
        """
        self.__class_start_time = class_start_time
        self.__late_threshold_minutes = late_threshold_minutes
    
    def is_late(self, arrival_time: datetime) -> bool:
        """
        Determines if a student is late based on their arrival time.
        
        PURPOSE:
        Compares the arrival time against the class start time plus
        the late threshold. Used when marking attendance to automatically
        determine if the status should be "late" vs "present".
        
        Args:
            arrival_time: The datetime when the student arrived
            
        Returns:
            True if the student arrived after the threshold
        """
        arrival = arrival_time.time()
        # Calculate the cutoff time
        cutoff_minutes = (self.__class_start_time.hour * 60 + 
                         self.__class_start_time.minute + 
                         self.__late_threshold_minutes)
        cutoff = time(cutoff_minutes // 60, cutoff_minutes % 60)
        return arrival > cutoff
    
    @staticmethod
    def calculate_duration(time_in: datetime, time_out: Optional[datetime] = None) -> float:
        """
        Calculates the duration between time_in and time_out in hours.
        
        PARADIGM NOTE:
        This is a @staticmethod — it doesn't use `self` and behaves
        like a standalone function. It's placed in the class for
        organizational purposes (namespacing). In functional JS,
        this would simply be a top-level function.
        
        Args:
            time_in: The check-in timestamp
            time_out: The check-out timestamp (defaults to now)
            
        Returns:
            Duration in hours, rounded to 2 decimal places
        """
        if time_out is None:
            time_out = datetime.now()
        delta = time_out - time_in
        return round(delta.total_seconds() / 3600, 2)
