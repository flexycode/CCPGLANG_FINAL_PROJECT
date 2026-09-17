"""
database.py — Database Configuration (SQLAlchemy + Supabase PostgreSQL)
=======================================================================
PARADIGM: Object-Oriented Programming (OOP)

This module sets up the database engine and session factory using
SQLAlchemy — Python's most popular ORM. The ORM approach maps
Python CLASSES to database TABLES, which aligns perfectly with
the OOP paradigm of this backend.

REAL-TIME DATABASE:
When SUPABASE_DB_URL is set in the environment (via .env), the
backend connects to a Supabase-hosted PostgreSQL instance. This
provides cloud-hosted, real-time database capabilities. If no
Supabase URL is configured, the system falls back to a local
SQLite file for development convenience.

KEY OOP CONCEPTS DEMONSTRATED:
- Declarative mapping: Classes define table schemas
- Session pattern: Database operations through session objects
- Engine abstraction: Connection details hidden behind an interface
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ─── Load Environment Variables ──────────────────────────────────────
load_dotenv()

# ─── Database Engine ────────────────────────────────────────────────
# Priority: Supabase PostgreSQL (production) → SQLite (local dev fallback)

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

if SUPABASE_DB_URL:
    # Supabase-hosted PostgreSQL via psycopg2 driver
    # Connection pool tuned for Supabase's transaction pooler
    print("[OK] Connecting to Supabase PostgreSQL...")
    engine = create_engine(
        SUPABASE_DB_URL,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,   # Verify connections are alive before use
        echo=False,           # Set to True to see SQL queries in console
    )
else:
    # Local SQLite fallback — perfect for development without Supabase
    print("[WARN] No SUPABASE_DB_URL found -- using local SQLite (attendance.db)")
    DATABASE_URL = "sqlite:///./attendance.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )

# ─── Session Factory ────────────────────────────────────────────────
# Each API request gets its own session via dependency injection.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ─── Base Class ─────────────────────────────────────────────────────
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


# ─── Dependency Injection ──────────────────────────────────────────

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
