from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.modules.projects.models import Priority, ProjectStatus


class ProjectBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    status: ProjectStatus = ProjectStatus.not_started
    priority: Priority = Priority.medium
    start_date: date | None = None
    due_date: date | None = None

    @model_validator(mode="after")
    def check_dates(self):
        if self.start_date and self.due_date and self.due_date < self.start_date:
            raise ValueError("due_date cannot be before start_date")
        return self


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    """Every field is optional, so the client sends only what changed (PATCH)."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = None
    status: ProjectStatus | None = None
    priority: Priority | None = None
    start_date: date | None = None
    due_date: date | None = None

    @field_validator("name", "status", "priority")
    @classmethod
    def not_null_if_sent(cls, v):
        # description and dates may be cleared with null, these three may not.
        if v is None:
            raise ValueError("cannot be null")
        return v


class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ProjectList(BaseModel):
    items: list[ProjectOut]
    total: int