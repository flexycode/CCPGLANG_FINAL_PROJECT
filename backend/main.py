"""
main.py — Entry Point for the Python Backend
============================================
PARADIGM: Object-Oriented Programming (OOP)

This module serves two purposes:
1. FastAPI REST API server — serves the attendance system as a web API
2. CLI demo — demonstrates the OOP attendance system in the terminal

Run the API server:
    uvicorn backend.main:app --reload

Run the CLI demo:
    python -m backend.main --demo
"""

import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine, Base
from backend.api.students import router as students_router
from backend.api.attendance import router as attendance_router
from backend.api.analytics import router as analytics_router
from backend.api.system import router as system_router
from backend.api.notifications import router as notifications_router
from backend.api.settings import router as settings_router
from backend.api.auth import router as auth_router


# ─── Database Initialization ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Create database tables on startup.
    
    PARADIGM NOTE:
    SQLAlchemy's create_all() inspects all classes that inherit from Base
    and creates the corresponding tables. This is OOP's declarative approach
    to schema definition — the classes define the database structure.
    """
    # Import db_models so SQLAlchemy registers them before create_all
    import backend.db_models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    yield


# ─── FastAPI Application ─────────────────────────────────────────────

app = FastAPI(
    title="Student Attendance Monitoring System",
    description=(
        "REST API for the Student Attendance Monitoring System.\n\n"
        "**Paradigm:** Object-Oriented Programming (Python)\n\n"
        "This API demonstrates OOP concepts including classes, encapsulation, "
        "inheritance, and method-based analytics."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register API Routers ────────────────────────────────────────────

app.include_router(students_router, prefix="/api/students")
app.include_router(attendance_router, prefix="/api/attendance")
app.include_router(analytics_router, prefix="/api/analytics")
app.include_router(system_router, prefix="/api/system")
app.include_router(notifications_router, prefix="/api/notifications")
app.include_router(settings_router, prefix="/api/settings")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/")
def root():
    """Health check / welcome endpoint."""
    return {
        "message": "Student Attendance Monitoring System API",
        "paradigm": "Object-Oriented Programming (Python)",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    print("API docs available at: http://localhost:8000/docs")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
