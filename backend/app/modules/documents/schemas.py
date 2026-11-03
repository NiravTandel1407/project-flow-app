from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    user_id: int
    filename: str
    file_size: int
    content_type: str | None = None
    created_at: datetime
