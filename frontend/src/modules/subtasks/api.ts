import apiClient from '@/core/api/client';
import { Subtask, SubtaskCreate, SubtaskUpdate } from './types';

export const subtasksApi = {
  getSubtasksByTask: async (taskId: number): Promise<Subtask[]> => {
    const response = await apiClient.get<Subtask[]>(`/subtasks`, {
      params: { task_id: taskId },
    });
    return response.data;
  },

  createSubtask: async (payload: SubtaskCreate): Promise<Subtask> => {
    const response = await apiClient.post<Subtask>('/subtasks', payload);
    return response.data;
  },

  updateSubtask: async (id: number, payload: SubtaskUpdate): Promise<Subtask> => {
    const response = await apiClient.patch<Subtask>(`/subtasks/${id}`, payload);
    return response.data;
  },

  toggleSubtask: async (id: number, is_completed: boolean): Promise<Subtask> => {
    const response = await apiClient.patch<Subtask>(`/subtasks/${id}`, { is_completed });
    return response.data;
  },

  deleteSubtask: async (id: number): Promise<void> => {
    await apiClient.delete(`/subtasks/${id}`);
  },
};

