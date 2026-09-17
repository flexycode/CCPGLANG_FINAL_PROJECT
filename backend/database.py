"""
database.py — Database Configuration (SQLAlchemy + SQLite)
==========================================================
PARADIGM: Object-Oriented Programming (OOP)

This module sets up the database engine and session factory using
SQLAlchemy — Python's most popular ORM. The ORM approach maps
Python CLASSES to database TABLES, which aligns perfectly with
the OOP paradigm of this backend.

KEY OOP CONCEPTS DEMONSTRATED:
- Declarative mapping: Classes define table schemas
- Session pattern: Database operations through session objects
- Engine abstraction: Connection details hidden behind an interface
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ─── Database Engine ──────────────────────────────────────────────────
# SQLite stores the database as a single file — perfect for academic demos.
# The `check_same_thread=False` is required for FastAPI's async model.

DATABASE_URL = "sqlite:///./attendance.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,  # Set to True to see SQL queries in console
)

# ─── Session Factory ──────────────────────────────────────────────────
# Each API request gets its own session via dependency injection.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ─── Base Class ───────────────────────────────────────────────────────
# All ORM model classes inherit from this base.
# This is INHERITANCE — a core OOP concept.

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    
    PARADIGM NOTE:
    Inheritance is a fundamental OOP concept. Every model class
    (StudentModel, AttendanceRecordModel) inherits from Base,
    gaining database mapping capabilities automatically.
    """
    pass


# ─── Dependency Injection ────────────────────────────────────────────

def get_db():
    """
    FastAPI dependency that provides a database session.
    
    PARADIGM NOTE:
    This is a GENERATOR function used with FastAPI's dependency
    injection system. The `yield` ensures the session is properly
    closed after each request — demonstrating resource management.
    
    In functional programming, you'd pass the session as a parameter.
    In OOP, dependencies are typically injected via constructors or
    framework mechanisms like this.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
