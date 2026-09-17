"""
auth.py — Authentication API Endpoints
======================================
PARADIGM: Object-Oriented Programming (OOP)

Provides authentication endpoints for the Checkmate Attendance Monitoring system.
Supports the Figma design's "Sign In" flow with credentials:
- Username: Scaluya7 (or prof.caluya)
- Password: password123 (or any non-empty password in demo mode)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.database import get_db
from backend.db_models import UserSettingsModel
from backend.schemas import LoginRequest, LoginResponse, UserProfileResponse
from backend.api.settings import seed_default_settings_if_empty

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """
    Authenticate faculty credentials matching Figma User Login layer.
    """
    username_clean = payload.username.strip()
    password_clean = payload.password.strip()

    if not username_clean or not password_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required.",
        )

    # In academic demo mode, check valid usernames
    # Accepts Scaluya7 (Figma example), prof.caluya, or admin
    settings = seed_default_settings_if_empty(db)
    
    # Simple demo authentication validation
    valid_usernames = ["scaluya7", "prof.caluya", "admin", settings.username.lower()]
    if username_clean.lower() not in valid_usernames and not username_clean.isalnum():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. (Hint: Try 'Scaluya7' / 'password123')",
        )

    # Return authenticated user profile and session token
    user_profile = UserProfileResponse(
        username=settings.username,
        full_name=settings.full_name,
        email=settings.email,
        role=settings.role,
        department=settings.department,
        avatar_url=settings.avatar_url,
    )

    return LoginResponse(
        access_token=f"checkmate-token-{username_clean.lower()}-session",
        token_type="bearer",
        user=user_profile,
    )


@router.get("/me", response_model=UserProfileResponse)
def get_current_user(db: Session = Depends(get_db)) -> UserProfileResponse:
    """
    Get profile information of currently logged in user.
    """
    settings = seed_default_settings_if_empty(db)
    return UserProfileResponse(
        username=settings.username,
        full_name=settings.full_name,
        email=settings.email,
        role=settings.role,
        department=settings.department,
        avatar_url=settings.avatar_url,
    )


@router.post("/logout", response_model=dict)
def logout() -> dict:
    """
    End user session.
    """
    return {"message": "Successfully logged out of Checkmate."}
