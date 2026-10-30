import apiClient from '@/core/api/client';
import { Task, TaskCreate, TaskUpdate } from './types';
import { Status } from '@/core/types/common';

export const tasksApi = {
  getTasks: async (params?: { project_id?: number; status?: Status }): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (payload: TaskCreate): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', payload);
    return response.data;
  },

  updateTask: async (id: number, payload: TaskUpdate): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, payload);
    return response.data;
  },

  toggleStatus: async (id: number, status: Status): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, { status });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

