import apiClient from '@/core/api/client';
import { Subtask, SubtaskCreate, SubtaskUpdate } from './types';

export const subtasksApi = {
  getSubtasksByTask: async (taskId: number): Promise<Subtask[]> => {
    const response = await apiClient.get<Subtask[]>(`/tasks/${taskId}/subtasks`);
    return response.data;
  },

  createSubtask: async (taskId: number, payload: SubtaskCreate): Promise<Subtask> => {
    const response = await apiClient.post<Subtask>(`/tasks/${taskId}/subtasks`, {
      title: payload.title,
    });
    return response.data;
  },

  updateSubtask: async (id: number, payload: SubtaskUpdate): Promise<Subtask> => {
    const is_done = payload.is_done !== undefined ? payload.is_done : payload.is_completed;
    const body: { title?: string; is_done?: boolean } = {};
    if (payload.title !== undefined) body.title = payload.title;
    if (is_done !== undefined) body.is_done = is_done;

    const response = await apiClient.patch<Subtask>(`/subtasks/${id}`, body);
    return response.data;
  },

  toggleSubtask: async (id: number, is_done: boolean): Promise<Subtask> => {
    const response = await apiClient.patch<Subtask>(`/subtasks/${id}`, { is_done });
    return response.data;
  },

  deleteSubtask: async (id: number): Promise<void> => {
    await apiClient.delete(`/subtasks/${id}`);
  },
};
