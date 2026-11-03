import apiClient from '@/core/api/client';
import { ProjectDocument } from './types';

export const documentsApi = {
  getDocuments: async (projectId: number): Promise<ProjectDocument[]> => {
    const response = await apiClient.get<ProjectDocument[]>(
      `/projects/${projectId}/documents`
    );
    return response.data;
  },

  uploadDocument: async (
    projectId: number,
    file: File
  ): Promise<ProjectDocument> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ProjectDocument>(
      `/projects/${projectId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  downloadDocument: async (
    projectId: number,
    documentId: number,
    filename: string
  ): Promise<void> => {
    const response = await apiClient.get(
      `/projects/${projectId}/documents/${documentId}/download`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  deleteDocument: async (
    projectId: number,
    documentId: number
  ): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/documents/${documentId}`);
  },
};
