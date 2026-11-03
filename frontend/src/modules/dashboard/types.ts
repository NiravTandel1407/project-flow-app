import { Task } from '@/modules/tasks/types';

export interface ProjectsByStatus {
  not_started: number;
  in_progress: number;
  on_hold: number;
  completed: number;
  total: number;
}

export interface DashboardSummary {
  projects_by_status: ProjectsByStatus;
  tasks_due_today: Task[];
  tasks_due_today_count: number;
  tasks_due_this_week: Task[];
  tasks_due_this_week_count: number;
  overdue_tasks: Task[];
  overdue_tasks_count: number;
  total_projects: number;
  total_tasks_completed: number;
  total_tasks_pending: number;
}
