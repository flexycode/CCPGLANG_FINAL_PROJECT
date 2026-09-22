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


DEFAULT_STUDENTS = [
    ("2023-001", "James", "Smith"),
    ("2023-002", "Christopher", "Anderson"),
    ("2023-003", "Ronald", "Clark"),
    ("2023-004", "Mary", "Wright"),
    ("2023-005", "Lisa", "Mitchell"),
    ("2023-006", "Michelle", "Johnson"),
    ("2023-007", "John", "Thomas"),
    ("2023-008", "Daniel", "Rodriguez"),
    ("2023-009", "Anthony", "Lopez"),
    ("2023-010", "Patricia", "Perez"),
    ("2023-011", "Nancy", "Williams"),
    ("2023-012", "Laura", "Jackson"),
    ("2023-013", "Robert", "Lewis"),
    ("2023-014", "Paul", "Hill"),
    ("2023-015", "Kevin", "Roberts"),
    ("2023-016", "Linda", "Jones"),
    ("2023-017", "Karen", "White"),
    ("2023-018", "Sarah", "Lee"),
    ("2023-019", "Michael", "Scott"),
    ("2023-020", "Mark", "Turner"),
    ("2023-021", "Jason", "Brown"),
    ("2023-022", "Barbara", "Harris"),
    ("2023-023", "Betty", "Walker"),
    ("2023-024", "Kimberly", "Green"),
    ("2023-025", "William", "Phillips"),
    ("2023-026", "Donald", "Davis"),
    ("2023-027", "Jeff", "Martin"),
    ("2023-028", "Elizabeth", "Hall"),
    ("2023-029", "Helen", "Adams"),
    ("2023-030", "Deborah", "Campbell"),
    ("2023-031", "David", "Miller"),
    ("2023-032", "George", "Thompson"),
    ("2023-033", "Jennifer", "Allen"),
    ("2023-034", "Sandra", "Baker"),
    ("2023-035", "Richard", "Parker"),
    ("2023-036", "Kenneth", "Wilson"),
    ("2023-037", "Maria", "Garcia"),
    ("2023-038", "Donna", "Young"),
    ("2023-039", "Charles", "Gonzalez"),
    ("2023-040", "Steven", "Evans"),
    ("2023-041", "Susan", "Moore"),
    ("2023-042", "Carol", "Martinez"),
    ("2023-043", "Joseph", "Hernandez"),
    ("2023-044", "Edward", "Nelson"),
    ("2023-045", "Margaret", "Edwards"),
    ("2023-046", "Ruth", "Taylor"),
    ("2023-047", "Thomas", "Robinson"),
    ("2023-048", "Brian", "King"),
    ("2023-049", "Dorothy", "Carter"),
    ("2023-050", "Sharon", "Collins"),
]


def seed_default_students_if_empty(db: Session) -> list[StudentModel]:
    """Seed initial 50 students if the database table is empty."""
    existing = db.query(StudentModel).first()
    if existing is None:
        students = [
            StudentModel(
                id=s_id,
                first_name=first_name,
                last_name=last_name,
                status="enrolled",
            )
            for s_id, first_name, last_name in DEFAULT_STUDENTS
        ]
        db.add_all(students)
        db.commit()
    return db.query(StudentModel).all()


@router.get("/", response_model=StudentListResponse)
def list_students(db: Session = Depends(get_db)):
    """
    Get all registered students.
    
    Returns a list of Student objects from the database.
    """
    students = seed_default_students_if_empty(db)
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
