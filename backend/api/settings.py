"""
settings.py — Account Settings & Preferences API Endpoints
==========================================================
PARADIGM: Object-Oriented Programming (OOP)

Manages user profile data and attendance system configuration.
Demonstrates:
- Object persistence and state modification
- Encapsulation of institutional defaults
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.database import get_db
from backend.db_models import UserSettingsModel
from backend.schemas import UserSettingsResponse, UserSettingsUpdate

router = APIRouter(tags=["Settings"])


def seed_default_settings_if_empty(db: Session) -> UserSettingsModel:
    """
    Ensure a faculty settings profile exists matching Figma Layer 3.
    """
    settings = db.scalar(select(UserSettingsModel).limit(1))
    if not settings:
        settings = UserSettingsModel(
            username="Scaluya7",
            full_name="Susan S. Caluya",
            email="sscaluya@national-u.edu.ph",
            role="Faculty",
            department="Faculty",
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
            absence_threshold=4,
            late_threshold=3,
            email_alerts_enabled=True,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=UserSettingsResponse)
def get_settings(db: Session = Depends(get_db)) -> UserSettingsResponse:
    """
    Get current account settings and faculty profile.
    """
    settings = seed_default_settings_if_empty(db)
    return settings


@router.put("", response_model=UserSettingsResponse)
def update_settings(
    payload: UserSettingsUpdate, db: Session = Depends(get_db)
) -> UserSettingsResponse:
    """
    Update account settings and faculty profile.
    """
    settings = seed_default_settings_if_empty(db)

    # Apply updates dynamically
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)
    return settings
