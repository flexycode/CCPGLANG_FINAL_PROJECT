"""
notifications.py — Notification API Endpoints
==============================================
PARADIGM: Object-Oriented Programming (OOP)

Manages system alerts and attendance threshold warnings.
Demonstrates:
- ORM querying and updates via SQLAlchemy session methods
- Automatic data seeding with default Figma alerts
- Pydantic schema serialization
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from backend.database import get_db
from backend.db_models import NotificationModel
from backend.schemas import (
    NotificationResponse,
    NotificationListResponse,
    NotificationCreate,
)

router = APIRouter(tags=["Notifications"])


def seed_default_notifications_if_empty(db: Session) -> None:
    """
    Seed initial notifications matching Figma design (Layer 2) if table is empty.
    """
    count = db.scalar(select(func.count(NotificationModel.id)))
    if count == 0:
        seed_data = [
            NotificationModel(
                title="Max Absences Reached",
                message="Rinoah Dela Rama has reached 4 absences, exceeding the maximum allowed.",
                category="warning",
                is_read=False,
                relative_time="10 mins ago",
            ),
            NotificationModel(
                title="High Lates Warning",
                message="Jay Arre Talosig has 6 lates. This counts as 2 absences.",
                category="warning",
                is_read=False,
                relative_time="1 hour ago",
            ),
            NotificationModel(
                title="System Update",
                message="Attendance records synced successfully.",
                category="system",
                is_read=False,
                relative_time="2 hours ago",
            ),
        ]
        db.add_all(seed_data)
        db.commit()


@router.get("", response_model=NotificationListResponse)
def get_notifications(db: Session = Depends(get_db)) -> NotificationListResponse:
    """
    Fetch all notifications ordered by creation timestamp, with unread count.
    """
    seed_default_notifications_if_empty(db)
    
    notifications = db.scalars(
        select(NotificationModel).order_by(NotificationModel.id.asc())
    ).all()
    
    unread_count = sum(1 for n in notifications if not n.is_read)
    
    return NotificationListResponse(
        notifications=list(notifications),
        unread_count=unread_count,
        total=len(notifications),
    )


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int, db: Session = Depends(get_db)
) -> NotificationResponse:
    """
    Mark a single notification as read.
    """
    notification = db.get(NotificationModel, notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification #{notification_id} not found",
        )
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/mark-all-read", response_model=dict)
def mark_all_read(db: Session = Depends(get_db)) -> dict:
    """
    Mark all unread notifications as read.
    """
    unread_notifications = db.scalars(
        select(NotificationModel).where(NotificationModel.is_read == False)
    ).all()
    
    for n in unread_notifications:
        n.is_read = True
        
    db.commit()
    return {"message": "All notifications marked as read", "updated": len(unread_notifications)}


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: NotificationCreate, db: Session = Depends(get_db)
) -> NotificationResponse:
    """
    Create a new notification alert.
    """
    new_notif = NotificationModel(
        title=payload.title,
        message=payload.message,
        category=payload.category,
        relative_time=payload.relative_time,
        is_read=False,
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif
