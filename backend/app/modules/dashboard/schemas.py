from pydantic import BaseModel
from app.modules.tasks.schemas import TaskOut


class ProjectsByStatus(BaseModel):
    not_started: int
    in_progress: int
    on_hold: int
    completed: int
    total: int


class DashboardSummary(BaseModel):
    projects_by_status: ProjectsByStatus
    tasks_due_today: list[TaskOut]
    tasks_due_today_count: int
    tasks_due_this_week: list[TaskOut]
    tasks_due_this_week_count: int
    overdue_tasks: list[TaskOut]
    overdue_tasks_count: int
    total_projects: int
    total_tasks_completed: int
    total_tasks_pending: int

