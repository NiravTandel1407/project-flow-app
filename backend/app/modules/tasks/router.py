"""HTTP layer only."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

# NOTE: adjust these imports if your names differ (same ones as projects/router.py).
from app.core.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.projects.models import Priority
from app.modules.tasks import services
from app.modules.tasks.models import TaskStatus
from app.modules.tasks.schemas import (
    ProjectProgress,
    TaskCreate,
    TaskDetail,
    TaskList,
    TaskOut,
    TaskUpdate,
)

router = APIRouter(tags=["tasks"])


# ---- nested under a project: create / list / progress ----
@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskOut,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    project_id: int,
    payload: TaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.create_task(db, user.id, project_id, payload)


@router.get("/projects/{project_id}/tasks", response_model=TaskList)
def list_tasks(
    project_id: int,
    task_status: TaskStatus | None = Query(None, alias="status"),
    priority: Priority | None = None,
    q: str | None = Query(None, description="Search in task title"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = services.list_tasks(
        db,
        user.id,
        project_id,
        status=task_status,
        priority=priority,
        search=q,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total}


@router.get("/projects/{project_id}/progress", response_model=ProjectProgress)
def project_progress(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.get_project_progress(db, user.id, project_id)


# ---- a single task: get / update / delete ----
@router.get("/tasks/{task_id}", response_model=TaskDetail)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.get_task_detail(db, user.id, task_id)


@router.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.update_task(db, user.id, task_id, payload)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    services.delete_task(db, user.id, task_id)