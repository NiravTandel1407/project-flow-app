import apiClient from '@/core/api/client';
import { Task, TaskDetail, TaskCreate, TaskUpdate, ProjectProgress, TaskStatus, TaskPriority } from './types';

export const tasksApi = {
  getTasks: async (params?: {
    project_id?: number;
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
  }): Promise<Task[]> => {
    if (params?.project_id) {
      const response = await apiClient.get<Task[] | { items: Task[]; total: number }>(
        `/projects/${params.project_id}/tasks`,
        {
          params: {
            status: params.status,
            priority: params.priority,
            q: params.search,
          },
        }
      );
      if (response.data && typeof response.data === 'object' && 'items' in response.data && Array.isArray(response.data.items)) {
        return response.data.items;
      }
      return Array.isArray(response.data) ? response.data : [];
    }

    // Fallback if global tasks endpoint is called
    try {
      const response = await apiClient.get<Task[] | { items: Task[]; total: number }>('/tasks', { params });
      if (response.data && typeof response.data === 'object' && 'items' in response.data && Array.isArray(response.data.items)) {
        return response.data.items;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  getProjectProgress: async (projectId: number): Promise<ProjectProgress> => {
    const response = await apiClient.get<ProjectProgress>(`/projects/${projectId}/progress`);
    return response.data;
  },

  getTaskById: async (id: number): Promise<TaskDetail> => {
    const response = await apiClient.get<TaskDetail>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (projectId: number, payload: TaskCreate): Promise<Task> => {
    const response = await apiClient.post<Task>(`/projects/${projectId}/tasks`, {
      title: payload.title,
      description: payload.description || undefined,
      status: payload.status || 'todo',
      priority: payload.priority || 'medium',
      due_date: payload.due_date || undefined,
    });
    return response.data;
  },

  updateTask: async (id: number, payload: TaskUpdate): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, payload);
    return response.data;
  },

  toggleStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, { status });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
