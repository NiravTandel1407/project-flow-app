import apiClient from '@/core/api/client';
import { DashboardStats } from './types';
import { projectsApi } from '@/modules/projects/api';
import { tasksApi } from '@/modules/tasks/api';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<DashboardStats>('/dashboard');
      return response.data;
    } catch {
      // Fallback: aggregate from existing project & task endpoints if /dashboard is not yet implemented on backend
      const [projects, tasks] = await Promise.all([
        projectsApi.getProjects().catch(() => []),
        tasksApi.getTasks().catch(() => []),
      ]);

      const now = new Date().getTime();

      const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
      const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
      const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED').length;
      const overdueTasks = tasks.filter(
        (t) => t.status !== 'COMPLETED' && t.due_date && new Date(t.due_date).getTime() < now
      ).length;

      const breakdown = {
        TODO: tasks.filter((t) => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        COMPLETED: completedTasks,
        BLOCKED: tasks.filter((t) => t.status === 'BLOCKED').length,
      };

      const dueSoonTasks = tasks
        .filter((t) => t.status !== 'COMPLETED' && t.due_date)
        .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
        .slice(0, 5);

      return {
        total_projects: projects.length,
        active_projects: activeProjects,
        completed_tasks: completedTasks,
        pending_tasks: pendingTasks,
        overdue_tasks: overdueTasks,
        status_breakdown: breakdown,
        due_soon_tasks: dueSoonTasks,
      };
    }
  },
};

