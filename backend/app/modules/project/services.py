"""Project business logic. No FastAPI imports here, only DB + rules."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.project.models import Priority, Project, ProjectStatus
from app.modules.project.schemas import ProjectCreate, ProjectUpdate
from app.modules.project.exceptions import InvalidDateRangeError, ProjectNotFoundError

def create_project(db: Session, user_id: int, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump(), user_id=user_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(
    db: Session,
    user_id: int,
    *,
    status: ProjectStatus | None = None,
    priority: Priority | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Project], int]:
    """Return (items for this page, total matching count)."""
    stmt = select(Project).where(Project.user_id == user_id)
    if status:
        stmt = stmt.where(Project.status == status)
    if priority:
        stmt = stmt.where(Project.priority == priority)
    if search:
        stmt = stmt.where(Project.name.ilike(f"%{search.strip()}%"))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(Project.created_at.desc()).offset(skip).limit(limit)
    ).all()
    return list(items), total


def get_project(db: Session, user_id: int, project_id: int) -> Project:
    """Fetch a project only if it belongs to this user.

    Someone else's project raises the same not-found error as a missing one,
    so we never reveal that an ID exists.
    """
    project = db.scalar(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    if project is None:
        raise ProjectNotFoundError()
    return project


def update_project(
    db: Session, user_id: int, project_id: int, data: ProjectUpdate
) -> Project:
    project = get_project(db, user_id, project_id)
    changes = data.model_dump(exclude_unset=True)  # only fields the client sent

    # Check the date rule against the merged result (new + existing values).
    start = changes.get("start_date", project.start_date)
    due = changes.get("due_date", project.due_date)
    if start and due and due < start:
        raise InvalidDateRangeError()

    for field, value in changes.items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, user_id: int, project_id: int) -> None:
    project = get_project(db, user_id, project_id)
    db.delete(project)  # tasks and subtasks will cascade once we add them
    db.commit()