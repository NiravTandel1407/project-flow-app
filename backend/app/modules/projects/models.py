import enum
from datetime import date, datetime, timezone
 
from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
 
from app.core.database import Base
 
 
class ProjectStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    on_hold = "on_hold"
    completed = "completed"
 
 
class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
 
 
def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class Project(Base):
    __tablename__ = "projects"
 
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
 
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus), default=ProjectStatus.not_started, index=True
    )
    priority: Mapped[Priority] = mapped_column(Enum(Priority), default=Priority.medium)
    start_date: Mapped[date | None] = mapped_column(Date)
    due_date: Mapped[date | None] = mapped_column(Date)
 
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )
 
    owner: Mapped["User"] = relationship(back_populates="projects")
    
    # Later: tasks = relationship("Task", cascade="all, delete-orphan")
