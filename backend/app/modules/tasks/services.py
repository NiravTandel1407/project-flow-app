"""Task business logic. No FastAPI imports here."""

from datetime import date, datetime, timedelta, timezone

from sqlalchemy import and_, case, func, select
from sqlalchemy.orm import Session

from app.modules.projects import services as project_services
from app.modules.projects.models import Priority, Project, ProjectStatus
from app.modules.subtasks.models import Subtask
from app.modules.tasks.exceptions import TaskNotFoundError
from app.modules.tasks.models import Task, TaskStatus
from app.modules.tasks.schemas import TaskCreate, TaskUpdate


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _with_counts():
    """SELECT task + subtask counts in ONE query (no N+1 queries per task)."""
    total = (
        select(func.count(Subtask.id))
        .where(Subtask.task_id == Task.id)
        .correlate(Task)
        .scalar_subquery()
    )
    done = (
        select(func.count(Subtask.id))
        .where(Subtask.task_id == Task.id, Subtask.is_done.is_(True))
        .correlate(Task)
        .scalar_subquery()
    )
    return select(Task, total.label("subtasks_total"), done.label("subtasks_done"))


def _attach(task: Task, total: int, done: int) -> Task:
    task.subtasks_total = total
    task.subtasks_done = done
    return task


def _check_project_completion(db: Session, project_id: int):
    """Auto status: when all tasks are done, project switches to Completed.
    If a task is moved back to in_progress or todo, switches back to in_progress.
    """
    project = db.scalar(select(Project).where(Project.id == project_id))
    if not project:
        return

    total_tasks = (
        db.scalar(select(func.count(Task.id)).where(Task.project_id == project_id))
        or 0
    )
    if total_tasks == 0:
        return

    pending_tasks = (
        db.scalar(
            select(func.count(Task.id)).where(
                Task.project_id == project_id,
                Task.status != TaskStatus.done,
            )
        )
        or 0
    )

    if pending_tasks == 0 and project.status != ProjectStatus.completed:
        project.status = ProjectStatus.completed
    elif pending_tasks > 0 and project.status == ProjectStatus.completed:
        project.status = ProjectStatus.in_progress


def get_task(db: Session, user_id: int, task_id: int) -> Task:
    """Fetch a task only if its PROJECT belongs to this user (task -> project -> user)."""
    stmt = (
        _with_counts()
        .select_from(Task)
        .join(Project, Project.id == Task.project_id)
        .where(Task.id == task_id, Project.user_id == user_id)
    )
    row = db.execute(stmt).first()
    if row is None:
        raise TaskNotFoundError()
    task, total, done = row
    return _attach(task, total, done)


def get_task_detail(db: Session, user_id: int, task_id: int) -> Task:
    task = get_task(db, user_id, task_id)
    task.subtasks = list(
        db.scalars(
            select(Subtask).where(Subtask.task_id == task_id).order_by(Subtask.id)
        ).all()
    )
    return task


def create_task(db: Session, user_id: int, project_id: int, data: TaskCreate) -> Task:
    project_services.get_project(db, user_id, project_id)  # 404 if not yours
    task = Task(**data.model_dump(), project_id=project_id)
    if task.status == TaskStatus.done:
        task.completed_at = _now()
    db.add(task)
    _check_project_completion(db, project_id)
    db.commit()
    db.refresh(task)
    return _attach(task, 0, 0)


def list_tasks(
    db: Session,
    user_id: int,
    project_id: int,
    *,
    status: TaskStatus | None = None,
    priority: Priority | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Task], int]:
    project_services.get_project(db, user_id, project_id)

    conditions = [Task.project_id == project_id]
    if status:
        conditions.append(Task.status == status)
    if priority:
        conditions.append(Task.priority == priority)
    if search:
        conditions.append(Task.title.ilike(f"%{search.strip()}%"))

    total = db.scalar(select(func.count(Task.id)).where(*conditions)) or 0
    rows = db.execute(
        _with_counts()
        .where(*conditions)
        .order_by(Task.due_date.asc().nulls_last(), Task.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return [_attach(task, t, d) for task, t, d in rows], total


def update_task(db: Session, user_id: int, task_id: int, data: TaskUpdate) -> Task:
    task = get_task(db, user_id, task_id)
    changes = data.model_dump(exclude_unset=True)

    # completed_at follows the status automatically.
    if "status" in changes:
        if changes["status"] == TaskStatus.done and task.status != TaskStatus.done:
            task.completed_at = _now()
        elif changes["status"] != TaskStatus.done:
            task.completed_at = None

    for field, value in changes.items():
        setattr(task, field, value)

    _check_project_completion(db, task.project_id)
    db.commit()
    return get_task(db, user_id, task_id)  # re-read so counts are fresh


def delete_task(db: Session, user_id: int, task_id: int) -> None:
    task = get_task(db, user_id, task_id)
    project_id = task.project_id
    db.delete(task)  # subtasks are removed by the database (ondelete CASCADE)
    _check_project_completion(db, project_id)
    db.commit()


def get_project_progress(db: Session, user_id: int, project_id: int) -> dict:
    """Progress = tasks done / total tasks. Calculated, never stored."""
    project_services.get_project(db, user_id, project_id)

    today = date.today()
    not_done = Task.status != TaskStatus.done
    total, done, overdue, this_week = db.execute(
        select(
            func.count(Task.id),
            func.coalesce(func.sum(case((Task.status == TaskStatus.done, 1), else_=0)), 0),
            func.coalesce(
                func.sum(case((and_(not_done, Task.due_date < today), 1), else_=0)), 0
            ),
            func.coalesce(
                func.sum(
                    case(
                        (
                            and_(
                                not_done,
                                Task.due_date >= today,
                                Task.due_date <= today + timedelta(days=7),
                            ),
                            1,
                        ),
                        else_=0,
                    )
                ),
                0,
            ),
        ).where(Task.project_id == project_id)
    ).one()

    total, done, overdue, this_week = int(total), int(done), int(overdue), int(this_week)
    return {
        "total_tasks": total,
        "done_tasks": done,
        "overdue_tasks": overdue,
        "due_this_week": this_week,
        "progress_percent": round(done / total * 100) if total else 0,
    }
