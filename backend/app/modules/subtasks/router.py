"""HTTP layer only."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

# NOTE: adjust these imports if your names differ (same ones as projects/router.py).
from app.core.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.subtasks import services
from app.modules.subtasks.schemas import SubtaskCreate, SubtaskOut, SubtaskUpdate

router = APIRouter(tags=["subtasks"])


@router.post(
    "/tasks/{task_id}/subtasks",
    response_model=SubtaskOut,
    status_code=status.HTTP_201_CREATED,
)
def create_subtask(
    task_id: int,
    payload: SubtaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.create_subtask(db, user.id, task_id, payload)


@router.get("/tasks/{task_id}/subtasks", response_model=list[SubtaskOut])
def list_subtasks(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.list_subtasks(db, user.id, task_id)


@router.patch("/subtasks/{subtask_id}", response_model=SubtaskOut)
def update_subtask(
    subtask_id: int,
    payload: SubtaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.update_subtask(db, user.id, subtask_id, payload)


@router.delete("/subtasks/{subtask_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtask(
    subtask_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    services.delete_subtask(db, user.id, subtask_id)