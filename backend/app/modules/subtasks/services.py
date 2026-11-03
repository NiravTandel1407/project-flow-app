"""Subtask business logic. Ownership is checked through task -> project -> user."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.projects.models import Project
from app.modules.subtasks.exceptions import SubtaskNotFoundError
from app.modules.subtasks.models import Subtask
from app.modules.subtasks.schemas import SubtaskCreate, SubtaskUpdate
from app.modules.tasks import services as task_services
from app.modules.tasks.models import Task


def _get_owned(db: Session, user_id: int, subtask_id: int) -> Subtask:
    subtask = db.scalar(
        select(Subtask)
        .join(Task, Task.id == Subtask.task_id)
        .join(Project, Project.id == Task.project_id)
        .where(Subtask.id == subtask_id, Project.user_id == user_id)
    )
    if subtask is None:
        raise SubtaskNotFoundError()
    return subtask


def create_subtask(
    db: Session, user_id: int, task_id: int, data: SubtaskCreate
) -> Subtask:
    task_services.get_task(db, user_id, task_id)  # 404 if the task isn't yours
    subtask = Subtask(task_id=task_id, title=data.title)
    db.add(subtask)
    db.commit()
    db.refresh(subtask)
    return subtask


def list_subtasks(db: Session, user_id: int, task_id: int) -> list[Subtask]:
    task_services.get_task(db, user_id, task_id)
    return list(
        db.scalars(
            select(Subtask).where(Subtask.task_id == task_id).order_by(Subtask.id)
        ).all()
    )


def update_subtask(
    db: Session, user_id: int, subtask_id: int, data: SubtaskUpdate
) -> Subtask:
    subtask = _get_owned(db, user_id, subtask_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subtask, field, value)
    db.commit()
    db.refresh(subtask)
    return subtask


def delete_subtask(db: Session, user_id: int, subtask_id: int) -> None:
    subtask = _get_owned(db, user_id, subtask_id)
    db.delete(subtask)
    db.commit()