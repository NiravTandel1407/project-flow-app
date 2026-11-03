import apiClient from '@/core/api/client';
import { Project, ProjectCreate, ProjectUpdate, ProjectStatus, ProjectPriority } from './types';

export const projectsApi = {
  getProjects: async (params?: {
    status?: ProjectStatus | string;
    priority?: ProjectPriority | string;
    search?: string;
  }): Promise<Project[]> => {
    const response = await apiClient.get<Project[] | { items: Project[]; total: number }>('/projects', { params });
    if (response.data && typeof response.data === 'object' && 'items' in response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  getProjectById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (payload: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', payload);
    return response.data;
  },

  updateProject: async (id: number, payload: ProjectUpdate): Promise<Project> => {
    const response = await apiClient.patch<Project>(`/projects/${id}`, payload);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
