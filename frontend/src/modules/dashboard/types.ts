import { Task } from '@/modules/tasks/types';

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  status_breakdown: {
    TODO: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    BLOCKED: number;
  };
  due_soon_tasks: Task[];
}

