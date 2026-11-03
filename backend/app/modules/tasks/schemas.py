from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator

from app.modules.projects.models import Priority
from app.modules.subtasks.schemas import SubtaskOut
from app.modules.tasks.models import TaskStatus


class TaskBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus = TaskStatus.todo
    priority: Priority = Priority.medium
    due_date: date | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    """All optional (PATCH). description and due_date may be cleared with null."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    priority: Priority | None = None
    due_date: date | None = None

    @field_validator("title", "status", "priority")
    @classmethod
    def not_null_if_sent(cls, v):
        if v is None:
            raise ValueError("cannot be null")
        return v


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    # Filled in by the service (counted in SQL, never stored).
    subtasks_total: int = 0
    subtasks_done: int = 0

    @computed_field
    @property
    def is_overdue(self) -> bool:
        """Calculated on the fly, so it can never go out of date."""
        return bool(
            self.due_date
            and self.status != TaskStatus.done
            and self.due_date < date.today()
        )


class TaskDetail(TaskOut):
    subtasks: list[SubtaskOut] = []


class TaskList(BaseModel):
    items: list[TaskOut]
    total: int


class ProjectProgress(BaseModel):
    total_tasks: int
    done_tasks: int
    overdue_tasks: int
    due_this_week: int
    progress_percent: int