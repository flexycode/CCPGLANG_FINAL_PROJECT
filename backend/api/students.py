"""
api/students.py — Student CRUD API Routes
==========================================
PARADIGM: Object-Oriented Programming (OOP)

These endpoints provide RESTful access to the Student model.
Each endpoint uses SQLAlchemy ORM operations — creating, querying,
and updating Student OBJECTS through the database session.

KEY OOP CONCEPTS:
- Object creation: StudentModel(...) creates database-mapped objects
- Method calls: session.add(), session.query() operate on ORM objects
- Encapsulation: Database details hidden behind the ORM interface
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.db_models import StudentModel
from backend.schemas import (
    StudentCreate,
    StudentResponse,
    StudentListResponse,
)

router = APIRouter(tags=["Students"])


@router.get("/", response_model=StudentListResponse)
def list_students(db: Session = Depends(get_db)):
    """
    Get all registered students.
    
    Returns a list of Student objects from the database.
    """
    students = db.query(StudentModel).all()
    return StudentListResponse(
        students=[StudentResponse.model_validate(s) for s in students],
        total=len(students),
    )


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    """
    Get a specific student by their ID.
    
    Raises 404 if the student does not exist.
    """
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found.")
    return StudentResponse.model_validate(student)


@router.post("/", response_model=StudentResponse, status_code=201)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    """
    Register a new student.
    
    PARADIGM NOTE:
    Creates a new StudentModel OBJECT and persists it to the database.
    In OOP, the object "knows" how to save itself through the ORM.
    """
    # Check for duplicate ID
    existing = db.query(StudentModel).filter(StudentModel.id == payload.id).first()
    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail=f"Student {payload.id} already exists.",
        )
    
    student = StudentModel(
        id=payload.id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        status=payload.status.value,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return StudentResponse.model_validate(student)


@router.patch("/{student_id}/status", response_model=StudentResponse)
def update_student_status(
    student_id: str,
    status: str,
    db: Session = Depends(get_db),
):
    """
    Update a student's enrollment status.
    
    PARADIGM NOTE:
    In OOP, we modify the object's attribute directly:
    student.status = new_status
    The ORM tracks this change and persists it on commit.
    
    In functional programming, you'd return a NEW object:
    updateStudentStatus(student, newStatus) → { ...student, status: newStatus }
    """
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if student is None:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found.")
    
    student.status = status
    db.commit()
    db.refresh(student)
    return StudentResponse.model_validate(student)
