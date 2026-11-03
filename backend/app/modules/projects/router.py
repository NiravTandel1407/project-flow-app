"""HTTP layer only: parse the request, call the service, shape the response."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

# NOTE: adjust these three imports if your names differ.
from app.core.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.projects import services
from app.modules.projects.models import Priority, ProjectStatus
from app.modules.projects.schemas import (
    ProjectCreate,
    ProjectList,
    ProjectOut,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.create_project(db, user.id, payload)


@router.get("", response_model=ProjectList)
def list_projects(
    project_status: ProjectStatus | None = Query(None, alias="status"),
    priority: Priority | None = None,
    q: str | None = Query(None, description="Search in project name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = services.list_projects(
        db,
        user.id,
        status=project_status,
        priority=priority,
        search=q,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total}


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.get_project(db, user.id, project_id)


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.update_project(db, user.id, project_id, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    services.delete_project(db, user.id, project_id)