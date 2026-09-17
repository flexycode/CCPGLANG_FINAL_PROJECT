"""
db_models.py — SQLAlchemy ORM Models
=====================================
PARADIGM: Object-Oriented Programming (OOP)

These classes map directly to database tables using SQLAlchemy's
ORM (Object-Relational Mapping). Each class represents a table,
each attribute represents a column, and relationships between
tables are expressed through class-level declarations.

KEY OOP CONCEPTS DEMONSTRATED:
- Inheritance: All models inherit from Base (SQLAlchemy)
- Encapsulation: Column types and constraints define data rules
- Relationships: Foreign keys express object associations
- Properties: Computed attributes via Python @property
"""

from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, Boolean, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class StudentModel(Base):
    """
    ORM model for the students table.
    
    Maps the Student domain concept to a database table.
    Each instance represents one row in the `students` table.
    """
    __tablename__ = "students"
    
    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="enrolled")
    enrolled_date: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    
    # Relationship: One student → many attendance records
    attendance_records: Mapped[list["AttendanceRecordModel"]] = relationship(
        back_populates="student", cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Student(id={self.id}, name={self.last_name}, {self.first_name})>"


class AttendanceRecordModel(Base):
    """
    ORM model for the attendance_records table.
    
    Each instance represents one attendance entry for one student
    on one date.
    """
    __tablename__ = "attendance_records"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[str] = mapped_column(
        String(20), ForeignKey("students.id"), nullable=False
    )
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # "YYYY-MM-DD"
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # present/absent/late/excused
    time_in: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    time_out: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    
    # Relationship: Many records → one student
    student: Mapped["StudentModel"] = relationship(back_populates="attendance_records")
    
    def __repr__(self) -> str:
        return f"<AttendanceRecord(student={self.student_id}, date={self.date}, status={self.status})>"


class NotificationModel(Base):
    """
    ORM model for system notifications & attendance warnings.
    
    Represents an alert in the Checkmate notification tray.
    """
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="warning")  # warning, system, alert
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    relative_time: Mapped[str] = mapped_column(String(50), default="Just now")
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, title={self.title}, is_read={self.is_read})>"


class UserSettingsModel(Base):
    """
    ORM model for account settings and faculty profile.
    
    Encapsulates user information and administrative threshold settings.
    """
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, default="Scaluya7")
    full_name: Mapped[str] = mapped_column(String(100), nullable=False, default="Susan S. Caluya")
    email: Mapped[str] = mapped_column(String(100), nullable=False, default="sscaluya@national-u.edu.ph")
    role: Mapped[str] = mapped_column(String(50), default="Faculty")
    department: Mapped[str] = mapped_column(String(100), default="Faculty")
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    absence_threshold: Mapped[int] = mapped_column(Integer, default=4)
    late_threshold: Mapped[int] = mapped_column(Integer, default=3)
    email_alerts_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<UserSettings(username={self.username}, full_name={self.full_name})>"
