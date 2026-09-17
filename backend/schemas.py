"""
schemas.py — Pydantic Request/Response Schemas
===============================================
PARADIGM: Object-Oriented Programming (OOP)

Pydantic models define the shape of data flowing in and out of
the API. They handle:
- Input validation (rejecting invalid data with clear errors)
- Serialization (converting Python objects to JSON)
- Documentation (auto-generated OpenAPI/Swagger docs)

These complement the SQLAlchemy models (db_models.py):
- SQLAlchemy models define how data is STORED
- Pydantic models define how data is TRANSFERRED
"""

from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


# ─── Enums ────────────────────────────────────────────────────────────

class AttendanceStatusEnum(str, Enum):
    """Valid attendance status values."""
    present = "present"
    absent = "absent"
    late = "late"
    excused = "excused"


class StudentStatusEnum(str, Enum):
    """Valid student status values."""
    enrolled = "enrolled"
    late_enrolled = "late_enrolled"
    dropped = "dropped"
    suspended = "suspended"


# ─── Student Schemas ──────────────────────────────────────────────────

class StudentCreate(BaseModel):
    """Schema for creating a new student (request body)."""
    id: str = Field(..., min_length=1, max_length=20, examples=["STU-001"])
    first_name: str = Field(..., min_length=1, max_length=100, examples=["Juan"])
    last_name: str = Field(..., min_length=1, max_length=100, examples=["Dela Cruz"])
    status: StudentStatusEnum = StudentStatusEnum.enrolled


class StudentResponse(BaseModel):
    """Schema for returning student data (response body)."""
    id: str
    first_name: str
    last_name: str
    status: StudentStatusEnum
    enrolled_date: datetime

    model_config = {"from_attributes": True}


class StudentListResponse(BaseModel):
    """Schema for returning a list of students."""
    students: list[StudentResponse]
    total: int


# ─── Attendance Schemas ───────────────────────────────────────────────

class AttendanceMarkRequest(BaseModel):
    """Schema for marking attendance (request body)."""
    student_id: str = Field(..., examples=["STU-001"])
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", examples=["2026-09-15"])
    status: AttendanceStatusEnum = Field(..., examples=["present"])


class AttendanceRecordResponse(BaseModel):
    """Schema for returning an attendance record (response body)."""
    id: int
    student_id: str
    date: str
    status: AttendanceStatusEnum
    time_in: datetime | None = None
    time_out: datetime | None = None
    timestamp: datetime

    model_config = {"from_attributes": True}


class AttendanceListResponse(BaseModel):
    """Schema for returning a list of attendance records."""
    records: list[AttendanceRecordResponse]
    total: int


# ─── Analytics Schemas ────────────────────────────────────────────────

class StudentSummaryResponse(BaseModel):
    """
    Schema for the analytics summary — matches the structure
    returned by AnalyticsService.student_summary().
    """
    student_id: str
    student_name: str
    total_present: int
    total_absent: int
    total_late: int
    total_excused: int
    total_days_attended: int
    total_school_days: int
    attendance_percentage: float
    absence_percentage: float
    late_percentage: float
    consecutive_absences: int
    consecutive_lates: int


# ─── System Time Schemas ──────────────────────────────────────────────

class SystemTimeResponse(BaseModel):
    """Real-time server date, time, and schedule period information."""
    iso_timestamp: str
    timestamp_ms: int
    formatted_date: str
    formatted_time: str
    active_period: str
    timezone: str


# ─── Notification Schemas ────────────────────────────────────────────

class NotificationResponse(BaseModel):
    """Schema for a single notification."""
    id: int
    title: str
    message: str
    category: str
    is_read: bool
    relative_time: str
    timestamp: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    """Schema for list of notifications and total unread count."""
    notifications: list[NotificationResponse]
    unread_count: int
    total: int


class NotificationCreate(BaseModel):
    """Schema for manually creating a notification."""
    title: str = Field(..., max_length=100)
    message: str = Field(..., max_length=255)
    category: str = Field(default="warning")
    relative_time: str = Field(default="Just now")


# ─── User Settings Schemas ───────────────────────────────────────────

class UserSettingsResponse(BaseModel):
    """Schema for returning user account settings and faculty profile."""
    id: int
    username: str
    full_name: str
    email: str
    role: str
    department: str
    avatar_url: str | None = None
    absence_threshold: int
    late_threshold: int
    email_alerts_enabled: bool

    model_config = {"from_attributes": True}


class UserSettingsUpdate(BaseModel):
    """Schema for updating user account settings."""
    full_name: str | None = None
    email: str | None = None
    role: str | None = None
    department: str | None = None
    avatar_url: str | None = None
    absence_threshold: int | None = None
    late_threshold: int | None = None
    email_alerts_enabled: bool | None = None


# ─── Authentication Schemas ───────────────────────────────────────────

class LoginRequest(BaseModel):
    """Schema for user credentials."""
    username: str = Field(..., examples=["Scaluya7"])
    password: str = Field(..., min_length=1)


class UserProfileResponse(BaseModel):
    """Schema for public user profile."""
    username: str
    full_name: str
    email: str
    role: str
    department: str
    avatar_url: str | None = None


class LoginResponse(BaseModel):
    """Schema for successful authentication response."""
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
