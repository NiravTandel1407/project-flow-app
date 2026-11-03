from datetime import date, timedelta
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.projects.models import Project, ProjectStatus
from app.modules.tasks.models import Task, TaskStatus
from app.modules.tasks import services as task_services
from app.modules.dashboard.schemas import DashboardSummary, ProjectsByStatus


def get_dashboard_summary(db: Session, user_id: int) -> DashboardSummary:
    today = date.today()
    week_later = today + timedelta(days=7)

    # 1. Projects by Status for current user
    projects_stmt = select(Project).where(Project.user_id == user_id)
    projects = list(db.scalars(projects_stmt).all())

    status_counts = {
        ProjectStatus.not_started: 0,
        ProjectStatus.in_progress: 0,
        ProjectStatus.on_hold: 0,
        ProjectStatus.completed: 0,
    }
    for p in projects:
        if p.status in status_counts:
            status_counts[p.status] += 1

    projects_by_status = ProjectsByStatus(
        not_started=status_counts[ProjectStatus.not_started],
        in_progress=status_counts[ProjectStatus.in_progress],
        on_hold=status_counts[ProjectStatus.on_hold],
        completed=status_counts[ProjectStatus.completed],
        total=len(projects),
    )

    # 2. Tasks across all projects belonging to this user
    user_project_ids = [p.id for p in projects]
    if not user_project_ids:
        return DashboardSummary(
            projects_by_status=projects_by_status,
            tasks_due_today=[],
            tasks_due_today_count=0,
            tasks_due_this_week=[],
            tasks_due_this_week_count=0,
            overdue_tasks=[],
            overdue_tasks_count=0,
            total_projects=0,
            total_tasks_completed=0,
            total_tasks_pending=0,
        )

    # Fetch tasks with subtask counts using task_services._with_counts()
    base_task_query = (
        task_services._with_counts()
        .where(Task.project_id.in_(user_project_ids))
    )

    # Overdue tasks
    overdue_rows = db.execute(
        base_task_query.where(
            Task.status != TaskStatus.done,
            Task.due_date < today,
        ).order_by(Task.due_date.asc())
    ).all()
    overdue_tasks = [task_services._attach(t, tot, d) for t, tot, d in overdue_rows]

    # Tasks due today
    today_rows = db.execute(
        base_task_query.where(
            Task.status != TaskStatus.done,
            Task.due_date == today,
        ).order_by(Task.priority.desc())
    ).all()
    tasks_due_today = [task_services._attach(t, tot, d) for t, tot, d in today_rows]

    # Tasks due this week (today to today + 7 days)
    week_rows = db.execute(
        base_task_query.where(
            Task.status != TaskStatus.done,
            Task.due_date >= today,
            Task.due_date <= week_later,
        ).order_by(Task.due_date.asc())
    ).all()
    tasks_due_this_week = [task_services._attach(t, tot, d) for t, tot, d in week_rows]

    # Completed tasks count
    total_completed = (
        db.scalar(
            select(func.count(Task.id)).where(
                Task.project_id.in_(user_project_ids),
                Task.status == TaskStatus.done,
            )
        )
        or 0
    )

    # Pending tasks count
    total_pending = (
        db.scalar(
            select(func.count(Task.id)).where(
                Task.project_id.in_(user_project_ids),
                Task.status != TaskStatus.done,
            )
        )
        or 0
    )

    return DashboardSummary(
        projects_by_status=projects_by_status,
        tasks_due_today=tasks_due_today,
        tasks_due_today_count=len(tasks_due_today),
        tasks_due_this_week=tasks_due_this_week,
        tasks_due_this_week_count=len(tasks_due_this_week),
        overdue_tasks=overdue_tasks,
        overdue_tasks_count=len(overdue_tasks),
        total_projects=len(projects),
        total_tasks_completed=total_completed,
        total_tasks_pending=total_pending,
    )
