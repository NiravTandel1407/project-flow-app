import apiClient from '@/core/api/client';
import { Project, ProjectCreate, ProjectUpdate } from './types';
import { Status } from '@/core/types/common';

export const projectsApi = {
  getProjects: async (params?: { status?: Status; search?: string }): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects', { params });
    return response.data;
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

