from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SubtaskCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=200)


class SubtaskUpdate(BaseModel):
    """Rename and/or toggle done. Send only what changed."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=200)
    is_done: bool | None = None

    @field_validator("title", "is_done")
    @classmethod
    def not_null_if_sent(cls, v):
        if v is None:
            raise ValueError("cannot be null")
        return v


class SubtaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_id: int
    title: str
    is_done: bool
    created_at: datetime